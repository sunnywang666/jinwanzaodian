/**
 * EveningPrepare.tsx — 傍晚预承诺（产品核心窗口）
 *
 * v6.22：
 * - 精灵问话按六型人格分流（evening.ask.{typeKey}），不再千人一句
 * - 卸心事 textarea 加字数提示 + 输入停顿自动保存草稿（防丢）
 * - 关灯时间默认高亮当前值；保存有更明确的反馈
 */

import { useState, useEffect, useRef } from 'react'
import type { EveningPrepareState, NightType } from '../lib/storage'
import { GameOverlay } from '../components/GameOverlay'
import { SoftButton } from '../components/SoftButton'
import { useT } from '../lib/i18n'

interface EveningPrepareProps {
  initialValue: EveningPrepareState
  spiritName: string
  /** 六型人格，用于个性化精灵问话 */
  nightType: NightType
  onSave: (value: EveningPrepareState) => void
  onGoToSpiritChat: () => void
  onClose: () => void
}

const timeOptions = ['22:30', '23:00', '23:30', '00:00']
const WORRY_MAX = 500

const nightTypeKeyMap: Record<string, string> = {
  '报复型': 'revenge', '惯性型': 'inertia', '焦虑型': 'anxiety',
  '工作型': 'work', '猫头鹰型': 'owl', '说不清': 'unsure',
}

export function EveningPrepare({ initialValue, spiritName, nightType, onSave, onGoToSpiritChat, onClose }: EveningPrepareProps) {
  const [plannedLightsOffTime, setPlannedLightsOffTime] = useState(initialValue.plannedLightsOffTime)
  const [worry, setWorry] = useState(initialValue.worry)
  const [savedAt, setSavedAt] = useState(initialValue.savedAt)
  const [justSaved, setJustSaved] = useState(false)
  const { t, lang } = useT()

  const typeKey = nightTypeKeyMap[nightType] ?? 'unsure'

  // 输入停顿后静默自动保存草稿，防止用户没点保存就退出导致心事丢失
  const firstRun = useRef(true)
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return }
    const id = window.setTimeout(() => {
      onSave({ plannedLightsOffTime, worry, savedAt })
    }, 700)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worry, plannedLightsOffTime])

  const handleSave = () => {
    const now = new Date().toISOString()
    setSavedAt(now)
    setJustSaved(true)
    onSave({ plannedLightsOffTime, worry, savedAt: now })
  }

  return (
    <GameOverlay title={t('evening.title')} onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-5 pb-6 pt-[11dvh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-ink">{t('evening.title')}</h2>
          <p className="mt-2 text-sm leading-6 text-ink/55">{t(`evening.ask.${typeKey}`, { name: spiritName })}</p>
        </div>

        <div className="mt-6">
          <p className="text-xs text-ink/40">{t('evening.lightsOffLabel')}</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {timeOptions.map((option) => (
              <button key={option} type="button"
                className={`rounded-full py-3 text-base font-semibold transition ${plannedLightsOffTime === option ? 'bg-butter/70 text-ink shadow-[0_2px_8px_rgba(212,165,116,0.35)]' : 'bg-white/35 text-ink/55'}`}
                onClick={() => { setPlannedLightsOffTime(option); setJustSaved(false) }}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-ink/40">{t('evening.worryLabel')}</p>
            <p className="text-[11px] tabular-nums text-ink/30">{worry.length}/{WORRY_MAX}</p>
          </div>
          <textarea value={worry} maxLength={WORRY_MAX} onChange={(e) => { setWorry(e.target.value); setJustSaved(false) }}
            className="mt-3 min-h-[100px] flex-1 resize-none rounded-[20px] bg-white/30 px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink/25 focus:bg-white/45"
            placeholder={t('evening.worryPlaceholder')} />
          <p className="mt-3 text-sm leading-6 text-ink/55">{t(`evening.method.${typeKey}`, { name: spiritName })}</p>
        </div>

        <div className="mt-4">
          <SoftButton type="button" variant="primary" block onClick={handleSave}>
            {justSaved ? t('common.saved') : t('evening.saveBtn')}
          </SoftButton>
          {justSaved ? (
            <div className="mt-3 flex flex-col items-center gap-2.5">
              <p className="text-sm font-medium text-[#7a9a6f]">{t('evening.savedMsg')}</p>
              {/* 保存后给两个明确出口：去和精灵聊聊（顺着心事给方法）/ 回铺子完成 */}
              <div className="flex w-full gap-2">
                <SoftButton type="button" variant="secondary" block onClick={onClose}>
                  {lang === 'en' ? 'Back to shop' : '回铺子'}
                </SoftButton>
                <SoftButton type="button" variant="primary" block onClick={onGoToSpiritChat}>
                  {lang === 'en' ? `Chat with ${spiritName}` : `和${spiritName}聊聊`}
                </SoftButton>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </GameOverlay>
  )
}
