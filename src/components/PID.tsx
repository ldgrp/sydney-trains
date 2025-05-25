import { cn } from '@/lib/utils'
import { differenceInMinutes, format } from 'date-fns'
import React from 'react'
import { useEffect, useState } from 'react'
import { CapacityIndicator } from './CapacityIndicator'
import { Separator } from './ui/separator'

type BasePIDProps = {
  tripId: string
  time: Date | null
  destination: string
  destinationSubtitle: string | null
  line: string
  platform: string
  departureTime: string
  stops: {
    id: string
    name: string
  }[]
  badges: string[]
  nextServices: {
    tripId: string
    destination: string
    destinationSubtitle?: string
    badges: string[]
    platform: string
    departureTime: string
  }[]
  carCount?: number
  capacity?: Record<number, 'low' | 'medium' | 'high' | null>
  showOccupancy: boolean
  enableScrolling: boolean
}

type PIDProps = BasePIDProps &
  (
    | {
        variant: 'old'
      }
    | {
        variant: 'new'
        carCount: number
        capacity: Record<number, 'low' | 'medium' | 'high' | null>
      }
  )

export default function PID({
  variant,
  showOccupancy,
  enableScrolling,
  carCount,
  capacity,
  time,
  destination,
  destinationSubtitle,
  line,
  platform,
  departureTime,
  stops,
  badges,
  nextServices,
}: PIDProps) {
  const isOccupancyVisible = variant === 'new' && showOccupancy
  return (
    <div className="aspect-video max-w-sm h-[42rem] bg-white font-sydney-trains text-black">
      <PIDHeader now={time} variant={variant} />
      <div className="px-3">
        <PIDLine
          line={line}
          destination={destination}
          destinationSubtitle={destinationSubtitle}
        />
        {isOccupancyVisible ? (
          <CapacityIndicator carCount={carCount} capacity={capacity} />
        ) : (
          variant === 'old' && (
            <Separator
              className={cn('my-1', variant === 'old' && 'bg-black')}
            />
          )
        )}
        <PIDBody
          enableScrolling={enableScrolling}
          stops={stops}
          platform={platform}
          departureTime={departureTime}
          badges={badges}
          showOccupancy={isOccupancyVisible}
        />
        <Separator
          className={cn(
            'my-1',
            variant === 'old' && 'bg-black',
            variant === 'new' && 'bg-sydney-trains',
          )}
        />
        <PIDFooter nextServices={nextServices} />
      </div>
    </div>
  )
}

function PIDHeader({
  now,
  variant,
}: {
  now: Date | null
  variant: 'old' | 'new'
}) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    if (now) {
      setCurrentTime(now)
      return
    }
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const time24h = format(currentTime, 'H:mm:ss')

  return (
    <div
      className={cn(
        'px-3 pt-1 pb-0.5 flex justify-between bg-sydney-trains text-white font-medium text-[1.75rem] transition-colors tracking-tight',
        variant === 'new' && 'bg-zinc-700',
      )}
    >
      <div>{variant === 'old' ? 'Service' : 'Next Service'}</div>
      <div className="flex flex-row items-end gap-4 mb-1">
        {variant === 'old' && <div className="text-sm">Time now</div>}
        <div className="text-2xl">{time24h}</div>
      </div>
    </div>
  )
}

function LineLogo({ line }: { line: string }) {
  const isSydneyTrains = line.startsWith('T')

  if (isSydneyTrains) {
    return (
      <div
        className={cn(
          'h-16 w-16 rounded-xl flex items-center justify-center tracking-tighter text-center shrink-0  ',
          line === 'T1' && 'bg-t1',
          line === 'T2' && 'bg-t2',
          line === 'T3' && 'bg-t3',
          line === 'T4' && 'bg-t4',
          line === 'T5' && 'bg-t5',
          line === 'T7' && 'bg-t7',
          line === 'T8' && 'bg-t8',
          line === 'T9' && 'bg-t9',
        )}
      >
        <span className="text-[2.625rem] text-center font-medium text-white">
          {line}
        </span>
      </div>
    )
  }

  // TODO: Is this a correct fallback?
  return (
    <div className="h-14 w-14 rounded-full flex items-center justify-center tracking-tighter text-center bg-sydney-trains shrink-0">
      <span className="text-[2.75rem] text-center font-medium text-white">
        T
      </span>
    </div>
  )
}

function PIDLine({
  line,
  destination,
  destinationSubtitle,
}: {
  line: string
  destination: string
  destinationSubtitle: string | null
}) {
  return (
    <div className="flex flex-row items-center py-2 gap-2">
      <LineLogo line={line} />
      <div className="flex flex-col">
        <div className="text-4xl tracking-tight font-medium line-clamp-1">
          {destination}
        </div>
        <div className="text-xl">{destinationSubtitle}&nbsp;</div>
      </div>
    </div>
  )
}

function PIDBody({
  enableScrolling,
  stops,
  platform,
  departureTime,
  badges,
  showOccupancy,
}: {
  stops: {
    id: string
    name: string
  }[]
  platform: string
  departureTime: string
  badges: string[]
  showOccupancy: boolean
  enableScrolling: boolean
}) {
  return (
    <div
      className={cn(
        'flex flex-col min-h-[22.25rem] relative overflow-hidden',
        showOccupancy ? 'max-h-[22rem]' : 'max-h-[24rem]',
      )}
    >
      <div className="flex flex-col grow text-2xl my-1 mb-2 gap-2">
        <div className="flex h-full grow flex-col overflow-hidden">
          <div
            className={cn(
              'flex flex-col grow',
              enableScrolling && 'animate-marquee',
            )}
            style={{
              animationDuration: `${Math.max(20, stops.length * 2)}s`,
            }}
          >
            {enableScrolling && <div className="grow">&nbsp;</div>}
            {stops.map((stop) => (
              <div key={stop.id}>{stop.name}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end absolute top-4 right-0">
        <div className="text-lg">Platform</div>
        <div className="text-4xl font-medium">{platform}</div>
      </div>
      <div className="bg-white absolute bottom-0 left-0 py-2 w-full">
        <Badges badges={badges} />
      </div>
      <div className="flex flex-row justify-between absolute bottom-2 right-0">
        <div className="flex flex-col items-end">
          <div className="text-lg">Departs</div>
          <DepartureTime
            departureTime={departureTime}
            className="text-4xl font-medium"
          />
        </div>
      </div>
    </div>
  )
}

function DepartureTime({
  departureTime,
  className,
}: {
  departureTime: string
  className: string
}) {
  // Refreshes every 1 second toand sues getDepartureTime
  const [time, setTime] = useState(getDepartureTime(departureTime))

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getDepartureTime(departureTime))
    }, 1000)
    return () => clearInterval(interval)
  }, [departureTime])

  return <div className={cn(className)}>{time}</div>
}

function Badges({ badges }: { badges: string[] }) {
  return (
    <div className="flex flex-row items-end gap-2">
      {badges.map((badge) => (
        <Badge key={badge} badge={badge} />
      ))}
    </div>
  )
}

function Badge({ badge }: { badge: string }) {
  return (
    <div className="bg-zinc-600 text-white px-2.5 font-medium tracking-tight text-sm">
      {badge}
    </div>
  )
}

function PIDFooter({
  nextServices,
}: {
  nextServices: {
    tripId: string
    destination: string
    destinationSubtitle?: string
    platform: string
    departureTime: string
    badges: string[]
  }[]
}) {
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-2">Following Services</div>
      <div className="text-center">Platform</div>
      <div className="text-right">Departs</div>
      {nextServices.map((service) => (
        <React.Fragment key={service.tripId}>
          <div className="text-2xl col-span-2">
            <div className="flex flex-row">
              <div className="flex flex-col ">
                <div className="text-2xl line-clamp-1">
                  {service.destination}
                </div>
              </div>
            </div>
          </div>
          <div className="text-2xl text-center">{service.platform}</div>
          <DepartureTime
            departureTime={service.departureTime}
            className="text-2xl text-right whitespace-nowrap"
          />
          <div className="col-span-4 flex flex-row gap-1 min-h-3">
            <div className="text-sm">{service.destinationSubtitle}</div>
            <Badges badges={service.badges} />
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

function getDepartureTime(departureTime: string) {
  const minutes = differenceInMinutes(new Date(departureTime), new Date())

  if (minutes <= 0) {
    return '1 min'
  } else if (minutes > 60) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
  }

  return `${minutes} min`
}