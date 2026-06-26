/**
 * NightClosing.tsx — v6.4
 *
 * 打烊仪式升级：4步画面变化 + CSS动效 + i18n
 * - Step 1: 关柜台灯 — 灯光晕淡出，画面暗一档
 * - Step 2: 拉卷帘 — 画面再暗
 * - Step 3: 精灵回屋 — 精灵飘走 + 小屋亮光
 * - Step 4: 铺子睡了 — 最终暗色 + 月光 + 呼吸
 */

import { useState } from 'react'
import type { LogEntry, SpiritForm } from '../lib/storage'
import { spiritAssets, sceneAssets } from '../lib/assets'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import { SoftButton } from '../components/SoftButton'
import { useT } from '../lib/i18n'

interface NightClosingProps {
  spiritName: string
  spiritForm?: SpiritForm
  tonightClosed: boolean
  tonightWorry: string
  onComplete: () => void
  onClose: () => void
  latestLog: LogEntry
}

const closingAnimStyles = `
@keyframes closingFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes lampOff {
  from { opacity: 0.5; transform: scale(1); }
  to { opacity: 0; transform: scale(0.6); }
}
@keyframes spiritFloat {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to { opacity: 0; transform: translateX(60px) translateY(-20px) scale(0.4); }
}
@keyframes hutGlow {
  from { opacity: 0; }
  to { opacity: 0.6; }
}
@keyframes moonrise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 0.4; transform: translateY(0); }
}
@keyframes nightBreathe {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 0.95; }
}
@keyframes zzFloat {
  0% { opacity: 0.6; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-30px) scale(0.5); }
}
.closing-fade { animation: closingFadeIn 500ms ease-out both; }
.lamp-off { animation: lampOff 800ms ease-in both; }
.spirit-float { animation: spiritFloat 1000ms ease-in both; }
.hut-glow { animation: hutGlow 600ms ease-out 400ms both; }
.moonrise { animation: moonrise 800ms ease-out 200ms both; }
.night-breathe { animation: nightBreathe 5s ease-in-out infinite; }
.zz-float { animation: zzFloat 2.5s ease-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .closing-fade, .lamp-off, .spirit-float, .hut-glow, .moonrise, .night-breathe, .zz-float { animation: none !important; }
}
`

export function NightClosing({ spiritName, spiritForm = 'base', tonightClosed, tonightWorry, onComplete, onClose, latestLog }: NightClosingProps) {
  const [step, setStep] = useState(0)
  const { t } = useT()
  const spiritImg = spiritAssets[spiritForm]
  const hasWorry = tonightWorry.trim().length > 0

  // 背景明度根据步骤递减
  const bgBrightness = step === 0 ? 0.5 : step === 1 ? 0.35 : step === 2 ? 0.2 : step === 3 ? 0.12 : 0.08
  const overlayOpacity = step === 0 ? 0.3 : step === 1 ? 0.45 : step === 2 ? 0.6 : step === 3 ? 0.75 : 0.85
  const isComplete = step >= 4

  return (
    <GameOverlay title={t('closing.title')} onClose={onClose}>
      <style>{closingAnimStyles}</style>
      <section className="relative flex h-full flex-col overflow-hidden">
        {/* 铺子背景 — 逐步变暗 */}
        <div className="absolute inset-0 transition-all duration-700" style={{ filter: `brightness(${bgBrightness})` }}>
          <AssetImage
            src={sceneAssets.mainBackground.src}
            fallbackSrc={sceneAssets.mainBackground.fallbackSrc}
            alt=""
            variant="scene"
            renderFallbackCard={false}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 transition-opacity duration-700" style={{ background: `rgba(30,26,24,${overlayOpacity})` }} />

        {!isComplete ? (
          <div className="relative z-10 flex flex-1 flex-col px-5 pb-6 pt-[11dvh]">
            {/* 标题 */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#e8ddd0]">{t('closing.title')}</h2>
              <p className="mt-2 text-sm leading-6 text-[#e8ddd0]/45">{t('closing.subtitle')}</p>
            </div>

            {/* 灯光晕 — 步骤0可见，步骤1开始淡出 */}
            {step <= 1 ? (
              <div
                className={`pointer-events-none absolute left-1/2 top-[35%] h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700 ${step >= 1 ? 'lamp-off' : ''}`}
                style={{
                  background: 'radial-gradient(circle, rgba(250,224,156,0.3) 0%, transparent 70%)',
                  opacity: step === 0 ? 0.5 : undefined,
                }}
              />
            ) : null}

            {/* 精灵 — 步骤0-2可见，步骤3飘走 */}
            {step <= 3 ? (
              <div
                className={`mx-auto mt-6 ${step === 3 ? 'spirit-float' : ''}`}
                style={{ opacity: step >= 2 ? 0.6 : 0.85, filter: step >= 2 ? 'brightness(0.7)' : 'none' }}
              >
                <AssetImage
                  src={spiritImg.src}
                  fallbackSrc={spiritImg.fallbackSrc}
                  alt={spiritName}
                  variant="character"
                  className="h-24 transition-opacity duration-500 drop-shadow-[0_4px_16px_rgba(138,97,74,0.1)]"
                />
              </div>
            ) : null}

            {/* 精灵小屋暖光 — 步骤3出现 */}
            {step === 3 ? (
              <div className="hut-glow mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full" style={{ background: 'radial-gradient(circle, rgba(250,224,156,0.4) 0%, transparent 70%)' }}>
                <span className="text-xs text-[#f0ddb3]/60">🏠</span>
              </div>
            ) : null}

            {/* 步骤列表 */}
            <div className="mt-8 flex flex-1 flex-col gap-3">
              {[
                { label: t('closing.step1'), desc: t('closing.step1Desc') },
                { label: t('closing.step2'), desc: t('closing.step2Desc') },
                { label: t('closing.step3'), desc: t('closing.step3Desc') },
                { label: t('closing.step4'), desc: t('closing.step4Desc') },
              ].map((s, i) => {
                const isDone = i < step
                const isCurrent = i === step
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!isCurrent}
                    className={`rounded-[20px] px-5 py-4 text-left transition-all duration-300 disabled:cursor-default ${
                      isDone ? 'bg-white/6 opacity-40' : isCurrent ? 'bg-white/10' : 'bg-transparent opacity-25'
                    }`}
                    onClick={() => { if (isCurrent) setStep(step + 1) }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        isDone ? 'bg-[#e8ddd0]/15 text-[#e8ddd0]/40' : isCurrent ? 'bg-[#f0ddb3]/25 text-[#f0ddb3]' : 'bg-white/5 text-white/15'
                      }`}>
                        {isDone ? '✓' : i + 1}
                      </span>
                      <span className={`text-base font-semibold ${
                        isDone ? 'text-[#e8ddd0]/35 line-through' : isCurrent ? 'text-[#e8ddd0]' : 'text-[#e8ddd0]/20'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    {isCurrent ? <p className="mt-2 pl-9 text-sm leading-6 text-[#e8ddd0]/40">{s.desc}</p> : null}
                    {isCurrent ? <p className="mt-2 pl-9 text-xs text-[#f0ddb3]/30">{t('closing.clickHint')}</p> : null}
                  </button>
                )
              })}
            </div>

            <p className="mt-4 text-center text-xs text-[#e8ddd0]/20">{step} / 4</p>
          </div>
        ) : (
          /* ── 完成画面：铺子睡了 ── */
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-8 text-center">
            {/* 月光 */}
            <div className="moonrise absolute right-[15%] top-[12%] h-16 w-16 rounded-full" style={{
              background: 'radial-gradient(circle, rgba(230,225,215,0.3) 0%, transparent 70%)',
            }} />

            {/* 小 z */}
            <div className="absolute right-[30%] top-[25%] flex flex-col gap-2">
              <span className="zz-float text-lg text-[#f0ddb3]/20" style={{ animationDelay: '0ms' }}>z</span>
              <span className="zz-float text-sm text-[#f0ddb3]/15" style={{ animationDelay: '800ms' }}>z</span>
              <span className="zz-float text-xs text-[#f0ddb3]/10" style={{ animationDelay: '1600ms' }}>z</span>
            </div>

            <div className="night-breathe flex flex-col items-center">
              {/* 小屋暖光 */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{
                background: 'radial-gradient(circle, rgba(250,224,156,0.25) 0%, transparent 70%)',
              }}>
                <span className="text-2xl">🏠</span>
              </div>

              <h2 className="closing-fade mt-8 text-xl font-semibold text-[#e8ddd0]">{t('closing.doneTitle')}</h2>
              <p className="closing-fade mt-3 whitespace-pre-line text-sm leading-7 text-[#e8ddd0]/45" style={{ animationDelay: '200ms' }}>
                {t('closing.doneBody', { name: spiritName })}
              </p>

              {hasWorry ? (
                <div className="closing-fade mt-5 rounded-[18px] bg-white/6 px-5 py-3" style={{ animationDelay: '400ms' }}>
                  <p className="text-sm leading-6 text-[#f0ddb3]/40">
                    {t('closing.worryNote', { name: spiritName })}
                  </p>
                </div>
              ) : null}

              <p className="closing-fade mt-6 text-base leading-7 text-[#f0ddb3]/50" style={{ animationDelay: '600ms' }}>
                {t('closing.putDown')}
              </p>
            </div>

            <SoftButton
              className="closing-fade mt-10"
              type="button"
              variant="primary"
              block
              style={{ animationDelay: '800ms' }}
              onClick={onComplete}
            >
              {tonightClosed ? t('closing.alreadyCta') : t('closing.readyCta')}
            </SoftButton>

            {tonightClosed ? (
              <p className="closing-fade mt-3 text-sm text-[#f0ddb3]/30" style={{ animationDelay: '1000ms' }}>
                {t('closing.alreadyNote')}
              </p>
            ) : null}
          </div>
        )}
      </section>
    </GameOverlay>
  )
}
