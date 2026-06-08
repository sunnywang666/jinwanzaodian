/**
 * EveningPrepare.tsx — v5.9
 *
 * 保存后可选择"回去和精灵聊聊"（跳回 spiritChat）
 */

import { useState } from 'react'
import type { EveningPrepareState } from '../lib/storage'
import { GameOverlay } from '../components/GameOverlay'
import { SoftButton } from '../components/SoftButton'

interface EveningPrepareProps {
  initialValue: EveningPrepareState
  spiritName: string
  onSave: (value: EveningPrepareState) => void
  onGoToSpiritChat: () => void
  onClose: () => void
}

const timeOptions = ['22:30', '23:00', '23:30', '00:00']

export function EveningPrepare({ initialValue, spiritName, onSave, onGoToSpiritChat, onClose }: EveningPrepareProps) {
  const [plannedLightsOffTime, setPlannedLightsOffTime] = useState(initialValue.plannedLightsOffTime)
  const [worry, setWorry] = useState(initialValue.worry)
  const [saved, setSaved] = useState(false)

  return (
    <GameOverlay title="傍晚准备" onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-5 pb-6 pt-[11dvh]">

        {/* Spirit question */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-ink">先把今晚安排轻一点</h2>
          <p className="mt-2 text-sm leading-6 text-ink/55">
            {spiritName} 说：明天阿橘要来吃油条呢，今晚打算几点关灯歇着？
          </p>
        </div>

        {/* Time selection */}
        <div className="mt-6">
          <p className="text-xs text-ink/40">今晚关灯时间</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {timeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`rounded-full py-3 text-base font-semibold transition ${
                  plannedLightsOffTime === option
                    ? 'bg-butter/70 text-ink'
                    : 'bg-white/35 text-ink/55'
                }`}
                onClick={() => setPlannedLightsOffTime(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Worry input */}
        <div className="mt-6 flex min-h-0 flex-1 flex-col">
          <p className="text-xs text-ink/40">今晚放不下的事</p>
          <textarea
            value={worry}
            onChange={(event) => setWorry(event.target.value)}
            className="mt-3 min-h-[100px] flex-1 resize-none rounded-[20px] bg-white/30 px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-ink/25 focus:bg-white/45"
            placeholder="写下来就好，不用今晚全部解决。"
          />

          {/* Spirit response */}
          <p className="mt-3 text-sm leading-6 text-ink/50">
            {spiritName}：先把它写进明天的小纸条里，今晚不用一直放在脑子里。
          </p>
        </div>

        {/* Save */}
        <div className="mt-4">
          <SoftButton
            type="button"
            variant="primary"
            block
            onClick={() => {
              onSave({
                plannedLightsOffTime,
                worry,
                savedAt: new Date().toISOString(),
              })
              setSaved(true)
            }}
          >
            {saved ? '已保存' : '保存今晚安排'}
          </SoftButton>

          {saved ? (
            <div className="mt-3 text-center">
              <p className="text-sm text-brown/70">已经写进铺子的明日纸条里。</p>
              <button
                type="button"
                className="mt-2 text-sm text-brown/50 transition hover:text-brown/70"
                onClick={onGoToSpiritChat}
              >
                回去和 {spiritName} 聊聊 →
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </GameOverlay>
  )
}
