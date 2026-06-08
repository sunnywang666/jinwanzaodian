/**
 * guestProgression.ts — v5.4
 *
 * Tracks per-guest visit counts and familiarity levels.
 * Determines which guests appear today based on shop mood.
 */

import type { ShopMood } from './storage'

// ── Types ──

export type FamiliarityLevel = 0 | 1 | 2 | 3

export interface GuestProgressEntry {
  totalVisits: number
  lastVisitDate: string
  familiarityLevel: FamiliarityLevel
}

export type GuestProgressMap = Record<string, GuestProgressEntry>

// ── Familiarity thresholds ──

const FAMILIARITY_THRESHOLDS: Array<{ min: number; level: FamiliarityLevel; label: string }> = [
  { min: 10, level: 3, label: '熟客' },
  { min: 6, level: 2, label: '常客' },
  { min: 3, level: 1, label: '新熟' },
  { min: 0, level: 0, label: '生客' },
]

export function getFamiliarityLevel(visits: number): FamiliarityLevel {
  for (const t of FAMILIARITY_THRESHOLDS) {
    if (visits >= t.min) return t.level
  }
  return 0
}

export function getFamiliarityLabel(level: FamiliarityLevel): string {
  return FAMILIARITY_THRESHOLDS.find((t) => t.level === level)?.label ?? '生客'
}

export function getFamiliarityDescription(key: string, level: FamiliarityLevel): string {
  const descriptions: Record<string, Record<FamiliarityLevel, string>> = {
    cat: {
      0: '第一次来，在门口犹豫了一会儿',
      1: '开始认得你了，会点头打招呼',
      2: '已经会坐在窗边等开门',
      3: '闭着眼都能找到自己的位子',
    },
    rabbit: {
      0: '探头看了看铺子就走了',
      1: '会进来坐一会儿',
      2: '见面会主动问你昨晚睡得如何',
      3: '把铺子当成自己家了',
    },
    raccoon: {
      0: '好奇地张望着',
      1: '每次来都东张西望',
      2: '会把杯子整齐放回柜台',
      3: '开始帮你一起收拾桌子',
    },
    bear: {
      0: '远远地闻着包子的香味',
      1: '来过几次了，还有点害羞',
      2: '已经记得自己的小凳子',
      3: '抱着包子的样子让人安心',
    },
    fox: {
      0: '路过看了一眼',
      1: '开始愿意在门口多坐一会儿',
      2: '会专门来喝一碗暖粥',
      3: '给你带来了家乡的小米粥做法',
    },
    sparrow: {
      0: '在屋檐上看着铺子',
      1: '飞进来过一两次',
      2: '还在熟悉铺子的味道',
      3: '教你做了一碗银耳枸杞粥',
    },
    bird: {
      0: '听到收音机的声音飞过来',
      1: '会在窗台停一会儿',
      2: '会在收音机旁边停一会儿',
      3: '成了铺子的常驻DJ',
    },
  }
  return descriptions[key]?.[level] ?? getFamiliarityLabel(level)
}

// ── Guest appearance logic ──

const ALL_GUEST_KEYS = ['cat', 'rabbit', 'raccoon', 'bear', 'fox', 'sparrow', 'bird'] as const

/** Determines which guests appear today based on shop mood */
export function rollTodayGuests(
  mood: 'busy' | 'normal' | 'quiet',
  progress: GuestProgressMap,
): string[] {
  // How many guests come today
  const countByMood = { busy: [5, 7], normal: [3, 5], quiet: [1, 3] }
  const [min, max] = countByMood[mood]
  const count = min + Math.floor(Math.random() * (max - min + 1))

  // Sort guests by familiarity (higher = more likely to come)
  // Add some randomness so it's not always the same order
  const weighted = ALL_GUEST_KEYS.map((key) => {
    const entry = progress[key]
    const familiarity = entry?.familiarityLevel ?? 0
    const weight = (familiarity + 1) * 2 + Math.random() * 3
    return { key, weight }
  })

  weighted.sort((a, b) => b.weight - a.weight)

  return weighted.slice(0, Math.min(count, ALL_GUEST_KEYS.length)).map((w) => w.key)
}

/** After determining today's guests, increment their visit counts */
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

// ── Storage helpers ──

const STORAGE_KEY = 'jinwanzaodian:guest-progress'

export function loadGuestProgress(): GuestProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as GuestProgressMap) : {}
  } catch {
    return {}
  }
}

export function saveGuestProgress(value: GuestProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function clearGuestProgress() {
  localStorage.removeItem(STORAGE_KEY)
}
