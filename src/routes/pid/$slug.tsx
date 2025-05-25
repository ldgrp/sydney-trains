import PID from '@/components/PID'
import PIDFrame from '@/components/PIDFrame'
import SettingsSheet, {
  defaultSettings,
  settingsSchema,
} from '@/components/SettingsSheet'
import StationSign from '@/components/StationSign'
import StationsSheet from '@/components/StationsSheet'
import { Button } from '@/components/ui/button'
import { usePIDData } from '@/hooks/usePIDData'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { Share, Train } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/pid/$slug')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    const parsedSettings = settingsSchema.safeParse(search)
    if (parsedSettings.success) {
      return parsedSettings.data
    }
    return defaultSettings
  },
})

function getStopId(slug: string) {
  const parts = slug.split('-')
  return parts[parts.length - 1]
}

function RouteComponent() {
  const { slug } = Route.useParams()
  const {
    variant,
    enableScrolling,
    showOccupancy,
    showStationName,
    showSettings,
  } = Route.useSearch()
  const stopId = getStopId(slug)

  const data = usePIDData(stopId)

  useEffect(() => {
    if (data) {
      document.title = `${data.stationName} - Platform ${data.platform} - PID`
    }
  }, [data])

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <div
      className={cn(
        'h-screen w-screen flex flex-col gap-2 items-center bg-neutral-900',
      )}
    >
      <div className="flex flex-row gap-2 my-4"></div>
      <div
        className={cn(
          'flex flex-col grow items-center justify-start md:justify-center gap-2 py-4',
        )}
      >
        {showStationName && (
          <StationsSheet
            defaultParentName={data.stationName}
            selectedStop={stopId}
            triggerComponent={
              <button>
                <StationSign title={data.stationName} />
              </button>
            }
          />
        )}
        <PIDFrame>
          <PID
            variant={variant === 'normal' ? 'new' : 'old'}
            enableScrolling={enableScrolling}
            showOccupancy={showOccupancy}
            time={null}
            tripId={data.tripId}
            carCount={data.carCount}
            capacity={{
              1: 'high',
              2: 'medium',
              3: 'medium',
              4: 'low',
              5: 'high',
              6: 'high',
              7: 'high',
              8: 'high',
            }}
            destination={data.destination}
            destinationSubtitle={data.destinationSubtitle}
            line={data.line}
            platform={data.platform}
            departureTime={data.departureTime}
            stops={data.stops}
            badges={data.badges}
            nextServices={data.nextServices}
          />
        </PIDFrame>
        {showSettings && (
          <div className="flex flex-row w-full justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    url: window.location.href,
                    title: 'Sydney Trains PID',
                  })
                }
              }}
            >
              <Share />
              Share
            </Button>
            <StationsSheet
              defaultParentName={data.stationName}
              selectedStop={stopId}
              triggerComponent={
                <Button variant="outline">
                  <Train />
                  Change Station
                </Button>
              }
            />
            <SettingsSheet />
          </div>
        )}
      </div>
    </div>
  )
}
