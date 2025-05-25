import { createFileRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Train } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import StationSign from '@/components/StationSign'
import { Button } from '@/components/ui/button'
import StationsSheet from '@/components/StationsSheet'

export const Route = createFileRoute('/')({
  component: App,
})

const stations = [
  { id: 'town-hall-platform-1-2000391', name: 'Town Hall' },
  { id: 'central-platform-23-2000343', name: 'Central' },
  { id: 'wynyard-platform-3-2000403', name: 'Wynyard' },
  { id: 'parramatta-platform-1-2150411', name: 'Parramatta' },
  { id: 'chatswood-platform-1-2067141', name: 'Chatswood' },
  { id: 'redfern-platform-6-2015136', name: 'Redfern' },
  { id: 'circular-quay-platform-1-2000351', name: 'Circular Quay' },
  { id: 'strathfield-platform-7-2135237', name: 'Strathfield' },
  { id: 'bondi-junction-platform-1-202291', name: 'Bondi Junction' },
  { id: 'erskineville-platform-1-204331', name: 'Erskineville' },
]

function App() {
  return (
    <div
      className={cn(
        'flex min-h-screen justify-start md:justify-center p-4 flex-col gap-4 items-center bg-neutral-900',
      )}
    >
      {stations.map((station) => (
        <Link
          key={station.id}
          to="/pid/$slug"
          params={{ slug: station.id }}
          search={{
            showStationName: true,
            showSettings: true,
            variant: 'normal',
            enableScrolling: true,
            showOccupancy: true,
          }}
        >
          <StationSign title={station.name} />
        </Link>
      ))}

      <StationsSheet
        selectedStop={null}
        triggerComponent={
          <Button variant="outline" className="cursor-pointer">
            <Train />
            or select a station
          </Button>
        }
      />
    </div>
  )
}
