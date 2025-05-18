export function CapacityIndicator({
  carCount,
  capacity,
}: {
  carCount: number
  capacity: Record<number, 'low' | 'medium' | 'high' | null>
}) {
  return (
    <div className="flex flex-row items-center gap-1 mb-1">
      {Array.from({ length: carCount }).map((_, index) => (
        <Car key={index} id={carCount - index} capacity={capacity[index]} />
      ))}
    </div>
  )
}

function Car({
  id,
  capacity,
}: {
  id: number
  capacity: 'low' | 'medium' | 'high' | null
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-xs">{id}</div>
      <CarBody capacity={capacity ?? 'high'} isHead={id === 1} />
    </div>
  )
}

function CarBody({
  capacity,
  isHead,
}: {
  capacity: 'low' | 'medium' | 'high'
  isHead: boolean
}) {
  const colors = {
    low: 'var(--color-capacity-low)',
    medium: 'var(--color-capacity-medium)',
    high: 'var(--color-capacity-high)',
  }
  const fill = colors[capacity]
  return (
    <svg
      width="2.5rem"
      height="1.25rem"
      viewBox="0 0 42 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {isHead ? (
        <path
          d="M0 2.5C0 1.39543 0.895431 0.5 2 0.5H26.0387C26.6463 0.5 27.2209 0.776179 27.6005 1.25061L29 3L40.6223 16.8574C41.1681 17.5081 40.7055 18.5 39.8561 18.5H2C0.89543 18.5 0 17.6046 0 16.5V2.5Z"
          fill={fill}
        />
      ) : (
        <rect width="42" height="18" rx="2" fill={fill} />
      )}
      <People capacity={capacity} isHead={isHead} />
    </svg>
  )
}

function Person() {
  return (
    <g viewBox="0 0 6 15">
      <circle cx="3" cy="1.5" r="1.5" fill="white" />
      <path
        d="M0 3.5H6V8.5L4.8 9.5V14.5H1.2L1.15862 9.5L0 8.5V3.5Z"
        fill="white"
      />
    </g>
  )
}

function People({
  capacity,
  isHead,
}: {
  capacity: 'low' | 'medium' | 'high'
  isHead: boolean
}) {
  const transform = isHead ? 'translate(12, 2)' : 'translate(18, 2)'
  if (capacity === 'high') {
    return (
      <g transform={transform}>
        <Person />
      </g>
    )
  }
  if (capacity === 'medium') {
    return (
      <g transform={transform}>
        <g transform="translate(-3.5, 0)">
          <Person />
        </g>
        <g transform="translate(3.5, 0)">
          <Person />
        </g>
      </g>
    )
  }
  if (capacity === 'low') {
    return (
      <g transform={transform}>
        <g transform="translate(-7,0)">
          <Person />
        </g>
        <Person />
        <g transform="translate(7,0)">
          <Person />
        </g>
      </g>
    )
  }
}
