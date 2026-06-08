/**
 * MorningOpening.tsx — v5.7
 *
 * Changes from v5.5:
 * - Added worry review beat: if last night had a worry, gently bring it back
 * - Two choices: "放下了" (released) / "还在" (carrying)
 * - Can skip entirely (不想看)
 * - Warm, non-judgmental tone per CBT-I worry externalization
 */

import { useState } from 'react'
import { spiritAssets } from '../lib/assets'
import { morningGreetings, middayTransitionCopy } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'
import type { WorryStatus } from '../lib/storage'

interface MorningOpeningProps {
  spiritName: string
  lastNightClosed: boolean
  lastCloseTime: string | null
  /** 昨晚写下的心事（如果有） */
  lastNightWorry: string | null
  /** 回调：用户选择了心事的处理方式 */
  onWorryReviewed: (status: WorryStatus) => void
  onComplete: (todayMood: 'busy' | 'normal' | 'quiet') => void
}

export function MorningOpening({
  spiritName,
  lastNightClosed,
  lastCloseTime,
  lastNightWorry,
  onWorryReviewed,
  onComplete,
}: MorningOpeningProps) {
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

  // 是否有昨晚的心事需要回看
  const hasWorry = lastNightWorry !== null && lastNightWorry.trim() !== ''

  // Beat 0: 精灵问候
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

  // Beat 1: 昨晚简要回顾
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
            <SoftButton
              className="mt-10"
              type="button"
              variant="primary"
              block
              onClick={() => setBeat(hasWorry ? 2 : 3)}
            >
              {hasWorry ? '\u7EE7\u7EED' : '\u5F00\u95E8\u8425\u4E1A'}
            </SoftButton>
          </div>
        </section>
      </div>
    )
  }

  // Beat 2: 心事回看（仅当昨晚有写心事时出现）
  if (beat === 2 && hasWorry) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-[#f5ead8]">
        <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="relative z-10 flex flex-col items-center">
            <AssetImage
              src={spiritAssets.base.src}
              fallbackSrc={spiritAssets.base.fallbackSrc}
              alt={spiritName}
              variant="character"
              className="h-28 drop-shadow-[0_6px_16px_rgba(138,97,74,0.14)]"
            />

            <p className="mt-6 text-sm text-ink/45">
              {spiritName} 轻轻递来昨晚的小纸条
            </p>

            {/* 心事内容 */}
            <div className="mt-4 w-full rounded-[20px] bg-white/40 px-5 py-4">
              <p className="text-sm leading-7 text-ink/70">
                {lastNightWorry}
              </p>
            </div>

            <p className="mt-4 text-sm leading-6 text-ink/50">
              过了一夜，这件事还压着你吗？
            </p>

            {/* 两个选择 */}
            <div className="mt-6 flex w-full gap-3">
              <button
                type="button"
                className="flex-1 rounded-[18px] bg-white/45 px-4 py-3.5 text-sm font-medium text-ink/70 transition hover:bg-white/60"
                onClick={() => {
                  onWorryReviewed('released')
                  setBeat(3)
                }}
              >
                放下了
              </button>
              <button
                type="button"
                className="flex-1 rounded-[18px] bg-white/45 px-4 py-3.5 text-sm font-medium text-ink/70 transition hover:bg-white/60"
                onClick={() => {
                  onWorryReviewed('carrying')
                  setBeat(3)
                }}
              >
                还在
              </button>
            </div>

            {/* 跳过 */}
            <button
              type="button"
              className="mt-3 text-xs text-ink/30 transition hover:text-ink/45"
              onClick={() => {
                setBeat(3)
              }}
            >
              不想看
            </button>
          </div>
        </section>
      </div>
    )
  }

  // Beat 3: 开门
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

/* ── MiddayTransition (unchanged) ── */

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
