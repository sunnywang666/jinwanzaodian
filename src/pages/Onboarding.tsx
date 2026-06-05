import { useEffect, useState, type ReactNode } from 'react'
import { getSceneAsset, getSpiritAsset } from '../lib/assets'
import { personaCopy, personaQuestions, resolvePersona, spiritOptions } from '../lib/demoData'
import {
  clearOnboardingDraft,
  defaultOnboardingDraft,
  loadOnboardingDraft,
  saveOnboardingDraft,
  type NightType,
  type OnboardingDraft,
  type OnboardingProfile,
} from '../lib/storage'
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'

interface OnboardingProps {
  onComplete: (profile: OnboardingProfile) => void
}

const timeOptions = ['22:30', '23:00', '23:30', '00:00']

function OnboardingFrame({ children, onReset }: { children: ReactNode; onReset: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col px-3 py-3">
      <div className="paper-panel flex min-h-[calc(100vh-1.5rem)] flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-between border-b border-line bg-paper px-4 py-3">
          <span className="paper-label">开店流程</span>
          <button
            type="button"
            className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-xs text-brown"
            onClick={onReset}
          >
            重置
          </button>
        </header>
        <main className="flex min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,rgba(255,249,241,0.82),rgba(246,239,226,0.96))]">
          {children}
        </main>
      </div>
    </div>
  )
}

function updateDraft(next: Partial<OnboardingDraft>, current: OnboardingDraft): OnboardingDraft {
  return { ...current, ...next }
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [draft, setDraft] = useState<OnboardingDraft>(() => loadOnboardingDraft())

  useEffect(() => {
    saveOnboardingDraft(draft)
  }, [draft])

  const reset = () => {
    clearOnboardingDraft()
    setDraft(defaultOnboardingDraft)
  }

  const setStep = (step: number) => setDraft((current) => updateDraft({ step }, current))
  const result: NightType = draft.nightType ?? resolvePersona(draft.personaAnswers)

  if (draft.step === 0) {
    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex flex-1 flex-col px-5 py-5">
          <div className="overflow-hidden rounded-[28px] border border-line bg-cream">
            <AssetImage src={getSceneAsset('cover')} alt="今晚早点铺子" variant="scene" className="h-[310px]" />
          </div>
          <div className="mt-auto pt-5">
            <h1 className="text-3xl font-semibold leading-tight text-ink">欢迎来到你的早点铺</h1>
            <p className="mt-3 text-base leading-7 text-ink/75">
              这里不会催你，也不会评判你。先看看，哪一种夜晚最像你。
            </p>
            <SoftButton className="mt-5" type="button" variant="primary" block onClick={() => setStep(1)}>
              开始开店
            </SoftButton>
          </div>
        </section>
      </OnboardingFrame>
    )
  }

  if (draft.step === 1) {
    const question = personaQuestions[draft.questionIndex]

    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex flex-1 flex-col px-5 py-5">
          <p className="paper-label">
            问题 {draft.questionIndex + 1} / {personaQuestions.length}
          </p>
          <h1 className="mt-6 text-2xl font-semibold leading-tight text-ink">{question.question}</h1>
          <div className="mt-8 grid gap-3">
            {question.options.map((option) => (
              <button
                key={option.key}
                type="button"
                className="rounded-[26px] border border-line bg-white/80 px-4 py-4 text-left text-base leading-6 text-ink shadow-sm transition hover:border-brown"
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

  if (draft.step === 2) {
    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex flex-1 flex-col justify-center px-5 py-5 text-center">
          <p className="paper-label mx-auto">测试结果</p>
          <h1 className="mt-6 text-2xl font-semibold text-ink">今晚最像你的夜晚是……</h1>
          <div className="mx-auto mt-6 w-full rounded-[32px] border border-line bg-white/80 px-5 py-8 shadow-sm">
            <p className="text-4xl font-semibold text-brown">{result}</p>
            <p className="mt-4 text-base leading-7 text-ink/75">{personaCopy[result]}</p>
          </div>
          <SoftButton className="mt-7" type="button" variant="primary" block onClick={() => setStep(3)}>
            看看谁最懂这种夜晚
          </SoftButton>
        </section>
      </OnboardingFrame>
    )
  }

  if (draft.step === 3) {
    const spirit = getSpiritAsset('base')

    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex flex-1 flex-col justify-center px-5 py-5 text-center">
          <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full bg-butter/35">
            <div className="absolute h-40 w-40 rounded-full border border-line/70" />
            <AssetImage
              src={spirit.src}
              fallbackSrc={spirit.fallbackSrc}
              alt="面点精灵"
              variant="character"
              className="h-36"
            />
          </div>
          <h1 className="mt-7 text-2xl font-semibold text-ink">面点精灵出现了</h1>
          <p className="mt-3 text-base leading-7 text-ink/75">
            一只面点精灵从柜台后探出来。它最懂这种夜晚。
          </p>
          <SoftButton className="mt-7" type="button" variant="primary" block onClick={() => setStep(4)}>
            领它回小屋
          </SoftButton>
        </section>
      </OnboardingFrame>
    )
  }

  if (draft.step === 4) {
    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex min-h-0 flex-1 flex-col px-5 py-5">
          <p className="paper-label">精灵外表</p>
          <h1 className="mt-4 text-2xl font-semibold text-ink">给它挑一个点心形态</h1>
          <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-y-auto pb-2">
            {spiritOptions.map((option) => (
              <button
                key={option.form}
                type="button"
                className={`rounded-[28px] border bg-white/80 px-3 py-4 text-center transition ${
                  draft.spiritAppearance === option.form ? 'border-brown ring-2 ring-brown/20' : 'border-line'
                }`}
                onClick={() => {
                  if (option.form === 'base' || option.form === 'xiaolongbao') {
                    const spiritAppearance = option.form
                    setDraft((current) => updateDraft({ spiritAppearance }, current))
                  }
                }}
              >
                <AssetImage
                  src={option.src}
                  fallbackSrc={option.fallbackSrc}
                  alt={option.name}
                  variant="character"
                  className="h-28"
                />
                <p className="mt-3 text-sm font-semibold text-ink">{option.name}</p>
                <p className="mt-1 text-xs text-ink/60">{option.unlocked ? '已解锁' : '素材预留'}</p>
              </button>
            ))}
          </div>
          <SoftButton type="button" variant="primary" block onClick={() => setStep(5)}>
            下一步
          </SoftButton>
        </section>
      </OnboardingFrame>
    )
  }

  if (draft.step === 5) {
    return (
      <OnboardingFrame onReset={reset}>
        <section className="flex flex-1 flex-col justify-center px-5 py-5">
          <p className="paper-label">起名</p>
          <h1 className="mt-5 text-2xl font-semibold text-ink">给精灵起个名字</h1>
          <label className="mt-7 rounded-[28px] border border-line bg-white/80 px-5 py-4">
            <span className="text-sm text-ink/65">精灵名字</span>
            <input
              value={draft.spiritName}
              onChange={(event) => setDraft((current) => updateDraft({ spiritName: event.target.value }, current))}
              className="mt-3 w-full border-0 bg-transparent p-0 text-2xl text-ink outline-none"
              placeholder="阿团"
            />
          </label>
          <SoftButton
            className="mt-7"
            type="button"
            variant="primary"
            block
            disabled={!draft.spiritName.trim()}
            onClick={() => setStep(6)}
          >
            下一步
          </SoftButton>
        </section>
      </OnboardingFrame>
    )
  }

  return (
    <OnboardingFrame onReset={reset}>
      <section className="flex flex-1 flex-col justify-center px-5 py-5">
        <p className="paper-label">关灯时间</p>
        <h1 className="mt-5 text-2xl font-semibold text-ink">平时希望几点关灯？</h1>
        <p className="mt-3 text-sm leading-6 text-ink/70">这只是参考，铺子不会催你。</p>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {timeOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-[28px] border px-4 py-5 text-xl font-semibold transition ${
                draft.defaultLightsOffTime === option
                  ? 'border-brown bg-butter text-ink'
                  : 'border-line bg-white/80 text-ink/75'
              }`}
              onClick={() => setDraft((current) => updateDraft({ defaultLightsOffTime: option }, current))}
            >
              {option}
            </button>
          ))}
        </div>
        <SoftButton
          className="mt-7"
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
