/**
 * guestProgression.ts — v6.6
 *
 * Updated familiarity labels to match 来往 system:
 * 新客(0) → 渐熟(1) → 常来(2) → 熟客(3)
 *
 * Removed getFamiliarityDescription (replaced by guestEncounters.ts)
 */

import type { ShopMood } from './storage'

export type FamiliarityLevel = 0 | 1 | 2 | 3

export interface GuestProgressEntry {
  totalVisits: number
  lastVisitDate: string
  familiarityLevel: FamiliarityLevel
}

export type GuestProgressMap = Record<string, GuestProgressEntry>

const FAMILIARITY_THRESHOLDS: Array<{ min: number; level: FamiliarityLevel; label: string }> = [
  { min: 10, level: 3, label: '熟客' },
  { min: 6, level: 2, label: '常来' },
  { min: 3, level: 1, label: '渐熟' },
  { min: 0, level: 0, label: '新客' },
]

export function getFamiliarityLevel(visits: number): FamiliarityLevel {
  for (const t of FAMILIARITY_THRESHOLDS) {
    if (visits >= t.min) return t.level
  }
  return 0
}

export function getFamiliarityLabel(level: FamiliarityLevel): string {
  return FAMILIARITY_THRESHOLDS.find((t) => t.level === level)?.label ?? '新客'
}

// ── Guest appearance logic ──

const ALL_GUEST_KEYS = ['cat', 'rabbit', 'raccoon', 'bear', 'fox', 'sparrow', 'bird'] as const

export function rollTodayGuests(
  mood: 'busy' | 'normal' | 'quiet',
  progress: GuestProgressMap,
): string[] {
  const countByMood = { busy: [5, 7], normal: [3, 5], quiet: [1, 3] }
  const [min, max] = countByMood[mood]
  const count = min + Math.floor(Math.random() * (max - min + 1))

  const weighted = ALL_GUEST_KEYS.map((key) => {
    const entry = progress[key]
    const familiarity = entry?.familiarityLevel ?? 0
    const weight = (familiarity + 1) * 2 + Math.random() * 3
    return { key, weight }
  })

  weighted.sort((a, b) => b.weight - a.weight)
  return weighted.slice(0, Math.min(count, ALL_GUEST_KEYS.length)).map((w) => w.key)
}

export function recordDailyVisits(
  todayGuests: string[],
  progress: GuestProgressMap,
): GuestProgressMap {
  const today = new Date().toISOString().split('T')[0]!
  const updated = { ...progress }

  for (const key of todayGuests) {
    const existing = updated[key]
    const newVisits = (existing?.totalVisits ?? 0) + 1
    updated[key] = {
      totalVisits: newVisits,
      lastVisitDate: today,
      familiarityLevel: getFamiliarityLevel(newVisits),
    }
  }

  return updated
}
