import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Home } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { EveningPrepare } from './pages/EveningPrepare'
import { NightClosing } from './pages/NightClosing'
import { MorningOpening, MiddayTransition } from './pages/MorningOpening'
import { createDefaultLogEntries, getGuestCountByMood, guests } from './lib/demoData'
import {
  clearDemoStorage,
  loadDemoScene,
  loadEveningPrepare,
  loadLastOpenDate,
  loadLogbook,
  loadMiddayDone,
  loadOnboardingProfile,
  loadSpiritForm,
  loadTodayMood,
  loadTonightClosed,
  saveDemoScene,
  saveEveningPrepare,
  saveLastOpenDate,
  saveLogbook,
  saveMiddayDone,
  saveOnboardingProfile,
  saveSpiritForm,
  saveTodayMood,
  saveTonightClosed,
  type EveningPrepareState,
  type LogEntry,
  type OnboardingProfile,
  type SpiritForm,
} from './lib/storage'
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
  const [guestBookPage, setGuestBookPage] = useState(0)
  const [debugHotspots, setDebugHotspots] = useState(false)

  // Determine if morning opening should show
  const lastOpenDate = loadLastOpenDate()
  const todayStr = getTodayString()
  const needsMorningOpening = onboardingProfile !== null && lastOpenDate !== todayStr

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
          // First time: skip morning opening, go straight to shop
          saveLastOpenDate(getTodayString())
        }}
      />
    )
  }

  // Morning opening flow
  if (view === 'morningOpening') {
    return (
      <MorningOpening
        spiritName={onboardingProfile.spiritName}
        lastNightClosed={tonightClosed}
        lastCloseTime={logEntries[0]?.closeTime ?? null}
        onComplete={(mood) => {
          // Save today's open date so we don't show again today
          saveLastOpenDate(todayStr)
          // Set today's mood based on last night
          setTodayMood(mood)
          // Reset tonight's state for the new day
          setTonightClosed(false)
          setMiddayDone(false)
          // Set scene to match mood
          setDemoScene(mood === 'busy' ? 'busy' : mood === 'quiet' ? 'quiet' : 'normal')
          setView('home')
        }}
      />
    )
  }

  return (
    <AppShell
      topChrome={view === 'home' ? (
        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            className="pointer-events-auto rounded-full bg-ink/20 px-3 py-1.5 text-xs text-paper backdrop-blur-sm transition hover:bg-ink/30"
            onClick={() => {
              if (!window.confirm('要清空开店流程和本地演示记录吗？')) return
              clearDemoStorage()
              setOnboardingProfile(null)
              setSpiritForm('base')
              setDemoScene('cover')
              setTonightClosed(false)
              setTodayMood('normal')
              setMiddayDone(false)
              setEveningPrepare({ plannedLightsOffTime: '23:00', worry: '', savedAt: null })
              setLogEntries(createDefaultLogEntries())
              setView('home')
              setGuestBookPage(0)
              setDebugHotspots(false)
            }}
          >
            重置
          </button>
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
          setDemoScene(scene)
          if (scene !== 'lightsOff') setTonightClosed(false)
          if (scene === 'evening') setView('eveningPrepare')
          if (scene === 'night') setView('nightClosing')
          // Trigger midday transition when switching to daytime (if not done today)
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
