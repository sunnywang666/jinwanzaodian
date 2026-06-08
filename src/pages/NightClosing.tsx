/**
 * NightClosing.tsx — v5.9
 *
 * 打烊最后一步：如果写了心事，精灵提及"纸条收好了"
 */

import { useState } from 'react'
import type { LogEntry } from '../lib/storage'
import { GameOverlay } from '../components/GameOverlay'
import { SoftButton } from '../components/SoftButton'

interface NightClosingProps {
  spiritName: string
  tonightClosed: boolean
  /** 今晚写的心事（如果有） */
  tonightWorry: string
  onComplete: () => void
  onClose: () => void
  latestLog: LogEntry
}

const closingSteps = [
  {
    label: '关掉柜台小灯',
    description: '铺子亮了一整天，够了。',
  },
  {
    label: '拉下小卷帘',
    description: '明天还会再拉起来的。',
  },
  {
    label: '精灵回小屋睡',
    description: '它打了个哈欠，跟你说了声晚安。',
  },
  {
    label: '铺子睡了',
    description: '把手机也放下吧，扣过来放远一点。',
  },
]

export function NightClosing({ spiritName, tonightClosed, tonightWorry, onComplete, onClose, latestLog }: NightClosingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const isComplete = currentStep >= closingSteps.length

  const hasWorry = tonightWorry.trim().length > 0

  return (
    <GameOverlay title="打烊" onClose={onClose}>
      <section className="flex h-full flex-col bg-[#3d3834] px-5 pb-6 pt-[11dvh]">

        {!isComplete ? (
          <>
            {/* Title */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#e8ddd0]">铺子要关灯歇业了</h2>
              <p className="mt-2 text-sm leading-6 text-[#e8ddd0]/45">
                不是"你该睡了"——是你这个店长该收摊了。
              </p>
            </div>

            {/* Steps */}
            <div className="mt-8 flex flex-1 flex-col gap-3">
              {closingSteps.map((step, index) => {
                const isDone = index < currentStep
                const isCurrent = index === currentStep
                const isLocked = index > currentStep

                return (
                  <button
                    key={step.label}
                    type="button"
                    disabled={!isCurrent}
                    className={`rounded-[20px] px-5 py-4 text-left transition-all duration-300 ${
                      isDone
                        ? 'bg-white/8 opacity-50'
                        : isCurrent
                          ? 'bg-white/12'
                          : 'bg-transparent opacity-20'
                    }`}
                    onClick={() => {
                      if (isCurrent) setCurrentStep(currentStep + 1)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          isDone
                            ? 'bg-[#e8ddd0]/20 text-[#e8ddd0]/50'
                            : isCurrent
                              ? 'bg-[#f0ddb3]/30 text-[#f0ddb3]'
                              : 'bg-white/5 text-white/20'
                        }`}
                      >
                        {isDone ? '✓' : index + 1}
                      </span>
                      <span
                        className={`text-base font-semibold ${
                          isDone
                            ? 'text-[#e8ddd0]/40 line-through'
                            : isCurrent
                              ? 'text-[#e8ddd0]'
                              : 'text-[#e8ddd0]/25'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {isCurrent ? (
                      <p className="mt-2 pl-9 text-sm leading-6 text-[#e8ddd0]/45">
                        {step.description}
                      </p>
                    ) : null}
                    {isCurrent ? (
                      <p className="mt-2 pl-9 text-xs text-[#f0ddb3]/40">
                        点击完成这一步
                      </p>
                    ) : null}
                  </button>
                )
              })}
            </div>

            {/* Progress hint */}
            <p className="mt-4 text-center text-xs text-[#e8ddd0]/25">
              {currentStep} / {closingSteps.length}
            </p>
          </>
        ) : (
          /* ── Final screen: all steps done ── */
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-4xl">🌙</p>
            <h2 className="mt-6 text-xl font-semibold text-[#e8ddd0]">铺子睡了</h2>
            <p className="mt-3 text-sm leading-7 text-[#e8ddd0]/50">
              {spiritName} 已经回小屋了。<br />
              灯关了，剩下的夜晚会自己安静下来。
            </p>

            {/* 心事提及 */}
            {hasWorry ? (
              <div className="mt-5 rounded-[18px] bg-white/8 px-5 py-3">
                <p className="text-sm leading-6 text-[#f0ddb3]/50">
                  {spiritName}：今晚的小纸条已经收好了，明天再看。
                </p>
              </div>
            ) : null}

            <p className="mt-6 text-base leading-7 text-[#f0ddb3]/60">
              把手机也放下吧，扣过来放远一点。
            </p>

            <SoftButton
              className="mt-10"
              type="button"
              variant="primary"
              block
              onClick={onComplete}
            >
              {tonightClosed ? '已记录，回到铺子' : '我准备放下手机了'}
            </SoftButton>

            {tonightClosed ? (
              <p className="mt-3 text-sm text-[#f0ddb3]/40">
                今晚已经记录为熄灯状态。
              </p>
            ) : null}
          </div>
        )}
      </section>
    </GameOverlay>
  )
}
