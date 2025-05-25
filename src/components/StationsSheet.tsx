'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Check, ChevronLeft, Search } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './ui/breadcrumb'
import { Button } from './ui/button'

type StationsSheetProps = {
  defaultParentName?: string
  selectedStop: string | null
  triggerComponent: React.ReactNode
}

function slugify(parts: string[]) {
  return parts
    .map((part) => encodeURIComponent(part.toLowerCase().replace(/ /g, '-')))
    .join('-')
}

export default function StationsSheet({
  defaultParentName,
  selectedStop,
  triggerComponent,
}: StationsSheetProps) {
  const isMobile = useIsMobile()
  const trpc = useTRPC()
  const navigate = useNavigate()
  const { data: stops, isPending } = useQuery(trpc.transit.stops.queryOptions())
  const [selectedParent, setSelectedParent] = useState<{
    id: string
    name: string
    platforms: { id: string; name: string }[]
  } | null>(null)

  useEffect(() => {
    if (!defaultParentName) {
      return
    }
    setSelectedParent(
      stops?.find((stop) =>
        stop.name.toLowerCase().includes(defaultParentName.toLowerCase()),
      ) ?? null,
    )
  }, [defaultParentName, stops])

  const side = isMobile ? 'right' : 'right'
  return (
    <Sheet>
      <SheetTrigger asChild>{triggerComponent}</SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>Change Station</SheetTitle>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedParent(null)
                  }}
                >
                  Station
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>
                  {selectedParent ? selectedParent.name : ''}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </SheetHeader>
        <Command>
          <CommandInput
            placeholder={
              selectedParent ? 'Search platform...' : 'Search stop...'
            }
            className="h-9"
            onKeyDown={(e) => {
              if (
                e.key === 'Backspace' &&
                e.currentTarget.value === '' &&
                selectedParent
              ) {
                setSelectedParent(null)
              }
            }}
            icon={
              selectedParent ? (
                <ChevronLeft
                  className="size-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
                  onClick={() => {
                    setSelectedParent(null)
                  }}
                />
              ) : (
                <Search className="size-4 shrink-0 opacity-50" />
              )
            }
          />
          <CommandList className="max-h-full">
            <CommandEmpty>No stop found.</CommandEmpty>
            <CommandGroup>
              {!selectedParent &&
                stops?.map((stop) => (
                  <CommandItem
                    key={stop.id}
                    value={stop.id}
                    keywords={[stop.name]}
                    onSelect={() => {
                      setSelectedParent(stop)
                    }}
                    className="font-sydney-trains tracking-tight"
                  >
                    {stop.name}
                  </CommandItem>
                ))}
              {selectedParent &&
                selectedParent.platforms.map((stop) => (
                  <CommandItem
                    key={stop.id}
                    value={stop.id}
                    keywords={[stop.name]}
                    className="font-sydney-trains tracking-tight"
                    onSelect={() => {
                      navigate({
                        to: '/pid/$slug',
                        params: { slug: slugify([stop.name, stop.id]) },
                        search: {
                          variant: 'normal',
                          enableScrolling: true,
                          showOccupancy: true,
                          showStationName: true,
                          showSettings: true,
                        },
                      })
                    }}
                  >
                    {stop.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        selectedStop === stop.id ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </SheetContent>
    </Sheet>
  )
}
