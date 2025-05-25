'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Settings } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { Switch } from './ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { useNavigate } from '@tanstack/react-router'
import { Separator } from './ui/separator'

export const settingsSchema = z.object({
  variant: z.enum(['normal', 'compact', 'normal-old']),
  enableScrolling: z.boolean(),
  showOccupancy: z.boolean(),
  showStationName: z.boolean(),
  showSettings: z.boolean(),
})

export const defaultSettings: z.infer<typeof settingsSchema> = {
  variant: 'normal',
  enableScrolling: true,
  showOccupancy: true,
  showStationName: true,
  showSettings: true,
}

export default function SettingsSheet() {
  const navigate = useNavigate({ from: '/pid/$slug' })
  const isMobile = useIsMobile()
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  })

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    navigate({
      search: {
        variant: values.variant,
        enableScrolling: values.enableScrolling,
        showOccupancy: values.showOccupancy,
        showStationName: values.showStationName,
        showSettings: values.showSettings,
      },
    })
  }

  const side = isMobile ? 'right' : 'right'
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Settings />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
              <SheetDescription>
                Change how the the PID looks and behaves.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <h3 className="text-lg font-medium">
                Passenger Information Display
              </h3>
              <FormField
                control={form.control}
                name="variant"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2 justify-self-end">
                      Variant
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Portrait</SelectItem>
                          <SelectItem value="normal-old">
                            Portrait (old)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enableScrolling"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2 justify-self-end">
                      Enable scrolling
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Switch
                        id="enableScrolling"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showOccupancy"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2 justify-self-end">
                      Show occupancy
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Switch
                        id="showOccupancy"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Separator />
              <h3 className="font-medium">Interface</h3>
              <FormField
                control={form.control}
                name="showStationName"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2 justify-self-end">
                      Show station
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Switch
                        id="showStationName"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showSettings"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-2 justify-self-end">
                      Show settings
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Switch
                        id="showSettings"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Apply</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
