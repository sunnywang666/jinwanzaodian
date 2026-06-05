import { demoSceneOptions } from '../lib/demoData'
import type { DemoScene } from '../lib/storage'

interface DemoControlsProps {
  currentScene: DemoScene
  onChange: (scene: DemoScene) => void
}

export function DemoControls({ currentScene, onChange }: DemoControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {demoSceneOptions.map((option) => (
        <button
          key={option.key}
          type="button"
          className={`rounded-3xl border px-4 py-3 text-sm transition ${
            currentScene === option.key
              ? 'border-brown bg-butter text-ink'
              : 'border-line bg-white/75 text-ink/75'
          }`}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
