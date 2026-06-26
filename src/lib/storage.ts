/**
 * storage.ts — v6.33
 *
 * v6.33: LogEntry gains `nightWakes` — how many times the app came back to the
 * foreground after closing and before next morning (a gentle "picked the phone
 * back up at night" signal). Folded in at morning opening; used by sleepAnalysis.
 *
 * Fix: defaultOnboardingDraft.spiritName changed from '阿团' to ''
 * so that Onboarding uses t('onboarding.namingPlaceholder') as fallback,
 * which is language-aware ('阿团' in zh, 'Tuanzi' in en).
 */

// ── Types ──

export type DemoScene =
  | 'cover' | 'busy' | 'normal' | 'quiet'
  | 'daytime' | 'nap' | 'evening' | 'night' | 'lightsOff'

export type AppPage = 'home' | 'eveningPrepare' | 'nightClosing' | 'demoMode' | 'spiritChat'

export type NightType = '报复型' | '惯性型' | '焦虑型' | '工作型' | '猫头鹰型' | '说不清'

export type SpiritForm =
  | 'base' | 'whiteDough' | 'xiaolongbao' | 'bagel' | 'confusedBagel' | 'croissant'
  | 'donut' | 'baozi' | 'waffle' | 'mochi' // 靠累计早睡解锁的新形态（待补图）
  | 'sleep'

export type SpiritBody = 'base' | 'xiaolongbao' | 'bagel' | 'croissant'

export type ShopMood = '热闹' | '平常' | '安静'

export type WorryStatus = 'pending' | 'released' | 'carrying'

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
  /** 打烊后到次日开门间，App 被重新唤到前台的次数（夜里又拿起手机的近似信号） */
  nightWakes?: number
  isRealData?: boolean
  worry?: string
  worryStatus?: WorryStatus
}

// ── Onboarding draft ──

const DRAFT_KEY = 'jinwanzaodian:onboarding-draft'

export const defaultOnboardingDraft: OnboardingDraft = {
  step: 0,
  questionIndex: 0,
  personaAnswers: [],
  nightType: null,
  spiritAppearance: 'base',
  spiritName: '',  // empty → Onboarding uses t('onboarding.namingPlaceholder') as fallback
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

// ── Pure helpers ──

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function formatDate(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export function createCloseLogEntry(
  shopMood: ShopMood,
  guestCount: number,
  worry?: string,
): LogEntry {
  const now = new Date()
  const entry: LogEntry = {
    date: formatDate(now),
    openTime: '',
    closeTime: formatTime(now),
    shopMood,
    guestCount,
    closingNote: '按时打烊',
    realCloseTimestamp: now.toISOString(),
    isRealData: true,
  }
  if (worry && worry.trim()) {
    entry.worry = worry.trim()
    entry.worryStatus = 'pending'
  }
  return entry
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
