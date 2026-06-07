import { useState } from 'react'
import type { SceneItem } from '../lib/sceneItems'
import { AssetImage } from './AssetImage'

interface SceneItemButtonProps {
  item: SceneItem
  debug?: boolean
  onOpen: (target: SceneItem['target']) => void
}

export function SceneItemButton({ item, debug = false, onOpen }: SceneItemButtonProps) {
  const [active, setActive] = useState(false)
  const [hovered, setHovered] = useState(false)

  return (
    <button
      type="button"
      aria-label={item.label}
      className="absolute transition-transform duration-200"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.width}%`,
        height: item.height ? `${item.height}%` : 'auto',
        zIndex: item.zIndex,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        setActive(true)
        window.setTimeout(() => {
          setActive(false)
          onOpen(item.target)
        }, 200)
      }}
    >
      <div
        className="relative h-full transition duration-200"
        style={{
          transform: active
            ? 'scale(1.08)'
            : hovered
              ? 'scale(1.04) translateY(-2px)'
              : 'scale(1)',
          filter: active
            ? 'drop-shadow(0 0 18px rgba(250,224,156,0.95))'
            : hovered
              ? 'drop-shadow(0 0 10px rgba(250,224,156,0.6)) brightness(1.04)'
              : 'none',
        }}
      >
        {debug ? (
          <div className="absolute inset-0 rounded-[18px] border-2 border-dashed border-brown/60 bg-butter/10" />
        ) : null}
        <AssetImage
          src={item.src}
          fallbackSrc={item.fallbackSrc}
          alt={item.label}
          variant={item.variant ?? 'item'}
          renderFallbackCard={false}
          className="h-full w-full object-contain"
        />
        {debug ? (
          <span className="absolute -top-5 left-0 rounded-full border border-line bg-paper/90 px-2 py-1 text-[10px] text-brown shadow-sm">
            {item.label}
          </span>
        ) : null}
      </div>
    </button>
  )
}
