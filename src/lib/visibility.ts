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

  const session = loadCurrentSession()
  if (!session || session.endedAt) {
    saveCurrentSession({ startedAt: new Date().toISOString(), endedAt: null })
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
