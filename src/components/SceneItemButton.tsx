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

  return (
    <button
      type="button"
      aria-label={item.label}
      className="absolute transition-transform duration-200"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: `${item.width}%`,
        zIndex: item.zIndex,
      }}
      onClick={() => {
        setActive(true)
        window.setTimeout(() => {
          setActive(false)
          onOpen(item.target)
        }, 200)
      }}
    >
      <div
        className={`relative transition duration-200 ${
          active ? 'scale-[1.08] drop-shadow-[0_0_18px_rgba(250,224,156,0.95)]' : 'scale-100'
        }`}
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
          className="h-auto w-full"
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
