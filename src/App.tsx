import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Home } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { createDefaultLogEntries, sceneCopy } from './lib/demoData'
import {
  clearDemoStorage,
  loadDemoScene,
  loadEveningPrepare,
  loadLogbook,
  loadOnboardingProfile,
  loadSpiritForm,
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
import { LogbookOverlay } from './overlays/LogbookOverlay'
import { SpiritHutOverlay } from './overlays/SpiritHutOverlay'
import { RadioChatOverlay } from './overlays/RadioChatOverlay'
import { MessageBoardOverlay } from './overlays/MessageBoardOverlay'

type OverlayKey = 'recipeBook' | 'guestBook' | 'logbook' | 'spiritHut' | 'radio' | 'blackboard' | null

export default function App() {
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(() => loadOnboardingProfile())
  const [spiritForm, setSpiritForm] = useState<SpiritForm>(() => loadSpiritForm())
  const [demoScene, setDemoScene] = useState(() => loadDemoScene())
  const [tonightClosed, setTonightClosed] = useState(() => loadTonightClosed())
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => loadLogbook(createDefaultLogEntries()))
  const [eveningPrepare, setEveningPrepare] = useState<EveningPrepareState>(() =>
    loadEveningPrepare(loadOnboardingProfile()?.defaultLightsOffTime ?? '23:00'),
  )
  const [overlay, setOverlay] = useState<OverlayKey>(null)
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

  const statusText = overlay
    ? `${onboardingProfile.spiritName} 的铺子正在翻开一本册子。`
    : `${sceneCopy[demoScene].title} · 关灯时间 ${eveningPrepare.plannedLightsOffTime}${tonightClosed ? ' · 今晚已熄灯' : ''}`

  return (
    <AppShell
      statusText={statusText}
      headerAction={{
        label: '重置',
        onClick: () => {
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
          setOverlay(null)
          setDebugHotspots(false)
        },
      }}
    >
      <Home
        scene={demoScene}
        debugHotspots={debugHotspots}
        onToggleDebugHotspots={() => setDebugHotspots((current) => !current)}
        onOpenHotspot={(hotspotId) => setOverlay(hotspotId)}
        onSceneChange={(scene) => {
          setDemoScene(scene)
          if (scene !== 'lightsOff') {
            setTonightClosed(false)
          }
        }}
      />

      {overlay === 'recipeBook' ? <RecipeBookOverlay onClose={() => setOverlay(null)} /> : null}
      {overlay === 'guestBook' ? <GuestBookOverlay onClose={() => setOverlay(null)} /> : null}
      {overlay === 'logbook' ? <LogbookOverlay entries={logEntries} onClose={() => setOverlay(null)} /> : null}
      {overlay === 'spiritHut' ? (
        <SpiritHutOverlay
          spiritName={onboardingProfile.spiritName}
          currentForm={spiritForm}
          onSelectForm={setSpiritForm}
          onClose={() => setOverlay(null)}
        />
      ) : null}
      {overlay === 'radio' ? <RadioChatOverlay spiritName={onboardingProfile.spiritName} onClose={() => setOverlay(null)} /> : null}
      {overlay === 'blackboard' ? <MessageBoardOverlay onClose={() => setOverlay(null)} /> : null}
    </AppShell>
  )
}
