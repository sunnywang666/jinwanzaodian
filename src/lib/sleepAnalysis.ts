/**
 * sleepAnalysis.ts — v6.33 (new)
 *
 * 把已经在记、却一直没被用过的数据真正用起来：
 *   - screenOffTimestamp（打烊后真正放下手机的时刻）
 *   - realOpenTimestamp（早上开门的时刻）
 *   - realCloseTimestamp（点打烊仪式的时刻）
 *   - nightWakes（夜里又把 App 唤到前台的次数）
 *
 * 产出"真正放下手机的时间 / 休息了多久 / 打烊后磨蹭多久 / 夜里醒几次 /
 * 规律性 / 趋势变好还是变差"等分析，并据此给出温柔的预警。
 *
 * 诚实的局限（务必守住产品口吻）：
 *   - "放下手机" = "离开了本 App"，不等于真睡着（可能去刷别的 App）。
 *   - 只用系统白送的"前台/后台"信号估算，绝不监测睡眠，绝不指责。
 *
 * 纯函数，无副作用，可单测。
 */

import type { LogEntry } from './storage'

// 合理休息时长边界：超出视为脏数据丢弃（避免时区/异常时间戳污染分析）
const MIN_REST_MIN = 90 // 1.5h
const MAX_REST_MIN = 16 * 60 // 16h

export interface NightSleep {
  /** 真正放下手机的时刻：screenOff 优先，退回打烊时刻 */
  putDownAt: Date
  /** 早上开门的时刻 */
  wokeAt: Date
  /** 估计休息时长（分钟） */
  restMinutes: number
  /** 打烊仪式 → 真正放下手机的延迟（分钟）；无 screenOff 数据时为 null */
  settleDelayMinutes: number | null
  /** 夜里又把 App 唤到前台的次数 */
  nightWakes: number
  /** 是否用上了真正的 screenOff（true）还是只能退回打烊时刻估算（false） */
  basedOnScreenOff: boolean
}

/** 把放下手机的时刻折算成"距 18:00 的分钟"，凌晨(0-11点)算次日 → 评夜里时间用的单调刻度 */
export function putDownScale(d: Date): number {
  const h = d.getHours()
  const hours = h < 12 ? h + 24 : h
  return (hours - 18) * 60 + d.getMinutes()
}

/** 把 putDownScale 的分钟值折回 "HH:MM" 文本 */
export function scaleToClock(scaleMin: number): string {
  let total = Math.round(scaleMin) + 18 * 60
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatClock(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function formatDuration(minutes: number, lang: 'zh' | 'en'): string {
  const safe = Math.max(0, Math.round(minutes))
  const h = Math.floor(safe / 60)
  const m = safe % 60
  if (lang === 'en') {
    if (h === 0) return `${m} min`
    if (m === 0) return `${h} h`
    return `${h} h ${m} min`
  }
  if (h === 0) return `${m} 分钟`
  if (m === 0) return `${h} 小时`
  return `${h} 小时 ${m} 分`
}

/** 分析单个夜晚；数据不全或不合理时返回 null（安全降级，调用方不显示即可） */
export function analyzeNight(entry: LogEntry | null | undefined): NightSleep | null {
  if (!entry) return null

  const wokeIso = entry.realOpenTimestamp
  const putDownIso = entry.screenOffTimestamp ?? entry.realCloseTimestamp
  if (!wokeIso || !putDownIso) return null

  const wokeAt = new Date(wokeIso)
  const putDownAt = new Date(putDownIso)
  const restMinutes = Math.round((wokeAt.getTime() - putDownAt.getTime()) / 60000)
  if (!Number.isFinite(restMinutes) || restMinutes < MIN_REST_MIN || restMinutes > MAX_REST_MIN) {
    return null
  }

  let settleDelayMinutes: number | null = null
  if (entry.screenOffTimestamp && entry.realCloseTimestamp) {
    const d = Math.round(
      (new Date(entry.screenOffTimestamp).getTime() - new Date(entry.realCloseTimestamp).getTime()) / 60000,
    )
    settleDelayMinutes = d >= 0 ? d : null
  }

  return {
    putDownAt,
    wokeAt,
    restMinutes,
    settleDelayMinutes,
    nightWakes: typeof entry.nightWakes === 'number' && entry.nightWakes > 0 ? entry.nightWakes : 0,
    basedOnScreenOff: Boolean(entry.screenOffTimestamp),
  }
}

export interface SleepSummary {
  /** 参与统计的有效夜晚数 */
  nights: number
  avgRestMinutes: number | null
  /** 平均放下手机时间（putDownScale 刻度，用 scaleToClock 转 HH:MM） */
  avgPutDownScale: number | null
  earliestPutDownScale: number | null
  latestPutDownScale: number | null
  avgSettleDelay: number | null
  /** 夜里拿起手机的总次数 */
  totalNightWakes: number
  /** 放下手机时间的离散度（分钟，约等于平均绝对偏差）：越小越规律 */
  consistencyMinutes: number | null
  /** 休息时长趋势：最近几晚均值 − 之前均值（正=最近休息更多） */
  restTrendMinutes: number | null
  /** 放下手机时间趋势：最近 − 之前（正=最近越来越晚） */
  putDownTrendMinutes: number | null
}

const EMPTY_SUMMARY: SleepSummary = {
  nights: 0,
  avgRestMinutes: null,
  avgPutDownScale: null,
  earliestPutDownScale: null,
  latestPutDownScale: null,
  avgSettleDelay: null,
  totalNightWakes: 0,
  consistencyMinutes: null,
  restTrendMinutes: null,
  putDownTrendMinutes: null,
}

function avg(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

/**
 * 汇总最近 maxNights 个有效夜晚。entries 约定为最新在前（与 LogEntry[] 一致）。
 */
export function summarizeNights(entries: LogEntry[], maxNights = 7): SleepSummary {
  const nights = entries
    .map((e) => analyzeNight(e))
    .filter((n): n is NightSleep => n !== null)
    .slice(0, maxNights)

  if (nights.length === 0) return { ...EMPTY_SUMMARY }

  const rests = nights.map((n) => n.restMinutes)
  const putDowns = nights.map((n) => putDownScale(n.putDownAt))
  const settles = nights.map((n) => n.settleDelayMinutes).filter((x): x is number => x !== null)
  const totalNightWakes = nights.reduce((s, n) => s + n.nightWakes, 0)

  const avgPutDownScale = avg(putDowns)
  const consistencyMinutes =
    putDowns.length >= 2 ? avg(putDowns.map((p) => Math.abs(p - avgPutDownScale))) : null

  // 趋势：最近一半 vs 之前一半（注意最新在前 → 取前段为"最近"）
  let restTrendMinutes: number | null = null
  let putDownTrendMinutes: number | null = null
  if (nights.length >= 4) {
    const half = Math.floor(nights.length / 2)
    const recentRest = avg(rests.slice(0, half))
    const olderRest = avg(rests.slice(half))
    restTrendMinutes = Math.round(recentRest - olderRest)

    const recentPD = avg(putDowns.slice(0, half))
    const olderPD = avg(putDowns.slice(half))
    putDownTrendMinutes = Math.round(recentPD - olderPD)
  }

  return {
    nights: nights.length,
    avgRestMinutes: Math.round(avg(rests)),
    avgPutDownScale,
    earliestPutDownScale: Math.min(...putDowns),
    latestPutDownScale: Math.max(...putDowns),
    avgSettleDelay: settles.length > 0 ? Math.round(avg(settles)) : null,
    totalNightWakes,
    consistencyMinutes: consistencyMinutes !== null ? Math.round(consistencyMinutes) : null,
    restTrendMinutes,
    putDownTrendMinutes,
  }
}

// ── 预警（温柔，绝不指责） ──

export type SleepWarningKind = 'restShort' | 'gettingLater' | 'restless' | 'settleSlow'

export interface SleepWarning {
  kind: SleepWarningKind
  /** 给文案用的变量（已格式化好的字符串） */
  data: Record<string, string>
}

// 触发阈值（保守，宁可不提醒也不误伤）
const REST_SHORT_MIN = 6 * 60 // 平均休息 < 6h
const GETTING_LATER_MIN = 30 // 放下手机时间比之前晚 30 分钟以上
const RESTLESS_AVG = 1.5 // 平均每晚拿起手机 ≥ 1.5 次
const SETTLE_SLOW_MIN = 45 // 打烊后平均还要 45 分钟以上才放下

// 展示优先级：越靠前越优先（清晨只展示最优先那条）
const PRIORITY: SleepWarningKind[] = ['restShort', 'restless', 'gettingLater', 'settleSlow']

/**
 * 基于汇总检测温柔预警。需至少 3 个有效夜晚才开始提醒，避免噪声。
 * lang 仅用于把数字格式化成时长文本。
 */
export function detectWarnings(summary: SleepSummary, lang: 'zh' | 'en'): SleepWarning[] {
  if (summary.nights < 3) return []
  const out: SleepWarning[] = []

  if (summary.avgRestMinutes !== null && summary.avgRestMinutes < REST_SHORT_MIN) {
    out.push({ kind: 'restShort', data: { dur: formatDuration(summary.avgRestMinutes, lang) } })
  }
  if (summary.totalNightWakes / summary.nights >= RESTLESS_AVG) {
    out.push({ kind: 'restless', data: { count: String(summary.totalNightWakes) } })
  }
  if (summary.putDownTrendMinutes !== null && summary.putDownTrendMinutes > GETTING_LATER_MIN) {
    out.push({ kind: 'gettingLater', data: { min: String(summary.putDownTrendMinutes) } })
  }
  if (summary.avgSettleDelay !== null && summary.avgSettleDelay > SETTLE_SLOW_MIN) {
    out.push({ kind: 'settleSlow', data: { min: String(summary.avgSettleDelay) } })
  }

  return out.sort((a, b) => PRIORITY.indexOf(a.kind) - PRIORITY.indexOf(b.kind))
}
