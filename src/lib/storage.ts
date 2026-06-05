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
  | 'menu'
  | 'guestbook'
  | 'logbook'
  | 'spiritHut'
  | 'eveningPrepare'
  | 'nightClosing'

export type NightType =
  | '报复型'
  | '惯性型'
  | '焦虑型'
  | '工作型'
  | '猫头鹰型'
  | '说不清'

export type SpiritForm = 'base' | 'xiaolongbao' | 'sleep' | 'croissant' | 'donut'
export type ShopMood = '热闹' | '平常' | '安静'

export interface OnboardingProfile {
  nightType: NightType
  spiritAppearance: 'base' | 'xiaolongbao'
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
}

const STORAGE_KEYS = {
  onboarding: 'jinwanzaodian:onboarding',
  spiritForm: 'jinwanzaodian:spirit-form',
  demoScene: 'jinwanzaodian:demo-scene',
  eveningPrepare: 'jinwanzaodian:evening-prepare',
  tonightClosed: 'jinwanzaodian:tonight-closed',
  logbook: 'jinwanzaodian:logbook',
} as const

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readValue<T>(key: string, fallback: T): T {
  if (!canUseStorage()) {
    return fallback
  }

  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeValue<T>(key: string, value: T) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export function loadOnboardingProfile() {
  return readValue<OnboardingProfile | null>(STORAGE_KEYS.onboarding, null)
}

export function saveOnboardingProfile(value: OnboardingProfile) {
  writeValue(STORAGE_KEYS.onboarding, value)
}

export function loadSpiritForm() {
  return readValue<SpiritForm>(STORAGE_KEYS.spiritForm, 'base')
}

export function saveSpiritForm(value: SpiritForm) {
  writeValue(STORAGE_KEYS.spiritForm, value)
}

export function loadDemoScene() {
  return readValue<DemoScene>(STORAGE_KEYS.demoScene, 'cover')
}

export function saveDemoScene(value: DemoScene) {
  writeValue(STORAGE_KEYS.demoScene, value)
}

export function loadEveningPrepare(defaultLightsOffTime = '23:00') {
  return readValue<EveningPrepareState>(STORAGE_KEYS.eveningPrepare, {
    plannedLightsOffTime: defaultLightsOffTime,
    worry: '',
    savedAt: null,
  })
}

export function saveEveningPrepare(value: EveningPrepareState) {
  writeValue(STORAGE_KEYS.eveningPrepare, value)
}

export function loadTonightClosed() {
  return readValue<boolean>(STORAGE_KEYS.tonightClosed, false)
}

export function saveTonightClosed(value: boolean) {
  writeValue(STORAGE_KEYS.tonightClosed, value)
}

export function loadLogbook(defaultValue: LogEntry[]) {
  return readValue<LogEntry[]>(STORAGE_KEYS.logbook, defaultValue)
}

export function saveLogbook(value: LogEntry[]) {
  writeValue(STORAGE_KEYS.logbook, value)
}

export function clearDemoStorage() {
  if (!canUseStorage()) {
    return
  }

  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key))
}
