/**
 * storage.ts — v5.5
 *
 * Now a types + utilities file. All persistent state lives in the unified
 * store (dataStore.ts). Individual load/save functions are removed.
 *
 * What remains:
 * - All type exports (used everywhere)
 * - defaultOnboardingDraft (used by Onboarding.tsx)
 * - Onboarding draft functions (temp data, outside the store)
 * - createCloseLogEntry / stampOpenTime (pure helpers)
 */

// ── Types ──

export type DemoScene =
  | 'cover'
  | 'busy'
  | 'normal'
  | 'quiet'
  | 'daytime'
  | 'nap'
  | 'evening'
  | 'night'
  | 'lightsOff'

export type AppPage =
  | 'home'
  | 'eveningPrepare'
  | 'nightClosing'
  | 'demoMode'
  | 'spiritChat'

export type NightType =
  | '报复型'
  | '惯性型'
  | '焦虑型'
  | '工作型'
  | '猫头鹰型'
  | '说不清'

export type SpiritForm =
  | 'base'
  | 'whiteDough'
  | 'xiaolongbao'
  | 'bagel'
  | 'confusedBagel'
  | 'croissant'
  | 'donut'
  | 'sleep'

export type SpiritBody = 'base' | 'xiaolongbao' | 'bagel' | 'croissant'

export type ShopMood = '热闹' | '平常' | '安静'

export interface OnboardingProfile {
  nightType: NightType
  personaAnswers: string[]
  spiritAppearance: SpiritBody
  spiritName: string
  defaultLightsOffTime: string
}

export interface OnboardingDraft {
  step: number
  questionIndex: number
  personaAnswers: string[]
  nightType: NightType | null
  spiritAppearance: SpiritBody
  spiritName: string
  defaultLightsOffTime: string
}

export interface EveningPrepareState {
  plannedLightsOffTime: string
  worry: string
  savedAt: string | null
}

export interface LogEntry {
  date: string
  openTime: string
  closeTime: string
  shopMood: ShopMood
  guestCount: number
  closingNote: string
  realCloseTimestamp?: string
  realOpenTimestamp?: string
  screenOffTimestamp?: string
  isRealData?: boolean
}

// ── Onboarding draft (temporary, lives outside the store) ──

const DRAFT_KEY = 'jinwanzaodian:onboarding-draft'

export const defaultOnboardingDraft: OnboardingDraft = {
  step: 0,
  questionIndex: 0,
  personaAnswers: [],
  nightType: null,
  spiritAppearance: 'base',
  spiritName: '阿团',
  defaultLightsOffTime: '23:00',
}

export function loadOnboardingDraft(): OnboardingDraft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as OnboardingDraft) : defaultOnboardingDraft
  } catch {
    return defaultOnboardingDraft
  }
}

export function saveOnboardingDraft(value: OnboardingDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(value))
}

export function clearOnboardingDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

// ── Pure helpers (used by App.tsx) ──

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function formatDate(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export function createCloseLogEntry(shopMood: ShopMood, guestCount: number): LogEntry {
  const now = new Date()
  return {
    date: formatDate(now),
    openTime: '',
    closeTime: formatTime(now),
    shopMood,
    guestCount,
    closingNote: '按时打烊',
    realCloseTimestamp: now.toISOString(),
    isRealData: true,
  }
}

export function stampOpenTime(entries: LogEntry[]): LogEntry[] {
  if (entries.length === 0) return entries
  const now = new Date()
  const updated = [...entries]
  const latest = { ...updated[0]! }
  if (!latest.realOpenTimestamp) {
    latest.openTime = formatTime(now)
    latest.realOpenTimestamp = now.toISOString()
    updated[0] = latest
  }
  return updated
}
