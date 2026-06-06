import type { DemoScene } from '../lib/storage'
import { sceneCopy } from '../lib/demoData'
import { DemoControls } from '../components/DemoControls'
import { ShopSceneInteractive } from '../components/ShopSceneInteractive'

interface HomeProps {
  scene: DemoScene
  debugHotspots: boolean
  onToggleDebugHotspots: () => void
  onOpenHotspot: (hotspotId: 'recipeBook' | 'guestBook' | 'logbook' | 'spiritHut' | 'radio' | 'blackboard') => void
  onSceneChange: (scene: DemoScene) => void
}

export function Home({ scene, debugHotspots, onToggleDebugHotspots, onOpenHotspot, onSceneChange }: HomeProps) {
  const copy = sceneCopy[scene]

  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="paper-label">铺子主场景</p>
          <h1 className="mt-2 text-xl font-semibold text-ink">{copy.title}</h1>
        </div>
        <button
          type="button"
          className={`rounded-full border px-3 py-2 text-xs ${
            debugHotspots ? 'border-brown bg-butter text-ink' : 'border-line bg-white/80 text-ink/70'
          }`}
          onClick={onToggleDebugHotspots}
        >
          显示热区
        </button>
      </div>

      <div className="mt-4">
        <ShopSceneInteractive debug={debugHotspots} onHotspotClick={onOpenHotspot} />
      </div>

      <div className="mt-4 rounded-[28px] border border-line bg-white/80 px-4 py-3">
        <p className="text-sm leading-6 text-ink/75">{copy.body}</p>
      </div>

      <div className="mt-auto pt-4">
        <p className="mb-2 text-sm text-ink/65">演示模式</p>
        <DemoControls currentScene={scene} onChange={onSceneChange} />
      </div>
    </section>
  )
}
