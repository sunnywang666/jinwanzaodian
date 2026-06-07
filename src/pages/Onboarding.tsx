import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { getCoverTransparent, getSpiritAsset } from '../lib/assets'
import { onboardingSkins, personaCopy, personaQuestions, resolvePersona } from '../lib/demoData'
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
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'

interface OnboardingProps {
  onComplete: (profile: OnboardingProfile) => void
}

const timeOptions = ['22:30', '23:00', '23:30', '00:00']

/* ── Story beats for Step 0 ── */

const storyBeats = [
  {
    title: '有一家叫「今晚早点」的铺子',
    body: '清晨才开门，只卖早点，夜里跟着店长一起关灯歇业。',
    cta: '继续',
  },
  {
    title: '它的常客不多，但都很熟',
    body: '黑猫阿橘总是第一个来，坐在门口等开门。白兔小团喜欢慢慢喝完一整碗热粥。精灵在柜台后揉着面，等店长回来。',
    cta: '继续',
  },
  {
    title: '可是店长不见了',
    body: '铺子空了好些天，客人慢慢少了，精灵也没什么精神了。',
    cta: '继续',
  },
  {
    title: '精灵说：要不，你来试试？',
    body: '规矩只有一条——好好早睡，才能早起开门。',
    cta: '领这家铺子',
  },
]

/* ── Shared frame ── */

function OnboardingFrame({ children, onReset }: { children: ReactNode; onReset: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-[#f5ead8]">
      <div className="absolute right-4 top-4 z-20">
        <button
          type="button"
          className="rounded-full bg-ink/15 px-3 py-1.5 text-xs text-ink/60 backdrop-blur-sm transition hover:bg-ink/25"
          onClick={onReset}
        >
          重置
        </button>
      </div>
      <main className="relative flex min-h-screen flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}

/* ── Carousel component ── */

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

  const handleTouchStart = (event: React.TouchEvent) => {
    dragStartX.current = event.touches[0].clientX
    dragDeltaX.current = 0
    isDragging.current = true
  }

  const handleTouchMove = (event: React.TouchEvent) => {
    dragDeltaX.current = event.touches[0].clientX - dragStartX.current
  }

  const handleTouchEnd = () => {
    isDragging.current = false
    if (Math.abs(dragDeltaX.current) > 40) {
      goTo(dragDeltaX.current < 0 ? 1 : -1)
    }
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault()
    dragStartX.current = event.clientX
    dragDeltaX.current = 0
    isDragging.current = true

    const handleMouseMove = (moveEvent: MouseEvent) => {
      dragDeltaX.current = moveEvent.clientX - dragStartX.current
    }

    const handleMouseUp = () => {
      isDragging.current = false
      if (Math.abs(dragDeltaX.current) > 40) {
        goTo(dragDeltaX.current < 0 ? 1 : -1)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
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
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: absOffset === 0 ? 'default' : 'pointer',
      filter: absOffset === 0 ? 'none' : 'grayscale(0.3)',
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative mx-auto h-[260px] w-full max-w-[380px] select-none"
        style={{ perspective: '800px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        <div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(8deg)' }}
        >
          {items.map((item, index) => {
            const rawOffset = (index - selectedIndex + count) % count
            const offset = Math.abs(rawOffset > count / 2 ? rawOffset - count : rawOffset)

            return (
              <div
                key={item.form}
                style={getItemStyle(index)}
                onClick={() => {
                  if (offset !== 0) onSelect(item.form)
                }}
              >
                <AssetImage
                  src={item.image.src}
                  fallbackSrc={item.image.fallbackSrc}
                  alt={item.name}
                  variant="character"
                  className="h-44 drop-shadow-[0_8px_24px_rgba(138,97,74,0.18)]"
                />
              </div>
            )
          })}
        </div>
      </div>

      <p className="mt-2 text-center text-lg font-semibold text-ink">
        {items[selectedIndex].name}
      </p>

      <div className="mt-3 flex gap-2">
        {items.map((item, index) => (
          <button
            key={item.form}
            type="button"
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex ? 'w-5 bg-brown' : 'w-2 bg-ink/20'
            }`}
            onClick={() => onSelect(item.form)}
          />
        ))}
      </div>
    </div>
  )
}

function updateDraft(next: Partial<OnboardingDraft>, current: OnboardingDraft): OnboardingDraft {
  return { ...current, ...next }
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [draft, setDraft] = useState<OnboardingDraft>(() => loadOnboardingDraft())
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    saveOnboardingDraft(draft)
  }, [draft])

  const reset = () => {
    clearOnboardingDraft()
    setDraft(defaultOnboardingDraft)
    setBeat(0)
  }

  const setStep = (step: number) => setDraft((current) => updateDraft({ step }, current))
  const result: NightType = draft.nightType ?? resolvePersona(draft.personaAnswers)

  /* ── Step 0: Story-driven welcome with multi-beat narrative ── */
  if (draft.step === 0) {
    const currentBeat = storyBeats[beat]
    const isLastBeat = beat === storyBeats.length - 1

    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex flex-1 flex-col">
          {/* Hero illustration — transparent PNG, no container, directly on background */}
          <div className="flex w-full flex-shrink-0 items-center justify-center px-6 pt-10">
            <img
              src={getCoverTransparent()}
              alt="今晚早点铺子"
              className="h-auto w-[92%] max-w-[360px] object-contain drop-shadow-[0_12px_32px_rgba(138,97,74,0.12)]"
            />
          </div>

          {/* Story beats area */}
          <div className="mt-auto px-6 pb-10 pt-4">
            {/* Beat progress dots */}
            <div className="mb-5 flex gap-1.5">
              {storyBeats.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i <= beat ? 'bg-brown/50' : 'bg-ink/10'
                  } ${i === beat ? 'w-6' : 'w-2'}`}
                />
              ))}
            </div>

            {/* Story content — key forces re-render for smooth feel */}
            <div key={beat}>
              <h1 className="text-[22px] font-semibold leading-snug text-ink">
                {currentBeat.title}
              </h1>
              <p className="mt-3 text-[15px] leading-7 text-ink/60">
                {currentBeat.body}
              </p>
            </div>

            {isLastBeat ? (
              <SoftButton
                className="mt-6"
                type="button"
                variant="primary"
                block
                onClick={() => setStep(1)}
              >
                {currentBeat.cta}
              </SoftButton>
            ) : (
              <button
                type="button"
                className="mt-6 flex w-full items-center justify-between rounded-[22px] bg-white/40 px-5 py-3 text-sm text-ink/55 transition hover:bg-white/60"
                onClick={() => setBeat((b) => b + 1)}
              >
                <span>{currentBeat.cta}</span>
                <span className="text-ink/30">→</span>
              </button>
            )}
          </div>
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 1: Quiz (5 questions) ── */
  if (draft.step === 1) {
    const question = personaQuestions[draft.questionIndex]

    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex flex-1 flex-col px-5 py-5">
          <div className="flex gap-1.5 py-2">
            {personaQuestions.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                  index <= draft.questionIndex ? 'bg-butter' : 'bg-ink/10'
                }`}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-ink/40">
            {draft.questionIndex + 1} / {personaQuestions.length}
          </p>
          <h1 className="mt-4 text-2xl font-semibold leading-tight text-ink">{question.question}</h1>
          <div className="mt-8 grid gap-3">
            {question.options.map((option) => (
              <button
                key={option.key}
                type="button"
                className="rounded-[26px] bg-white/50 px-4 py-4 text-left text-base leading-6 text-ink transition hover:bg-white/70 active:scale-[0.98]"
                onClick={() => {
                  const answers = [...draft.personaAnswers, option.key]
                  const finished = draft.questionIndex === personaQuestions.length - 1
                  setDraft((current) =>
                    updateDraft(
                      {
                        personaAnswers: answers,
                        questionIndex: finished ? current.questionIndex : current.questionIndex + 1,
                        nightType: finished ? resolvePersona(answers) : current.nightType,
                        step: finished ? 2 : 1,
                      },
                      current,
                    ),
                  )
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 2: Result + Spirit appears (merged) ── */
  if (draft.step === 2) {
    const spirit = getSpiritAsset('base')

    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex flex-1 flex-col justify-center px-5 py-5 text-center">
          <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
            <AssetImage
              src={spirit.src}
              fallbackSrc={spirit.fallbackSrc}
              alt="面点精灵"
              variant="character"
              className="h-36 drop-shadow-[0_8px_24px_rgba(138,97,74,0.2)]"
            />
          </div>

          <p className="mt-4 text-sm text-ink/45">它最懂这种夜晚——</p>
          <h1 className="mt-2 text-3xl font-semibold text-brown">{result}</h1>
          <p className="mt-4 text-base leading-7 text-ink/65">{personaCopy[result]}</p>
          <p className="mt-3 text-sm leading-6 text-ink/50">
            一只面点精灵从柜台后探出来，它将一直陪着你。
          </p>

          <SoftButton className="mt-8" type="button" variant="primary" block onClick={() => setStep(3)}>
            给它挑一个外表
          </SoftButton>
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 3: Carousel skin selection ── */
  if (draft.step === 3) {
    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex min-h-0 flex-1 flex-col justify-center px-5 py-5">
          <h1 className="text-center text-2xl font-semibold text-ink">选一个点心形态</h1>
          <p className="mt-2 text-center text-sm text-ink/50">左右滑动或点击两侧挑选，以后还能解锁更多</p>

          <div className="mt-6">
            <SpiritCarousel
              selected={draft.spiritAppearance}
              onSelect={(form) => setDraft((current) => updateDraft({ spiritAppearance: form }, current))}
            />
          </div>

          <SoftButton className="mt-8" type="button" variant="primary" block onClick={() => setStep(4)}>
            就决定是你了
          </SoftButton>
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 4: Name spirit ── */
  if (draft.step === 4) {
    const currentSkin = onboardingSkins.find((s) => s.form === draft.spiritAppearance) ?? onboardingSkins[0]

    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex flex-1 flex-col justify-center px-5 py-5 text-center">
          <div className="mx-auto flex h-36 w-36 items-center justify-center">
            <AssetImage
              src={currentSkin.image.src}
              fallbackSrc={currentSkin.image.fallbackSrc}
              alt={currentSkin.name}
              variant="character"
              className="h-28 drop-shadow-[0_6px_18px_rgba(138,97,74,0.18)]"
            />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-ink">给它起个名字</h1>

          <div className="mx-auto mt-6 w-full max-w-[280px]">
            <input
              value={draft.spiritName}
              onChange={(event) => setDraft((current) => updateDraft({ spiritName: event.target.value }, current))}
              className="w-full border-0 border-b-2 border-line/40 bg-transparent pb-2 text-center text-2xl text-ink outline-none transition focus:border-brown/50"
              placeholder="阿团"
            />
          </div>

          <SoftButton
            className="mt-8"
            type="button"
            variant="primary"
            block
            disabled={!draft.spiritName.trim()}
            onClick={() => setStep(5)}
          >
            下一步
          </SoftButton>
        </section>
      </OnboardingFrame>
    )
  }

  /* ── Step 5: Set lights-off time ── */
  return (
    <OnboardingFrame onReset={reset}>
      <section className="flex flex-1 flex-col justify-center px-5 py-5">
        <h1 className="text-2xl font-semibold text-ink">平时希望几点关灯？</h1>
        <p className="mt-3 text-sm leading-6 text-ink/55">这只是参考，铺子不会催你。</p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {timeOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-[28px] px-4 py-5 text-xl font-semibold transition ${
                draft.defaultLightsOffTime === option
                  ? 'bg-butter/70 text-ink'
                  : 'bg-white/40 text-ink/60'
              }`}
              onClick={() => setDraft((current) => updateDraft({ defaultLightsOffTime: option }, current))}
            >
              {option}
            </button>
          ))}
        </div>
        <SoftButton
          className="mt-8"
          type="button"
          variant="primary"
          block
          onClick={() => {
            clearOnboardingDraft()
            onComplete({
              nightType: result,
              personaAnswers: draft.personaAnswers,
              spiritAppearance: draft.spiritAppearance,
              spiritName: draft.spiritName.trim() || '阿团',
              defaultLightsOffTime: draft.defaultLightsOffTime,
            })
          }}
        >
          开张
        </SoftButton>
      </section>
    </OnboardingFrame>
  )
}
