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
    <div className="relative flex h-full w-full items-center justify-center bg-[#efe1cb]">
      <div
        className="relative w-full"
        style={{ aspectRatio: '1024 / 1536', maxHeight: '100%' }}
      >
        <AssetImage
          src={background.src}
          fallbackSrc={background.fallbackSrc}
          alt="早点铺主场景"
          variant="scene"
          renderFallbackCard={false}
          className="h-full w-full object-contain"
        />

        <div className="absolute inset-0">
          {sceneItems.map((item) => (
            <SceneItemButton key={item.id} item={item} debug={debug} onOpen={onItemOpen} />
          ))}
        </div>
      </div>
    </div>
  )
}
