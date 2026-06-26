/**
 * visibility.ts — v6.33
 *
 * v6.33: add countNightReturns() — from the visibility log, count how many times
 * the app returned to the foreground between closing and next morning (a gentle
 * "picked the phone back up at night" signal). The final foreground event right
 * before morning (the morning open itself) is excluded via a tail buffer.
 *
 * Fix: on page load, read last session's endedAt to detect
 * tab close + reopen scenario and trigger onReturn.
 */

export interface VisibilityEvent {
  timestamp: string
  state: 'visible' | 'hidden'
}

export interface VisibilitySession {
  startedAt: string
  endedAt: string | null
}

const STORAGE_KEY = 'jinwanzaodian:visibility-log'
const SESSION_KEY = 'jinwanzaodian:visibility-session'

function loadEvents(): VisibilityEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as VisibilityEvent[]) : []
  } catch {
    return []
  }
}

function saveEvents(events: VisibilityEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-200)))
}

function loadCurrentSession(): VisibilitySession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as VisibilitySession) : null
  } catch {
    return null
  }
}

function saveCurrentSession(session: VisibilitySession | null) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export interface VisibilityCallbacks {
  onReturn?: (awayDurationMs: number) => void
  onLeave?: () => void
  onScreenOffAfterClosing?: () => void
}

export function startVisibilityTracking(
  callbacks: VisibilityCallbacks,
  isClosedTonight: () => boolean,
) {
  let lastHiddenAt: number | null = null

  // ── v5.4 fix: check for previous session on page load ──
  // If the last session has an endedAt (tab was closed), calculate
  // how long ago that was and trigger onReturn if > threshold.
  const previousSession = loadCurrentSession()
  if (previousSession?.endedAt) {
    const awayMs = Date.now() - new Date(previousSession.endedAt).getTime()
    if (awayMs > 0 && awayMs < 86_400_000) {
      // Only trigger for gaps under 24h (beyond that, morning opening handles it)
      callbacks.onReturn?.(awayMs)
    }
  }

  // Start a fresh session
  saveCurrentSession({ startedAt: new Date().toISOString(), endedAt: null })

  function handleVisibilityChange() {
    const now = new Date()
    const isoNow = now.toISOString()

    if (document.visibilityState === 'hidden') {
      lastHiddenAt = now.getTime()

      const events = loadEvents()
      events.push({ timestamp: isoNow, state: 'hidden' })
      saveEvents(events)

      const session = loadCurrentSession()
      if (session && !session.endedAt) {
        session.endedAt = isoNow
        saveCurrentSession(session)
      }

      callbacks.onLeave?.()

      if (isClosedTonight()) {
        callbacks.onScreenOffAfterClosing?.()
        try {
          localStorage.setItem('jinwanzaodian:last-screen-off', JSON.stringify(isoNow))
        } catch {
          // ignore
        }
      }
      return
    }

    const awayDuration = lastHiddenAt !== null ? now.getTime() - lastHiddenAt : 0

    const events = loadEvents()
    events.push({ timestamp: isoNow, state: 'visible' })
    saveEvents(events)

    saveCurrentSession({ startedAt: isoNow, endedAt: null })
    callbacks.onReturn?.(awayDuration)
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}

/**
 * 数"夜里又拿起手机"的次数：可见性日志里，落在 (closeIso, morningIso) 之间的
 * `visible` 事件数。头部缓冲跳过打烊瞬间的余波，尾部缓冲排除早上开门那一次。
 * 拿不到合法时间戳时返回 0。注意：只能抓到"重新打开本 App"，抓不到切去刷别的 App。
 */
export function countNightReturns(closeIso: string | null | undefined, morningIso: string): number {
  if (!closeIso) return 0
  const closeMs = new Date(closeIso).getTime()
  const morningMs = new Date(morningIso).getTime()
  if (!Number.isFinite(closeMs) || !Number.isFinite(morningMs) || morningMs <= closeMs) return 0

  const HEAD_BUFFER = 60_000 // 打烊后 1 分钟内的回前台不算（仪式余波）
  const TAIL_BUFFER = 120_000 // 早上开门前 2 分钟内的回前台不算（开门本身）

  let count = 0
  for (const e of loadEvents()) {
    if (e.state !== 'visible') continue
    const t = new Date(e.timestamp).getTime()
    if (!Number.isFinite(t)) continue
    if (t > closeMs + HEAD_BUFFER && t < morningMs - TAIL_BUFFER) count += 1
  }
  return count
}

export function getLastScreenOffTime(): string | null {
  try {
    const raw = localStorage.getItem('jinwanzaodian:last-screen-off')
    return raw ? (JSON.parse(raw) as string) : null
  } catch {
    return null
  }
}

export function clearLastScreenOffTime() {
  localStorage.removeItem('jinwanzaodian:last-screen-off')
}

export function clearVisibilityData() {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('jinwanzaodian:last-screen-off')
}
