import { useEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { Home } from './pages/Home'
import { Menu } from './pages/Menu'
import { GuestBook } from './pages/GuestBook'
import { GuestDetail } from './pages/GuestDetail'
import { Logbook } from './pages/Logbook'
import { SpiritHut } from './pages/SpiritHut'
import { SpiritChatPage } from './pages/SpiritChatPage'
import { Onboarding } from './pages/Onboarding'
import { EveningPrepare } from './pages/EveningPrepare'
import { NightClosing } from './pages/NightClosing'
import { DemoMode } from './pages/DemoMode'
import { createDefaultLogEntries, guests, sceneCopy, type GuestEntry } from './lib/demoData'
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
  type AppPage,
  type EveningPrepareState,
  type LogEntry,
  type OnboardingProfile,
  type SpiritForm,
} from './lib/storage'

function getNowTime() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function updateLatestLogEntry(entries: LogEntry[], closeTime: string): LogEntry[] {
  if (entries.length === 0) {
    return entries
  }

  const [latest, ...rest] = entries
  return [
    {
      ...latest,
      closeTime,
      shopMood: '安静',
      closingNote: '完成了夜晚打烊，把手机也放远了一点',
    },
    ...rest,
  ]
}

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>('home')
  const [selectedGuest, setSelectedGuest] = useState<GuestEntry>(guests[0])
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(() => loadOnboardingProfile())
  const [spiritForm, setSpiritForm] = useState<SpiritForm>(() => loadSpiritForm())
  const [demoScene, setDemoScene] = useState(() => loadDemoScene())
  const [tonightClosed, setTonightClosed] = useState(() => loadTonightClosed())
  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => loadLogbook(createDefaultLogEntries()))
  const [eveningPrepare, setEveningPrepare] = useState<EveningPrepareState>(() =>
    loadEveningPrepare(loadOnboardingProfile()?.defaultLightsOffTime ?? '23:00'),
  )

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        return
      }

      if (activePage === 'nightClosing' && tonightClosed) {
        setDemoScene('lightsOff')
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [activePage, tonightClosed])

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
          setActivePage('home')
        }}
      />
    )
  }

  const statusText =
    activePage === 'eveningPrepare'
      ? '傍晚先把今晚安排轻一点。'
      : activePage === 'nightClosing'
        ? '把铺子收好，再把手机放下。'
        : activePage === 'spiritChat'
          ? `${onboardingProfile.spiritName} 在柜台后等你。`
          : `${sceneCopy[demoScene].title} · 关灯时间 ${eveningPrepare.plannedLightsOffTime}`

  const latestLog = logEntries[0] ?? createDefaultLogEntries()[0]

  return (
    <AppShell
      activePage={activePage}
      onNavigate={setActivePage}
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
          setActivePage('home')
        },
      }}
    >
      {activePage === 'home' ? (
        <Home scene={demoScene} tonightClosed={tonightClosed} onNavigate={setActivePage} />
      ) : null}

      {activePage === 'menu' ? <Menu /> : null}
      {activePage === 'guestbook' ? (
        <GuestBook
          onSelectGuest={(guest) => {
            setSelectedGuest(guest)
            setActivePage('guestDetail')
          }}
        />
      ) : null}
      {activePage === 'guestDetail' ? (
        <GuestDetail guest={selectedGuest} onBack={() => setActivePage('guestbook')} />
      ) : null}
      {activePage === 'logbook' ? <Logbook entries={logEntries} spiritName={onboardingProfile.spiritName} /> : null}
      {activePage === 'spiritHut' ? (
        <SpiritHut
          currentForm={spiritForm}
          spiritName={onboardingProfile.spiritName}
          onSelectForm={setSpiritForm}
          onNavigate={setActivePage}
        />
      ) : null}
      {activePage === 'spiritChat' ? <SpiritChatPage spiritName={onboardingProfile.spiritName} /> : null}
      {activePage === 'demoMode' ? (
        <DemoMode
          scene={demoScene}
          onSceneChange={(scene) => {
            setDemoScene(scene)
            if (scene !== 'lightsOff') {
              setTonightClosed(false)
            }
          }}
        />
      ) : null}
      {activePage === 'eveningPrepare' ? (
        <EveningPrepare
          initialValue={eveningPrepare}
          spiritName={onboardingProfile.spiritName}
          onSave={(value) => {
            setEveningPrepare(value)
            setTonightClosed(false)
            setDemoScene('evening')
          }}
        />
      ) : null}
      {activePage === 'nightClosing' ? (
        <NightClosing
          spiritName={onboardingProfile.spiritName}
          latestLog={latestLog}
          tonightClosed={tonightClosed}
          onComplete={() => {
            const closeTime = getNowTime()
            setTonightClosed(true)
            setDemoScene('lightsOff')
            setLogEntries((current) => updateLatestLogEntry(current, closeTime))
          }}
        />
      ) : null}
    </AppShell>
  )
}
