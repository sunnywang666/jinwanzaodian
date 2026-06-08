/**
 * spiritProgression.ts — v5.4
 *
 * Tracks cumulative "good nights" (screen-off after closing)
 * and unlocks spirit skins at milestones.
 */

import type { LogEntry, SpiritForm } from './storage'

// ── Types ──

export interface SpiritProgressState {
  totalGoodNights: number
  unlockedForms: SpiritForm[]
}

// ── Milestone rules ──

interface SkinMilestone {
  form: SpiritForm
  goodNightsRequired: number
  congratsText: string
}

const MILESTONES: SkinMilestone[] = [
  { form: 'base', goodNightsRequired: 0, congratsText: '' },
  { form: 'xiaolongbao', goodNightsRequired: 0, congratsText: '' },
  { form: 'croissant', goodNightsRequired: 5, congratsText: '连续好好关灯，精灵学会了可颂的样子！' },
  { form: 'donut', goodNightsRequired: 10, congratsText: '铺子越来越稳了，精灵变成了圆圆的贝果！' },
  { form: 'sleep', goodNightsRequired: 15, congratsText: '你的陪伴让精灵也安心多了——迷糊贝果解锁！' },
]

// ── Evaluation ──

function countGoodNights(logEntries: LogEntry[]): number {
  return logEntries.filter((e) =>
    e.isRealData && e.screenOffTimestamp && e.closingNote !== '未打烊',
  ).length
}

/**
 * Evaluate spirit skin unlocks based on cumulative good nights.
 * Returns updated state and any newly unlocked forms.
 */
export function evaluateSpiritUnlocks(
  currentState: SpiritProgressState,
  logEntries: LogEntry[],
): { updated: SpiritProgressState; newUnlocks: SkinMilestone[] } {
  const goodNights = countGoodNights(logEntries)
  const currentUnlocked = new Set(currentState.unlockedForms)
  const newUnlocks: SkinMilestone[] = []

  for (const milestone of MILESTONES) {
    if (currentUnlocked.has(milestone.form)) continue
    if (goodNights >= milestone.goodNightsRequired) {
      currentUnlocked.add(milestone.form)
      if (milestone.goodNightsRequired > 0) {
        newUnlocks.push(milestone)
      }
    }
  }

  return {
    updated: {
      totalGoodNights: goodNights,
      unlockedForms: Array.from(currentUnlocked),
    },
    newUnlocks,
  }
}

/** Check if a specific form is unlocked */
export function isFormUnlocked(state: SpiritProgressState, form: SpiritForm): boolean {
  return state.unlockedForms.includes(form)
}

/** Get milestone info for a locked form */
export function getFormMilestoneHint(form: SpiritForm, currentGoodNights: number): string {
  const milestone = MILESTONES.find((m) => m.form === form)
  if (!milestone || milestone.goodNightsRequired === 0) return '已解锁'
  const remaining = milestone.goodNightsRequired - currentGoodNights
  if (remaining <= 0) return '已解锁'
  return `再早睡 ${remaining} 晚即可解锁`
}

// ── Storage helpers ──

const STORAGE_KEY = 'jinwanzaodian:spirit-progress'

const DEFAULT_STATE: SpiritProgressState = {
  totalGoodNights: 0,
  unlockedForms: ['base', 'xiaolongbao'],
}

export function loadSpiritProgress(): SpiritProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as SpiritProgressState
    // Ensure default forms are always present
    if (!parsed.unlockedForms.includes('base')) parsed.unlockedForms.push('base')
    if (!parsed.unlockedForms.includes('xiaolongbao')) parsed.unlockedForms.push('xiaolongbao')
    return parsed
  } catch {
    return DEFAULT_STATE
  }
}

export function saveSpiritProgress(value: SpiritProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function clearSpiritProgress() {
  localStorage.removeItem(STORAGE_KEY)
}
