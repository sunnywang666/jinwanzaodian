/**
 * App.tsx — v5.4
 *
 * New in this version:
 * - Guest progression: daily guest rolling + visit tracking + familiarity levels
 * - Dish unlock: milestone (good nights) + guest relationship paths
 * - Spirit skin unlock: cumulative good nights milestones
 * - Settings page: modify lights-off time, about, reset
 * - Visibility fix: detects tab close + reopen
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
  clearDemoStorage,
  createCloseLogEntry,
  loadAutoSceneEnabled,
  loadDemoScene,
  loadEveningPrepare,
  loadLastOpenDate,
  loadLogbook,
  loadMiddayDone,
  loadOnboardingProfile,
  loadReturnMessage,
  loadSpiritForm,
  loadTodayMood,
  loadTonightClosed,
  saveAutoSceneEnabled,
  saveDemoScene,
  saveEveningPrepare,
  saveLastOpenDate,
  saveLogbook,
  saveMiddayDone,
  saveOnboardingProfile,
  saveReturnMessage,
  saveSpiritForm,
  saveTodayMood,
  saveTonightClosed,
  stampOpenTime,
  type EveningPrepareState,
  type LogEntry,
  type OnboardingProfile,
  type SpiritForm,
} from './lib/storage'
import { getSceneForCurrentTime } from './lib/timeScene'
import { clearLastScreenOffTime, clearVisibilityData, getLastScreenOffTime, startVisibilityTracking } from './lib/visibility'
import { calculateTrend } from './lib/trendCalculation'
import {
  loadGuestProgress, saveGuestProgress, clearGuestProgress,
  rollTodayGuests, recordDailyVisits, type GuestProgressMap,
} from './lib/guestProgression'
import {
  loadDishProgress, saveDishProgress, clearDishProgress,
  evaluateDishUnlocks, type DishProgressMap,
} from './lib/dishProgression'
import {
  loadSpiritProgress, saveSpiritProgress, clearSpiritProgress,
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
  // ── Persisted state ──
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(() => loadOnboardingProfile())
  const [spiritForm, setSpiritForm] = useState<SpiritForm>(() => loadSpiritForm())
  const [demoScene, setDemoScene] = useState(() => loadDemoScene())
  const [tonightClosed, setTonightClosed] = useState(() => loadTonightClosed())
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => loadLogbook(createDefaultLogEntries()))
  const [eveningPrepare, setEveningPrepare] = useState<EveningPrepareState>(() =>
    loadEveningPrepare(loadOnboardingProfile()?.defaultLightsOffTime ?? '23:00'),
  )
  const [todayMood, setTodayMood] = useState<'busy' | 'normal' | 'quiet'>(() => loadTodayMood())
  const [middayDone, setMiddayDone] = useState(() => loadMiddayDone())
  const [autoSceneEnabled, setAutoSceneEnabled] = useState(() => loadAutoSceneEnabled())

  // v5.4: Progression state
  const [guestProgress, setGuestProgress] = useState<GuestProgressMap>(() => loadGuestProgress())
  const [dishProgress, setDishProgress] = useState<DishProgressMap>(() => loadDishProgress())
  const [spiritProgress, setSpiritProgress] = useState<SpiritProgressState>(() => loadSpiritProgress())

  // ── Ephemeral state ──
  const [guestBookPage, setGuestBookPage] = useState(0)
  const [debugHotspots, setDebugHotspots] = useState(false)
  const [returnMessage, setReturnMessage] = useState<string | null>(() => loadReturnMessage())

  // ── View routing ──
  const lastOpenDate = loadLastOpenDate()
  const todayStr = getTodayString()
  const needsMorningOpening = onboardingProfile !== null && lastOpenDate !== todayStr
  const autoSceneSuppressedUntil = useRef(0)

  const [view, setView] = useState<AppView>(() => {
    if (needsMorningOpening) return 'morningOpening'
    return 'home'
  })

  // ── Persist on change ──
  useEffect(() => { if (onboardingProfile) saveOnboardingProfile(onboardingProfile) }, [onboardingProfile])
  useEffect(() => { saveSpiritForm(spiritForm) }, [spiritForm])
  useEffect(() => { saveDemoScene(demoScene) }, [demoScene])
  useEffect(() => { saveTonightClosed(tonightClosed) }, [tonightClosed])
  useEffect(() => { saveEveningPrepare(eveningPrepare) }, [eveningPrepare])
  useEffect(() => { saveLogbook(logEntries) }, [logEntries])
  useEffect(() => { saveTodayMood(todayMood) }, [todayMood])
  useEffect(() => { saveMiddayDone(middayDone) }, [middayDone])
  useEffect(() => { saveAutoSceneEnabled(autoSceneEnabled) }, [autoSceneEnabled])
  useEffect(() => { saveGuestProgress(guestProgress) }, [guestProgress])
  useEffect(() => { saveDishProgress(dishProgress) }, [dishProgress])
  useEffect(() => { saveSpiritProgress(spiritProgress) }, [spiritProgress])

  useEffect(() => {
    if (Object.keys(dishProgress).length > 0) {
      return
    }

    const initialDish = evaluateDishUnlocks({}, logEntries, guestProgress)
    setDishProgress(initialDish.updated)
  }, [dishProgress, guestProgress, logEntries])

  // ── Auto scene switching ──
  useEffect(() => {
    if (!autoSceneEnabled || !onboardingProfile) return

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
  }, [autoSceneEnabled, onboardingProfile, eveningPrepare.plannedLightsOffTime, tonightClosed, todayMood, view])

  // ── Visibility tracking ──
  useEffect(() => {
    if (!onboardingProfile) return

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
        onScreenOffAfterClosing: () => {
          // best sleep signal — timestamp stored by visibility.ts
        },
      },
      () => tonightClosed,
    )

    return cleanup
  }, [onboardingProfile, tonightClosed])

  function dismissReturnMessage() {
    setReturnMessage(null)
    saveReturnMessage(null)
  }

  // ── Helper: run all progression evaluations ──
  function runProgressionChecks(entries: LogEntry[], guests: GuestProgressMap) {
    // Dish unlocks
    const dishResult = evaluateDishUnlocks(dishProgress, entries, guests)
    if (dishResult.newUnlocks.length > 0) {
      setDishProgress(dishResult.updated)
    } else {
      setDishProgress(dishResult.updated)
    }

    // Spirit skin unlocks
    const spiritResult = evaluateSpiritUnlocks(spiritProgress, entries)
    if (spiritResult.newUnlocks.length > 0) {
      setSpiritProgress(spiritResult.updated)
    } else {
      setSpiritProgress(spiritResult.updated)
    }
  }

  // ── Full reset ──
  function resetAll() {
    clearDemoStorage()
    clearVisibilityData()
    clearGuestProgress()
    clearDishProgress()
    clearSpiritProgress()
    setOnboardingProfile(null)
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
    setSpiritProgress({ totalGoodNights: 0, unlockedForms: ['base', 'xiaolongbao'] })
    setView('home')
    setGuestBookPage(0)
    setDebugHotspots(false)
    setReturnMessage(null)
  }

  // ── Onboarding ──
  if (!onboardingProfile) {
    return (
      <Onboarding
        onComplete={(profile) => {
          setOnboardingProfile(profile)
          setSpiritForm(profile.spiritAppearance)
          setEveningPrepare({
            plannedLightsOffTime: profile.defaultLightsOffTime,
            worry: '',
            savedAt: null,
          })
          saveLastOpenDate(getTodayString())

          // Initialize dish progress with defaults unlocked
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
      targetLightsOffTime: onboardingProfile.defaultLightsOffTime,
    })

    return (
      <MorningOpening
        spiritName={onboardingProfile.spiritName}
        lastNightClosed={tonightClosed}
        lastCloseTime={logEntries[0]?.closeTime ?? null}
        onComplete={() => {
          saveLastOpenDate(todayStr)

          // Stamp open time
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

          // Set mood from trend
          setTodayMood(trend.sceneMood)

          // v5.4: Roll today's guests and record visits
          const todayGuestKeys = rollTodayGuests(trend.sceneMood, guestProgress)
          const updatedGuestProgress = recordDailyVisits(todayGuestKeys, guestProgress)
          setGuestProgress(updatedGuestProgress)

          // v5.4: Run progression checks
          runProgressionChecks(stampedEntries, updatedGuestProgress)

          // Reset tonight state
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
              onClick={() => setAutoSceneEnabled((current) => !current)}
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
        onToggleDebugHotspots={() => setDebugHotspots((current) => !current)}
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

      {/* ── Overlays ── */}

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
          onPrev={() => setGuestBookPage((current) => (current - 1 + guests.length) % guests.length)}
          onNext={() => setGuestBookPage((current) => (current + 1) % guests.length)}
        />
      ) : null}
      {view === 'spiritChat' ? (
        <SpiritChatOverlay
          spiritName={onboardingProfile.spiritName}
          nightType={onboardingProfile.nightType}
          onGoToHut={() => setView('spiritHut')}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'spiritHut' ? (
        <SpiritHutOverlay
          spiritName={onboardingProfile.spiritName}
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
          spiritName={onboardingProfile.spiritName}
          onSave={(value) => setEveningPrepare(value)}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'nightClosing' ? (
        <NightClosing
          spiritName={onboardingProfile.spiritName}
          tonightClosed={tonightClosed}
          latestLog={logEntries[0]}
          onComplete={() => {
            const trend = calculateTrend({
              recentEntries: logEntries.slice(0, 7),
              targetLightsOffTime: onboardingProfile.defaultLightsOffTime,
            })
            const newEntry = createCloseLogEntry(trend.mood, getGuestCountByMood(todayMood))
            const updatedEntries = [newEntry, ...logEntries]
            setLogEntries(updatedEntries)
            setTonightClosed(true)
            setDemoScene('lightsOff')

            // v5.4: Re-evaluate spirit unlocks after closing
            const spiritResult = evaluateSpiritUnlocks(spiritProgress, updatedEntries)
            setSpiritProgress(spiritResult.updated)

            setView('home')
          }}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'middayTransition' ? (
        <MiddayTransition
          spiritName={onboardingProfile.spiritName}
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
          spiritName={onboardingProfile.spiritName}
          defaultLightsOffTime={onboardingProfile.defaultLightsOffTime}
          onUpdateLightsOffTime={(time) => {
            const updated = { ...onboardingProfile, defaultLightsOffTime: time }
            setOnboardingProfile(updated)
            setEveningPrepare((current) => ({
              ...current,
              plannedLightsOffTime: time,
            }))
          }}
          onResetAll={resetAll}
          onClose={() => setView('home')}
        />
      ) : null}
    </AppShell>
  )
}
