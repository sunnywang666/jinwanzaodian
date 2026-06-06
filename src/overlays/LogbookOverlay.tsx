import { useState } from 'react'
import type { LogEntry } from '../lib/storage'
import { GameOverlay } from '../components/GameOverlay'
import { PageTurnButton } from '../components/PageTurnButton'

interface LogbookOverlayProps {
  entries: LogEntry[]
  onClose: () => void
}

export function LogbookOverlay({ entries, onClose }: LogbookOverlayProps) {
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(entries.length / 3)
  const pageEntries = entries.slice(page * 3, page * 3 + 3)

  return (
    <GameOverlay title="营业账本" onClose={onClose}>
      <section className="flex h-full flex-col px-4 py-4">
        <div className="min-h-0 flex-1 rounded-[30px] border border-line bg-[#f8ecd8] px-4 py-4">
          <div className="grid gap-3">
            {pageEntries.map((entry, index) => (
              <article
                key={entry.date}
                className={`rounded-[24px] border border-line bg-paper px-4 py-3 ${index % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.4deg]'}`}
              >
                <p className="text-lg font-semibold text-ink">{entry.date}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm leading-5 text-ink/75">
                  <p>开门：{entry.openTime}</p>
                  <p>关灯：{entry.closeTime}</p>
                  <p>状态：{entry.shopMood}</p>
                  <p>客人：{entry.guestCount} 位</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-4 rounded-[22px] bg-white/75 px-4 py-4 text-sm leading-6 text-ink/75">
            这周你有两天很早关灯，铺子也跟着精神了一点。
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <PageTurnButton direction="prev" disabled={page === 0} onClick={() => setPage((current) => current - 1)} />
          <span className="paper-label">
            {page + 1} / {pageCount}
          </span>
          <PageTurnButton
            direction="next"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((current) => current + 1)}
          />
        </div>
      </section>
    </GameOverlay>
  )
}
