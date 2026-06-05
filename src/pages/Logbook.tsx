import { useState } from 'react'
import type { LogEntry } from '../lib/storage'

interface LogbookProps {
  entries: LogEntry[]
  spiritName: string
}

function clampPage(page: number, pageCount: number) {
  return Math.max(0, Math.min(page, pageCount - 1))
}

export function Logbook({ entries, spiritName }: LogbookProps) {
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(entries.length / 3)
  const pageEntries = entries.slice(page * 3, page * 3 + 3)
  const lateEntry = entries.reduce((latest, entry) => (entry.closeTime > latest.closeTime ? entry : latest), entries[0])

  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="paper-label">手写账本</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">最近七天</h1>
        </div>
        <p className="paper-label">
          {page + 1} / {pageCount}
        </p>
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col rounded-[30px] border border-line bg-[#f8ecd8] p-4 shadow-sm">
        <div className="grid gap-3">
          {pageEntries.map((entry) => (
            <article key={entry.date} className="rotate-[-0.3deg] rounded-[24px] border border-line bg-paper px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-ink">{entry.date}</h2>
                <span className="paper-label">{entry.shopMood}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm leading-5 text-ink/75">
                <p>开门：{entry.openTime}</p>
                <p>关灯：{entry.closeTime}</p>
                <p>状态：{entry.shopMood}</p>
                <p>客人：{entry.guestCount} 位</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-auto rounded-[24px] bg-white/70 px-4 py-4 text-sm leading-6 text-ink/75">
          {spiritName}：{lateEntry.date} 关灯最晚。不是批注，只是提醒你看看那天是不是有什么事把夜晚拖长了。
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-[24px] border border-line bg-white/80 px-4 py-3 text-sm text-ink disabled:opacity-40"
          disabled={page === 0}
          onClick={() => setPage((current) => clampPage(current - 1, pageCount))}
        >
          上一页
        </button>
        <button
          type="button"
          className="rounded-[24px] border border-line bg-white/80 px-4 py-3 text-sm text-ink disabled:opacity-40"
          disabled={page === pageCount - 1}
          onClick={() => setPage((current) => clampPage(current + 1, pageCount))}
        >
          下一页
        </button>
      </div>
    </section>
  )
}
