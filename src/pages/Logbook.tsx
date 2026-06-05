import type { LogEntry } from '../lib/storage'

interface LogbookProps {
  entries: LogEntry[]
  spiritName: string
}

export function Logbook({ entries, spiritName }: LogbookProps) {
  const lateEntry = entries.reduce((latest, entry) =>
    entry.closeTime > latest.closeTime ? entry : latest,
  entries[0])

  return (
    <div className="space-y-4">
      <section className="paper-panel px-4 py-4">
        <p className="paper-label">营业日志</p>
        <h2 className="mt-3 text-xl font-semibold text-ink">最近七天的手写账本</h2>
        <p className="mt-2 ink-note">
          不做科技仪表盘，只把开门、关灯、铺子状态和客人数记成一页页纸片。翻回去时，变化会自己浮出来。
        </p>
      </section>

      <section className="paper-dashed p-4">
        <p className="text-sm leading-6 text-ink/80">
          {spiritName} 的温柔解读：这几天里，{lateEntry.date} 关灯最晚。不是批注，只是提醒你看看那天是不是有固定的事把夜晚拖长了。
        </p>
      </section>

      <div className="space-y-3">
        {entries.map((entry) => (
          <article key={entry.date} className="paper-panel px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-ink">{entry.date}</h3>
              <span className="paper-label">{entry.shopMood}</span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-ink/80">
              <div className="rounded-3xl bg-paper px-3 py-3">
                <dt className="text-xs tracking-[0.08em] text-brown">开门时间</dt>
                <dd className="mt-2 text-base text-ink">{entry.openTime}</dd>
              </div>
              <div className="rounded-3xl bg-paper px-3 py-3">
                <dt className="text-xs tracking-[0.08em] text-brown">关灯时间</dt>
                <dd className="mt-2 text-base text-ink">{entry.closeTime}</dd>
              </div>
              <div className="rounded-3xl bg-paper px-3 py-3">
                <dt className="text-xs tracking-[0.08em] text-brown">铺子状态</dt>
                <dd className="mt-2 text-base text-ink">{entry.shopMood}</dd>
              </div>
              <div className="rounded-3xl bg-paper px-3 py-3">
                <dt className="text-xs tracking-[0.08em] text-brown">客人数</dt>
                <dd className="mt-2 text-base text-ink">{entry.guestCount}</dd>
              </div>
            </dl>

            <p className="mt-4 rounded-3xl bg-cream px-3 py-3 text-sm text-ink/75">{entry.closingNote}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
