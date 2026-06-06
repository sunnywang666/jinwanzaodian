import { sceneAssets } from '../lib/assets'
import { shopHotspots, type HotspotDefinition } from '../lib/hotspots'
import { AssetImage } from './AssetImage'
import { SceneHotspot } from './SceneHotspot'

interface ShopSceneInteractiveProps {
  debug?: boolean
  onHotspotClick: (hotspot: HotspotDefinition['id']) => void
}

export function ShopSceneInteractive({ debug = false, onHotspotClick }: ShopSceneInteractiveProps) {
  return (
    <div className="relative overflow-hidden rounded-[30px] border border-line bg-cream">
      <AssetImage
        src={sceneAssets.mainBackground.src}
        fallbackSrc={sceneAssets.mainBackground.fallbackSrc}
        alt="早点铺主场景"
        variant="scene"
        className="h-[460px] bg-[#f6efe2]"
      />
      <div className="absolute inset-0">
        {shopHotspots.map((hotspot) => (
          <SceneHotspot key={hotspot.id} {...hotspot} debug={debug} onClick={() => onHotspotClick(hotspot.id)} />
        ))}
      </div>
    </div>
  )
}
