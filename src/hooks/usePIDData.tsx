import { useEffect, useState } from 'react'

import { useDB } from '@/integrations/duckdb/db-resolver'
import { getStopsForTrip } from '@/integrations/duckdb/queries'
import { useTRPC } from '@/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'
import { getCarCountFromTripId } from '@/lib/utils'

const bgColor: Record<string, string> = {
  T1: 'bg-t1',
  T2: 'bg-t2',
  T3: 'bg-t3',
  T4: 'bg-t4',
  T5: 'bg-t5',
  T7: 'bg-t7',
  T8: 'bg-t8',
  T9: 'bg-t9',
}

/**
 * Encapsules the data needed for the PID.
 * Performs fetching and transformation of data.
 */
export const usePIDData = (stopId: string) => {
  const trpc = useTRPC()
  const { db, loading } = useDB()
  const [tripStops, setTripStops] = useState<
    {
      id: string
      name: string
    }[]
  >([])

  const { data: departures } = useQuery(
    trpc.transit.departures.queryOptions(
      { stopId },
      {
        refetchInterval: 20000,
      },
    ),
  )

  const mainTrip = departures?.[0]

  useEffect(() => {
    if (!db || loading || !mainTrip) {
      return
    }
    getStopsForTrip(db, mainTrip.tripId, mainTrip.stopId).then((stops) => {
      setTripStops(stops)
    })
  }, [db, loading, mainTrip])

  if (!departures || !mainTrip) {
    return null
  }

  return {
    tripId: mainTrip.tripId,
    carCount: getCarCountFromTripId(mainTrip.tripId),
    bgColor: bgColor[mainTrip.line],
    stationName: mainTrip.stationName,
    destination: mainTrip.destination,
    destinationSubtitle: mainTrip.destinationSubtitle,
    line: mainTrip.line,
    platform: mainTrip.platform,
    departureTime: mainTrip.departureTime,
    stops: tripStops ?? [],
    badges: mainTrip.badges,
    nextServices: departures.slice(1).map((trip) => ({
      tripId: trip.tripId,
      destination: trip.destination,
      destinationSubtitle: trip.destinationSubtitle,
      platform: trip.platform,
      departureTime: trip.departureTime,
      badges: trip.badges,
    })),
  }
}
