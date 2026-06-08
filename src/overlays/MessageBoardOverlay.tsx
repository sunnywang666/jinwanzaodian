/**
 * MessageBoardOverlay.tsx — v6.1
 *
 * Dynamic message board:
 * - Guest messages based on guestProgress (visited guests leave notes)
 * - Shop announcements based on logEntries (milestones)
 * - Released worries become warm "已释怀" notes
 * - Static fallback notes for empty state
 */

import { GameOverlay } from '../components/GameOverlay'
import type { LogEntry } from '../lib/storage'
import type { GuestProgressMap } from '../lib/guestProgression'
import { guests } from '../lib/demoData'

interface MessageBoardOverlayProps {
  guestProgress: GuestProgressMap
  logEntries: LogEntry[]
  onClose: () => void
}

interface BoardNote {
  text: string
  color: string
}

const noteColors = ['#fff5d8', '#f9efe6', '#e8f0df', '#fce8e2', '#e8eaf0', '#f0e8f4']
const noteRotations = [-1.2, 0.8, -0.6, 1.4, -0.3, 0.5, -0.9, 1.1]

/** 根据客人来访情况生成留言 */
function generateGuestNotes(guestProgress: GuestProgressMap): BoardNote[] {
  const notes: BoardNote[] = []

  for (const guest of guests) {
    const progress = guestProgress[guest.key]
    if (!progress || progress.totalVisits < 1) continue

    if (progress.totalVisits >= 5) {
      notes.push({
        text: `${guest.name}：我好像已经记住了自己的位子。`,
        color: noteColors[notes.length % noteColors.length],
      })
    } else if (progress.totalVisits >= 3) {
      notes.push({
        text: `${guest.name}：今天的${guest.favoriteFood}还是老样子，很好。`,
        color: noteColors[notes.length % noteColors.length],
      })
    } else {
      notes.push({
        text: `${guest.name}：第一次来，有点紧张，但铺子很暖。`,
        color: noteColors[notes.length % noteColors.length],
      })
    }
  }

  return notes
}

/** 根据日志生成铺子公告 */
function generateShopNotes(logEntries: LogEntry[]): BoardNote[] {
  const notes: BoardNote[] = []
  const realEntries = logEntries.filter(e => e.isRealData)

  if (realEntries.length >= 7) {
    notes.push({
      text: '铺子已经开了一整周了，谢谢每一位来过的客人。——铺子',
      color: '#e8f0df',
    })
  } else if (realEntries.length >= 3) {
    notes.push({
      text: '开了好几天了，铺子慢慢热起来了。——铺子',
      color: '#e8f0df',
    })
  }

  const goodNights = realEntries.filter(e => {
    if (!e.realCloseTimestamp) return false
    const h = new Date(e.realCloseTimestamp).getHours()
    return h < 24 && h >= 20
  }).length

  if (goodNights >= 3) {
    notes.push({
      text: `连续好几晚都按时关了灯，明天的豆浆会格外香。——铺子`,
      color: '#fff5d8',
    })
  }

  return notes
}

/** 已释怀的心事变成温暖纸条 */
function generateWorryNotes(logEntries: LogEntry[]): BoardNote[] {
  return logEntries
    .filter(e => e.worry && e.worryStatus === 'released')
    .slice(0, 3)
    .map(e => ({
      text: `"${e.worry!.slice(0, 30)}${e.worry!.length > 30 ? '…' : ''}" —— 已经放下了`,
      color: '#f0e8f4',
    }))
}

/** 空状态下的默认留言 */
const defaultNotes: BoardNote[] = [
  { text: '今天的油条很好吃。——阿橘', color: '#fff5d8' },
  { text: '早上窗边的光很安静。——蓝蓝', color: '#f9efe6' },
  { text: '没关系，明天见。——铺子', color: '#e8f0df' },
]

export function MessageBoardOverlay({ guestProgress, logEntries, onClose }: MessageBoardOverlayProps) {
  const guestNotes = generateGuestNotes(guestProgress)
  const shopNotes = generateShopNotes(logEntries)
  const worryNotes = generateWorryNotes(logEntries)

  const allNotes = [...guestNotes, ...shopNotes, ...worryNotes]
  const notes = allNotes.length > 0 ? allNotes : defaultNotes

  return (
    <GameOverlay title="留言板" onClose={onClose}>
      <section className="flex h-full flex-col bg-[#4a4340] px-5 pt-[11dvh] overflow-y-auto pb-6">
        <div className="grid gap-4 pt-4">
          {notes.map((note, index) => (
            <article
              key={index}
              className="px-5 py-4 text-sm leading-6 text-ink/85"
              style={{
                background: note.color,
                transform: `rotate(${noteRotations[index % noteRotations.length]}deg)`,
                boxShadow: '2px 3px 8px rgba(0,0,0,0.18)',
              }}
            >
              {note.text}
            </article>
          ))}
        </div>
      </section>
    </GameOverlay>
  )
}
