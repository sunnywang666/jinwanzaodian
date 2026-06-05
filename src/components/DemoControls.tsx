import { demoSceneOptions } from '../lib/demoData'
import type { DemoScene } from '../lib/storage'
import { SoftButton } from './SoftButton'

interface DemoControlsProps {
  currentScene: DemoScene
  onChange: (scene: DemoScene) => void
}

export function DemoControls({ currentScene, onChange }: DemoControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {demoSceneOptions.map((option) => (
        <SoftButton
          key={option.key}
          type="button"
          active={currentScene === option.key}
          onClick={() => onChange(option.key)}
        >
          {option.label}
        </SoftButton>
      ))}
    </div>
  )
}
