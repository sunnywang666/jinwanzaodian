import { sceneAssets, sceneByDemo } from '../lib/assets'
import type { DemoScene } from '../lib/storage'
import type { GuestProgressMap } from '../lib/guestProgression'
import { sceneItems, type SceneItemTarget } from '../lib/sceneItems'
import { AssetImage } from './AssetImage'
import { ClockOverlay } from './ClockOverlay'
import { SceneItemButton } from './SceneItemButton'
import { ShopGuests } from './ShopGuests'

interface ShopSceneInteractiveProps {
  scene: DemoScene
  debug?: boolean
  onItemOpen: (target: SceneItemTarget) => void
  /** 今天在铺子里的客人 key（由 App 按作息 roll） */
  guestKeys?: string[]
  /** 刚开门 → 播「出餐迎客」动画一次 */
  playArrival?: boolean
  onArrivalComplete?: () => void
  spiritName?: string
  onSpiritTap?: () => void
  /** 真实来访次数/熟络度，传给客人资料卡（否则回退图鉴默认值） */
  guestProgress?: GuestProgressMap
}

export function ShopSceneInteractive({
  scene, debug = false, onItemOpen,
  guestKeys = [], playArrival = false, onArrivalComplete, spiritName, onSpiritTap, guestProgress,
}: ShopSceneInteractiveProps) {
  const background = scene === 'cover' ? sceneAssets.mainBackground : sceneByDemo[scene]
  // 只在清晨热闹场景显示客人；白天/傍晚/夜晚铺子自然冷清
  const showGuests = scene === 'busy' || scene === 'normal' || scene === 'quiet'

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

        <ClockOverlay />
        <div className="absolute inset-0">
          {sceneItems
            // 清晨显示 ShopGuests 的活精灵时，隐藏原静态「面点精灵」热点，避免两个精灵重复
            .filter((item) => !(showGuests && item.id === 'spirit'))
            .map((item) => (
              <SceneItemButton key={item.id} item={item} debug={debug} onOpen={onItemOpen} />
            ))}
        </div>

        {showGuests ? (
          <ShopGuests
            guestKeys={guestKeys}
            playArrival={playArrival}
            onArrivalComplete={onArrivalComplete}
            spiritName={spiritName}
            onSpiritTap={onSpiritTap}
            guestProgress={guestProgress}
          />
        ) : null}
      </div>
    </div>
  )
}
