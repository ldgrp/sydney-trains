import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTRPC } from '@/integrations/trpc/react'
import { useQuery } from '@tanstack/react-query'

export function StopSelect({
  selectedStop,
  onSelectStop,
}: {
  selectedStop: string | null
  onSelectStop: (stop: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState<string | null>(null)
  const [page, setPage] = useState<{ id: string; name: string }[] | null>(null)

  const trpc = useTRPC()
  const { data: stops, isPending } = useQuery(trpc.transit.stops.queryOptions())

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      setPage(null)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOnOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isPending}
        >
          {selectedParent
            ? stops?.find((stop) => stop.id === selectedParent)?.name
            : 'Select stop...'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search stop..." className="h-9" />
          <CommandList>
            <CommandEmpty>No stop found.</CommandEmpty>
            <CommandGroup>
              {!page &&
                stops?.map((stop) => (
                  <CommandItem
                    key={stop.id}
                    value={stop.id}
                    keywords={[stop.name]}
                    onSelect={() => {
                      setSelectedParent(stop.id)
                      setPage(stop.platforms)
                    }}
                  >
                    {stop.name}
                    <Check
                      className={cn(
                        'ml-auto',
                        selectedParent === stop.id
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
                    onSelect={() => {
                      onSelectStop(stop.id)
                      setOpen(false)
                      setTimeout(() => {
                        setPage(null)
                      }, 100)
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
      </PopoverContent>
    </Popover>
  )
}
