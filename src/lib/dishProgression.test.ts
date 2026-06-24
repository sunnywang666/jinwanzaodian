import { describe, it, expect } from 'vitest'
import { evaluateDishUnlocks, type DishProgressMap } from './dishProgression'
import type { GuestProgressMap } from './guestProgression'
import type { LogEntry } from './storage'

function goodNight(i: number): LogEntry {
  return {
    date: `day-${i}`,
    openTime: '07:00',
    closeTime: '23:00',
    shopMood: '平常' as LogEntry['shopMood'],
    guestCount: 5,
    closingNote: '按时打烊',
    screenOffTimestamp: '2026-01-01T23:00:00.000Z',
    isRealData: true,
  }
}

describe('evaluateDishUnlocks', () => {
  it('unlocks default dishes immediately and does not report them as new', () => {
    const { updated, newUnlocks } = evaluateDishUnlocks({}, [], {})
    expect(updated['bun'].unlocked).toBe(true)
    expect(updated['soy-milk'].unlocked).toBe(true)
    expect(newUnlocks).not.toContain('bun')
    expect(newUnlocks).not.toContain('soy-milk')
  })

  it('unlocks the milestone dish (youtiao) only after 3 good nights', () => {
    const before = evaluateDishUnlocks({}, [goodNight(0), goodNight(1)], {})
    expect(before.updated['youtiao']?.unlocked).toBeFalsy()

    const after = evaluateDishUnlocks({}, [goodNight(0), goodNight(1), goodNight(2)], {})
    expect(after.updated['youtiao'].unlocked).toBe(true)
    expect(after.newUnlocks).toContain('youtiao')
  })

  it('unlocks a guest dish when the guest reaches the required familiarity', () => {
    const notYet: GuestProgressMap = { fox: { totalVisits: 6, lastVisitDate: 'x', familiarityLevel: 2 } }
    expect(evaluateDishUnlocks({}, [], notYet).updated['millet-porridge']?.unlocked).toBeFalsy()

    const ready: GuestProgressMap = { fox: { totalVisits: 10, lastVisitDate: 'x', familiarityLevel: 3 } }
    const r = evaluateDishUnlocks({}, [], ready)
    expect(r.updated['millet-porridge'].unlocked).toBe(true)
    expect(r.newUnlocks).toContain('millet-porridge')
  })

  it('does not re-unlock or re-report an already-unlocked dish', () => {
    const seed: DishProgressMap = { youtiao: { unlocked: true, unlockedBy: 'milestone' } }
    const r = evaluateDishUnlocks(seed, [goodNight(0), goodNight(1), goodNight(2)], {})
    expect(r.newUnlocks).not.toContain('youtiao')
  })

  it('does not mutate the input progress map', () => {
    const input: DishProgressMap = {}
    evaluateDishUnlocks(input, [], {})
    expect(Object.keys(input)).toHaveLength(0)
  })
})
