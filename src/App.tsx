import { useEffect, useRef, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Home } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { EveningPrepare } from './pages/EveningPrepare'
import { NightClosing } from './pages/NightClosing'
import { MorningOpening, MiddayTransition } from './pages/MorningOpening'
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

function getTodayString() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

export default function App() {
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
  const [guestBookPage, setGuestBookPage] = useState(0)
  const [debugHotspots, setDebugHotspots] = useState(false)
  const [returnMessage, setReturnMessage] = useState<string | null>(() => loadReturnMessage())

  const lastOpenDate = loadLastOpenDate()
  const todayStr = getTodayString()
  const needsMorningOpening = onboardingProfile !== null && lastOpenDate !== todayStr
  const autoSceneSuppressedUntil = useRef(0)

  const [view, setView] = useState<AppView>(() => {
    if (needsMorningOpening) return 'morningOpening'
    return 'home'
  })

  useEffect(() => {
    if (onboardingProfile) saveOnboardingProfile(onboardingProfile)
  }, [onboardingProfile])

  useEffect(() => { saveSpiritForm(spiritForm) }, [spiritForm])
  useEffect(() => { saveDemoScene(demoScene) }, [demoScene])
  useEffect(() => { saveTonightClosed(tonightClosed) }, [tonightClosed])
  useEffect(() => { saveEveningPrepare(eveningPrepare) }, [eveningPrepare])
  useEffect(() => { saveLogbook(logEntries) }, [logEntries])
  useEffect(() => { saveTodayMood(todayMood) }, [todayMood])
  useEffect(() => { saveMiddayDone(middayDone) }, [middayDone])
  useEffect(() => { saveAutoSceneEnabled(autoSceneEnabled) }, [autoSceneEnabled])

  useEffect(() => {
    if (!autoSceneEnabled || !onboardingProfile) {
      return
    }

    function tick() {
      if (view !== 'home') {
        return
      }

      if (Date.now() < autoSceneSuppressedUntil.current) {
        return
      }

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

  useEffect(() => {
    if (!onboardingProfile) {
      return
    }

    const cleanup = startVisibilityTracking(
      {
        onReturn: (awayMs) => {
          if (awayMs <= 30_000) {
            return
          }

          const msg = awayMs > 600_000
            ? '\u54CE\uff0c\u4f60\u56de\u6765\u5566\u3002\u94fa\u5b50\u4e00\u76f4\u5f00\u7740\u5462\u3002'
            : '\u6b22\u8fce\u56de\u6765\uff0c\u94fa\u5b50\u8fd8\u5728\u3002'

          setReturnMessage(msg)
          saveReturnMessage(msg)

          window.setTimeout(() => {
            setReturnMessage(null)
            saveReturnMessage(null)
          }, 8000)
        },
        onScreenOffAfterClosing: () => {
          // best sleep signal, timestamp is stored by visibility.ts
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
        }}
      />
    )
  }

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
          setTonightClosed(false)
          setMiddayDone(false)
          setDemoScene(trend.sceneMood === 'busy' ? 'busy' : trend.sceneMood === 'quiet' ? 'quiet' : 'normal')
          setView('home')
        }}
      />
    )
  }

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
              {autoSceneEnabled ? '\u81ea\u52a8' : '\u624b\u52a8'}
            </button>

            <button
              type="button"
              className="pointer-events-auto rounded-full bg-ink/20 px-3 py-1.5 text-xs text-paper backdrop-blur-sm transition hover:bg-ink/30"
              onClick={() => {
                if (!window.confirm('\u8981\u6e05\u7a7a\u5f00\u5e97\u6d41\u7a0b\u548c\u672c\u5730\u6f14\u793a\u8bb0\u5f55\u5417\uff1f')) return
                clearDemoStorage()
                clearVisibilityData()
                setOnboardingProfile(null)
                setSpiritForm('base')
                setDemoScene('cover')
                setTonightClosed(false)
                setTodayMood('normal')
                setMiddayDone(false)
                setAutoSceneEnabled(true)
                setEveningPrepare({ plannedLightsOffTime: '23:00', worry: '', savedAt: null })
                setLogEntries(createDefaultLogEntries())
                setView('home')
                setGuestBookPage(0)
                setDebugHotspots(false)
                setReturnMessage(null)
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
      />

      {view === 'recipeBookConfirm' ? (
        <RecipeBookConfirmView onConfirm={() => setView('recipeBookOpen')} onCancel={() => setView('home')} />
      ) : null}
      {view === 'recipeBookOpen' ? <RecipeBookOverlay onClose={() => setView('home')} /> : null}
      {view === 'guestBookConfirm' ? (
        <GuestBookConfirmView onConfirm={() => setView('guestBookOpen')} onCancel={() => setView('home')} />
      ) : null}
      {view === 'guestBookOpen' ? (
        <GuestBookOpenView
          page={guestBookPage}
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
            setLogEntries((current) => [newEntry, ...current])
            setTonightClosed(true)
            setDemoScene('lightsOff')
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
    </AppShell>
  )
}
