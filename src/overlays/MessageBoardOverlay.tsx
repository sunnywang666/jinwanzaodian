/**
 * MessageBoardOverlay.tsx — v6.41
 *
 * 留言板 = 铺子墙上的小黑板。来过的熟客各自在上面留下一句话（带头像 + 日期），
 * 体现"熟客越来越多、铺子有人情味"。**每位客人一句专属台词（按性格写死，互不相同）**，
 * 不再套同一句模板。日期：今天/昨天 用词，更早写具体「M月D日」。
 *
 * 为什么不用实时 LLM 生成：留言板要在离线演示里稳定出图，且每位客人的性格台词
 * 手写比通用 AI 文案更贴角色、更可控；要"活"的随机感由日期 + 按熟络度切换台词体现。
 */

import { GameOverlay } from '../components/GameOverlay'
import type { LogEntry } from '../lib/storage'
import type { AssetSource } from '../lib/assets'
import type { GuestProgressMap } from '../lib/guestProgression'
import { guestReferences as guests } from '../lib/guestReferences'
import { useT } from '../lib/i18n'

interface MessageBoardOverlayProps {
  guestProgress: GuestProgressMap
  logEntries: LogEntry[]
  onClose: () => void
}

interface BoardNote {
  text: string
  color: string
  image?: AssetSource
  time?: string
}

const noteColors = ['#fff5d8', '#f9efe6', '#e8f0df', '#fce8e2', '#e8eaf0', '#f0e8f4']
const noteRotations = [-1.2, 0.8, -0.6, 1.4, -0.3, 0.5, -0.9, 1.1]

/**
 * 每位客人的专属留言（第一人称、贴性格、互不相同）。
 * [生面孔时说的, 熟络后说的]；familiarityLevel>=2 用后一句。
 */
const GUEST_LINES: Record<string, { zh: [string, string]; en: [string, string] }> = {
  cat: {
    zh: ['门没开就先来蹲着了，台阶上的位子我占了。', '又是我第一个到。这家的油条，我等得起。'],
    en: ['Came before you opened and waited on the step — that spot is mine.', "First one here again. For this youtiao, I'll wait."],
  },
  rabbit: {
    zh: ['粥要等到不烫了才好喝，我不着急。', '今天你看着有点累，我多陪你坐了会儿。'],
    en: ["Porridge is best once it's cooled. I'm in no hurry.", 'You looked tired today, so I sat with you a while.'],
  },
  raccoon: {
    zh: ['手里得攥着豆浆杯才安心。', '今天试着空着手坐了一会儿，原来也挺好。'],
    en: ['I feel calmer holding the soy milk cup.', 'Tried sitting with empty hands today. Turns out it’s fine.'],
  },
  bear: {
    zh: ['把热包子焐在手里，暖气能多留一会儿。', '吃完没急着走，坐到太阳照进来，像家一样。'],
    en: ['Cupping the warm bun keeps the heat a little longer.', "Didn't rush off — sat till the sun came in. Felt like home."],
  },
  fox: {
    zh: ['看着精神，其实刚偷偷打了个哈欠。', '在这儿犯困也没人笑我，真好。'],
    en: ['I look alert, but I just snuck a yawn.', 'Nobody laughs if I get sleepy here. That’s nice.'],
  },
  sparrow: {
    zh: ['门口这个位子我记下了，随时能飞走。', '今天落在你手边了，没挑能逃走的地方。'],
    en: ['Memorized the seat by the door — ready to fly off.', "Landed by your hand today, didn't pick the escape spot."],
  },
  bird: {
    zh: ['不为早点，就为这屋子的安静来的。', '你还没开收音机，我先在老位子等着了。'],
    en: ["Not here for the food — for the quiet of this room.", "Before you turned on the radio, I waited in my spot."],
  },
  spirit1: {
    zh: ['靠着柜台发会儿呆，这里待着真舒服。', '在别处总怕自己太软，在你这儿不用。'],
    en: ['Leaning on the counter, zoning out. So cozy here.', 'Elsewhere I fear being too soft — not here.'],
  },
  spirit2: {
    zh: ['心里揣着点甜，遇到熟人才舍得拿出来。', '今天难得多说了两句，脸还有点热。'],
    en: ['I keep a little sweetness in, sharing it only with friends.', 'Said a bit more than usual today — cheeks still warm.'],
  },
  spirit3: {
    zh: ['滚进门撞到凳子也不疼，自己笑出了声。', '看你没精神，就滚到你脚边靠了一会儿。'],
    en: ['Rolled in, bumped a stool, didn’t hurt — laughed out loud.', 'You seemed low, so I rolled over and leaned a while.'],
  },
  spiritFamily1_1: {
    zh: ['踩着打烊点来的，就想在这儿坐到灯灭。', '忙了一整天，这儿是我收尾的地方。'],
    en: ['Came right at closing — just want to sit till the lights go out.', 'After a long day, this is where mine winds down.'],
  },
}

const FALLBACK_LINE = { zh: '今天也来坐了坐，谢谢这碗热乎的。', en: 'Stopped by again today. Thanks for the warm bite.' }

function lineFor(key: string, level: number, lang: string): string {
  const entry = GUEST_LINES[key]
  if (!entry) return lang === 'en' ? FALLBACK_LINE.en : FALLBACK_LINE.zh
  const pair = lang === 'en' ? entry.en : entry.zh
  return level >= 2 ? pair[1] : pair[0]
}

const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** 今天/昨天用词；更早写具体日期 */
function noteDate(dateStr: string | undefined, lang: string): string | undefined {
  if (!dateStr) return undefined
  const then = new Date(dateStr + 'T00:00:00')
  if (Number.isNaN(then.getTime())) return undefined
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.round((today.getTime() - then.getTime()) / 86_400_000)
  if (days <= 0) return lang === 'en' ? 'Today' : '今天'
  if (days === 1) return lang === 'en' ? 'Yesterday' : '昨天'
  return lang === 'en'
    ? `${EN_MONTHS[then.getMonth()]} ${then.getDate()}`
    : `${then.getMonth() + 1}月${then.getDate()}日`
}

function generateGuestNotes(guestProgress: GuestProgressMap, lang: string): BoardNote[] {
  const rows = guests
    .map((guest) => {
      const progress = guestProgress[guest.key]
      if (!progress || progress.totalVisits < 1) return null
      return { guest, progress }
    })
    .filter((r): r is { guest: typeof guests[number]; progress: GuestProgressMap[string] } => r !== null)
    // 按留言时间倒序：最新在上、越往下越旧（同一天再按熟络度），最多 7 条避免一墙
    .sort((a, b) =>
      (b.progress.lastVisitDate || '').localeCompare(a.progress.lastVisitDate || '')
      || b.progress.familiarityLevel - a.progress.familiarityLevel,
    )
    .slice(0, 7)

  return rows.map(({ guest, progress }, i) => ({
    text: lineFor(guest.key, progress.familiarityLevel, lang),
    color: noteColors[i % noteColors.length]!,
    image: guest.image,
    time: noteDate(progress.lastVisitDate, lang),
  }))
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
    .slice(0, 2)
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
    ? [{ text: 'Quiet morning light by the window. — The Shop', color: '#f9efe6' }, { text: "It's okay. See you tomorrow. — The Shop", color: '#e8f0df' }]
    : [{ text: '早上窗边的光很安静。——铺子', color: '#f9efe6' }, { text: '没关系，明天见。——铺子', color: '#e8f0df' }]

  const notes = allNotes.length > 0 ? allNotes : defaultNotes

  return (
    <GameOverlay title={t('messageBoard.title')} onClose={onClose}>
      <section className="flex h-full flex-col bg-[#4a4340] px-5 pt-[11dvh] overflow-y-auto pb-6">
        <div className="grid gap-4 pt-4">
          {notes.map((note, i) => (
            <article key={i} className="px-4 py-3 text-sm leading-6 text-ink/85"
              style={{ background: note.color, transform: `rotate(${noteRotations[i % noteRotations.length]}deg)`, boxShadow: '2px 3px 8px rgba(0,0,0,0.18)' }}>
              {note.image ? (
                <div className="flex items-center gap-3">
                  <img
                    src={note.image.src}
                    alt=""
                    className="h-12 w-12 shrink-0 object-contain"
                    // 拼贴风：沿剪影描一圈白边（多向白色 drop-shadow 叠出轮廓），不发光
                    style={{
                      filter:
                        'drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(1.5px 1.5px 0 #fff) drop-shadow(-1.5px 1.5px 0 #fff) drop-shadow(1.5px -1.5px 0 #fff) drop-shadow(-1.5px -1.5px 0 #fff)',
                    }}
                    onError={(e) => { if (note.image?.fallbackSrc) (e.target as HTMLImageElement).src = note.image.fallbackSrc }}
                  />
                  <div className="min-w-0 flex-1">
                    <p>{note.text}</p>
                    {note.time ? <p className="mt-1 text-xs text-ink/40">{note.time}</p> : null}
                  </div>
                </div>
              ) : (
                note.text
              )}
            </article>
          ))}
        </div>
      </section>
    </GameOverlay>
  )
}
