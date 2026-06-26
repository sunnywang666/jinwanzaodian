import { sceneAssets, sceneByDemo } from '../lib/assets'
import type { DemoScene, SpiritForm } from '../lib/storage'
import type { GuestProgressMap } from '../lib/guestProgression'
import { sceneItems, type SceneItemTarget } from '../lib/sceneItems'
import { AssetImage } from './AssetImage'
import { ClockOverlay } from './ClockOverlay'
import { SceneItemButton } from './SceneItemButton'
import { ShopGuests } from './ShopGuests'
import { SpiritSprite } from './SpiritSprite'

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
  /** 当前选择的精灵形态（皮肤） */
  spiritForm?: SpiritForm
  onSpiritTap?: () => void
  /** 真实来访次数/熟络度，传给客人资料卡（否则回退图鉴默认值） */
  guestProgress?: GuestProgressMap
}

export function ShopSceneInteractive({
  scene, debug = false, onItemOpen,
  guestKeys = [], playArrival = false, onArrivalComplete, spiritName, spiritForm = 'base', onSpiritTap, guestProgress,
}: ShopSceneInteractiveProps) {
  const background = scene === 'cover' ? sceneAssets.mainBackground : sceneByDemo[scene]
  // 只在清晨热闹场景显示客人；白天/傍晚/夜晚铺子自然冷清
  const showGuests = scene === 'busy' || scene === 'normal' || scene === 'quiet'
  // ShopGuests 仅在「清晨 且 今天确有客人」时才渲染活精灵；此时才隐藏静态精灵热点，
  // 否则（清晨但没人）ShopGuests 返回 null，静态精灵需保留，避免连一个精灵都没有
  const hasLiveGuests = showGuests && guestKeys.length > 0

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

        <ClockOverlay debug={debug} />
        <div className="absolute inset-0">
          {/* 精灵改用 SpiritSprite 单独渲染（见下），其它物件照常 */}
          {sceneItems
            .filter((item) => item.id !== 'spirit')
            .map((item) => (
              <SceneItemButton key={item.id} item={item} debug={debug} onOpen={onItemOpen} />
            ))}

          {/* 静态精灵（没有活精灵时显示）：身体+表情合成，反映当前皮肤 */}
          {!hasLiveGuests ? (
            <button
              type="button"
              aria-label={spiritName ?? '面点精灵'}
              className="absolute"
              style={{ left: '19%', top: '32%', width: '7%', zIndex: 7 }}
              onClick={() => onSpiritTap?.()}
            >
              <SpiritSprite body={spiritForm} face="normal" className="w-full" />
            </button>
          ) : null}
        </div>

        {showGuests ? (
          <ShopGuests
            guestKeys={guestKeys}
            playArrival={playArrival}
            onArrivalComplete={onArrivalComplete}
            spiritName={spiritName}
            spiritForm={spiritForm}
            onSpiritTap={onSpiritTap}
            guestProgress={guestProgress}
          />
        ) : null}
      </div>
    </div>
  )
}
