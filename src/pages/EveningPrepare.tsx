import { useEffect, useState } from 'react'
import type { EveningPrepareState } from '../lib/storage'
import { SoftButton } from '../components/SoftButton'

interface EveningPrepareProps {
  initialValue: EveningPrepareState
  spiritName: string
  onSave: (value: EveningPrepareState) => void
}

const timeOptions = ['22:30', '23:00', '23:30', '00:00']

export function EveningPrepare({ initialValue, spiritName, onSave }: EveningPrepareProps) {
  const [plannedLightsOffTime, setPlannedLightsOffTime] = useState(initialValue.plannedLightsOffTime)
  const [worry, setWorry] = useState(initialValue.worry)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setPlannedLightsOffTime(initialValue.plannedLightsOffTime)
    setWorry(initialValue.worry)
    setSaved(false)
  }, [initialValue])

  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div className="paper-panel px-4 py-4">
        <p className="paper-label">傍晚准备</p>
        <h2 className="mt-3 text-xl font-semibold text-ink">先把今晚安排轻一点</h2>
        <p className="mt-2 ink-note">
          {spiritName} 会在这一步陪你做预承诺。不是现在就睡，只是先把关灯时间和心事都安放好。
        </p>
      </div>

      <div className="mt-4 paper-panel px-4 py-4">
        <h3 className="ink-title">今晚关灯时间</h3>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {timeOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`rounded-[24px] border px-4 py-3 text-base font-semibold ${
                plannedLightsOffTime === option ? 'border-brown bg-butter text-ink' : 'border-line bg-white/80 text-ink/75'
              }`}
              onClick={() => setPlannedLightsOffTime(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col paper-panel px-4 py-4">
        <h3 className="ink-title">今晚放不下的事</h3>
        <textarea
          value={worry}
          onChange={(event) => setWorry(event.target.value)}
          className="mt-4 min-h-0 flex-1 resize-none rounded-[24px] border border-line bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-brown"
          placeholder="写下来就好，不用今晚全部解决。"
        />
        <div className="mt-4 rounded-[24px] bg-paper px-4 py-4 text-sm leading-6 text-ink/80">
          {spiritName} 的固定回复：先把它写进明天的小纸条里，今晚不用一直放在脑子里。
        </div>
        <SoftButton
          className="mt-4"
          type="button"
          variant="primary"
          onClick={() => {
            onSave({
              plannedLightsOffTime,
              worry,
              savedAt: new Date().toISOString(),
            })
            setSaved(true)
          }}
        >
          保存今晚安排
        </SoftButton>
        {saved ? <p className="mt-3 text-sm text-brown">已经写进铺子的明日纸条里。</p> : null}
      </div>
    </section>
  )
}
