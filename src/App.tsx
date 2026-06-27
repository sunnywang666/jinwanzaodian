/**
 * App.tsx — v6.5
 *
 * Data layer unification:
 * - All persistent state loaded from one `loadStore()` call
 * - All persistent state saved via one `useEffect` → `saveStore()`
 * - Replaces 12 individual load/save pairs
 * - Migration from old scattered keys happens automatically on first load
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { AppShell } from './components/AppShell'
import { DemoNotice } from './components/DemoNotice'
import { Home } from './pages/Home'
import { Onboarding } from './pages/Onboarding'
import { GuideTour } from './pages/GuideTour'
import { EveningPrepare } from './pages/EveningPrepare'
import { NightClosing } from './pages/NightClosing'
import { MorningOpening, MiddayTransition } from './pages/MorningOpening'
import { Settings } from './pages/Settings'
import { createDefaultLogEntries, getGuestCountByMood, dishes } from './lib/demoData'
import { guestReferences as guests } from './lib/guestReferences'
import { injectDemoGuestSeeds } from './lib/demoSeed'
import { type AppView, resolveInitialView } from './lib/appView'
import { updateWidget } from './lib/widget'
import {
  createCloseLogEntry,
  stampOpenTime,
  type EveningPrepareState,
  type LogEntry,
  type SpiritForm,
  type WorryStatus,
} from './lib/storage'
import { loadStore, clearStore, createDefaultStore } from './lib/dataStore'
import { usePersistStore } from './hooks/usePersistStore'
import { startReminderScheduler, type StoredReminderSettings } from './lib/notifications'
import { isNativePlatform, syncNativeReminders, registerNativeTapHandler } from './lib/nativeNotifications'
import { isDemoMode } from './lib/devMode'
import { getSceneForCurrentTime, isMorningOpenTime } from './lib/timeScene'
import { sceneByDemo } from './lib/assets'
import { clearChatHistory } from './lib/chatStore'
import { clearLastScreenOffTime, clearVisibilityData, countNightReturns, getLastScreenOffTime, startVisibilityTracking } from './lib/visibility'
import { calculateTrend } from './lib/trendCalculation'
import { analyzeNight, summarizeNights, detectWarnings } from './lib/sleepAnalysis'
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
import { useAmbientAudio } from './lib/ambientAudio'
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
  // 只算一次：演示版无存档时用示例 7 晚，否则用存档（空数组）。
  const initialLogEntries = useMemo(
    () => (initialStore.days.length > 0 ? initialStore.days : (isDemoMode() ? createDefaultLogEntries() : [])),
    [initialStore],
  )
  const [logEntries, setLogEntries] = useState<LogEntry[]>(initialLogEntries)
  const [eveningPrepare, setEveningPrepare] = useState<EveningPrepareState>(initialStore.today.eveningPrepare)
  const [todayMood, setTodayMood] = useState(initialStore.today.mood)
  const [middayDone, setMiddayDone] = useState(initialStore.today.middayDone)
  const [autoSceneEnabled, setAutoSceneEnabled] = useState(initialStore.settings.autoSceneEnabled)
  const [reminders, setReminders] = useState<StoredReminderSettings>(initialStore.settings.reminders)
  const [tourDone, setTourDone] = useState(initialStore.settings.tourDone)
  const [sleepInsights, setSleepInsights] = useState(initialStore.settings.sleepInsights)
  // 首页在场的客人 + 是否该播出餐迎客动画
  const [homeGuestKeys, setHomeGuestKeys] = useState<string[]>(initialStore.today.homeGuestKeys)
  const [arrivalPending, setArrivalPending] = useState(false)
  const [guestProgress, setGuestProgress] = useState<GuestProgressMap>(() =>
    Object.keys(initialStore.guests).length > 0 ? initialStore.guests : injectDemoGuestSeeds({}),
  )
  const [dishProgress, setDishProgress] = useState<DishProgressMap>(initialStore.dishes)
  const [spiritProgress, setSpiritProgress] = useState<SpiritProgressState>(() =>
    // 演示版（且无真实进度时）从演示的 7 晚推导累计早睡，让成就/皮肤进度一开始就活的；
    // 与日后 morning/closing 的重算口径一致（都走 countGoodNights）。
    isDemoMode() && initialStore.spirit.progress.totalGoodNights === 0
      ? evaluateSpiritUnlocks(initialStore.spirit.progress, initialLogEntries).updated
      : initialStore.spirit.progress,
  )
  const [lastOpenDate, setLastOpenDate] = useState<string | null>(initialStore.today.date)

  // ── Ephemeral state (outside store) ──
  const [guestBookPage, setGuestBookPage] = useState(0)
  const [debugHotspots, setDebugHotspots] = useState(false)
  // 是否「刚从傍晚预承诺写完心事」跳进对话——决定精灵开场是否顺着心事给方法
  const [chatFromEvening, setChatFromEvening] = useState(false)
  const [returnMessage, setReturnMessage] = useState<string | null>(() => loadReturnMessage())
  const ambientAudio = useAmbientAudio()
  const { t, lang } = useT()

  // ── View routing ──
  const todayStr = getTodayString()
  // 今天还没开过门 + 当前正是清晨时段 → 才进开门仪式；下午/晚上落首页按时辰走各自场景
  const needsMorningOpening = profile !== null && lastOpenDate !== todayStr && isMorningOpenTime()
  const autoSceneSuppressedUntil = useRef(0)

  // Deep link from a tapped reminder notification (/?reminder=evening|closing)
  const reminderParam = (() => {
    try { return new URLSearchParams(window.location.search).get('reminder') } catch { return null }
  })()

  const [view, setView] = useState<AppView>(() =>
    resolveInitialView({ needsMorningOpening, reminderParam }),
  )

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

  // 把今晚关灯时间 + 当前皮肤同步给桌面小组件（仅安卓原生有效）
  useEffect(() => {
    updateWidget(eveningPrepare.plannedLightsOffTime, spiritForm)
  }, [eveningPrepare.plannedLightsOffTime, spiritForm])

  // ── Centralized persistence: one save for all state ──
  usePersistStore({
    profile, spiritForm, spiritProgress, demoScene, todayMood,
    middayDone, tonightClosed, eveningPrepare, lastOpenDate, homeGuestKeys,
    guestProgress, dishProgress, logEntries, autoSceneEnabled, reminders, tourDone,
    sleepInsights,
  })

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
    if (isNativePlatform()) {
      // 原生：交给 OS 定时（每日重复），app 关闭也能准时弹。设置变动时重排。
      void syncNativeReminders(reminderRuntimeRef.current, copy)
      return
    }
    return startReminderScheduler(() => reminderRuntimeRef.current, copy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, lang, reminders, eveningPrepare.plannedLightsOffTime])

  // 原生通知点击 → 深链跳转到对应界面（仅原生壳，注册一次）
  useEffect(() => {
    if (!profile) return
    void registerNativeTapHandler((kind) => {
      if (kind === 'evening') setView('eveningPrepare')
      else if (kind === 'closing') setView('nightClosing')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

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

  // 落到首页时按时辰分流：清晨(6:00–11:00)且今天还没开门 → 进开门仪式（客人也随之到来）。
  // 覆盖：注册当天第一次清晨进店、跨零点整夜常驻、傍晚设定关灯后回到首页恰逢清晨。
  // 下午/晚上不强行开门，交给自动场景显示备菜/打烊。
  useEffect(() => {
    if (!profile || !tourDone) return
    const check = () => {
      if (view === 'home' && lastOpenDate !== getTodayString() && isMorningOpenTime()) {
        setView('morningOpening')
      }
    }
    check() // 立即查一次：进首页就开门，不用等下一次轮询
    const id = window.setInterval(check, 60_000)
    return () => window.clearInterval(id)
  }, [profile, tourDone, view, lastOpenDate])

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
    clearChatHistory()
    const defaults = createDefaultStore()
    setProfile(null)
    setSpiritForm('base')
    setDemoScene('cover')
    setTonightClosed(false)
    setTodayMood('normal')
    setMiddayDone(false)
    setAutoSceneEnabled(true)
    setReminders(defaults.settings.reminders)
    setTourDone(false)
    setSleepInsights(defaults.settings.sleepInsights)
    setEveningPrepare({ plannedLightsOffTime: '23:00', worry: '', savedAt: null })
    const resetEntries = isDemoMode() ? createDefaultLogEntries() : []
    setLogEntries(resetEntries)
    setGuestProgress(injectDemoGuestSeeds({}))
    setDishProgress({})
    // 演示版重置后也从示例 7 晚推导累计早睡，避免"客人变新客/累计早睡=0"与示例数据不自洽
    setSpiritProgress(
      isDemoMode()
        ? evaluateSpiritUnlocks(defaults.spirit.progress, resetEntries).updated
        : defaults.spirit.progress,
    )
    setLastOpenDate(null)
    setView('home')
    setGuestBookPage(0)
    setHomeGuestKeys([])
    setArrivalPending(false)
    setDebugHotspots(false)
    setReturnMessage(null)
    saveReturnMessage(null)
  }

  // ── Onboarding ──
  if (!profile) {
    return (
      <>
        <Onboarding
          onComplete={(p) => {
            setProfile(p)
            setSpiritForm(p.spiritAppearance)
            setEveningPrepare({
              plannedLightsOffTime: p.defaultLightsOffTime,
              worry: '',
              savedAt: null,
            })
            // 不在此把"上次开门"设成今天——否则注册当天清晨永远进不了开门仪式、铺子空无一客。
            // 留空(null)，由引导结束后回到首页的清晨分流来开门（见上方 effect）。
            setLastOpenDate(null)
            const initialDish = evaluateDishUnlocks({}, [], {})
            setDishProgress(initialDish.updated)
          }}
        />
        {/* 路演版首次进入即说明这是演示数据 */}
        <DemoNotice />
      </>
    )
  }

  // ── New-shopkeeper guided tour (runs once after onboarding) ──
  if (!tourDone) {
    return (
      <GuideTour
        spiritName={profile.spiritName}
        onGoToEveningPrepare={() => { setTourDone(true); setDemoScene('evening'); setView('eveningPrepare') }}
        onFinishToHome={() => { setTourDone(true); setView('home') }}
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

    // 昨晚睡眠分析：把还没折进 logEntries[0] 的实时 screenOff / 夜醒次数先并进去算
    const prevEntry = logEntries[0]
    const nowIso = new Date().toISOString()
    const mergedPrev = prevEntry
      ? {
          ...prevEntry,
          screenOffTimestamp: prevEntry.screenOffTimestamp ?? getLastScreenOffTime() ?? undefined,
          realOpenTimestamp: prevEntry.realOpenTimestamp ?? nowIso,
          nightWakes: prevEntry.nightWakes ?? countNightReturns(prevEntry.realCloseTimestamp, nowIso),
        }
      : null
    // 只在"昨晚确实打烊了"(tonightClosed) 才展示昨晚睡眠小结，
    // 否则 logEntries[0] 是更早的旧夜，会把几天前的休息时长当昨晚显示。
    const lastNightSleep = sleepInsights && tonightClosed ? analyzeNight(mergedPrev) : null
    const sleepSummary = summarizeNights(mergedPrev ? [mergedPrev, ...logEntries.slice(1)] : logEntries)
    const sleepWarning = sleepInsights ? (detectWarnings(sleepSummary, lang)[0] ?? null) : null

    return (
      <MorningOpening
        spiritName={profile.spiritName}
        spiritForm={spiritForm}
        nightType={profile.nightType}
        lastNightClosed={tonightClosed}
        lastCloseTime={logEntries[0]?.closeTime ?? null}
        lastNightWorry={logEntries[0]?.worry ?? null}
        trend={trend}
        spiritProgress={spiritProgress}
        todayGuestKeys={todayGuestKeys}
        newDishUnlocks={newDishUnlocks}
        sleepInsightsEnabled={sleepInsights}
        lastNightSleep={lastNightSleep}
        sleepWarning={sleepWarning}
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
          if (stampedEntries[0]) {
            const head = { ...stampedEntries[0] }
            const screenOffTimestamp = getLastScreenOffTime()
            if (screenOffTimestamp && !head.screenOffTimestamp) {
              head.screenOffTimestamp = screenOffTimestamp
              clearLastScreenOffTime()
            }
            // 记下夜里又拿起手机的次数（用于睡眠洞察与温柔预警）
            if (head.nightWakes === undefined) {
              head.nightWakes = countNightReturns(head.realCloseTimestamp, head.realOpenTimestamp ?? nowIso)
            }
            stampedEntries = [head, ...stampedEntries.slice(1)]
          }
          setLogEntries(stampedEntries)
          setTodayMood(trend.sceneMood)

          const updatedGP = recordDailyVisits(todayGuestKeys, guestProgress)
          setGuestProgress(updatedGP)
          runProgressionChecks(stampedEntries, updatedGP)

          // 让客人“走进来”：仪式结束回首页时播一次出餐迎客
          setHomeGuestKeys(todayGuestKeys)
          setArrivalPending(true)

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

          <div className="flex items-center gap-2">
            {ambientAudio.isPlaying ? (
              <button
                type="button"
                className="pointer-events-auto animate-pulse rounded-full bg-ink/20 px-3 py-1.5 text-xs text-paper backdrop-blur-sm transition hover:bg-ink/30"
                onClick={() => setView('radio')}
              >
                ♫ {t(`radio.ch.${ambientAudio.currentChannel}.name`)}
              </button>
            ) : null}

            {/* 演示版：演示导航开关 */}
            {isDemoMode() ? (
              <button
                type="button"
                className={`pointer-events-auto rounded-full px-3 py-1.5 text-xs backdrop-blur-sm transition ${debugHotspots ? 'bg-butter/70 text-ink' : 'bg-ink/20 text-paper'}`}
                onClick={() => setDebugHotspots((c) => !c)}
              >
                {lang === 'en' ? 'Demo' : '演示'}
              </button>
            ) : null}

            {/* 设置 */}
            <button
              type="button"
              aria-label={t('settings.title')}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-ink/20 text-paper backdrop-blur-sm transition hover:bg-ink/30"
              onClick={() => setView('settings')}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.5.5a1 1 0 00-1 .91L5.42 2.8a5.5 5.5 0 00-1.5.87L2.6 3.13a1 1 0 00-1.14.44L.46 5.43a1 1 0 00.22 1.25l1.14.93a5.6 5.6 0 000 1.78l-1.14.93a1 1 0 00-.22 1.25l1 1.86a1 1 0 001.14.44l1.32-.54a5.5 5.5 0 001.5.87l.08 1.39a1 1 0 001 .91h2a1 1 0 001-.91l.08-1.39a5.5 5.5 0 001.5-.87l1.32.54a1 1 0 001.14-.44l1-1.86a1 1 0 00-.22-1.25l-1.14-.93a5.6 5.6 0 000-1.78l1.14-.93a1 1 0 00.22-1.25l-1-1.86a1 1 0 00-1.14-.44l-1.32.54a5.5 5.5 0 00-1.5-.87L9.5 1.41a1 1 0 00-1-.91h-2zM8 5.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    >
      <Home
        scene={demoScene}
        debugHotspots={debugHotspots}
        guestKeys={homeGuestKeys}
        guestProgress={guestProgress}
        playArrival={arrivalPending}
        onArrivalComplete={() => setArrivalPending(false)}
        spiritName={profile.spiritName}
        spiritForm={spiritForm}
        onOpenSpiritChat={() => { setChatFromEvening(false); setView('spiritChat') }}
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
            if (!window.confirm(t('home.confirmReopen'))) return
            setTonightClosed(false)
          }
          setDemoScene(scene)
          if (scene === 'evening') setView('eveningPrepare')
          if (scene === 'night') setView('nightClosing')
          if (scene === 'daytime' && !middayDone) setView('middayTransition')
        }}
        onOpenSettings={() => setView('settings')}
        onDemoJump={(event) => {
          // 演示期间别让"自动按真实时间切场景"把背景又切回去（拿掉时间模拟后 getNow=真实时间），
          // 这样事件结束回到首页能看到对应时段的背景图（清晨/白天/傍晚/夜晚）。
          autoSceneSuppressedUntil.current = Date.now() + 30 * 60 * 1000
          if (event === 'morningOpening') { setView('morningOpening'); return }
          if (event === 'middayTransition') {
            // 没客人就先 roll 一批，午间过场才有人可散
            if (homeGuestKeys.length === 0) setHomeGuestKeys(rollTodayGuests('normal', guestProgress))
            setDemoScene('daytime'); setView('middayTransition'); return
          }
          if (event === 'eveningPrepare') { setDemoScene('evening'); setView('eveningPrepare'); return }
          if (event === 'nightClosing') { setDemoScene('night'); setView('nightClosing') }
        }}
        onReplayTour={() => setTourDone(false)}
      />

      {view === 'recipeBookConfirm' ? (
        <RecipeBookConfirmView background={sceneByDemo[demoScene]} onConfirm={() => setView('recipeBookOpen')} onCancel={() => setView('home')} />
      ) : null}
      {view === 'recipeBookOpen' ? (
        <RecipeBookOverlay background={sceneByDemo[demoScene]} dishProgress={dishProgress} onClose={() => setView('home')} />
      ) : null}
      {view === 'guestBookConfirm' ? (
        <GuestBookConfirmView background={sceneByDemo[demoScene]} onConfirm={() => setView('guestBookOpen')} onCancel={() => setView('home')} />
      ) : null}
      {view === 'guestBookOpen' ? (
        <GuestBookOpenView
          page={guestBookPage}
          background={sceneByDemo[demoScene]}
          guestProgress={guestProgress}
          onBackToHome={() => setView('home')}
          onPrev={() => setGuestBookPage((c) => (c - 1 + guests.length) % guests.length)}
          onNext={() => setGuestBookPage((c) => (c + 1) % guests.length)}
        />
      ) : null}
      {view === 'spiritChat' ? (
        <SpiritChatOverlay
          spiritName={profile.spiritName}
          spiritForm={spiritForm}
          nightType={profile.nightType}
          currentScene={demoScene}
          tonightWorry={eveningPrepare.worry}
          fromEveningPrepare={chatFromEvening}
          onGoToEveningPrepare={() => setView('eveningPrepare')}
          onGoToNightClosing={() => setView('nightClosing')}
          onClose={() => { setChatFromEvening(false); setView('home') }}
        />
      ) : null}
      {view === 'spiritHut' ? (
        <SpiritHutOverlay
          spiritName={profile.spiritName}
          currentForm={spiritForm}
          spiritProgress={spiritProgress}
          guestProgress={guestProgress}
          dishProgress={dishProgress}
          logEntries={logEntries}
          onSelectForm={setSpiritForm}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'radio' ? <RadioOverlay audio={ambientAudio} onClose={() => setView('home')} /> : null}
      {view === 'logbook' ? <LogbookOverlay entries={logEntries} spiritName={profile.spiritName} showSleep={sleepInsights} onClose={() => setView('home')} /> : null}
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
          nightType={profile.nightType}
          onSave={(value) => setEveningPrepare(value)}
          onGoToSpiritChat={() => { setChatFromEvening(true); setView('spiritChat') }}
          onClose={() => setView('home')}
        />
      ) : null}
      {view === 'nightClosing' ? (
        <NightClosing
          spiritName={profile.spiritName}
          spiritForm={spiritForm}
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
          spiritForm={spiritForm}
          guestCount={getGuestCountByMood(todayMood)}
          shopMood={todayMood}
          guestKeys={homeGuestKeys}
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
          sleepInsights={sleepInsights}
          onUpdateSleepInsights={setSleepInsights}
          onResetAll={resetAll}
          onClose={() => setView('home')}
        />
      ) : null}

      <DemoNotice />
    </AppShell>
  )
}
