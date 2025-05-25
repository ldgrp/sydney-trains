import { getCarCountFromTripId } from '@/lib/utils'
import { z } from 'zod'

const stopEventSchema = z.object({
  departureTimeBaseTimetable: z.string().datetime(),
  departureTimePlanned: z.string().datetime(),
  departureTimeEstimated: z.string().datetime().optional(),
  properties: z.object({
    RealtimeTripId: z.string(),
  }),
  location: z.object({
    id: z.string(),
    name: z.string(),
    properties: z.object({
      stopId: z.string(),
      area: z.string(),
      platform: z.string(),
    }),
  }),
  transportation: z.object({
    disassembledName: z.string(),
    name: z.string(),
    number: z.string(),
    destination: z.object({
      name: z.string(),
    }),
  }),
})

const departuresSchema = z.object({
  version: z.string(),
  stopEvents: z.array(stopEventSchema),
})

function getDepartureTime(stopEvent: z.infer<typeof stopEventSchema>) {
  return stopEvent.departureTimeEstimated || stopEvent.departureTimePlanned
}

function getCarBadge(stopEvent: z.infer<typeof stopEventSchema>) {
  const tripId = stopEvent.properties.RealtimeTripId
  const carCount = getCarCountFromTripId(tripId)
  return `${carCount} cars`
}

export async function fetchDepartures(stopId: string, apiKey: string) {
  const url = 'https://api.transport.nsw.gov.au/v1/tp/departure_mon'
  const params = new URLSearchParams({
    outputFormat: 'rapidJSON',
    coordOutputFormat: 'EPSG:4326',
    mode: 'direct',
    type_dm: 'stop',
    name_dm: stopId,
    departureMonitorMacro: 'true',
    TfNSWDM: 'true',
    version: '10.6.21.17',
  })

  const response = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `apikey ${apiKey}`,
    },
  })
  const data = await response.json()
  const parsedData = departuresSchema.parse(data)

  // Return the next 5 departures sorted by either estimated or planned time
  const departures = parsedData.stopEvents
    .sort((a, b) => {
      const aTime = getDepartureTime(a)
      const bTime = getDepartureTime(b)
      return aTime.localeCompare(bTime)
    })
    .slice(0, 3)
    .map((event) => {
      const destination = event.transportation.destination.name.split('via')
      const platformRegex = /Platform (\d+)/
      const platformMatch = event.location.name.match(platformRegex)
      const platform = platformMatch
        ? platformMatch[1]
        : event.location.properties.area

      const stationNameRegex = /(.*) Station/
      const stationNameMatch = event.location.name.match(stationNameRegex)
      const stationName = stationNameMatch
        ? stationNameMatch[1]
        : event.location.name
      return {
        departureTime: getDepartureTime(event),
        line: event.transportation.disassembledName,
        destination: destination[0].trim(),
        destinationSubtitle: destination[1]
          ? `via ${destination[1].trim()}`
          : '',
        tripId: event.properties.RealtimeTripId,
        stopId: event.location.id,
        platform: platform,
        stationName,
        badges: [getCarBadge(event)],
      }
    })

  return departures
}
