import { sceneAssets, sceneByDemo } from '../lib/assets'
import type { DemoScene } from '../lib/storage'
import { sceneItems, type SceneItemTarget } from '../lib/sceneItems'
import { AssetImage } from './AssetImage'
import { SceneItemButton } from './SceneItemButton'

interface ShopSceneInteractiveProps {
  scene: DemoScene
  debug?: boolean
  onItemOpen: (target: SceneItemTarget) => void
}

export function ShopSceneInteractive({ scene, debug = false, onItemOpen }: ShopSceneInteractiveProps) {
  const background = scene === 'cover' ? sceneAssets.mainBackground : sceneByDemo[scene]

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#efe1cb]">
      <AssetImage
        src={background.src}
        fallbackSrc={background.fallbackSrc}
        alt="早点铺主场景"
        variant="scene"
        renderFallbackCard={false}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0">
        {sceneItems.map((item) => (
          <SceneItemButton key={item.id} item={item} debug={debug} onOpen={onItemOpen} />
        ))}
      </div>
    </div>
  )
}
