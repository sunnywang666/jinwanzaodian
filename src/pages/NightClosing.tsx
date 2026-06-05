import type { LogEntry } from '../lib/storage'
import { SoftButton } from '../components/SoftButton'

interface NightClosingProps {
  spiritName: string
  tonightClosed: boolean
  onComplete: () => void
  latestLog: LogEntry
}

const steps = [
  'Step 1 关掉柜台小灯',
  'Step 2 拉下小卷帘',
  'Step 3 面点精灵回小屋睡',
  'Step 4 铺子睡了，把手机也放下吧',
]

export function NightClosing({ spiritName, tonightClosed, onComplete, latestLog }: NightClosingProps) {
  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div className="paper-panel px-4 py-4">
        <p className="paper-label">夜晚打烊</p>
        <h2 className="mt-3 text-xl font-semibold text-ink">铺子要关灯歇业了</h2>
        <p className="mt-2 ink-note">
          主语一直是铺子。你只是把它收好，再把手机放下。{spiritName} 会在第三步回到小屋里。
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        {steps.map((step) => (
          <div key={step} className="paper-panel px-4 py-4">
            <p className="text-base text-ink">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto paper-dashed p-4">
        <p className="text-sm leading-6 text-ink/80">
          最近一条账本会被更新成：{latestLog.date}，关灯时间写成你完成打烊的这一刻，铺子状态切到安静，客人数保留原样。
        </p>
      </div>

      <SoftButton className="mt-4" type="button" variant="primary" block onClick={onComplete}>
        我准备放下手机了
      </SoftButton>

      {tonightClosed ? (
        <p className="text-center text-sm text-brown">今晚已经记录为熄灯状态，回铺子会看到安静的夜景。</p>
      ) : null}
    </section>
  )
}
