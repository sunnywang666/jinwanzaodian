/**
 * Home.tsx — v6.5
 *
 * Replaced DemoControls (scene picker) with TimeSimPanel (time scrubber).
 * DEBUG button now opens time simulation panel.
 */

import { ShopSceneInteractive } from '../components/ShopSceneInteractive'
import { DemoPanel, type DemoEvent } from '../components/DemoPanel'
import type { SceneItemTarget } from '../lib/sceneItems'
import type { DemoScene, SpiritForm } from '../lib/storage'
import type { GuestProgressMap } from '../lib/guestProgression'
import { useT } from '../lib/i18n'
import { getNow } from '../lib/timeSimulator'
import { isDemoMode } from '../lib/devMode'

interface HomeProps {
  scene: DemoScene
  /** 演示面板开关（仅演示版） */
  debugHotspots: boolean
  onToggleDebugHotspots: () => void
  onOpenHotspot: (target: SceneItemTarget) => void
  onSceneChange: (scene: DemoScene) => void
  onOpenSettings: () => void
  /** 演示版：直接跳到某个时段事件 / 重看导览（重置在设置里） */
  onDemoJump: (event: DemoEvent) => void
  onReplayTour: () => void
  /** 今天在铺子里的客人 */
  guestKeys?: string[]
  /** 刚从开门仪式进来 → 播出餐迎客动画一次 */
  playArrival?: boolean
  onArrivalComplete?: () => void
  spiritName?: string
  /** 当前选择的精灵形态（皮肤）→ 让主场景精灵反映换装 */
  spiritForm?: SpiritForm
  onOpenSpiritChat?: () => void
  /** 真实来访次数/熟络度，传给客人资料卡 */
  guestProgress?: GuestProgressMap
}

export function Home({
  scene, debugHotspots, onToggleDebugHotspots,
  onOpenHotspot, onSceneChange, onOpenSettings,
  onDemoJump, onReplayTour,
  guestKeys = [], playArrival = false, onArrivalComplete, spiritName, spiritForm = 'base', onOpenSpiritChat, guestProgress,
}: HomeProps) {
  const { t, lang } = useT()
  const sceneText = t(`scene.${scene}.body`)
  const now = getNow()
  const nowLabel = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(now)

  return (
    <section className="relative h-full w-full">
      <ShopSceneInteractive
        scene={scene}
        debug={false}
        onItemOpen={onOpenHotspot}
        guestKeys={guestKeys}
        playArrival={playArrival}
        onArrivalComplete={onArrivalComplete}
        spiritName={spiritName}
        spiritForm={spiritForm}
        onSpiritTap={onOpenSpiritChat}
        guestProgress={guestProgress}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f5ead8]/92 via-[#f5ead8]/36 to-transparent" />

      <div className="absolute left-3 top-3 z-20 flex max-w-[60%] flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-ink/15 px-3 py-1.5 text-xs text-paper backdrop-blur-sm">
            {t('home.shopName')}
          </span>
          <span className="rounded-full bg-ink/15 px-3 py-1.5 text-xs text-paper backdrop-blur-sm">
            {nowLabel}
          </span>
        </div>
        <p className="rounded-[20px] bg-paper/60 px-3 py-2 text-xs leading-5 text-ink/78 backdrop-blur-sm">
          {sceneText}
        </p>
      </div>

      {debugHotspots ? (
        <div className="absolute inset-x-3 bottom-3 z-20 rounded-[24px] bg-paper/85 px-3.5 py-3.5 shadow-[0_8px_24px_rgba(54,38,26,0.18)] backdrop-blur-sm">
          <DemoPanel onJump={onDemoJump} onReplayTour={onReplayTour} />
        </div>
      ) : null}
    </section>
  )
}
