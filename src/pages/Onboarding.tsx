/**
 * Onboarding.tsx — v6.2
 *
 * Narrative redesign:
 * - Story beats now explain WHY the shop needs someone who sleeps well
 * - Quiz is presented as spirit dialogue (chat bubbles), not cold quiz form
 * - Smooth transition: story → spirit asks → dialogue-style questions → result
 * - Language switcher in top-right corner of first beat
 * - i18n support via useT()
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { getCoverTransparent } from '../lib/assets'
import { SpiritSprite } from '../components/SpiritSprite'
import { onboardingSkins, personaQuestions, resolvePersona } from '../lib/demoData'
import {
  clearOnboardingDraft,
  defaultOnboardingDraft,
  loadOnboardingDraft,
  saveOnboardingDraft,
  type NightType,
  type OnboardingDraft,
  type OnboardingProfile,
  type SpiritBody,
} from '../lib/storage'
import { SoftButton } from '../components/SoftButton'
import { useT, type Lang } from '../lib/i18n'
import { isDemoMode } from '../lib/devMode'

interface OnboardingProps {
  onComplete: (profile: OnboardingProfile) => void
}

const timeOptions = ['22:30', '23:00', '23:30', '00:00']

/* ── Language toggle ── */

function LangToggle() {
  const { lang, setLang } = useT()
  return (
    <button
      type="button"
      className="rounded-full bg-ink/10 px-3 py-1.5 text-xs text-ink/50 backdrop-blur-sm transition hover:bg-ink/18"
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
    >
      {lang === 'zh' ? 'EN' : '中文'}
    </button>
  )
}

/* ── Shared frame ── */

function OnboardingFrame({ children, onReset, onSkip }: { children: ReactNode; onReset: () => void; onSkip?: () => void }) {
  const { lang } = useT()
  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-[#f5ead8]">
      <div className="absolute right-4 top-4 z-20 flex gap-2">
        <LangToggle />
        <button
          type="button"
          className="rounded-full bg-ink/15 px-3 py-1.5 text-xs text-ink/60 backdrop-blur-sm transition hover:bg-ink/25"
          onClick={onReset}
        >
          ↻
        </button>
        {/* 仅演示版：一键跳过开场，直接进店（真实用户走完整人格化流程） */}
        {isDemoMode() && onSkip ? (
          <button
            type="button"
            className="rounded-full bg-ink/15 px-3 py-1.5 text-xs text-ink/60 backdrop-blur-sm transition hover:bg-ink/25"
            onClick={onSkip}
          >
            {lang === 'en' ? 'Skip' : '跳过'}
          </button>
        ) : null}
      </div>
      <main className="relative flex min-h-screen flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}

/* ── Spirit carousel (unchanged logic, i18n labels) ── */

interface SpiritCarouselProps {
  selected: SpiritBody
  onSelect: (form: SpiritBody) => void
}

function SpiritCarousel({ selected, onSelect }: SpiritCarouselProps) {
  const items = onboardingSkins
  const count = items.length
  const selectedIndex = items.findIndex((item) => item.form === selected)
  const dragStartX = useRef(0)
  const dragDeltaX = useRef(0)
  const isDragging = useRef(false)

  const goTo = useCallback(
    (direction: 1 | -1) => {
      const nextIndex = (selectedIndex + direction + count) % count
      onSelect(items[nextIndex].form)
    },
    [selectedIndex, count, items, onSelect],
  )

  const handleTouchStart = (event: React.TouchEvent) => { dragStartX.current = event.touches[0].clientX; dragDeltaX.current = 0; isDragging.current = true }
  const handleTouchMove = (event: React.TouchEvent) => { dragDeltaX.current = event.touches[0].clientX - dragStartX.current }
  const handleTouchEnd = () => { isDragging.current = false; if (Math.abs(dragDeltaX.current) > 40) goTo(dragDeltaX.current < 0 ? 1 : -1) }

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault(); dragStartX.current = event.clientX; dragDeltaX.current = 0; isDragging.current = true
    const handleMouseMove = (e: MouseEvent) => { dragDeltaX.current = e.clientX - dragStartX.current }
    const handleMouseUp = () => { isDragging.current = false; if (Math.abs(dragDeltaX.current) > 40) goTo(dragDeltaX.current < 0 ? 1 : -1); window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp) }
    window.addEventListener('mousemove', handleMouseMove); window.addEventListener('mouseup', handleMouseUp)
  }

  function getItemStyle(index: number): React.CSSProperties {
    let offset = index - selectedIndex
    if (offset > count / 2) offset -= count
    if (offset < -count / 2) offset += count
    const angle = (offset / count) * 360
    const absOffset = Math.abs(offset)
    const translateX = Math.sin((angle * Math.PI) / 180) * 130
    const translateZ = -absOffset * 80
    const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.6 : 0.4
    const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.35 : 0.15
    const zIndex = absOffset === 0 ? 10 : absOffset === 1 ? 5 : 1
    return {
      position: 'absolute', left: '50%', top: '50%',
      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
      opacity, zIndex, transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: absOffset === 0 ? 'default' : 'pointer',
      filter: absOffset === 0 ? 'none' : 'grayscale(0.3)',
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mx-auto h-[260px] w-full max-w-[380px] select-none" style={{ perspective: '800px' }}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onMouseDown={handleMouseDown}>
        <div className="relative h-full w-full" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(8deg)' }}>
          {items.map((item, index) => {
            const rawOffset = (index - selectedIndex + count) % count
            const off = Math.abs(rawOffset > count / 2 ? rawOffset - count : rawOffset)
            return (
              <div key={item.form} style={getItemStyle(index)} onClick={() => { if (off !== 0) onSelect(item.form) }}>
                <SpiritSprite body={item.form} face="normal" alt={item.name} className="h-44 drop-shadow-[0_8px_24px_rgba(138,97,74,0.18)]" />
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-2 text-center text-lg font-semibold text-ink">{items[selectedIndex].name}</p>
      <div className="mt-3 flex gap-2">
        {items.map((item, index) => (
          <button key={item.form} type="button"
            className={`h-2 rounded-full transition-all ${index === selectedIndex ? 'w-5 bg-brown' : 'w-2 bg-ink/20'}`}
            onClick={() => onSelect(item.form)} />
        ))}
      </div>
    </div>
  )
}

function updateDraft(next: Partial<OnboardingDraft>, current: OnboardingDraft): OnboardingDraft {
  return { ...current, ...next }
}

/* ── Quiz question keys ── */
const quizKeys = ['q1', 'q2', 'q3', 'q4', 'q5'] as const
const optionKeys = ['revenge', 'habit', 'anxiety', 'work'] as const

export function Onboarding({ onComplete }: OnboardingProps) {
  const [draft, setDraft] = useState<OnboardingDraft>(() => loadOnboardingDraft())
  const [beat, setBeat] = useState(0)
  const { t } = useT()

  useEffect(() => { saveOnboardingDraft(draft) }, [draft])

  // 人格测试聊天：答一题就把对话滚到底，最新的问题始终露在选项上方（选项常驻底部）
  const quizScrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (draft.step !== 1) return
    const el = quizScrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [draft.step, draft.questionIndex])

  const reset = () => { clearOnboardingDraft(); setDraft(defaultOnboardingDraft); setBeat(0) }
  const setStep = (step: number) => setDraft((c) => updateDraft({ step }, c))
  const result: NightType = draft.nightType ?? resolvePersona(draft.personaAnswers)

  // 仅演示版：用当前草稿（缺则填默认）直接完成 onboarding，跳过开场
  const skip = () => {
    clearOnboardingDraft()
    onComplete({
      nightType: draft.nightType ?? resolvePersona(draft.personaAnswers),
      personaAnswers: draft.personaAnswers,
      spiritAppearance: draft.spiritAppearance || 'base',
      spiritName: draft.spiritName.trim() || t('onboarding.namingPlaceholder'),
      defaultLightsOffTime: draft.defaultLightsOffTime || '23:00',
    })
  }

  /* ── Step 0: Story with integrated narrative ── */
  if (draft.step === 0) {
    const storyBeats = [
      { title: t('onboarding.story.beat1.title'), body: t('onboarding.story.beat1.body') },
      { title: t('onboarding.story.beat2.title'), body: t('onboarding.story.beat2.body') },
      { title: t('onboarding.story.beat3.title'), body: t('onboarding.story.beat3.body') },
      { title: t('onboarding.story.beat4.title'), body: t('onboarding.story.beat4.body') },
      { title: t('onboarding.story.beat5.title'), body: t('onboarding.story.beat5.body') },
    ]
    const currentBeat = storyBeats[beat]
    const isLastBeat = beat === storyBeats.length - 1

    return (
      <OnboardingFrame onReset={reset} onSkip={skip}>
        <section className="flex flex-1 flex-col">
          <div className="flex w-full flex-shrink-0 items-center justify-center px-6 pt-10">
            <img src={getCoverTransparent()} alt="" className="h-auto w-[92%] max-w-[360px] object-contain drop-shadow-[0_12px_32px_rgba(138,97,74,0.12)]" />
          </div>
          <div className="mt-auto px-6 pb-10 pt-4">
            <div className="mb-5 flex gap-1.5">
              {storyBeats.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= beat ? 'bg-brown/50' : 'bg-ink/10'} ${i === beat ? 'w-6' : 'w-2'}`} />
              ))}
            </div>
            <div key={beat}>
              <h1 className="text-[22px] font-semibold leading-snug text-ink">{currentBeat.title}</h1>
              <p className="mt-3 text-[15px] leading-7 text-ink/60">{currentBeat.body}</p>
            </div>
            {isLastBeat ? (
              <SoftButton className="mt-6" type="button" variant="primary" block onClick={() => setStep(1)}>
                {t('onboarding.story.beat5.cta')}
              </SoftButton>
            ) : (
              <button type="button" className="mt-6 flex w-full items-center justify-between rounded-[22px] bg-white/40 px-5 py-3 text-sm text-ink/55 transition hover:bg-white/60"
                onClick={() => setBeat((b) => b + 1)}>
                <span>{t('common.continue')}</span>
                <span className="text-ink/30">→</span>
              </button>
            )}
          </div>
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 1: Spirit dialogue quiz ── */
  if (draft.step === 1) {
    const qIdx = draft.questionIndex
    const qKey = quizKeys[qIdx]
    const questionText = t(`onboarding.quiz.${qKey}.question`)

    // Build conversation history from previous answers
    const chatHistory: Array<{ speaker: 'spirit' | 'user'; text: string }> = []
    for (let i = 0; i < qIdx; i++) {
      chatHistory.push({ speaker: 'spirit', text: t(`onboarding.quiz.${quizKeys[i]}.question`) })
      const answerKey = draft.personaAnswers[i] as typeof optionKeys[number]
      if (answerKey) {
        chatHistory.push({ speaker: 'user', text: t(`onboarding.quiz.${quizKeys[i]}.options.${answerKey}`) })
      }
    }

    return (
      <OnboardingFrame onReset={reset} onSkip={skip}>
        {/* 固定一屏高：只有聊天区滚动，选项常驻底部、全部可见 */}
        <section className="flex h-[100dvh] flex-col px-5 py-5">
          {/* Spirit header */}
          <div className="flex shrink-0 items-center gap-3 pb-3">
            <SpiritSprite body="base" face="normal" className="h-10 drop-shadow-[0_4px_12px_rgba(138,97,74,0.15)]" />
            <p className="text-xs text-ink/40">{t('onboarding.quiz.spiritAsk', { name: '' })}</p>
          </div>

          {/* Progress */}
          <div className="flex shrink-0 gap-1.5 py-2">
            {quizKeys.map((_, index) => (
              <div key={index} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${index <= qIdx ? 'bg-butter' : 'bg-ink/10'}`} />
            ))}
          </div>

          {/* Chat history */}
          <div ref={quizScrollRef} className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.speaker === 'spirit' ? 'justify-start' : 'justify-end'}`}>
                <p className={`max-w-[85%] rounded-[20px] px-4 py-3 text-sm leading-6 ${
                  msg.speaker === 'spirit' ? 'bg-white/50 text-ink/70' : 'bg-[#d4a574]/30 text-ink'
                }`}>{msg.text}</p>
              </div>
            ))}
            {/* Current question as spirit bubble */}
            <div className="flex justify-start">
              <p className="max-w-[85%] rounded-[20px] bg-white/50 px-4 py-3 text-sm leading-6 text-ink/70">
                {questionText}
              </p>
            </div>
          </div>

          {/* Options as reply buttons — 常驻底部不收缩 */}
          <div className="mt-4 grid shrink-0 gap-2 pb-2">
            {optionKeys.map((key) => (
              <button
                key={key}
                type="button"
                className="rounded-[22px] bg-white/40 px-4 py-3.5 text-left text-[15px] leading-6 text-ink/80 transition hover:bg-white/60 active:scale-[0.98]"
                onClick={() => {
                  const answers = [...draft.personaAnswers, key]
                  const finished = qIdx === personaQuestions.length - 1
                  setDraft((current) =>
                    updateDraft({
                      personaAnswers: answers,
                      questionIndex: finished ? current.questionIndex : current.questionIndex + 1,
                      nightType: finished ? resolvePersona(answers) : current.nightType,
                      step: finished ? 2 : 1,
                    }, current),
                  )
                }}
              >
                {t(`onboarding.quiz.${qKey}.options.${key}`)}
              </button>
            ))}
          </div>
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 2: Result + Spirit appears ── */
  if (draft.step === 2) {
    return (
      <OnboardingFrame onReset={reset} onSkip={skip}>
        <section className="flex flex-1 flex-col justify-center px-5 py-5 text-center">
          <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
            <SpiritSprite body="base" face="normal" className="h-36 drop-shadow-[0_8px_24px_rgba(138,97,74,0.2)]" />
          </div>
          <p className="mt-4 text-sm text-ink/45">{t('onboarding.result.intro')}</p>
          <h1 className="mt-2 text-3xl font-semibold text-brown">{t(`onboarding.types.${result}`)}</h1>
          <p className="mt-4 text-base leading-7 text-ink/65">{t(`onboarding.typeCopy.${result}`)}</p>
          <p className="mt-3 text-sm leading-6 text-ink/50">{t('onboarding.result.spiritAppears')}</p>
          <SoftButton className="mt-8" type="button" variant="primary" block onClick={() => setStep(3)}>
            {t('onboarding.result.pickSkin')}
          </SoftButton>
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 3: Carousel ── */
  if (draft.step === 3) {
    return (
      <OnboardingFrame onReset={reset} onSkip={skip}>
        <section className="flex min-h-0 flex-1 flex-col justify-center px-5 py-5">
          <h1 className="text-center text-2xl font-semibold text-ink">{t('onboarding.skinSelect.title')}</h1>
          <p className="mt-2 text-center text-sm text-ink/50">{t('onboarding.skinSelect.subtitle')}</p>
          <div className="mt-6">
            <SpiritCarousel selected={draft.spiritAppearance} onSelect={(form) => setDraft((c) => updateDraft({ spiritAppearance: form }, c))} />
          </div>
          <SoftButton className="mt-8" type="button" variant="primary" block onClick={() => setStep(4)}>
            {t('onboarding.skinSelect.confirm')}
          </SoftButton>
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 4: Name spirit ── */
  if (draft.step === 4) {
    const currentSkin = onboardingSkins.find((s) => s.form === draft.spiritAppearance) ?? onboardingSkins[0]
    return (
      <OnboardingFrame onReset={reset} onSkip={skip}>
        <section className="flex flex-1 flex-col justify-center px-5 py-5 text-center">
          <div className="mx-auto flex h-36 w-36 items-center justify-center">
            <SpiritSprite body={currentSkin.form} face="normal" alt={currentSkin.name} className="h-28 drop-shadow-[0_6px_18px_rgba(138,97,74,0.18)]" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-ink">{t('onboarding.namingTitle')}</h1>
          <div className="mx-auto mt-6 w-full max-w-[280px]">
            <input value={draft.spiritName} onChange={(e) => setDraft((c) => updateDraft({ spiritName: e.target.value }, c))}
              className="w-full border-0 border-b-2 border-line/40 bg-transparent pb-2 text-center text-2xl text-ink outline-none transition focus:border-brown/50"
              placeholder={t('onboarding.namingPlaceholder')} />
          </div>
          <SoftButton className="mt-8" type="button" variant="primary" block disabled={!draft.spiritName.trim()} onClick={() => setStep(5)}>
            {t('common.nextStep')}
          </SoftButton>
          {!draft.spiritName.trim() ? (
            <p className="mt-3 text-xs text-ink/35">{t('onboarding.nameHint')}</p>
          ) : null}
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 5: Lights-off time ── */
  return (
    <OnboardingFrame onReset={reset} onSkip={skip}>
      <section className="flex flex-1 flex-col justify-center px-5 py-5">
        <h1 className="text-2xl font-semibold text-ink">{t('onboarding.lightsOff.title')}</h1>
        <p className="mt-3 text-sm leading-6 text-ink/55">{t('onboarding.lightsOff.subtitle')}</p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {timeOptions.map((option) => (
            <button key={option} type="button"
              className={`rounded-[28px] px-4 py-5 text-xl font-semibold transition ${draft.defaultLightsOffTime === option ? 'bg-butter/70 text-ink' : 'bg-white/40 text-ink/60'}`}
              onClick={() => setDraft((c) => updateDraft({ defaultLightsOffTime: option }, c))}>
              {option}
            </button>
          ))}
        </div>
        <SoftButton className="mt-8" type="button" variant="primary" block
          onClick={() => {
            clearOnboardingDraft()
            onComplete({
              nightType: result,
              personaAnswers: draft.personaAnswers,
              spiritAppearance: draft.spiritAppearance,
              spiritName: draft.spiritName.trim() || (t('onboarding.namingPlaceholder')),
              defaultLightsOffTime: draft.defaultLightsOffTime,
            })
          }}>
          {t('onboarding.lightsOff.cta')}
        </SoftButton>
      </section>
    </OnboardingFrame>
  )
}
