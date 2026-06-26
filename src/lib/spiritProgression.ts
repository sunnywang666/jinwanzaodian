/**
 * spiritProgression.ts — v6.33
 *
 * Tracks cumulative "good nights" (screen-off after closing).
 *
 * v6.33: the four pastry BODIES (白面团/小笼包/贝果/可颂) are free choices the
 * user picks at onboarding and can switch anytime — they are NOT earned. So they
 * are all unlocked by default and the skin-milestone gating is removed (it used
 * to lock 可颂/贝果 behind 5/10/15 good nights, which contradicted onboarding
 * offering them as choices). 累计早睡 still tracked for the hut + ceremony copy.
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

// 四个身体都是可自由选择的外观，默认全解锁，不再靠早睡解锁。
const ALL_BODIES: SpiritForm[] = ['base', 'xiaolongbao', 'bagel', 'croissant']

const MILESTONES: SkinMilestone[] = ALL_BODIES.map((form) => ({
  form,
  goodNightsRequired: 0,
  congratsText: '',
}))

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
  unlockedForms: [...ALL_BODIES],
}

export function loadSpiritProgress(): SpiritProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { totalGoodNights: 0, unlockedForms: [...ALL_BODIES] }
    const parsed = JSON.parse(raw) as SpiritProgressState
    // Ensure all four bodies are always present (also backfills old saves)
    for (const form of ALL_BODIES) {
      if (!parsed.unlockedForms.includes(form)) parsed.unlockedForms.push(form)
    }
    return parsed
  } catch {
    return { totalGoodNights: 0, unlockedForms: [...ALL_BODIES] }
  }
}

export function saveSpiritProgress(value: SpiritProgressState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
}

export function clearSpiritProgress() {
  localStorage.removeItem(STORAGE_KEY)
}
