import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Home } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { createDefaultLogEntries } from './lib/demoData'
import {
  clearDemoStorage,
  loadDemoScene,
  loadEveningPrepare,
  loadLogbook,
  loadOnboardingProfile,
  loadSpiritForm,
  loadOnboardingDraft,
  loadTonightClosed,
  saveDemoScene,
  saveEveningPrepare,
  saveLogbook,
  saveOnboardingProfile,
  saveSpiritForm,
  saveTonightClosed,
  type EveningPrepareState,
  type LogEntry,
  type OnboardingProfile,
  type SpiritForm,
} from './lib/storage'
import { RecipeBookOverlay } from './overlays/RecipeBookOverlay'
import { GuestBookOverlay } from './overlays/GuestBookOverlay'
import { SpiritHutOverlay } from './overlays/SpiritHutOverlay'
import { RadioChatOverlay } from './overlays/RadioChatOverlay'

type ActiveView = 'home' | 'recipeBook' | 'guestBook' | 'radio' | 'spiritHut'

export default function App() {
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(() => loadOnboardingProfile())
  const [spiritForm, setSpiritForm] = useState<SpiritForm>(() => loadSpiritForm())
  const [demoScene, setDemoScene] = useState(() => loadDemoScene())
  const [tonightClosed, setTonightClosed] = useState(() => loadTonightClosed())
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => loadLogbook(createDefaultLogEntries()))
  const [eveningPrepare, setEveningPrepare] = useState<EveningPrepareState>(() =>
    loadEveningPrepare(loadOnboardingProfile()?.defaultLightsOffTime ?? '23:00'),
  )
  const [activeView, setActiveView] = useState<ActiveView>('home')
  const [debugHotspots, setDebugHotspots] = useState(false)

  useEffect(() => {
    if (onboardingProfile) {
      saveOnboardingProfile(onboardingProfile)
    }
  }, [onboardingProfile])

  useEffect(() => {
    saveSpiritForm(spiritForm)
  }, [spiritForm])

  useEffect(() => {
    saveDemoScene(demoScene)
  }, [demoScene])

  useEffect(() => {
    saveTonightClosed(tonightClosed)
  }, [tonightClosed])

  useEffect(() => {
    saveEveningPrepare(eveningPrepare)
  }, [eveningPrepare])

  useEffect(() => {
    saveLogbook(logEntries)
  }, [logEntries])

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
        }}
      />
    )
  }

  return (
    <AppShell
      topChrome={activeView === 'home' ? (
        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            className="pointer-events-auto rounded-full border border-line bg-paper/85 px-3 py-1.5 text-xs text-brown shadow-sm backdrop-blur"
            onClick={() => {
              if (!window.confirm('要清空开店流程和本地演示记录吗？')) {
                return
              }

              clearDemoStorage()
              setOnboardingProfile(null)
              setSpiritForm('base')
              setDemoScene('cover')
              setTonightClosed(false)
              setEveningPrepare({ plannedLightsOffTime: '23:00', worry: '', savedAt: null })
              setLogEntries(createDefaultLogEntries())
              setActiveView('home')
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
        onOpenHotspot={(target) => setActiveView(target)}
        onSceneChange={(scene) => {
          setDemoScene(scene)
          if (scene !== 'lightsOff') {
            setTonightClosed(false)
          }
        }}
      />

      {activeView === 'recipeBook' ? <RecipeBookOverlay onClose={() => setActiveView('home')} /> : null}
      {activeView === 'guestBook' ? <GuestBookOverlay onClose={() => setActiveView('home')} /> : null}
      {activeView === 'radio' ? (
        <RadioChatOverlay spiritName={onboardingProfile.spiritName} onClose={() => setActiveView('home')} />
      ) : null}
      {activeView === 'spiritHut' ? (
        <SpiritHutOverlay
          spiritName={onboardingProfile.spiritName}
          currentForm={spiritForm}
          onSelectForm={setSpiritForm}
          onClose={() => setActiveView('home')}
        />
      ) : null}
    </AppShell>
  )
}
