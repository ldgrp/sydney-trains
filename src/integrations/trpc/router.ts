import { TRPCError } from '@trpc/server'
import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'
import stops from '@/assets/data/stops.json'
import { createTRPCRouter, publicProcedure } from './init'
import { fetchDepartures } from './tfnswQueries'

const transitRouter = {
  departures: publicProcedure
    .input(
      z.object({
        stopId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const apiKey = process.env.TFNSW_API_KEY
      if (!apiKey) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'A configuration error occurred',
        })
      }
      const data = await fetchDepartures(input.stopId, apiKey)

      return data
    }),
  stops: publicProcedure.query(async () => stops),
} satisfies TRPCRouterRecord

export const trpcRouter = createTRPCRouter({
  transit: transitRouter,
})
export type TRPCRouter = typeof trpcRouter
