import { describe, it, expect } from 'vitest'
import { resolveInitialView } from './appView'

describe('resolveInitialView', () => {
  it('opens the morning ceremony when a new day needs it (takes priority over reminders)', () => {
    expect(resolveInitialView({ needsMorningOpening: true, reminderParam: null })).toBe('morningOpening')
    expect(resolveInitialView({ needsMorningOpening: true, reminderParam: 'evening' })).toBe('morningOpening')
  })

  it('deep-links to evening / closing from a tapped reminder', () => {
    expect(resolveInitialView({ needsMorningOpening: false, reminderParam: 'evening' })).toBe('eveningPrepare')
    expect(resolveInitialView({ needsMorningOpening: false, reminderParam: 'closing' })).toBe('nightClosing')
  })

  it('defaults to home', () => {
    expect(resolveInitialView({ needsMorningOpening: false, reminderParam: null })).toBe('home')
    expect(resolveInitialView({ needsMorningOpening: false, reminderParam: 'garbage' })).toBe('home')
  })
})
