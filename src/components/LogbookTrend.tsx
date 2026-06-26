/**
 * LogbookTrend.tsx — v6.33
 *
 * Hand-drawn style SVG trend chart for the logbook.
 * Shows recent close times as a wobbly line chart with spirit commentary.
 * v6.33: adds a detailed sleep-insight card (real put-down time, rest duration,
 * consistency, night pickups, trend) + gentle warnings, gated by showSleep.
 */

import type { LogEntry } from '../lib/storage'
import { formatEntryDate } from '../lib/storage'
import { useT, type Lang } from '../lib/i18n'
import { summarizeNights, detectWarnings, scaleToClock, formatDuration } from '../lib/sleepAnalysis'

interface LogbookTrendProps {
  entries: LogEntry[]
  spiritName: string
  /** 是否展示睡眠洞察卡（设置里的开关） */
  showSleep?: boolean
}

/* ── 睡眠洞察卡：把放下手机时间/休息时长/规律/趋势/夜醒拢成一块 ── */
function SleepInsightCard({
  entries,
  spiritName,
  t,
  lang,
}: {
  entries: LogEntry[]
  spiritName: string
  t: (key: string, vars?: Record<string, string>) => string
  lang: Lang
}) {
  const summary = summarizeNights(entries)

  if (summary.nights === 0) {
    return (
      <div className="rounded-[18px] bg-white/20 px-4 py-3">
        <p className="text-xs leading-6 text-ink/40">{t('sleep.needMore')}</p>
      </div>
    )
  }

  const warnings = detectWarnings(summary, lang)

  let trendText = t('sleep.trendSteady')
  if (summary.restTrendMinutes !== null && Math.abs(summary.restTrendMinutes) >= 20) {
    trendText =
      summary.restTrendMinutes > 0
        ? t('sleep.trendMoreRest', { min: String(Math.abs(summary.restTrendMinutes)) })
        : t('sleep.trendLessRest', { min: String(Math.abs(summary.restTrendMinutes)) })
  } else if (summary.putDownTrendMinutes !== null && Math.abs(summary.putDownTrendMinutes) >= 20) {
    trendText = summary.putDownTrendMinutes > 0 ? t('sleep.trendLater') : t('sleep.trendEarlier')
  }

  const stats: Array<{ label: string; value: string }> = [
    {
      label: t('sleep.avgPutDown'),
      value: summary.avgPutDownScale !== null ? scaleToClock(summary.avgPutDownScale) : '—',
    },
    {
      label: t('sleep.avgRest'),
      value: summary.avgRestMinutes !== null ? formatDuration(summary.avgRestMinutes, lang) : '—',
    },
    {
      label: t('sleep.consistency'),
      value:
        summary.consistencyMinutes !== null
          ? t('sleep.consistencyValue', { min: String(summary.consistencyMinutes) })
          : '—',
    },
    {
      label: t('sleep.nightWakesLabel'),
      value: t('sleep.nightWakesValue', { count: String(summary.totalNightWakes) }),
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-[18px] bg-white/25 px-4 py-4">
        <p className="mb-3 px-1 text-xs font-medium text-ink/45">{t('sleep.insightTitle')}</p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[14px] bg-white/30 px-3 py-2.5">
              <p className="text-[11px] leading-4 text-ink/40">{s.label}</p>
              <p className="mt-1 text-base font-semibold text-ink/75">{s.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 px-1 text-xs leading-6 text-ink/50">{trendText}</p>
        <p className="mt-2 px-1 text-[10px] leading-5 text-ink/30">{t('sleep.basedOnNote')}</p>
      </div>

      {warnings.map((w) => (
        <div key={w.kind} className="rounded-[18px] bg-[#d4a574]/14 px-4 py-3">
          <p className="text-sm leading-6 text-[#8a614a]">
            {t(`sleep.warn.${w.kind}`, { name: spiritName, ...w.data })}
          </p>
        </div>
      ))}
    </div>
  )
}

/* ── Parse "HH:MM" to minutes since 20:00 (for chart Y-axis) ── */
function parseCloseMinutes(time: string): number | null {
  const parts = time.split(':')
  if (parts.length !== 2) return null
  let h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (isNaN(h) || isNaN(m)) return null
  // Treat 0:00-5:00 as next day (24-29 range)
  if (h < 6) h += 24
  return (h - 20) * 60 + m // minutes since 20:00
}

/* ── Add hand-drawn wobble to a path ── */
function wobblePath(points: { x: number; y: number }[], seed: number): string {
  if (points.length < 2) return ''
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const midX = (prev.x + curr.x) / 2
    const wobbleY = Math.sin(seed + i * 2.7) * 2.5
    d += ` Q ${midX} ${(prev.y + curr.y) / 2 + wobbleY}, ${curr.x} ${curr.y}`
  }
  return d
}

/* ── Spirit commentary based on data ── */
function getCommentary(
  t: (key: string, vars?: Record<string, string>) => string,
  lang: string,
  entries: LogEntry[],
  spiritName: string,
): string {
  const validEntries = entries.filter(e => e.closeTime && parseCloseMinutes(e.closeTime) !== null)
  if (validEntries.length < 3) {
    return lang === 'en'
      ? `${spiritName}: Keep going — a few more nights and we'll see the pattern.`
      : `${spiritName}：再坚持几天，铺子就能看出你的节奏了。`
  }

  const minutes = validEntries.map(e => parseCloseMinutes(e.closeTime)!).slice(0, 7)
  const avg = minutes.reduce((a, b) => a + b, 0) / minutes.length
  const avgHour = Math.floor(avg / 60) + 20
  const latest = Math.max(...minutes)
  const earliest = Math.min(...minutes)
  const recentTrend = minutes.length >= 3 ? minutes[0] - minutes[minutes.length - 1] : 0

  // Find consecutive early nights (close before 23:30 = 210min since 20:00)
  let earlyStreak = 0
  for (const m of minutes) {
    if (m <= 210) earlyStreak++
    else break
  }

  if (earlyStreak >= 5) {
    return lang === 'en'
      ? `${spiritName}: Five early nights in a row. The shop is in great shape.`
      : `${spiritName}：连着五晚早关灯了，铺子状态真不错。`
  }

  if (earlyStreak >= 3) {
    return lang === 'en'
      ? `${spiritName}: Three good nights — the rhythm is forming.`
      : `${spiritName}：连着三天早关灯，节奏慢慢有了。`
  }

  if (recentTrend < -30) {
    return lang === 'en'
      ? `${spiritName}: You've been closing earlier lately. That's nice.`
      : `${spiritName}：最近关灯越来越早了，感觉挺好的。`
  }

  if (recentTrend > 30) {
    return lang === 'en'
      ? `${spiritName}: Closing a bit later recently — but no rush, take your time.`
      : `${spiritName}：最近关灯稍晚了一点——不急，慢慢来。`
  }

  // 按周几找"总比别的天晚"的规律（需 realCloseTimestamp 才能知道是周几）
  const byWeekday: Record<number, number[]> = {}
  for (const entry of validEntries.slice(0, 14)) {
    if (!entry.realCloseTimestamp) continue
    const mins = parseCloseMinutes(entry.closeTime)
    if (mins === null) continue
    const wd = new Date(entry.realCloseTimestamp).getDay()
    ;(byWeekday[wd] ??= []).push(mins)
  }
  let latestWd = -1
  let latestWdAvg = -Infinity
  for (const [wd, arr] of Object.entries(byWeekday)) {
    if (arr.length < 2) continue
    const a = arr.reduce((x, y) => x + y, 0) / arr.length
    if (a > latestWdAvg) { latestWdAvg = a; latestWd = Number(wd) }
  }
  // 只有当某个周几明显（>35 分钟）晚于整体均值时才提，避免噪声
  if (latestWd >= 0 && latestWdAvg - avg > 35) {
    const zhDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const enDays = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']
    return lang === 'en'
      ? `${spiritName}: You tend to close later on ${enDays[latestWd]} — anything regular happening then?`
      : `${spiritName}：你${zhDays[latestWd]}总比别的天晚一些，是不是那天有什么固定的事？`
  }

  if (avgHour >= 24) {
    return lang === 'en'
      ? `${spiritName}: Average close time is past midnight — maybe we can nudge it a bit earlier?`
      : `${spiritName}：平均关灯过了零点，试试能不能再提前一点点？`
  }

  return lang === 'en'
    ? `${spiritName}: The shop's rhythm has been steady. Keep it up.`
    : `${spiritName}：铺子的节奏挺稳的，继续就好。`
}

/* ── Chart component ── */

export function LogbookTrend({ entries, spiritName, showSleep = true }: LogbookTrendProps) {
  const { t, lang } = useT()

  const sleepCard = showSleep ? (
    <SleepInsightCard entries={entries} spiritName={spiritName} t={t} lang={lang} />
  ) : null

  const validEntries = entries
    .filter(e => e.closeTime && parseCloseMinutes(e.closeTime) !== null)
    .slice(0, 10)
    .reverse() // oldest first for left-to-right

  if (validEntries.length < 2) {
    return (
      <div className="flex flex-col gap-3">
        {sleepCard}
        <div className="rounded-[18px] bg-white/25 px-4 py-5 text-center">
          <p className="text-sm text-ink/40">
            {lang === 'en'
              ? 'Close the shop a few more nights to see the trend chart.'
              : '再多关几天灯，趋势图就出来了。'}
          </p>
        </div>
      </div>
    )
  }

  const commentary = getCommentary(t, lang, entries, spiritName)

  // Chart dimensions
  const W = 320, H = 140
  const padL = 38, padR = 12, padT = 16, padB = 24
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  // Y range: 20:00 (0min) to 02:00 (360min)
  const yMin = 0, yMax = 360
  const minutesList = validEntries.map(e => parseCloseMinutes(e.closeTime)!)

  function toY(mins: number) {
    // Invert: earlier time = higher on chart (better)
    return padT + chartH - ((mins - yMin) / (yMax - yMin)) * chartH
  }

  function toX(i: number) {
    return padL + (i / (validEntries.length - 1)) * chartW
  }

  const points = minutesList.map((m, i) => ({ x: toX(i), y: toY(m) }))
  const linePath = wobblePath(points, 42)

  // Grid lines at 21:00, 22:00, 23:00, 00:00, 01:00
  const gridHours = [21, 22, 23, 24, 25]
  const gridLabels = ['21:00', '22:00', '23:00', '0:00', '1:00']

  // Average line
  const avgMin = minutesList.reduce((a, b) => a + b, 0) / minutesList.length
  const avgY = toY(avgMin)
  const avgHour = Math.floor((avgMin + 20 * 60) / 60) % 24
  const avgMinRemainder = Math.round(avgMin % 60)
  const avgLabel = `${String(avgHour).padStart(2, '0')}:${String(avgMinRemainder).padStart(2, '0')}`

  return (
    <div className="flex flex-col gap-3">
      {sleepCard}
      {/* Chart */}
      <div className="rounded-[18px] bg-white/25 px-3 py-4">
        <p className="mb-2 px-1 text-xs font-medium text-ink/45">
          {lang === 'en' ? 'Recent close times' : '近期关灯时间'}
        </p>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 160 }}>
          {/* Grid lines - slightly hand-drawn */}
          {gridHours.map((hour, i) => {
            const mins = (hour - 20) * 60
            const y = toY(mins)
            // Subtle wobble for hand-drawn feel
            const wobble = `M ${padL} ${y + Math.sin(i) * 0.8} Q ${W / 2} ${y + Math.cos(i * 1.5) * 1.2}, ${W - padR} ${y + Math.sin(i + 1) * 0.6}`
            return (
              <g key={hour}>
                <path d={wobble} fill="none" stroke="rgba(78,64,55,0.06)" strokeWidth="1" />
                <text x={padL - 4} y={y + 3.5} textAnchor="end" fontSize="8" fill="rgba(78,64,55,0.3)" fontFamily="system-ui">
                  {gridLabels[i]}
                </text>
              </g>
            )
          })}

          {/* Average line */}
          <line
            x1={padL} y1={avgY} x2={W - padR} y2={avgY}
            stroke="rgba(212,165,116,0.35)" strokeWidth="1" strokeDasharray="4 3"
          />
          <text x={W - padR + 2} y={avgY + 3} fontSize="7" fill="rgba(212,165,116,0.6)" fontFamily="system-ui">
            {lang === 'en' ? 'avg' : '均'} {avgLabel}
          </text>

          {/* Data line - hand-drawn style */}
          <path
            d={linePath}
            fill="none"
            stroke="rgba(138,97,74,0.55)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3.5" fill="#f5ead8" stroke="rgba(138,97,74,0.6)" strokeWidth="1.5" />
              {/* Date label on x-axis */}
              <text x={p.x} y={H - 4} textAnchor="middle" fontSize="7" fill="rgba(78,64,55,0.3)" fontFamily="system-ui">
                {formatEntryDate(validEntries[i], lang)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Spirit commentary */}
      <div className="rounded-[18px] bg-white/20 px-4 py-3">
        <p className="text-sm leading-6 text-ink/55" style={{ fontStyle: 'italic' }}>
          {commentary}
        </p>
      </div>
    </div>
  )
}
