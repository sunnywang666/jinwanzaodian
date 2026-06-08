/**
 * App.tsx — v5.5
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
import { createDefaultLogEntries, getGuestCountByMood, guests } from './lib/demoData'
import {
  createCloseLogEntry,
  stampOpenTime,
  type EveningPrepareState,
  type LogEntry,
  type SpiritForm,
  type WorryStatus,
} from './lib/storage'
import { loadStore, saveStore, clearStore, createDefaultStore, type AppStore } from './lib/dataStore'
import { getSceneForCurrentTime } from './lib/timeScene'
import { clearLastScreenOffTime, clearVisibilityData, getLastScreenOffTime, startVisibilityTracking } from './lib/visibility'
import { calculateTrend } from './lib/trendCalculation'
import {
  rollTodayGuests, recordDailyVisits, type GuestProgressMap,
} from './lib/guestProgression'
import {
  evaluateDishUnlocks, type DishProgressMap,
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
  const now = new Date()
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
    initialStore.days.length > 0 ? initialStore.days : createDefaultLogEntries(),
  )
  const [eveningPrepare, setEveningPrepare] = useState<EveningPrepareState>(initialStore.today.eveningPrepare)
  const [todayMood, setTodayMood] = useState(initialStore.today.mood)
  const [middayDone, setMiddayDone] = useState(initialStore.today.middayDone)
  const [autoSceneEnabled, setAutoSceneEnabled] = useState(initialStore.settings.autoSceneEnabled)
  const [guestProgress, setGuestProgress] = useState<GuestProgressMap>(initialStore.guests)
  const [dishProgress, setDishProgress] = useState<DishProgressMap>(initialStore.dishes)
  const [spiritProgress, setSpiritProgress] = useState<SpiritProgressState>(initialStore.spirit.progress)
  const [lastOpenDate, setLastOpenDate] = useState<string | null>(initialStore.today.date)

  // ── Ephemeral state (outside store) ──
  const [guestBookPage, setGuestBookPage] = useState(0)
  const [debugHotspots, setDebugHotspots] = useState(false)
  const [returnMessage, setReturnMessage] = useState<string | null>(() => loadReturnMessage())

  // ── View routing ──
  const todayStr = getTodayString()
  const needsMorningOpening = profile !== null && lastOpenDate !== todayStr
  const autoSceneSuppressedUntil = useRef(0)

  const [view, setView] = useState<AppView>(() => {
    if (needsMorningOpening) return 'morningOpening'
    return 'home'
  })

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
      },
    }
    saveStore(store)
  }, [
    profile, spiritForm, spiritProgress, demoScene, todayMood,
    middayDone, tonightClosed, eveningPrepare, lastOpenDate,
    guestProgress, dishProgress, logEntries, autoSceneEnabled,
  ])

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
            ? '哎，你回来啦。铺子一直开着呢。'
            : '欢迎回来，铺子还在。'
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
    setEveningPrepare({ plannedLightsOffTime: '23:00', worry: '', savedAt: null })
    setLogEntries(createDefaultLogEntries())
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

    return (
      <MorningOpening
        spiritName={profile.spiritName}
        lastNightClosed={tonightClosed}
        lastCloseTime={logEntries[0]?.closeTime ?? null}
        lastNightWorry={logEntries[0]?.worry ?? null}
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

          const todayGuestKeys = rollTodayGuests(trend.sceneMood, guestProgress)
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

          <div className="flex gap-2">
            <button
              type="button"
              className={`pointer-events-auto rounded-full px-3 py-1.5 text-xs backdrop-blur-sm transition ${
                autoSceneEnabled ? 'bg-sage/30 text-ink/60' : 'bg-ink/15 text-paper'
              }`}
              onClick={() => setAutoSceneEnabled((c) => !c)}
            >
              {autoSceneEnabled ? '自动' : '手动'}
            </button>

            <button
              type="button"
              className="pointer-events-auto rounded-full bg-ink/20 px-3 py-1.5 text-xs text-paper backdrop-blur-sm transition hover:bg-ink/30"
              onClick={() => {
                if (!window.confirm('要清空开店流程和本地演示记录吗？')) return
                resetAll()
              }}
            >
              重置
            </button>
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
          setDemoScene(scene)
          if (scene !== 'lightsOff') setTonightClosed(false)
          if (scene === 'evening') setView('eveningPrepare')
          if (scene === 'night') setView('nightClosing')
          if (scene === 'daytime' && !middayDone) setView('middayTransition')
        }}
        onOpenSettings={() => setView('settings')}
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
          onGoToHut={() => setView('spiritHut')}
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
      {view === 'radio' ? <RadioOverlay onClose={() => setView('home')} /> : null}
      {view === 'logbook' ? <LogbookOverlay entries={logEntries} onClose={() => setView('home')} /> : null}
      {view === 'messageBoard' ? <MessageBoardOverlay onClose={() => setView('home')} /> : null}
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
