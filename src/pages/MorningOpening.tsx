import { useState } from 'react'
import { spiritAssets } from '../lib/assets'
import { morningGreetings, middayTransitionCopy } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'

interface MorningOpeningProps {
  spiritName: string
  lastNightClosed: boolean
  lastCloseTime: string | null
  onComplete: (todayMood: 'busy' | 'normal' | 'quiet') => void
}

export function MorningOpening({ spiritName, lastNightClosed, lastCloseTime, onComplete }: MorningOpeningProps) {
  const [beat, setBeat] = useState(0)

  const greeting = lastNightClosed
    ? morningGreetings.closed
    : morningGreetings.notClosed

  const recapLine = lastNightClosed
    ? `昨晚 ${lastCloseTime ?? '23:00'} 关的灯，铺子休息得不错。`
    : '昨晚没来得及打烊，不过没关系。'

  const spiritRecapComment = lastNightClosed
    ? `${spiritName}：昨晚辛苦了，今天从容一点。`
    : `${spiritName}：没事，铺子不记仇的。`

  const todayMood = lastNightClosed ? 'busy' as const : 'quiet' as const

  /* Beat 0: Greeting */
  if (beat === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-[#f5ead8]">
        <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          {/* Sunrise gradient */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #fbe8c8 0%, #f5ead8 40%, #f5ead8 100%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <AssetImage
              src={spiritAssets.base.src}
              fallbackSrc={spiritAssets.base.fallbackSrc}
              alt={spiritName}
              variant="character"
              className="h-40 drop-shadow-[0_8px_24px_rgba(138,97,74,0.18)]"
            />
            <h1 className="mt-8 text-2xl font-semibold text-ink">{greeting.title}</h1>
            <p className="mt-4 text-base leading-7 text-ink/60">{greeting.body(spiritName)}</p>

            <button
              type="button"
              className="mt-10 flex w-full items-center justify-between rounded-[22px] bg-white/40 px-5 py-3 text-sm text-ink/55 transition hover:bg-white/60"
              onClick={() => setBeat(1)}
            >
              <span>看看铺子</span>
              <span className="text-ink/30">→</span>
            </button>
          </div>
        </section>
      </div>
    )
  }

  /* Beat 1: Light recap of last night (no spoilers) */
  if (beat === 1) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-[#f5ead8]">
        <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="relative z-10 flex flex-col items-center">
            <AssetImage
              src={spiritAssets.base.src}
              fallbackSrc={spiritAssets.base.fallbackSrc}
              alt={spiritName}
              variant="character"
              className="h-32 drop-shadow-[0_6px_18px_rgba(138,97,74,0.15)]"
            />

            <p className="mt-6 text-sm text-ink/45">昨晚</p>
            <p className="mt-2 text-lg font-semibold text-ink">{recapLine}</p>
            <p className="mt-4 text-sm leading-6 text-ink/55">{spiritRecapComment}</p>

            <SoftButton
              className="mt-10"
              type="button"
              variant="primary"
              block
              onClick={() => setBeat(2)}
            >
              开门营业
            </SoftButton>
          </div>
        </section>
      </div>
    )
  }

  /* Beat 2: Opening the shop */
  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-[#f5ead8]">
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-5xl">🏮</div>
          <h1 className="mt-6 text-2xl font-semibold text-ink">开门啦</h1>
          <p className="mt-3 text-base leading-7 text-ink/55">
            柜台擦好了，豆浆热好了，门口的小灯亮起来了。
          </p>

          <SoftButton
            className="mt-10"
            type="button"
            variant="primary"
            block
            onClick={() => onComplete(todayMood)}
          >
            迎客
          </SoftButton>
        </div>
      </section>
    </div>
  )
}

/* ── Midday Transition Overlay ── */

interface MiddayTransitionProps {
  spiritName: string
  guestCount: number
  shopMood: 'busy' | 'normal' | 'quiet'
  onContinue: () => void
}

export function MiddayTransition({ spiritName, guestCount, shopMood, onContinue }: MiddayTransitionProps) {
  const copy = middayTransitionCopy[shopMood]

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#f5ead8]">
      <section className="flex max-w-[380px] flex-col items-center px-6 text-center">
        <AssetImage
          src={spiritAssets.base.src}
          fallbackSrc={spiritAssets.base.fallbackSrc}
          alt={spiritName}
          variant="character"
          className="h-28 drop-shadow-[0_6px_16px_rgba(138,97,74,0.14)]"
        />

        <h2 className="mt-6 text-xl font-semibold text-ink">{copy.title}</h2>
        <p className="mt-3 text-base leading-7 text-ink/60">
          今天上午来了 {guestCount} 位客人。
        </p>
        <p className="mt-2 text-sm leading-6 text-ink/50">{copy.body(spiritName)}</p>

        <SoftButton
          className="mt-8"
          type="button"
          variant="primary"
          block
          onClick={onContinue}
        >
          开始备菜
        </SoftButton>
      </section>
    </div>
  )
}
