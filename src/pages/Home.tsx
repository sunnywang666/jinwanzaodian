/**
 * Home.tsx — v6.5
 *
 * Replaced DemoControls (scene picker) with TimeSimPanel (time scrubber).
 * DEBUG button now opens time simulation panel.
 */

import { ShopSceneInteractive } from '../components/ShopSceneInteractive'
import { TimeSimPanel } from '../components/TimeSimPanel'
import type { SceneItemTarget } from '../lib/sceneItems'
import type { DemoScene } from '../lib/storage'
import type { TimeSceneOptions } from '../lib/timeScene'
import type { GuestProgressMap } from '../lib/guestProgression'
import { useT } from '../lib/i18n'
import { getNow } from '../lib/timeSimulator'
import { isDemoMode } from '../lib/devMode'

interface HomeProps {
  scene: DemoScene
  debugHotspots: boolean
  onToggleDebugHotspots: () => void
  onOpenHotspot: (target: SceneItemTarget) => void
  onSceneChange: (scene: DemoScene) => void
  onOpenSettings: () => void
  /** For time sim panel */
  sceneOptions: TimeSceneOptions
  onTimeSimChange: () => void
  /** 今天在铺子里的客人 */
  guestKeys?: string[]
  /** 刚从开门仪式进来 → 播出餐迎客动画一次 */
  playArrival?: boolean
  onArrivalComplete?: () => void
  spiritName?: string
  onOpenSpiritChat?: () => void
  /** 真实来访次数/熟络度，传给客人资料卡 */
  guestProgress?: GuestProgressMap
}

export function Home({
  scene, debugHotspots, onToggleDebugHotspots,
  onOpenHotspot, onSceneChange, onOpenSettings,
  sceneOptions, onTimeSimChange,
  guestKeys = [], playArrival = false, onArrivalComplete, spiritName, onOpenSpiritChat, guestProgress,
}: HomeProps) {
  const { t } = useT()
  const sceneText = t(`scene.${scene}.body`)
  const now = getNow()
  const nowLabel = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(now)

  return (
    <section className="relative h-full w-full">
      <ShopSceneInteractive
        scene={scene}
        debug={debugHotspots}
        onItemOpen={onOpenHotspot}
        guestKeys={guestKeys}
        playArrival={playArrival}
        onArrivalComplete={onArrivalComplete}
        spiritName={spiritName}
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

      <div className="absolute right-3 top-14 z-20 flex flex-col items-end gap-2">
        <button type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/15 text-paper backdrop-blur-sm transition hover:bg-ink/25"
          onClick={onOpenSettings} aria-label={t('settings.title')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.5.5a1 1 0 00-1 .91L5.42 2.8a5.5 5.5 0 00-1.5.87L2.6 3.13a1 1 0 00-1.14.44L.46 5.43a1 1 0 00.22 1.25l1.14.93a5.6 5.6 0 000 1.78l-1.14.93a1 1 0 00-.22 1.25l1 1.86a1 1 0 001.14.44l1.32-.54a5.5 5.5 0 001.5.87l.08 1.39a1 1 0 001 .91h2a1 1 0 001-.91l.08-1.39a5.5 5.5 0 001.5-.87l1.32.54a1 1 0 001.14-.44l1-1.86a1 1 0 00-.22-1.25l-1.14-.93a5.6 5.6 0 000-1.78l1.14-.93a1 1 0 00.22-1.25l-1-1.86a1 1 0 00-1.14-.44l-1.32.54a5.5 5.5 0 00-1.5-.87L9.5 1.41a1 1 0 00-1-.91h-2zM8 5.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z" />
          </svg>
        </button>

        {isDemoMode() ? (
          <button type="button"
            className={`rounded-full px-3 py-1.5 text-xs backdrop-blur-sm transition ${debugHotspots ? 'bg-butter/70 text-ink' : 'bg-ink/15 text-paper'}`}
            onClick={onToggleDebugHotspots}>
            {t('home.debug')}
          </button>
        ) : null}
      </div>

      {debugHotspots ? (
        <div className="absolute inset-x-3 bottom-3 z-20 rounded-[24px] bg-paper/75 px-3 py-3 backdrop-blur-sm">
          <TimeSimPanel sceneOptions={sceneOptions} onTimeChange={onTimeSimChange} />
        </div>
      ) : null}
    </section>
  )
}
