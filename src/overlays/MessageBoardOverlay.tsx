/**
 * MessageBoardOverlay.tsx — v6.4
 * Dynamic + i18n via useT()
 */

import { GameOverlay } from '../components/GameOverlay'
import type { LogEntry } from '../lib/storage'
import type { GuestProgressMap } from '../lib/guestProgression'
import { guests } from '../lib/demoData'
import { useT } from '../lib/i18n'

interface MessageBoardOverlayProps {
  guestProgress: GuestProgressMap
  logEntries: LogEntry[]
  onClose: () => void
}

interface BoardNote { text: string; color: string }

const noteColors = ['#fff5d8', '#f9efe6', '#e8f0df', '#fce8e2', '#e8eaf0', '#f0e8f4']
const noteRotations = [-1.2, 0.8, -0.6, 1.4, -0.3, 0.5, -0.9, 1.1]

function generateGuestNotes(guestProgress: GuestProgressMap, lang: string): BoardNote[] {
  const notes: BoardNote[] = []
  for (const guest of guests) {
    const progress = guestProgress[guest.key]
    if (!progress || progress.totalVisits < 1) continue
    const name = guest.name
    let text: string
    if (lang === 'en') {
      text = progress.totalVisits >= 5
        ? `${name}: I think I've found my usual spot.`
        : progress.totalVisits >= 3
          ? `${name}: The usual today. Just right.`
          : `${name}: First time here. A bit nervous, but it's warm.`
    } else {
      text = progress.totalVisits >= 5
        ? `${name}：我好像已经记住了自己的位子。`
        : progress.totalVisits >= 3
          ? `${name}：今天的${guest.favoriteFood}还是老样子，很好。`
          : `${name}：第一次来，有点紧张，但铺子很暖。`
    }
    notes.push({ text, color: noteColors[notes.length % noteColors.length] })
  }
  return notes
}

function generateShopNotes(logEntries: LogEntry[], lang: string): BoardNote[] {
  const notes: BoardNote[] = []
  const real = logEntries.filter(e => e.isRealData)
  if (real.length >= 7) {
    notes.push({ text: lang === 'en' ? 'The shop has been open for a whole week. Thank you, everyone. — The Shop' : '铺子已经开了一整周了，谢谢每一位来过的客人。——铺子', color: '#e8f0df' })
  } else if (real.length >= 3) {
    notes.push({ text: lang === 'en' ? 'Been open a few days now. The shop is warming up. — The Shop' : '开了好几天了，铺子慢慢热起来了。——铺子', color: '#e8f0df' })
  }
  return notes
}

function generateWorryNotes(logEntries: LogEntry[], lang: string): BoardNote[] {
  return logEntries
    .filter(e => e.worry && e.worryStatus === 'released')
    .slice(0, 3)
    .map(e => ({
      text: lang === 'en'
        ? `"${e.worry!.slice(0, 30)}${e.worry!.length > 30 ? '…' : ''}" — let go`
        : `"${e.worry!.slice(0, 30)}${e.worry!.length > 30 ? '…' : ''}" —— 已经放下了`,
      color: '#f0e8f4',
    }))
}

export function MessageBoardOverlay({ guestProgress, logEntries, onClose }: MessageBoardOverlayProps) {
  const { t, lang } = useT()
  const guestNotes = generateGuestNotes(guestProgress, lang)
  const shopNotes = generateShopNotes(logEntries, lang)
  const worryNotes = generateWorryNotes(logEntries, lang)
  const allNotes = [...guestNotes, ...shopNotes, ...worryNotes]

  const defaultNotes: BoardNote[] = lang === 'en'
    ? [{ text: 'The youtiao today was great. — Ginger', color: '#fff5d8' }, { text: 'The morning light by the window is so quiet. — Blue', color: '#f9efe6' }, { text: 'It\'s okay. See you tomorrow. — The Shop', color: '#e8f0df' }]
    : [{ text: '今天的油条很好吃。——阿橘', color: '#fff5d8' }, { text: '早上窗边的光很安静。——蓝蓝', color: '#f9efe6' }, { text: '没关系，明天见。——铺子', color: '#e8f0df' }]

  const notes = allNotes.length > 0 ? allNotes : defaultNotes

  return (
    <GameOverlay title={t('messageBoard.title')} onClose={onClose}>
      <section className="flex h-full flex-col bg-[#4a4340] px-5 pt-[11dvh] overflow-y-auto pb-6">
        <div className="grid gap-4 pt-4">
          {notes.map((note, i) => (
            <article key={i} className="px-5 py-4 text-sm leading-6 text-ink/85"
              style={{ background: note.color, transform: `rotate(${noteRotations[i % noteRotations.length]}deg)`, boxShadow: '2px 3px 8px rgba(0,0,0,0.18)' }}>
              {note.text}
            </article>
          ))}
        </div>
      </section>
    </GameOverlay>
  )
}
