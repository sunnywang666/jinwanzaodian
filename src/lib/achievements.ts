/**
 * achievements.ts — v6.35 (new)
 *
 * 成就：从已有数据（累计早睡、客人、菜品、皮肤、睡眠记录）纯计算出来，
 * 不额外存状态。每条成就 = { key, current, goal }，unlocked = current >= goal。
 * 文案（名字/描述）走 i18n：achievements.{key}.title / .desc。
 *
 * 守产品口吻：成就是"回看走了多远"的温柔记录，不是 KPI、不催、不羞辱。
 */

import type { LogEntry } from './storage'
import { analyzeNight, putDownScale } from './sleepAnalysis'

export interface AchievementInput {
  /** 累计熄屏早睡的夜晚 */
  goodNights: number
  /** 已解锁皮肤数 / 皮肤总数 */
  skinsUnlocked: number
  totalSkins: number
  /** 认识的客人数 / 客人总数 */
  guestsMet: number
  totalGuests: number
  /** 会做的菜数 / 菜总数 */
  dishesMade: number
  totalDishes: number
  /** 最长一觉（分钟），无数据为 0 */
  longestRestMinutes: number
  /** 最早放下手机的刻度（putDownScale，越小越早），无数据为 null */
  earliestPutDownScale: number | null
}

export interface Achievement {
  key: string
  current: number
  goal: number
  unlocked: boolean
  /** 仅用于展示进度文本；boolean 型成就为 true 时隐藏数字 */
  boolean?: boolean
}

// 23:00 在 putDownScale 上的刻度：(23-18)*60 = 300
const BY_ELEVEN = 300

/** 从原始数据算出成就列表（固定顺序：早睡阶梯 → 收集 → 睡眠质量） */
export function computeAchievements(input: AchievementInput): Achievement[] {
  const earlyDownHit = input.earliestPutDownScale !== null && input.earliestPutDownScale <= BY_ELEVEN

  const raw: Array<Omit<Achievement, 'unlocked'>> = [
    { key: 'firstNight', current: input.goodNights, goal: 1 },
    { key: 'weekEarly', current: input.goodNights, goal: 7 },
    { key: 'monthEarly', current: input.goodNights, goal: 30 },
    { key: 'hundredNights', current: input.goodNights, goal: 100 },
    { key: 'firstGuest', current: input.guestsMet, goal: 1 },
    { key: 'allGuests', current: input.guestsMet, goal: Math.max(1, input.totalGuests) },
    { key: 'firstDish', current: input.dishesMade, goal: 1 },
    { key: 'fullMenu', current: input.dishesMade, goal: Math.max(1, input.totalDishes) },
    { key: 'collector', current: input.skinsUnlocked, goal: Math.max(1, input.totalSkins) },
    { key: 'soundSleep', current: input.longestRestMinutes, goal: 480 }, // 一觉睡满 8 小时
    { key: 'earlyDown', current: earlyDownHit ? 1 : 0, goal: 1, boolean: true },
  ]

  return raw.map((a) => ({ ...a, unlocked: a.current >= a.goal }))
}

/** 已解锁成就数 / 总数 */
export function achievementProgress(list: Achievement[]): { unlocked: number; total: number } {
  return { unlocked: list.filter((a) => a.unlocked).length, total: list.length }
}

/** 从历史记录算"最长一觉"（分钟）与"最早放下手机"刻度，喂给成就 */
export function sleepRecords(entries: LogEntry[]): {
  longestRestMinutes: number
  earliestPutDownScale: number | null
} {
  let longest = 0
  let earliest: number | null = null
  for (const e of entries) {
    const n = analyzeNight(e)
    if (!n) continue
    if (n.restMinutes > longest) longest = n.restMinutes
    const scale = putDownScale(n.putDownAt)
    if (earliest === null || scale < earliest) earliest = scale
  }
  return { longestRestMinutes: longest, earliestPutDownScale: earliest }
}
