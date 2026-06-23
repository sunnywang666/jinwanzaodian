/**
 * App.tsx — v6.5
 *
 * Data layer unification:
 * - All persistent state loaded from one `loadStore()` call
 * - All persistent state saved via one `useEffect` → `saveStore()`
 * - Replaces 12 individual load/save pairs
 * - Migration from old scattered keys happens automatically on first load
 */

import { useEffect, useRef, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Home } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { EveningPrepare } from './pages/EveningPrepare'
import { NightClosing } from './pages/NightClosing'
import { MorningOpening, MiddayTransition } from './pages/MorningOpening'
import { Settings } from './pages/Settings'
import { createDefaultLogEntries, getGuestCountByMood, guests, dishes } from './lib/demoData'
import {
  createCloseLogEntry,
  stampOpenTime,
  type EveningPrepareState,
  type LogEntry,
  type SpiritForm,
  type WorryStatus,
} from './lib/storage'
import { loadStore, saveStore, clearStore, createDefaultStore, type AppStore } from './lib/dataStore'
import { startReminderScheduler, type StoredReminderSettings } from './lib/notifications'
import { isDemoMode } from './lib/devMode'
import { getSceneForCurrentTime } from './lib/timeScene'
import { clearLastScreenOffTime, clearVisibilityData, getLastScreenOffTime, startVisibilityTracking } from './lib/visibility'
import { calculateTrend } from './lib/trendCalculation'
import {
  rollTodayGuests, recordDailyVisits, type GuestProgressMap,
} from './lib/guestProgression'
import {
  evaluateDishUnlocks, getDishUnlockSource, type DishProgressMap,
} from './lib/dishProgression'
import {
  evaluateSpiritUnlocks, type SpiritProgressState,
} from './lib/spiritProgression'
import { RecipeBookOverlay } from './overlays/RecipeBookOverlay'
import { SpiritHutOverlay } from './overlays/SpiritHutOverlay'
import { SpiritChatOverlay } from './overlays/SpiritChatOverlay'
import { RadioOverlay } from './overlays/RadioOverlay'
import { LogbookOverlay } from './overlays/LogbookOverlay'
import { MessageBoardOverlay } from './overlays/MessageBoardOverlay'
import { RecipeBookConfirmView } from './views/RecipeBookConfirmView'
import { GuestBookConfirmView } from './views/GuestBookConfirmView'
import { GuestBookOpenView } from './views/GuestBookOpenView'
import { useAmbientAudio, CHANNELS } from './lib/ambientAudio'
import { getNow } from './lib/timeSimulator'
import { useT } from './lib/i18n'

// ── Ephemeral keys (outside the store) ──

function loadReturnMessage(): string | null {
  try {
    const raw = localStorage.getItem('jinwanzaodian:return-message')
    return raw ? (JSON.parse(raw) as string) : null
  } catch { return null }
}
function saveReturnMessage(value: string | null) {
  if (value === null) localStorage.removeItem('jinwanzaodian:return-message')
  else localStorage.setItem('jinwanzaodian:return-message', JSON.stringify(value))
}

// ── Types ──

type AppView =
  | 'home'
  | 'guestBookConfirm'
  | 'guestBookOpen'
  | 'recipeBookConfirm'
  | 'recipeBookOpen'
  | 'spiritChat'
  | 'spiritHut'
  | 'radio'
  | 'logbook'
  | 'messageBoard'
  | 'eveningPrepare'
  | 'nightClosing'
  | 'morningOpening'
  | 'middayTransition'
  | 'settings'

function getTodayString() {
  const now = getNow()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

export default function App() {
  // ── Load unified store ──
  const [initialStore] = useState(() => loadStore())

  // ── Individual state (for React reactivity) ──
  const [profile, setProfile] = useState(initialStore.profile)
  const [spiritForm, setSpiritForm] = useState<SpiritForm>(initialStore.spirit.currentForm)
  const [demoScene, setDemoScene] = useState(initialStore.today.scene)
  const [tonightClosed, setTonightClosed] = useState(initialStore.today.tonightClosed)
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() =>
    initialStore.days.length > 0 ? initialStore.days : (isDemoMode() ? createDefaultLogEntries() : []),
  )
  const [eveningPrepare, setEveningPrepare] = useState<EveningPrepareState>(initialStore.today.eveningPrepare)
  const [todayMood, setTodayMood] = useState(initialStore.today.mood)
  const [middayDone, setMiddayDone] = useState(initialStore.today.middayDone)
  const [autoSceneEnabled, setAutoSceneEnabled] = useState(initialStore.settings.autoSceneEnabled)
  const [reminders, setReminders] = useState<StoredReminderSettings>(initialStore.settings.reminders)
  const [guestProgress, setGuestProgress] = useState<GuestProgressMap>(initialStore.guests)
  const [dishProgress, setDishProgress] = useState<DishProgressMap>(initialStore.dishes)
  const [spiritProgress, setSpiritProgress] = useState<SpiritProgressState>(initialStore.spirit.progress)
  const [lastOpenDate, setLastOpenDate] = useState<string | null>(initialStore.today.date)

  // ── Ephemeral state (outside store) ──
  const [guestBookPage, setGuestBookPage] = useState(0)
  const [debugHotspots, setDebugHotspots] = useState(false)
  const [returnMessage, setReturnMessage] = useState<string | null>(() => loadReturnMessage())
  const ambientAudio = useAmbientAudio()
  const { t, lang } = useT()

  // ── View routing ──
  const todayStr = getTodayString()
  const needsMorningOpening = profile !== null && lastOpenDate !== todayStr
  const autoSceneSuppressedUntil = useRef(0)

  // Deep link from a tapped reminder notification (/?reminder=evening|closing)
  const reminderParam = (() => {
    try { return new URLSearchParams(window.location.search).get('reminder') } catch { return null }
  })()

  const [view, setView] = useState<AppView>(() => {
    if (needsMorningOpening) return 'morningOpening'
    if (reminderParam === 'evening') return 'eveningPrepare'
    if (reminderParam === 'closing') return 'nightClosing'
    return 'home'
  })

  // Strip the ?reminder= param so a later refresh doesn't re-route
  useEffect(() => {
    if (!reminderParam) return
    try {
      const url = new URL(window.location.href)
      url.searchParams.delete('reminder')
      window.history.replaceState({}, '', url.pathname + url.search + url.hash)
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Centralized persistence: one save for all state ──
  useEffect(() => {
    const store: AppStore = {
      schemaVersion: 1,
      profile,
      spirit: {
        currentForm: spiritForm,
        progress: spiritProgress,
      },
      today: {
        date: lastOpenDate,
        mood: todayMood,
        scene: demoScene,
        middayDone,
        tonightClosed,
        eveningPrepare,
      },
      guests: guestProgress,
      dishes: dishProgress,
      days: logEntries,
      settings: {
        autoSceneEnabled,
        reminders,
      },
    }
    saveStore(store)
  }, [
    profile, spiritForm, spiritProgress, demoScene, todayMood,
    middayDone, tonightClosed, eveningPrepare, lastOpenDate,
    guestProgress, dishProgress, logEntries, autoSceneEnabled,
    reminders,
  ])

  // ── Reminder scheduling (local notifications) ──
  // closingTime tracks tonight's planned lights-off time automatically.
  const reminderRuntimeRef = useRef({
    eveningEnabled: reminders.eveningEnabled,
    eveningTime: reminders.eveningTime,
    closingEnabled: reminders.closingEnabled,
    closingTime: eveningPrepare.plannedLightsOffTime,
  })
  reminderRuntimeRef.current = {
    eveningEnabled: reminders.eveningEnabled,
    eveningTime: reminders.eveningTime,
    closingEnabled: reminders.closingEnabled,
    closingTime: eveningPrepare.plannedLightsOffTime,
  }

  useEffect(() => {
    if (!profile) return
    const spiritName = profile.spiritName
    const copy = lang === 'zh'
      ? {
          eveningTitle: '今晚早点',
          eveningBody: `${spiritName}：今晚打算几点关灯歇着呀？先把心事写下来吧。`,
          closingTitle: '要打烊了哦',
          closingBody: `${spiritName}：铺子该关灯歇业了，把手机也放下吧。`,
        }
      : {
          eveningTitle: 'Tonight, Sleep Early',
          eveningBody: `${spiritName}: what time shall we turn off the lights tonight? Jot down what's on your mind first.`,
          closingTitle: 'Time to close up',
          closingBody: `${spiritName}: the shop is closing for the night — put your phone down too.`,
        }
    return startReminderScheduler(() => reminderRuntimeRef.current, copy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, lang])

  // ── Init dish progress if empty ──
  useEffect(() => {
    if (Object.keys(dishProgress).length > 0) return
    const initialDish = evaluateDishUnlocks({}, logEntries, guestProgress)
    setDishProgress(initialDish.updated)
  }, [dishProgress, guestProgress, logEntries])

  // ── Auto scene switching ──
  useEffect(() => {
    if (!autoSceneEnabled || !profile) return

    function tick() {
      if (view !== 'home') return
      if (Date.now() < autoSceneSuppressedUntil.current) return

      const suggested = getSceneForCurrentTime({
        lightsOffTime: eveningPrepare.plannedLightsOffTime,
        tonightClosed,
        todayMood,
      })
      setDemoScene((current) => (current === suggested ? current : suggested))
    }

    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [autoSceneEnabled, profile, eveningPrepare.plannedLightsOffTime, tonightClosed, todayMood, view])

  // ── Visibility tracking ──
  useEffect(() => {
    if (!profile) return

    const cleanup = startVisibilityTracking(
      {
        onReturn: (awayMs) => {
          if (awayMs <= 30_000) return
          const msg = awayMs > 600_000
            ? t('app.returnLong')
            : t('app.returnShort')
          setReturnMessage(msg)
          saveReturnMessage(msg)
          window.setTimeout(() => {
            setReturnMessage(null)
            saveReturnMessage(null)
          }, 8000)
        },
        onScreenOffAfterClosing: () => { /* timestamp stored by visibility.ts */ },
      },
      () => tonightClosed,
    )

    return cleanup
  }, [profile, tonightClosed])

  function dismissReturnMessage() {
    setReturnMessage(null)
    saveReturnMessage(null)
  }

  // ── Progression helper ──
  function runProgressionChecks(entries: LogEntry[], gp: GuestProgressMap) {
    const dishResult = evaluateDishUnlocks(dishProgress, entries, gp)
    setDishProgress(dishResult.updated)
    const spiritResult = evaluateSpiritUnlocks(spiritProgress, entries)
    setSpiritProgress(spiritResult.updated)
  }

  // ── Full reset ──
  function resetAll() {
    clearStore()
    clearVisibilityData()
    const defaults = createDefaultStore()
    setProfile(null)
    setSpiritForm('base')
    setDemoScene('cover')
    setTonightClosed(false)
    setTodayMood('normal')
    setMiddayDone(false)
    setAutoSceneEnabled(true)
    setReminders(defaults.settings.reminders)
    setEveningPrepare({ plannedLightsOffTime: '23:00', worry: '', savedAt: null })
    setLogEntries(isDemoMode() ? createDefaultLogEntries() : [])
    setGuestProgress({})
    setDishProgress({})
    setSpiritProgress(defaults.spirit.progress)
    setLastOpenDate(null)
    setView('home')
    setGuestBookPage(0)
    setDebugHotspots(false)
    setReturnMessage(null)
    saveReturnMessage(null)
  }

  // ── Onboarding ──
  if (!profile) {
    return (
      <Onboarding
        onComplete={(p) => {
          setProfile(p)
          setSpiritForm(p.spiritAppearance)
          setEveningPrepare({
            plannedLightsOffTime: p.defaultLightsOffTime,
            worry: '',
            savedAt: null,
          })
          setLastOpenDate(getTodayString())
          const initialDish = evaluateDishUnlocks({}, [], {})
          setDishProgress(initialDish.updated)
        }}
      />
    )
  }

  // ── Morning opening ──
  if (view === 'morningOpening') {
    const trend = calculateTrend({
      recentEntries: logEntries.slice(0, 7),
      targetLightsOffTime: profile.defaultLightsOffTime,
    })
    const todayGuestKeys = rollTodayGuests(trend.sceneMood, guestProgress)

    // Project today's visits + dish unlocks so the ceremony can reveal a guest-taught dish
    const projectedGuestProgress = recordDailyVisits(todayGuestKeys, guestProgress)
    const projectedDish = evaluateDishUnlocks(dishProgress, logEntries, projectedGuestProgress)
    const newDishUnlocks = projectedDish.newUnlocks
      .map((key) => {
        const dish = dishes.find((d) => d.key === key)
        if (!dish) return null
        const src = getDishUnlockSource(key)
        const guest = src.guestKey ? guests.find((g) => g.key === src.guestKey) : null
        return {
          dishKey: key,
          dishName: dish.name,
          dishImageSrc: dish.image.src,
          dishImageFallback: dish.image.fallbackSrc,
          guestName: guest?.name ?? null,
          type: src.type,
        }
      })
      .filter((d): d is NonNullable<typeof d> => d !== null)

    return (
      <MorningOpening
        spiritName={profile.spiritName}
        nightType={profile.nightType}
        lastNightClosed={tonightClosed}
        lastCloseTime={logEntries[0]?.closeTime ?? null}
        lastNightWorry={logEntries[0]?.worry ?? null}
        trend={trend}
        spiritProgress={spiritProgress}
        todayGuestKeys={todayGuestKeys}
        newDishUnlocks={newDishUnlocks}
        onWorryReviewed={(status: WorryStatus) => {
          setLogEntries((current) => {
            if (current.length === 0) return current
            const updated = [...current]
            updated[0] = { ...updated[0]!, worryStatus: status }
            return updated
          })
        }}
        onComplete={() => {
          setLastOpenDate(todayStr)

          let stampedEntries = stampOpenTime(logEntries)
          const screenOffTimestamp = getLastScreenOffTime()
          if (screenOffTimestamp && stampedEntries[0]) {
            stampedEntries = [
              { ...stampedEntries[0], screenOffTimestamp },
              ...stampedEntries.slice(1),
            ]
            clearLastScreenOffTime()
          }
          setLogEntries(stampedEntries)
          setTodayMood(trend.sceneMood)

          const updatedGP = recordDailyVisits(todayGuestKeys, guestProgress)
          setGuestProgress(updatedGP)
          runProgressionChecks(stampedEntries, updatedGP)

          setTonightClosed(false)
          setMiddayDone(false)
          setDemoScene(trend.sceneMood === 'busy' ? 'busy' : trend.sceneMood === 'quiet' ? 'quiet' : 'normal')
          setView('home')
        }}
      />
    )
  }

  // ── Main app ──
  return (
    <AppShell
      topChrome={view === 'home' ? (
        <div className="flex items-start justify-between px-3 pt-3">
          {returnMessage ? (
            <button
              type="button"
              className="pointer-events-auto animate-[pageIn_300ms_ease-out] rounded-[18px] bg-paper/75 px-3 py-2 text-xs leading-5 text-ink/70 backdrop-blur-sm transition hover:bg-paper/85"
              onClick={dismissReturnMessage}
            >
              {returnMessage}
            </button>
          ) : <div />}

          <div className="flex gap-2 items-start">
            {ambientAudio.isPlaying ? (
              <button
                type="button"
                className="pointer-events-auto animate-pulse rounded-full bg-ink/20 px-3 py-1.5 text-xs text-paper backdrop-blur-sm transition hover:bg-ink/30"
                onClick={() => setView('radio')}
              >
                ♫ {CHANNELS.find((c) => c.id === ambientAudio.currentChannel)?.name ?? '播放中'}
              </button>
            ) : null}

            {isDemoMode() ? (
              <button
                type="button"
                className="pointer-events-auto rounded-full bg-ink/20 px-3 py-1.5 text-xs text-paper backdrop-blur-sm transition hover:bg-ink/30"
                onClick={() => {
                  if (!window.confirm(t('app.resetConfirm'))) return
                  resetAll()
                }}
              >
                {t('app.resetBtn')}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    >
      <Home
        scene={demoScene}
        debugHotspots={debugHotspots}
        onToggleDebugHotspots={() => setDebugHotspots((c) => !c)}
        onOpenHotspot={(target) => {
          if (target === 'guestBook') { setGuestBookPage(0); setView('guestBookConfirm'); return }
          if (target === 'recipeBook') { setView('recipeBookConfirm'); return }
          if (target === 'radio') { setView('radio'); return }
          if (target === 'spiritChat') { setView('spiritChat'); return }
          if (target === 'spiritHut') { setView('spiritHut'); return }
          if (target === 'logbook') { setView('logbook'); return }
          if (target === 'messageBoard') { setView('messageBoard') }
        }}
        onSceneChange={(scene) => {
          autoSceneSuppressedUntil.current = Date.now() + 5 * 60 * 1000
          if (tonightClosed && scene !== 'lightsOff') {
            if (!window.confirm('铺子已经打烊了，确定要重新开门吗？')) return
            setTonightClosed(false)
          }
          setDemoScene(scene)
          if (scene === 'evening') setView('eveningPrepare')
          if (scene === 'night') setView('nightClosing')
          if (scene === 'daytime' && !middayDone) setView('middayTransition')
        }}
        onOpenSettings={() => setView('settings')}
        sceneOptions={{
          lightsOffTime: eveningPrepare.plannedLightsOffTime,
          tonightClosed,
          todayMood,
        }}
        onTimeSimChange={() => {
          const suggested = getSceneForCurrentTime({
            lightsOffTime: eveningPrepare.plannedLightsOffTime,
            tonightClosed,
            todayMood,
          })
          setDemoScene(suggested)
          const newToday = getTodayString()
          if (lastOpenDate !== newToday && profile) {
            setView('morningOpening')
          }
        }}
      />

      {view === 'recipeBookConfirm' ? (
        <RecipeBookConfirmView onConfirm={() => setView('recipeBookOpen')} onCancel={() => setView('home')} />
      ) : null}
      {view === 'recipeBookOpen' ? (
        <RecipeBookOverlay dishProgress={dishProgress} onClose={() => setView('home')} />
      ) : null}
      {view === 'guestBookConfirm' ? (
        <GuestBookConfirmView onConfirm={() => setView('guestBookOpen')} onCancel={() => setView('home')} />
      ) : null}
      {view === 'guestBookOpen' ? (
        <GuestBookOpenView
          page={guestBookPage}
          guestProgress={guestProgress}
          onBackToHome={() => setView('home')}
          onPrev={() => setGuestBookPage((c) => (c - 1 + guests.length) % guests.length)}
          onNext={() => setGuestBookPage((c) => (c + 1) % guests.length)}
        />
      ) : null}
      {view === 'spiritChat' ? (
        <SpiritChatOverlay
          spiritName={profile.spiritName}
          nightType={profile.nightType}
          currentScene={demoScene}
          tonightWorry={eveningPrepare.worry}
          onGoToEveningPrepare={() => setView('eveningPrepare')}
          onGoToNightClosing={() => setView('nightClosing')}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'spiritHut' ? (
        <SpiritHutOverlay
          spiritName={profile.spiritName}
          currentForm={spiritForm}
          spiritProgress={spiritProgress}
          onSelectForm={setSpiritForm}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'radio' ? <RadioOverlay audio={ambientAudio} onClose={() => setView('home')} /> : null}
      {view === 'logbook' ? <LogbookOverlay entries={logEntries} spiritName={profile.spiritName} onClose={() => setView('home')} /> : null}
      {view === 'messageBoard' ? (
        <MessageBoardOverlay
          guestProgress={guestProgress}
          logEntries={logEntries}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'eveningPrepare' ? (
        <EveningPrepare
          initialValue={eveningPrepare}
          spiritName={profile.spiritName}
          onSave={(value) => setEveningPrepare(value)}
          onGoToSpiritChat={() => setView('spiritChat')}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'nightClosing' ? (
        <NightClosing
          spiritName={profile.spiritName}
          tonightClosed={tonightClosed}
          tonightWorry={eveningPrepare.worry}
          latestLog={logEntries[0]}
          onComplete={() => {
            const trend = calculateTrend({
              recentEntries: logEntries.slice(0, 7),
              targetLightsOffTime: profile.defaultLightsOffTime,
            })
            const newEntry = createCloseLogEntry(
              trend.mood,
              getGuestCountByMood(todayMood),
              eveningPrepare.worry,
            )
            const updatedEntries = [newEntry, ...logEntries]
            setLogEntries(updatedEntries)
            setTonightClosed(true)
            setDemoScene('lightsOff')
            const spiritResult = evaluateSpiritUnlocks(spiritProgress, updatedEntries)
            setSpiritProgress(spiritResult.updated)
            setView('home')
          }}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'middayTransition' ? (
        <MiddayTransition
          spiritName={profile.spiritName}
          guestCount={getGuestCountByMood(todayMood)}
          shopMood={todayMood}
          onContinue={() => {
            setMiddayDone(true)
            setDemoScene('daytime')
            setView('home')
          }}
        />
      ) : null}
      {view === 'settings' ? (
        <Settings
          spiritName={profile.spiritName}
          defaultLightsOffTime={profile.defaultLightsOffTime}
          nightType={profile.nightType}
          reminders={reminders}
          onUpdateReminders={setReminders}
          onUpdateLightsOffTime={(time) => {
            setProfile((prev) => prev ? { ...prev, defaultLightsOffTime: time } : prev)
            setEveningPrepare((prev) => ({ ...prev, plannedLightsOffTime: time }))
          }}
          onResetAll={resetAll}
          onClose={() => setView('home')}
        />
      ) : null}
    </AppShell>
  )
}
