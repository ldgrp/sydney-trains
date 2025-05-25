'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Check } from 'lucide-react'
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
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './ui/breadcrumb'

type StationsSheetProps = {
  selectedStop: string | null
  triggerComponent: React.ReactNode
}

function slugify(parts: string[]) {
  return parts
    .map((part) => encodeURIComponent(part.toLowerCase().replace(/ /g, '-')))
    .join('-')
}

export default function StationsSheet({
  selectedStop,
  triggerComponent,
}: StationsSheetProps) {
  const isMobile = useIsMobile()
  const trpc = useTRPC()
  const { data: stops, isPending } = useQuery(trpc.transit.stops.queryOptions())
  const [selectedParent, setSelectedParent] = useState<{
    id: string
    name: string
  } | null>(null)
  const [page, setPage] = useState<{ id: string; name: string }[] | null>(null)

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
                  onClick={() => {
                    setSelectedParent(null)
                    setPage(null)
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
          <CommandInput placeholder="Search stop..." className="h-9" />
          <CommandList className="max-h-full">
            <CommandEmpty>No stop found.</CommandEmpty>
            <CommandGroup>
              {!page &&
                stops?.map((stop) => (
                  <CommandItem
                    key={stop.id}
                    value={stop.id}
                    keywords={[stop.name]}
                    onSelect={() => {
                      setSelectedParent(stop)
                      setPage(stop.platforms)
                    }}
                    className="font-sydney-trains tracking-tight"
                  >
                    {stop.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        selectedParent?.id === stop.id
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </CommandItem>
                ))}
              {page &&
                page.map((stop) => (
                  <CommandItem
                    key={stop.id}
                    value={stop.id}
                    keywords={[stop.name]}
                    asChild
                    className="font-sydney-trains tracking-tight"
                  >
                    <Link
                      to="/pid/$slug"
                      params={{ slug: slugify([stop.name, stop.id]) }}
                      search={{
                        variant: 'normal',
                        enableScrolling: true,
                        showOccupancy: true,
                        showStationName: true,
                        showSettings: true,
                      }}
                    >
                      {stop.name}
                      <Check
                        className={cn(
                          'ml-auto',
                          selectedStop === stop.id
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    </Link>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </SheetContent>
    </Sheet>
  )
}
