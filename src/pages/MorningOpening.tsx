/**
 * MorningOpening.tsx — v6.3
 *
 * 5-beat opening ceremony with CSS animations:
 * Beat 0: 还没开门 — dark shop, sleepy spirit, tap to open
 * Beat 1: 灯亮迎接 — lights on, spirit greets based on last night
 * Beat 2: 今日小回报 — reward if slept well, warmth if not
 * Beat 3: 心事回看 — worry review (if any)
 * Beat 4: 铺子活过来 — today's mood + guests
 *
 * Uses CSS keyframes only (no Framer Motion yet).
 * Can be enhanced with Framer Motion later.
 */

import { useState } from 'react'
import { spiritAssets, sceneAssets, animalAssets } from '../lib/assets'
import { middayTransitionCopy, guests as allGuests } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'
import { useT } from '../lib/i18n'
import type { WorryStatus, NightType } from '../lib/storage'
import type { TrendResult } from '../lib/trendCalculation'
import type { SpiritProgressState } from '../lib/spiritProgression'

interface MorningOpeningProps {
  spiritName: string
  nightType: NightType
  lastNightClosed: boolean
  lastCloseTime: string | null
  lastNightWorry: string | null
  trend: TrendResult
  spiritProgress: SpiritProgressState
  /** 今天来的客人 key 列表 */
  todayGuestKeys: string[]
  onWorryReviewed: (status: WorryStatus) => void
  onComplete: () => void
}

/* ── 精灵迎接语（按人格类型 × 昨晚状态） ── */

function getSpiritGreeting(
  name: string,
  nightType: NightType,
  closed: boolean,
  closeTime: string | null,
): { line1: string; line2: string } {
  if (closed) {
    // 好好打烊了
    const timeStr = closeTime ?? '23:00'
    const greetings: Record<string, { line1: string; line2: string }> = {
      '报复型': {
        line1: `昨晚 ${timeStr} 就关了灯，你把时间还给了夜晚。`,
        line2: `${name}：铺子替你守着，你睡得很好。`,
      },
      '惯性型': {
        line1: `昨晚 ${timeStr} 关的灯，你真的停下来了。`,
        line2: `${name}：手放下了，铺子就安心了。`,
      },
      '焦虑型': {
        line1: `昨晚 ${timeStr} 关的灯，铺子休息得不错。`,
        line2: `${name}：脑子里的事明天再说，今天先开门。`,
      },
      '工作型': {
        line1: `昨晚 ${timeStr} 就收摊了，做得好。`,
        line2: `${name}：活儿明天还在，但你今天更有精神了。`,
      },
      '猫头鹰型': {
        line1: `昨晚 ${timeStr} 关的灯，节奏慢慢在调。`,
        line2: `${name}：不急，每一步都算数。`,
      },
      '说不清': {
        line1: `昨晚 ${timeStr} 关了灯。`,
        line2: `${name}：不管昨晚是什么感觉，今天铺子照常开。`,
      },
    }
    return greetings[nightType] ?? greetings['说不清']
  }

  // 没打烊
  const greetings: Record<string, { line1: string; line2: string }> = {
    '报复型': {
      line1: '昨晚没来得及打烊，夜晚被你多留了一会儿。',
      line2: `${name}：没关系，灯我一直留着，今天我们再来。`,
    },
    '惯性型': {
      line1: '昨晚没关灯，手可能还是没停下来。',
      line2: `${name}：没事，铺子不记仇，今天还在。`,
    },
    '焦虑型': {
      line1: '昨晚铺子没关上，可能脑子里还有事。',
      line2: `${name}：今天不用急，铺子先替你稳着。`,
    },
    '工作型': {
      line1: '昨晚没打烊，可能活儿太多了。',
      line2: `${name}：没关系，今天铺子帮你兜着。`,
    },
    '猫头鹰型': {
      line1: '昨晚没来得及关灯。',
      line2: `${name}：你的节奏本来就晚一点，没关系的。`,
    },
    '说不清': {
      line1: '昨晚没有打烊。',
      line2: `${name}：没事，铺子照常为你开着。`,
    },
  }
  return greetings[nightType] ?? greetings['说不清']
}

/* ── 小回报文案 ── */

function getRewardContent(
  trend: TrendResult,
  spiritProgress: SpiritProgressState,
  closed: boolean,
): { hasReward: boolean; text: string; subtext: string } {
  if (!closed) {
    return {
      hasReward: false,
      text: '铺子今天照常为你开门',
      subtext: '没有奖励也没有惩罚，只是陪着。',
    }
  }

  // 检查皮肤进度
  const nextMilestones = [
    { form: 'croissant', need: 5, name: '可颂' },
    { form: 'donut', need: 10, name: '贝果' },
    { form: 'sleep', need: 15, name: '迷糊贝果' },
  ]

  const current = spiritProgress.totalGoodNights
  for (const m of nextMilestones) {
    if (spiritProgress.unlockedForms.includes(m.form as any)) continue
    const remaining = m.need - current
    if (remaining <= 0) {
      // 刚好解锁！
      return {
        hasReward: true,
        text: `精灵学会了${m.name}的样子！`,
        subtext: '新的点心形态已解锁，去小屋看看吧。',
      }
    }
    if (remaining <= 3) {
      return {
        hasReward: true,
        text: `离${m.name}还差 ${remaining} 晚`,
        subtext: '继续好好关灯，精灵在努力变形呢。',
      }
    }
    break
  }

  // 普通好评
  if (trend.score > 0.5) {
    return {
      hasReward: true,
      text: '这几天铺子越来越热闹了',
      subtext: '早睡带来的好精神，客人们都感觉到了。',
    }
  }

  return {
    hasReward: true,
    text: '又一个好好关灯的夜晚',
    subtext: '每一晚都算数，铺子记着呢。',
  }
}

/* ── CSS animation styles ── */

const animStyles = `
@keyframes morningFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes morningScaleIn {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes spiritBreathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
@keyframes lightsOn {
  from { opacity: 0; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1.1); }
  to { opacity: 0.6; transform: scale(1); }
}
@keyframes rewardPop {
  0% { opacity: 0; transform: scale(0.6) translateY(8px); }
  60% { transform: scale(1.05) translateY(-2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes guestAppear {
  from { opacity: 0; transform: translateY(6px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.morning-fade { animation: morningFadeIn 600ms ease-out both; }
.morning-scale { animation: morningScaleIn 500ms ease-out both; }
.spirit-breathe { animation: spiritBreathe 4s ease-in-out infinite; }
.lights-glow { animation: lightsOn 800ms ease-out both; }
.reward-pop { animation: rewardPop 500ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.guest-appear { animation: guestAppear 400ms ease-out both; }
`

/* ── Main component ── */

export function MorningOpening({
  spiritName,
  nightType,
  lastNightClosed,
  lastCloseTime,
  lastNightWorry,
  trend,
  spiritProgress,
  todayGuestKeys,
  onWorryReviewed,
  onComplete,
}: MorningOpeningProps) {
  const [beat, setBeat] = useState(0)
  const { t } = useT()

  const hasWorry = lastNightWorry !== null && lastNightWorry.trim() !== ''
  const greeting = getSpiritGreeting(spiritName, nightType, lastNightClosed, lastCloseTime)
  const reward = getRewardContent(trend, spiritProgress, lastNightClosed)
  const todayGuests = todayGuestKeys
    .map((key) => allGuests.find((g) => g.key === key))
    .filter(Boolean)
    .slice(0, 4)

  // 计算跳转：没有回报就跳过 beat 2，没有心事跳过 beat 3
  function nextBeat(current: number) {
    if (current === 1 && !reward.hasReward && !lastNightClosed) return hasWorry ? 3 : 4
    if (current === 2 && !hasWorry) return 4
    return current + 1
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col overflow-hidden">
      <style>{animStyles}</style>

      {/* ── Beat 0: 还没开门 ── */}
      {beat === 0 ? (
        <section className="relative flex flex-1 flex-col items-center justify-center bg-[#2a2520] px-6 text-center">
          {/* 暗色铺子背景 */}
          <div className="absolute inset-0 opacity-20">
            <AssetImage
              src={sceneAssets.mainBackground.src}
              fallbackSrc={sceneAssets.mainBackground.fallbackSrc}
              alt=""
              variant="scene"
              renderFallbackCard={false}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* 困困的精灵 */}
            <div className="spirit-breathe opacity-60" style={{ filter: 'brightness(0.7) saturate(0.6)' }}>
              <AssetImage
                src={spiritAssets.base.src}
                fallbackSrc={spiritAssets.base.fallbackSrc}
                alt={spiritName}
                variant="character"
                className="h-32 drop-shadow-[0_6px_20px_rgba(138,97,74,0.1)]"
              />
            </div>

            <p className="morning-fade mt-6 text-sm text-[#e8ddd0]/40">
              铺子还暗着……
            </p>

            <button
              type="button"
              className="morning-fade mt-10 flex w-full items-center justify-center gap-2 rounded-[22px] bg-white/8 px-5 py-4 text-base text-[#f0ddb3]/70 transition hover:bg-white/12"
              style={{ animationDelay: '300ms' }}
              onClick={() => setBeat(1)}
            >
              <span>拉开卷帘</span>
              <span className="text-[#f0ddb3]/30">↑</span>
            </button>
          </div>
        </section>
      ) : null}

      {/* ── Beat 1: 灯亮 + 迎接 ── */}
      {beat === 1 ? (
        <section className="relative flex flex-1 flex-col items-center justify-center bg-[#f5ead8] px-6 text-center">
          {/* 灯光晕 */}
          <div
            className="lights-glow pointer-events-none absolute left-1/2 top-[30%] h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(250,224,156,0.4) 0%, rgba(245,234,216,0.1) 60%, transparent 100%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
            {/* 精灵醒来 */}
            <div className="morning-scale">
              <AssetImage
                src={spiritAssets.base.src}
                fallbackSrc={spiritAssets.base.fallbackSrc}
                alt={spiritName}
                variant="character"
                className="h-36 drop-shadow-[0_8px_24px_rgba(138,97,74,0.18)]"
              />
            </div>

            <h1 className="morning-fade mt-6 text-2xl font-semibold text-ink" style={{ animationDelay: '200ms' }}>
              {t('morning.greeting')}
            </h1>

            <p className="morning-fade mt-4 text-base leading-7 text-ink/70" style={{ animationDelay: '400ms' }}>
              {greeting.line1}
            </p>

            <p className="morning-fade mt-2 text-sm leading-6 text-ink/50" style={{ animationDelay: '600ms' }}>
              {greeting.line2}
            </p>

            <button
              type="button"
              className="morning-fade mt-10 flex w-full items-center justify-between rounded-[22px] bg-white/40 px-5 py-3 text-sm text-ink/55 transition hover:bg-white/60"
              style={{ animationDelay: '800ms' }}
              onClick={() => setBeat(nextBeat(1))}
            >
              <span>{t('common.continue')}</span>
              <span className="text-ink/30">→</span>
            </button>
          </div>
        </section>
      ) : null}

      {/* ── Beat 2: 今日小回报 ── */}
      {beat === 2 ? (
        <section className="relative flex flex-1 flex-col items-center justify-center bg-[#f5ead8] px-6 text-center">
          <div className="relative z-10 flex flex-col items-center">
            {reward.hasReward ? (
              <>
                <div className="reward-pop flex h-20 w-20 items-center justify-center rounded-full bg-[#fae49c]/30">
                  <span className="text-3xl">✦</span>
                </div>
                <h2 className="morning-fade mt-6 text-lg font-semibold text-ink" style={{ animationDelay: '200ms' }}>
                  {reward.text}
                </h2>
                <p className="morning-fade mt-3 text-sm leading-6 text-ink/50" style={{ animationDelay: '400ms' }}>
                  {reward.subtext}
                </p>
              </>
            ) : (
              <>
                <AssetImage
                  src={spiritAssets.base.src}
                  fallbackSrc={spiritAssets.base.fallbackSrc}
                  alt={spiritName}
                  variant="character"
                  className="morning-scale h-28"
                />
                <p className="morning-fade mt-6 text-base leading-7 text-ink/60" style={{ animationDelay: '200ms' }}>
                  {reward.text}
                </p>
                <p className="morning-fade mt-2 text-sm text-ink/40" style={{ animationDelay: '400ms' }}>
                  {reward.subtext}
                </p>
              </>
            )}

            <button
              type="button"
              className="morning-fade mt-10 flex w-full items-center justify-between rounded-[22px] bg-white/40 px-5 py-3 text-sm text-ink/55 transition hover:bg-white/60"
              style={{ animationDelay: '600ms' }}
              onClick={() => setBeat(nextBeat(2))}
            >
              <span>{t('common.continue')}</span>
              <span className="text-ink/30">→</span>
            </button>
          </div>
        </section>
      ) : null}

      {/* ── Beat 3: 心事回看 ── */}
      {beat === 3 && hasWorry ? (
        <section className="flex flex-1 flex-col items-center justify-center bg-[#f5ead8] px-6 text-center">
          <div className="relative z-10 flex flex-col items-center">
            <AssetImage
              src={spiritAssets.base.src}
              fallbackSrc={spiritAssets.base.fallbackSrc}
              alt={spiritName}
              variant="character"
              className="morning-scale h-28 drop-shadow-[0_6px_16px_rgba(138,97,74,0.14)]"
            />

            <p className="morning-fade mt-6 text-sm text-ink/45" style={{ animationDelay: '200ms' }}>
              {t('morning.worryReturn', { name: spiritName })}
            </p>

            <div className="morning-fade mt-4 w-full rounded-[20px] bg-white/40 px-5 py-4" style={{ animationDelay: '400ms' }}>
              <p className="text-sm leading-7 text-ink/70">{lastNightWorry}</p>
            </div>

            <p className="morning-fade mt-4 text-sm leading-6 text-ink/50" style={{ animationDelay: '600ms' }}>
              {t('morning.worryQuestion')}
            </p>

            <div className="morning-fade mt-6 flex w-full gap-3" style={{ animationDelay: '800ms' }}>
              <button type="button"
                className="flex-1 rounded-[18px] bg-white/45 px-4 py-3.5 text-sm font-medium text-ink/70 transition hover:bg-white/60"
                onClick={() => { onWorryReviewed('released'); setBeat(4) }}>
                {t('morning.released')}
              </button>
              <button type="button"
                className="flex-1 rounded-[18px] bg-white/45 px-4 py-3.5 text-sm font-medium text-ink/70 transition hover:bg-white/60"
                onClick={() => { onWorryReviewed('carrying'); setBeat(4) }}>
                {t('morning.carrying')}
              </button>
            </div>

            <button type="button" className="mt-3 text-xs text-ink/30 transition hover:text-ink/45" onClick={() => setBeat(4)}>
              {t('morning.dontLook')}
            </button>
          </div>
        </section>
      ) : null}

      {/* ── Beat 4: 铺子活过来 ── */}
      {beat === 4 ? (
        <section className="relative flex flex-1 flex-col items-center justify-center bg-[#f5ead8] px-6 text-center">
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="morning-fade text-2xl font-semibold text-ink">
              {t('morning.openUp')}
            </h1>
            <p className="morning-fade mt-3 text-base leading-7 text-ink/55" style={{ animationDelay: '200ms' }}>
              {t('morning.openDesc')}
            </p>

            {/* 今天来的客人 */}
            {todayGuests.length > 0 ? (
              <div className="mt-6 flex items-end gap-3">
                {todayGuests.map((guest, i) => (
                  <div
                    key={guest!.key}
                    className="guest-appear flex flex-col items-center"
                    style={{ animationDelay: `${400 + i * 150}ms` }}
                  >
                    <img
                      src={guest!.image.src}
                      alt={guest!.name}
                      className="h-12 w-12 object-contain drop-shadow-[0_3px_8px_rgba(138,97,74,0.12)]"
                      onError={(e) => {
                        if (guest!.image.fallbackSrc) (e.target as HTMLImageElement).src = guest!.image.fallbackSrc
                      }}
                    />
                    <span className="mt-1 text-[10px] text-ink/40">{guest!.name.slice(0, 4)}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <SoftButton
              className="morning-fade mt-10"
              type="button"
              variant="primary"
              block
              style={{ animationDelay: `${400 + todayGuests.length * 150 + 200}ms` }}
              onClick={onComplete}
            >
              {t('morning.welcome')}
            </SoftButton>
          </div>
        </section>
      ) : null}
    </div>
  )
}

/* ── MiddayTransition (unchanged, added i18n) ── */

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
          今天上午来了 {guestCount} 位客人。
        </p>
        <p className="mt-2 text-sm leading-6 text-ink/50">{middayCopy.body(spiritName)}</p>
        <SoftButton className="mt-8" type="button" variant="primary" block onClick={onContinue}>
          开始备菜
        </SoftButton>
      </section>
    </div>
  )
}
