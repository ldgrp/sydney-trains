import { ImageResponse } from '@vercel/og'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import fs from 'fs'
import path from 'path'

// read the asset
const newFrank = fs.readFileSync(
  path.join(process.cwd(), 'src/assets/fonts/New Frank Regular.otf'),
)

const newFrankMedium = fs.readFileSync(
  path.join(process.cwd(), 'src/assets/fonts/New Frank Medium.otf'),
)

const newFrankBold = fs.readFileSync(
  path.join(process.cwd(), 'src/assets/fonts/New Frank Bold.otf'),
)

export const APIRoute = createAPIFileRoute('/api/og')({
  GET: async ({ request, params }) => {
    const { searchParams } = new URL(request.url)
    const stationName = searchParams.get('stationName') ?? 'Redfern'
    const destination = searchParams.get('destination') ?? 'City Circle'
    const destinationVia = searchParams.get('destinationVia') ?? 'via Town Hall'
    const platformNumber = searchParams.get('platformNumber') ?? '1'

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 40,
            color: 'black',
            background: '#ec6606',
            width: '100%',
            height: '100%',
            fontFamily: 'New Frank',
            textAlign: 'center',
            justifyContent: 'flex-start',
            paddingTop: '120px',
            alignItems: 'center',
            gap: '64px',
          }}
        >
          <div
            style={{
              fontSize: 70,
              color: 'white',
              fontWeight: 500,
              flexShrink: 0,
              letterSpacing: '-0.025em',
            }}
          >
            {stationName}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '8px solid #f5f5f5',
              padding: '16px',
              background: 'black',
              height: '600px',
              boxShadow: '0 0 24px 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontSize: '36px',
                  background: '#3e3f47',
                  color: 'white',
                  display: 'flex',
                  width: '493px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 500,
                  padding: '0.325rem 1rem 0.25rem',
                  letterSpacing: '-0.025rem',
                }}
              >
                <div>Next Service</div>
                <div>9:41:00</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontSize: '36px',
                  background: 'white',
                  color: 'black',
                  height: '500px',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '16px',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      color: 'white',
                      fontWeight: 500,
                      background: '#0098ce',
                      padding: '',
                      borderRadius: '1rem',
                      width: '80px',
                      height: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '56px',
                    }}
                  >
                    T1
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '42px',
                        fontWeight: 500,
                        letterSpacing: '-0.025rem',
                      }}
                    >
                      {destination}
                    </div>
                    <div style={{ fontSize: '28px' }}>{destinationVia}</div>
                  </div>
                </div>
                <div
                  style={{ display: 'flex', margin: '1rem 0', gap: '0.5rem' }}
                >
                  <Car />
                  <Car />
                  <Car />
                  <Car />
                  <Car />
                  <Car />
                  <Car />
                  <Car isHead={true} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      fontSize: '28px',
                      color: 'black',
                    }}
                  >
                    <div>Central</div>
                    <div>Town Hall</div>
                    <div>Wynyard</div>
                    <div>Circular Quay</div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                    }}
                  >
                    <div style={{ fontSize: '20px' }}>Platform</div>
                    <div style={{ fontSize: '42px', fontWeight: 500 }}>
                      {platformNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'New Frank',
            data: newFrank.buffer,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'New Frank',
            data: newFrankBold.buffer,
            style: 'normal',
            weight: 700,
          },
          {
            name: 'New Frank',
            data: newFrankMedium.buffer,
            style: 'normal',
            weight: 500,
          },
        ],
      },
    )
  },
})

function Car({ isHead }: { isHead?: boolean }) {
  return (
    <svg
      width="3.0rem"
      height="1.25rem"
      viewBox="0 0 42 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isHead ? (
        <path
          d="M0 2.5C0 1.39543 0.895431 0.5 2 0.5H26.0387C26.6463 0.5 27.2209 0.776179 27.6005 1.25061L29 3L40.6223 16.8574C41.1681 17.5081 40.7055 18.5 39.8561 18.5H2C0.89543 18.5 0 17.6046 0 16.5V2.5Z"
          fill={'#00a551'}
        />
      ) : (
        <rect width="42" height="18" rx="2" fill={'#00a551'} />
      )}
      <g transform={isHead ? 'translate(12, 2)' : 'translate(18, 2)'}>
        <g viewBox="0 0 6 15">
          <circle cx="3" cy="1.5" r="1.5" fill="white" />
          <path
            d="M0 3.5H6V8.5L4.8 9.5V14.5H1.2L1.15862 9.5L0 8.5V3.5Z"
            fill="white"
          />
        </g>
      </g>
    </svg>
  )
}
