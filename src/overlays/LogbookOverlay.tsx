/**
 * LogbookOverlay.tsx — v6.4
 * Added i18n via useT()
 */

import { useState } from 'react'
import type { LogEntry } from '../lib/storage'
import { GameOverlay } from '../components/GameOverlay'
import { PageTurnButton } from '../components/PageTurnButton'
import { useT } from '../lib/i18n'

interface LogbookOverlayProps {
  entries: LogEntry[]
  onClose: () => void
}

export function LogbookOverlay({ entries, onClose }: LogbookOverlayProps) {
  const [page, setPage] = useState(0)
  const { t } = useT()
  const pageCount = Math.ceil(entries.length / 3)
  const pageEntries = entries.slice(page * 3, page * 3 + 3)

  const worryLabels: Record<string, { text: string; color: string }> = {
    released: { text: t('logbook.worryReleased'), color: 'text-[#5a8a52]' },
    carrying: { text: t('logbook.worryCarrying'), color: 'text-[#b87a3a]' },
    pending: { text: t('logbook.worryPending'), color: 'text-ink/35' },
  }

  return (
    <GameOverlay title={t('logbook.title')} onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-4 pb-4 pt-[11dvh]">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
          {pageEntries.map((entry, index) => (
            <article key={entry.date + '-' + index}
              className={`px-4 py-3 ${index % 2 === 0 ? 'rotate-[-0.5deg]' : 'rotate-[0.4deg]'}`}
              style={{
                background: 'repeating-linear-gradient(transparent, transparent 27px, rgba(212,179,147,0.25) 27px, rgba(212,179,147,0.25) 28px)',
                borderBottom: '1px solid rgba(212,179,147,0.3)',
              }}>
              <p className="text-lg font-semibold text-ink">{entry.date}</p>
              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-sm leading-7 text-ink/70">
                <p>{t('logbook.openTime')}：{entry.openTime || '—'}</p>
                <p>{t('logbook.closeTime')}：{entry.closeTime}</p>
                <p>{t('logbook.status')}：{entry.shopMood}</p>
                <p>{t('logbook.guestCount')}：{entry.guestCount} {t('logbook.guestUnit')}</p>
              </div>
              {entry.worry ? (
                <div className="mt-3 rounded-[14px] bg-white/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink/40">{t('logbook.worryLabel')}</span>
                    {entry.worryStatus ? (
                      <span className={`text-[10px] font-medium ${worryLabels[entry.worryStatus]?.color ?? 'text-ink/35'}`}>
                        {worryLabels[entry.worryStatus]?.text ?? ''}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-ink/60">{entry.worry}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <PageTurnButton direction="prev" disabled={page === 0} onClick={() => setPage((c) => c - 1)} />
          <span className="text-xs text-ink/50">{page + 1} / {pageCount}</span>
          <PageTurnButton direction="next" disabled={page >= pageCount - 1} onClick={() => setPage((c) => c + 1)} />
        </div>
      </section>
    </GameOverlay>
  )
}
