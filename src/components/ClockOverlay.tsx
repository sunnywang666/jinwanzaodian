import { useEffect, useState } from 'react'

export function ClockOverlay() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  const hourAngle = (hours + minutes / 60) * 30
  const minuteAngle = (minutes + seconds / 60) * 6
  const secondAngle = seconds * 6

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: '46.9%',
        top: '15.4%',
        width: '7.6%',
        aspectRatio: '1',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
      }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle cx="50" cy="50" r="38" fill="#f5ead4" opacity="0.92" />

        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
          <line
            key={angle}
            x1="50"
            y1="16"
            x2="50"
            y2={angle % 90 === 0 ? '21' : '19'}
            stroke="#7a6354"
            strokeWidth={angle % 90 === 0 ? '2' : '1.2'}
            strokeLinecap="round"
            transform={`rotate(${angle}, 50, 50)`}
            opacity="0.55"
          />
        ))}

        <line
          x1="50"
          y1="52"
          x2="50"
          y2="28"
          stroke="#5c4a3a"
          strokeWidth="3.2"
          strokeLinecap="round"
          transform={`rotate(${hourAngle}, 50, 50)`}
        />

        <line
          x1="50"
          y1="53"
          x2="50"
          y2="20"
          stroke="#5c4a3a"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle}, 50, 50)`}
        />

        <line
          x1="50"
          y1="56"
          x2="50"
          y2="18"
          stroke="#b07a56"
          strokeWidth="0.9"
          strokeLinecap="round"
          transform={`rotate(${secondAngle}, 50, 50)`}
          opacity="0.65"
        />

        <circle cx="50" cy="50" r="2.8" fill="#5c4a3a" />
        <circle cx="50" cy="50" r="1.2" fill="#8a6e58" />
      </svg>
    </div>
  )
}
