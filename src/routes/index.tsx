import { createFileRoute } from '@tanstack/react-router'
import PID from '@/components/PID'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [variant, setVariant] = useState<'old' | 'new'>('new')
  return (
    <div className="h-screen w-screen flex flex-col gap-2 justify-center items-center bg-t1">
      <Switch
        checked={variant === 'new'}
        onCheckedChange={(checked) => setVariant(checked ? 'new' : 'old')}
      />
      <div className="bg-black p-2 border-[1em] border-neutral-200 border-t-neutral-100 border-l-neutral-100 shadow-lg">
        <PID
          variant={variant}
          carCount={8}
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
          time={null}
          destination="Richmond"
          destinationSubtitle="via Parramatta"
          line="T1"
          platform={18}
          departsMinutes={4}
          stops={[
            'Redfern',
            'Strathfield',
            'Lidcombe',
            'Parramatta',
            'Westmead',
            'Wentworthville',
            'Pendle Hill',
            'Toongabbie',
            'Seven Hills',
            'Blacktown',
            'Marayong',
            'Quakers Hill',
            'Schofields',
            'Riverstone',
            'Vinehard',
            'Mulgrave',
            'Windsor',
            'Clarendon',
            'East Richmond',
            'Richmond',
          ]}
          badges={['8 cars', 'Limited Stops']}
          nextServices={[
            {
              destination: 'Penrith',
              destinationSubtitle: 'via Parramatta',
              platform: '18',
              departsMinutes: 4,
              badges: ['Limited Stops'],
            },
            {
              destination: 'Hornsby',
              platform: '18',
              departsMinutes: 10,
              badges: ['All Stops'],
              destinationSubtitle: 'via Strathfield',
            },
          ]}
        />
      </div>
    </div>
  )
}
