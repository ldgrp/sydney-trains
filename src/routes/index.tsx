import { createFileRoute } from '@tanstack/react-router'
import PID from '@/components/PID'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-t1">
      <div className="bg-black p-2 border-[1em] border-neutral-200 border-t-neutral-100 border-l-neutral-100 shadow-lg">
        <PID
          time={null}
          destination="Richmond"
          destinationSubtitle="via Paramatta"
          line="T1"
          platform={18}
          departsMinutes={4}
          stops={[
            'Redfern',
            'Strathfield',
            'Lidcombe',
            'Paramatta',
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
              destinationSubtitle: 'via Paramatta',
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
