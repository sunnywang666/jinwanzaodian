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

// 皮肤目录（成长线）：起手四身体(need 0，免费) + 靠累计早睡解锁的新形态。
// comingSoon = 美术资源未就位 → 暂不真正解锁（停留"待上新"剪影、不可选、不庆祝），
// 杜绝选了没图的皮肤导致主场景破图；补图后把对应项 comingSoon 改 false 即全链路生效。
interface SkinDef { form: SpiritForm; need: number; comingSoon: boolean }

const SKIN_CATALOG: SkinDef[] = [
  { form: 'base', need: 0, comingSoon: false },
  { form: 'xiaolongbao', need: 0, comingSoon: false },
  { form: 'bagel', need: 0, comingSoon: false },
  { form: 'croissant', need: 0, comingSoon: false },
  { form: 'donut', need: 10, comingSoon: true },
  { form: 'baozi', need: 25, comingSoon: true },
  { form: 'waffle', need: 60, comingSoon: true },
  { form: 'mochi', need: 120, comingSoon: true },
]

// 起手身体：need 0 的四个，默认全解锁，不靠早睡。
const ALL_BODIES: SpiritForm[] = SKIN_CATALOG.filter((s) => s.need === 0).map((s) => s.form)

// 里程碑只含"有图（非 comingSoon）"的形态，evaluateSpiritUnlocks 据此解锁；
// comingSoon 的形态不进里程碑 → 永不自动解锁，不会破图。
const MILESTONES: SkinMilestone[] = SKIN_CATALOG
  .filter((s) => !s.comingSoon)
  .map((s) => ({ form: s.form, goodNightsRequired: s.need, congratsText: '' }))

/** 解锁皮肤的展示顺序（成长线）：起手身体 + 里程碑形态 */
export const SKIN_ORDER: SpiritForm[] = SKIN_CATALOG.map((s) => s.form)

/** 靠累计早睡解锁的形态（need>0 且已有图），供清晨庆祝/预告复用；补图前为空。 */
export const EARNED_SKINS: Array<{ form: SpiritForm; need: number }> = SKIN_CATALOG
  .filter((s) => s.need > 0 && !s.comingSoon)
  .map((s) => ({ form: s.form, need: s.need }))

/** 某形态是否"待上新"（已规划、图未到位、暂不可解锁） */
export function isSkinComingSoon(form: SpiritForm): boolean {
  return SKIN_CATALOG.find((s) => s.form === form)?.comingSoon ?? false
}

// ── Evaluation ──

function countGoodNights(logEntries: LogEntry[]): number {
  // 好觉 = 真实数据 + 打烊后真正熄屏放下手机。只为已打烊的夜建记录，故无需再判 closingNote。
  return logEntries.filter((e) => e.isRealData && e.screenOffTimestamp).length
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

/** 某形态需要累计多少个早睡夜晚解锁（0 = 起手免费） */
export function getSkinGoodNightsRequired(form: SpiritForm): number {
  return SKIN_CATALOG.find((s) => s.form === form)?.need ?? 0
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
