/**
 * dishProgression.ts — v5.4
 *
 * Two unlock paths per product doc:
 * 1. Milestone: accumulated "good nights" (closed on time with screen-off)
 * 2. Guest relationship: a specific guest reaches a familiarity threshold
 */

import type { LogEntry } from './storage'
import type { GuestProgressMap } from './guestProgression'

// ── Types ──

export interface DishUnlockStatus {
  unlocked: boolean
  unlockedDate?: string
  unlockedBy?: 'default' | 'milestone' | 'guest'
}

export type DishProgressMap = Record<string, DishUnlockStatus>

// ── Unlock rules ──

interface DishUnlockRule {
  key: string
  type: 'default' | 'milestone' | 'guest'
  /** For milestone: how many good nights needed */
  goodNightsRequired?: number
  /** For guest: which guest key and what familiarity level needed */
  guestKey?: string
  guestFamiliarityRequired?: number
}

const UNLOCK_RULES: DishUnlockRule[] = [
  { key: 'bun', type: 'default' },
  { key: 'soy-milk', type: 'default' },
  { key: 'youtiao', type: 'milestone', goodNightsRequired: 3 },
  { key: 'millet-porridge', type: 'guest', guestKey: 'fox', guestFamiliarityRequired: 3 },
  { key: 'tremella-porridge', type: 'guest', guestKey: 'sparrow', guestFamiliarityRequired: 3 },
]

// ── Evaluation ──

function countGoodNights(logEntries: LogEntry[]): number {
  return logEntries.filter((e) =>
    e.isRealData && e.screenOffTimestamp && e.closingNote !== '未打烊',
  ).length
}

/**
 * Evaluate all dish unlock conditions and return current status.
 * This is a pure function — call it whenever log or guest progress changes.
 */
export function evaluateDishUnlocks(
  currentProgress: DishProgressMap,
  logEntries: LogEntry[],
  guestProgress: GuestProgressMap,
): { updated: DishProgressMap; newUnlocks: string[] } {
  const goodNights = countGoodNights(logEntries)
  const now = new Date().toISOString()
  const updated = { ...currentProgress }
  const newUnlocks: string[] = []

  for (const rule of UNLOCK_RULES) {
    // Already unlocked → skip
    if (updated[rule.key]?.unlocked) continue

    let shouldUnlock = false

    if (rule.type === 'default') {
      shouldUnlock = true
    } else if (rule.type === 'milestone' && rule.goodNightsRequired !== undefined) {
      shouldUnlock = goodNights >= rule.goodNightsRequired
    } else if (rule.type === 'guest' && rule.guestKey && rule.guestFamiliarityRequired !== undefined) {
      const gp = guestProgress[rule.guestKey]
      shouldUnlock = (gp?.familiarityLevel ?? 0) >= rule.guestFamiliarityRequired
    }

    if (shouldUnlock) {
      updated[rule.key] = {
        unlocked: true,
        unlockedDate: now,
        unlockedBy: rule.type,
      }
      if (rule.type !== 'default') {
        newUnlocks.push(rule.key)
      }
    }
  }

  return { updated, newUnlocks }
}

/** Get unlock hint text for a locked dish */
export function getDishUnlockHint(key: string): string {
  const rule = UNLOCK_RULES.find((r) => r.key === key)
  if (!rule) return '???'
  if (rule.type === 'default') return '已解锁'
  if (rule.type === 'milestone') return `累计${rule.goodNightsRequired}个早睡夜晚后解锁`
  if (rule.type === 'guest') {
    const guestNames: Record<string, string> = {
      fox: '小狐狸橘橘',
      sparrow: '小麻雀啾啾',
      cat: '橘猫阿橘',
      rabbit: '白兔小团',
      raccoon: '小浣熊灰灰',
      bear: '小熊栗子',
      bird: '小鸟蓝蓝',
    }
    return `与${guestNames[rule.guestKey!] ?? '???'}成为熟客后解锁`
  }
  return '???'
}

// ── Storage helpers ──

const STORAGE_KEY = 'jinwanzaodian:dish-progress'

export function loadDishProgress(): DishProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DishProgressMap) : {}
  } catch {
    return {}
  }
}

export function saveDishProgress(value: DishProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function clearDishProgress() {
  localStorage.removeItem(STORAGE_KEY)
}
