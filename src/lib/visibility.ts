/**
 * visibility.ts — v5.4
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
