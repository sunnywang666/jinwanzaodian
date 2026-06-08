/**
 * dataStore.ts — v5.5
 *
 * Unified data store with versioned schema and migration.
 *
 * One localStorage key (`jinwanzaodian:store`) replaces 15+ scattered keys.
 * On first load, migrates from old keys automatically.
 *
 * Keys that stay OUTSIDE the store (managed by their own modules):
 * - jinwanzaodian:onboarding-draft  (temporary, deleted after onboarding)
 * - jinwanzaodian:visibility-*      (high-frequency, managed by visibility.ts)
 * - jinwanzaodian:last-screen-off   (managed by visibility.ts)
 * - jinwanzaodian:anthropic_key     (sensitive, managed by SpiritChatOverlay)
 * - jinwanzaodian:return-message    (ephemeral, auto-clears)
 */

import type {
  DemoScene,
  EveningPrepareState,
  LogEntry,
  NightType,
  ShopMood,
  SpiritBody,
  SpiritForm,
} from './storage'
import type { GuestProgressMap } from './guestProgression'
import type { DishProgressMap } from './dishProgression'

// ── Schema ──

export interface AppStore {
  schemaVersion: 1

  /** User profile from onboarding. null = hasn't onboarded yet. */
  profile: {
    nightType: NightType
    personaAnswers: string[]
    spiritAppearance: SpiritBody
    spiritName: string
    defaultLightsOffTime: string
  } | null

  /** Spirit companion state */
  spirit: {
    /** Current display form (will become body-only in v5.6) */
    currentForm: SpiritForm
    progress: {
      totalGoodNights: number
      /** Forms the user has unlocked. Will become body-only in v5.6. */
      unlockedForms: SpiritForm[]
    }
  }

  /** Daily operational state — partially resets each new day */
  today: {
    date: string | null
    mood: 'busy' | 'normal' | 'quiet'
    scene: DemoScene
    middayDone: boolean
    tonightClosed: boolean
    eveningPrepare: EveningPrepareState
  }

  /** Guest progression */
  guests: GuestProgressMap

  /** Dish unlock progression */
  dishes: DishProgressMap

  /** Historical log entries (most recent first) */
  days: LogEntry[]

  /** User preferences */
  settings: {
    autoSceneEnabled: boolean
  }
}

// ── Defaults ──

export function createDefaultStore(): AppStore {
  return {
    schemaVersion: 1,
    profile: null,
    spirit: {
      currentForm: 'base',
      progress: {
        totalGoodNights: 0,
        unlockedForms: ['base', 'xiaolongbao'],
      },
    },
    today: {
      date: null,
      mood: 'normal',
      scene: 'cover',
      middayDone: false,
      tonightClosed: false,
      eveningPrepare: {
        plannedLightsOffTime: '23:00',
        worry: '',
        savedAt: null,
      },
    },
    guests: {},
    dishes: {},
    days: [],
    settings: {
      autoSceneEnabled: true,
    },
  }
}

// ── Storage key ──

const STORE_KEY = 'jinwanzaodian:store'

// ── Read / Write ──

export function loadStore(): AppStore {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppStore
      if (parsed.schemaVersion === 1) {
        return validateAndRepair(parsed)
      }
      // Future: if (parsed.schemaVersion === 1) return migrateV1toV2(parsed)
    }
  } catch {
    // Corrupted store — try migration
  }

  // No valid store found — try migrating from old scattered keys
  const migrated = migrateFromScatteredKeys()
  if (migrated) {
    saveStore(migrated)
    deleteOldKeys()
    return migrated
  }

  // Truly fresh install
  return createDefaultStore()
}

export function saveStore(store: AppStore) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function clearStore() {
  localStorage.removeItem(STORE_KEY)
  // Also clear keys that live outside the store
  localStorage.removeItem('jinwanzaodian:onboarding-draft')
  localStorage.removeItem('jinwanzaodian:visibility-log')
  localStorage.removeItem('jinwanzaodian:visibility-session')
  localStorage.removeItem('jinwanzaodian:last-screen-off')
  localStorage.removeItem('jinwanzaodian:return-message')
  // Note: anthropic_key is intentionally NOT cleared (user's API key)
}

// ── Validation ──

function validateAndRepair(store: AppStore): AppStore {
  // Ensure spirit has required defaults
  if (!store.spirit) {
    store.spirit = createDefaultStore().spirit
  }
  if (!store.spirit.progress) {
    store.spirit.progress = { totalGoodNights: 0, unlockedForms: ['base', 'xiaolongbao'] }
  }
  if (!store.spirit.progress.unlockedForms.includes('base')) {
    store.spirit.progress.unlockedForms.push('base')
  }

  // Ensure today exists
  if (!store.today) {
    store.today = createDefaultStore().today
  }
  if (!store.today.eveningPrepare) {
    store.today.eveningPrepare = createDefaultStore().today.eveningPrepare
  }

  // Ensure settings exists
  if (!store.settings) {
    store.settings = { autoSceneEnabled: true }
  }
  if (typeof store.settings.autoSceneEnabled !== 'boolean') {
    store.settings.autoSceneEnabled = true
  }

  // Ensure arrays are arrays
  if (!Array.isArray(store.days)) store.days = []
  if (!store.guests || typeof store.guests !== 'object') store.guests = {}
  if (!store.dishes || typeof store.dishes !== 'object') store.dishes = {}
  if (!Array.isArray(store.spirit.progress.unlockedForms)) {
    store.spirit.progress.unlockedForms = ['base', 'xiaolongbao']
  }
  if (typeof store.spirit.progress.totalGoodNights !== 'number') {
    store.spirit.progress.totalGoodNights = 0
  }

  return store
}

// ── Migration from old scattered keys ──

const OLD_KEYS = {
  onboarding: 'jinwanzaodian:onboarding',
  spiritForm: 'jinwanzaodian:spirit-form',
  demoScene: 'jinwanzaodian:demo-scene',
  eveningPrepare: 'jinwanzaodian:evening-prepare',
  tonightClosed: 'jinwanzaodian:tonight-closed',
  logbook: 'jinwanzaodian:logbook',
  lastOpenDate: 'jinwanzaodian:last-open-date',
  todayMood: 'jinwanzaodian:today-mood',
  middayDone: 'jinwanzaodian:midday-done',
  autoSceneEnabled: 'jinwanzaodian:auto-scene-enabled',
  guestProgress: 'jinwanzaodian:guest-progress',
  dishProgress: 'jinwanzaodian:dish-progress',
  spiritProgress: 'jinwanzaodian:spirit-progress',
} as const

function readOldKey<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function migrateFromScatteredKeys(): AppStore | null {
  // Check if any old keys exist
  const hasAnyOldKey = Object.values(OLD_KEYS).some((key) => localStorage.getItem(key) !== null)
  if (!hasAnyOldKey) return null

  const defaults = createDefaultStore()

  // Profile
  const oldProfile = readOldKey<AppStore['profile']>(OLD_KEYS.onboarding)

  // Spirit
  const oldSpiritForm = (readOldKey<string>(OLD_KEYS.spiritForm) ?? 'base') as SpiritForm
  const oldSpiritProgress = readOldKey<{ totalGoodNights: number; unlockedForms: SpiritForm[] }>(OLD_KEYS.spiritProgress)

  // Carry over forms as-is (body/expression split happens in v5.6)
  const unlockedForms = new Set<SpiritForm>(['base', 'xiaolongbao'])
  if (oldSpiritProgress?.unlockedForms) {
    for (const form of oldSpiritProgress.unlockedForms) {
      unlockedForms.add(form)
    }
  }

  // Today state
  const oldScene = readOldKey<DemoScene>(OLD_KEYS.demoScene) ?? 'cover'
  const oldEveningPrepare = readOldKey<EveningPrepareState>(OLD_KEYS.eveningPrepare)
  const oldTonightClosed = readOldKey<boolean>(OLD_KEYS.tonightClosed) ?? false
  const oldLastOpenDate = readOldKey<string>(OLD_KEYS.lastOpenDate)
  const oldTodayMood = readOldKey<'busy' | 'normal' | 'quiet'>(OLD_KEYS.todayMood) ?? 'normal'
  const oldMiddayDone = readOldKey<boolean>(OLD_KEYS.middayDone) ?? false
  const oldAutoScene = readOldKey<boolean>(OLD_KEYS.autoSceneEnabled) ?? true

  // Progression
  const oldGuests = readOldKey<GuestProgressMap>(OLD_KEYS.guestProgress) ?? {}
  const oldDishes = readOldKey<DishProgressMap>(OLD_KEYS.dishProgress) ?? {}
  const oldDays = readOldKey<LogEntry[]>(OLD_KEYS.logbook) ?? []

  return {
    schemaVersion: 1,
    profile: oldProfile,
    spirit: {
      currentForm: oldSpiritForm,
      progress: {
        totalGoodNights: oldSpiritProgress?.totalGoodNights ?? 0,
        unlockedForms: Array.from(unlockedForms),
      },
    },
    today: {
      date: oldLastOpenDate,
      mood: oldTodayMood,
      scene: oldScene,
      middayDone: oldMiddayDone,
      tonightClosed: oldTonightClosed,
      eveningPrepare: oldEveningPrepare ?? {
        plannedLightsOffTime: oldProfile?.defaultLightsOffTime ?? '23:00',
        worry: '',
        savedAt: null,
      },
    },
    guests: oldGuests,
    dishes: oldDishes,
    days: oldDays,
    settings: {
      autoSceneEnabled: oldAutoScene,
    },
  }
}

function deleteOldKeys() {
  for (const key of Object.values(OLD_KEYS)) {
    try { localStorage.removeItem(key) } catch { /* ok */ }
  }
}
