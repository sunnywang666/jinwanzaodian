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
    ? '\u6628\u665A ' + (lastCloseTime || '23:00') + ' \u5173\u7684\u706F\uFF0C\u94FA\u5B50\u4F11\u606F\u5F97\u4E0D\u9519\u3002'
    : '\u6628\u665A\u6CA1\u6765\u5F97\u53CA\u6253\u70CA\uFF0C\u4E0D\u8FC7\u6CA1\u5173\u7CFB\u3002'

  const spiritRecapComment = lastNightClosed
    ? spiritName + '\uFF1A\u6628\u665A\u8F9B\u82E6\u4E86\uFF0C\u4ECA\u5929\u4ECE\u5BB9\u4E00\u70B9\u3002'
    : spiritName + '\uFF1A\u6CA1\u4E8B\uFF0C\u94FA\u5B50\u4E0D\u8BB0\u4EC7\u7684\u3002'

  const todayMood = lastNightClosed ? 'busy' as const : 'quiet' as const

  if (beat === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-[#f5ead8]">
        <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, #fbe8c8 0%, #f5ead8 40%, #f5ead8 100%)' }}
          ></div>
          <div className="relative z-10 flex flex-col items-center">
            <AssetImage
              src={spiritAssets.base.src}
              fallbackSrc={spiritAssets.base.fallbackSrc}
              alt={spiritName}
              variant="character"
              className="h-40 drop-shadow-[0_8px_24px_rgba(138,97,74,0.18)]"
            />
            <h1 className="mt-8 text-2xl font-semibold text-ink">{'\u65E9\u5B89\uFF0C\u5E97\u957F'}</h1>
            <p className="mt-4 text-base leading-7 text-ink/60">{greeting.body(spiritName)}</p>
            <button
              type="button"
              className="mt-10 flex w-full items-center justify-between rounded-[22px] bg-white/40 px-5 py-3 text-sm text-ink/55 transition hover:bg-white/60"
              onClick={() => setBeat(1)}
            >
              <span>{'\u770B\u770B\u94FA\u5B50'}</span>
              <span className="text-ink/30">{'\u2192'}</span>
            </button>
          </div>
        </section>
      </div>
    )
  }

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
            <p className="mt-6 text-sm text-ink/45">{'\u6628\u665A'}</p>
            <p className="mt-2 text-lg font-semibold text-ink">{recapLine}</p>
            <p className="mt-4 text-sm leading-6 text-ink/55">{spiritRecapComment}</p>
            <SoftButton className="mt-10" type="button" variant="primary" block onClick={() => setBeat(2)}>
              {'\u5F00\u95E8\u8425\u4E1A'}
            </SoftButton>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-[#f5ead8]">
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="mt-6 text-2xl font-semibold text-ink">{'\u5F00\u95E8\u5566'}</h1>
          <p className="mt-3 text-base leading-7 text-ink/55">
            {'\u67DC\u53F0\u64E6\u597D\u4E86\uFF0C\u8C46\u6D46\u70ED\u597D\u4E86\uFF0C\u95E8\u53E3\u7684\u5C0F\u706F\u4EAE\u8D77\u6765\u4E86\u3002'}
          </p>
          <SoftButton className="mt-10" type="button" variant="primary" block onClick={() => onComplete(todayMood)}>
            {'\u8FCE\u5BA2'}
          </SoftButton>
        </div>
      </section>
    </div>
  )
}

interface MiddayTransitionProps {
  spiritName: string
  guestCount: number
  shopMood: 'busy' | 'normal' | 'quiet'
  onContinue: () => void
}

export function MiddayTransition({ spiritName, guestCount, shopMood, onContinue }: MiddayTransitionProps) {
  const middayCopy = middayTransitionCopy[shopMood]
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
        <h2 className="mt-6 text-xl font-semibold text-ink">{middayCopy.title}</h2>
        <p className="mt-3 text-base leading-7 text-ink/60">
          {'\u4ECA\u5929\u4E0A\u5348\u6765\u4E86 ' + guestCount + ' \u4F4D\u5BA2\u4EBA\u3002'}
        </p>
        <p className="mt-2 text-sm leading-6 text-ink/50">{middayCopy.body(spiritName)}</p>
        <SoftButton className="mt-8" type="button" variant="primary" block onClick={onContinue}>
          {'\u5F00\u59CB\u5907\u83DC'}
        </SoftButton>
      </section>
    </div>
  )
}
