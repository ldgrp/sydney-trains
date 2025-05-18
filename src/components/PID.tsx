import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import React from 'react'
import { useEffect, useState } from 'react'

type PIDProps = {
  time: Date | null
  destination: string
  destinationSubtitle: string | null
  line: string
  platform: number
  departsMinutes: number | 'now'
  stops: string[]
  badges: string[]
  nextServices: {
    destination: string
    destinationSubtitle?: string
    badges: string[]
    platform: string
    departsMinutes: number
  }[]
}

export default function PID({
  time,
  destination,
  destinationSubtitle,
  line,
  platform,
  departsMinutes,
  stops,
  badges,
  nextServices,
}: PIDProps) {
  return (
    <div className="aspect-video max-w-sm h-[42rem] bg-white font-sydney-trains">
      <PIDHeader now={time} />
      <div className="px-3">
        <PIDLine
          line={line}
          destination={destination}
          destinationSubtitle={destinationSubtitle}
        />
        <PIDBody
          stops={stops}
          platform={platform}
          departsMinutes={departsMinutes}
          badges={badges}
        />
        <PIDFooter nextServices={nextServices} />
      </div>
    </div>
  )
}

function PIDHeader({ now }: { now: Date | null }) {
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
    <div className="px-3 pt-1 pb-0.5 flex justify-between bg-sydney-trains text-white font-medium text-[1.75rem]">
      <div>Next Service</div>
      <div>{time24h}</div>
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
      <div className="h-16 w-16 rounded-xl bg-t1 flex items-center justify-center">
        <span className="text-[2.75rem] text-center font-medium text-white">
          {line}
        </span>
      </div>
      <div className="flex flex-col">
        <div className="text-4xl font-medium">{destination}</div>
        <div className="text-xl">{destinationSubtitle}</div>
      </div>
    </div>
  )
}

function PIDBody({
  stops,
  platform,
  departsMinutes,
  badges,
}: {
  stops: string[]
  platform: number
  departsMinutes: number | 'now'
  badges: string[]
}) {
  return (
    <div className="flex flex-col min-h-[23.75rem] max-h-[24.75rem] border-y-2 border-black relative">
      <div className="flex flex-col grow text-2xl my-1 mb-2 gap-2">
        <div className="flex max-h-[22rem] h-full grow flex-col overflow-hidden">
          <div
            className={cn('flex flex-col grow animate-marquee')}
            style={{
              animationDuration: `${Math.max(20, stops.length * 2)}s`,
            }}
          >
            <div className="grow">&nbsp;</div>
            {stops.map((stop) => (
              <div key={stop}>{stop}</div>
            ))}
          </div>
        </div>
        <Badges badges={badges} />
      </div>
      <div className="flex flex-col items-end absolute top-4 right-0">
        <div className="text-lg">Platform</div>
        <div className="text-4xl font-medium">{platform}</div>
      </div>
      <div className="flex flex-row justify-between absolute bottom-2 right-0">
        <div className="flex flex-col items-end">
          <div className="text-lg">Departs</div>
          <div className="text-4xl font-medium">{departsMinutes} min</div>
        </div>
      </div>
    </div>
  )
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
    <div className="bg-zinc-600 text-white px-2.5 font-bold text-sm">
      {badge}
    </div>
  )
}

function PIDFooter({
  nextServices,
}: {
  nextServices: {
    destination: string
    destinationSubtitle?: string
    platform: string
    departsMinutes: number
    badges: string[]
  }[]
}) {
  return (
    <div className="grid grid-cols-4 py-2">
      <div className="col-span-2">Following Services</div>
      <div className="text-center">Platform</div>
      <div className="text-right">Departs</div>
      {nextServices.map((service) => (
        <React.Fragment key={service.destination}>
          <div className="text-2xl col-span-2">
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div className="text-2xl">{service.destination}</div>
              </div>
            </div>
          </div>
          <div className="text-2xl text-center">{service.platform}</div>
          <div className="text-2xl text-right">
            {service.departsMinutes} min
          </div>
          <div className="col-span-4 flex flex-row gap-1">
            <div className="text-sm">{service.destinationSubtitle}</div>
            <Badges badges={service.badges} />
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
