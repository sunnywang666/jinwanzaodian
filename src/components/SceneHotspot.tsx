import { useState } from 'react'

interface SceneHotspotProps {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  onClick: () => void
  debug?: boolean
}

export function SceneHotspot({ id, label, x, y, width, height, onClick, debug = false }: SceneHotspotProps) {
  const [active, setActive] = useState(false)

  return (
    <button
      type="button"
      aria-label={label}
      data-hotspot-id={id}
      className={`absolute rounded-[18px] transition duration-200 ${
        debug ? 'border-2 border-dashed border-brown/70 bg-butter/20' : 'border border-transparent bg-transparent'
      } ${active ? 'scale-[1.06] shadow-[0_0_26px_rgba(240,221,179,0.95)]' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      onClick={() => {
        setActive(true)
        window.setTimeout(() => {
          setActive(false)
          onClick()
        }, 200)
      }}
    >
      {debug ? <span className="rounded-full bg-paper/90 px-2 py-1 text-[11px] text-brown">{label}</span> : null}
    </button>
  )
}
