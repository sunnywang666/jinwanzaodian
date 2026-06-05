import { getSceneAsset } from '../lib/assets'
import { sceneCopy } from '../lib/demoData'
import type { DemoScene } from '../lib/storage'
import { AssetImage } from '../components/AssetImage'
import { DemoControls } from '../components/DemoControls'

interface DemoModeProps {
  scene: DemoScene
  onSceneChange: (scene: DemoScene) => void
}

export function DemoMode({ scene, onSceneChange }: DemoModeProps) {
  const copy = sceneCopy[scene]

  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div>
        <p className="paper-label">演示模式</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">切换铺子状态</h1>
      </div>

      <div className="mt-4 overflow-hidden rounded-[30px] border border-line bg-cream">
        <AssetImage src={getSceneAsset(scene)} alt={copy.title} variant="scene" className="h-[260px]" />
      </div>

      <div className="mt-4 rounded-[28px] border border-line bg-paper px-4 py-3">
        <h2 className="text-lg font-semibold text-ink">{copy.title}</h2>
        <p className="mt-1 text-sm leading-5 text-ink/70">{copy.body}</p>
      </div>

      <div className="mt-auto pt-4">
        <DemoControls currentScene={scene} onChange={onSceneChange} />
      </div>
    </section>
  )
}
