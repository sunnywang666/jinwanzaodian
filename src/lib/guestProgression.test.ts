import { describe, it, expect } from 'vitest'
import {
  getFamiliarityLevel,
  getFamiliarityLabel,
  recordDailyVisits,
  type GuestProgressMap,
} from './guestProgression'

describe('getFamiliarityLevel', () => {
  it('maps visit counts to levels at the 0/3/6/10 thresholds', () => {
    expect(getFamiliarityLevel(0)).toBe(0)
    expect(getFamiliarityLevel(2)).toBe(0)
    expect(getFamiliarityLevel(3)).toBe(1)
    expect(getFamiliarityLevel(5)).toBe(1)
    expect(getFamiliarityLevel(6)).toBe(2)
    expect(getFamiliarityLevel(9)).toBe(2)
    expect(getFamiliarityLevel(10)).toBe(3)
    expect(getFamiliarityLevel(50)).toBe(3)
  })
})

describe('getFamiliarityLabel', () => {
  it('labels each level', () => {
    expect(getFamiliarityLabel(0)).toBe('新客')
    expect(getFamiliarityLabel(1)).toBe('渐熟')
    expect(getFamiliarityLabel(2)).toBe('常来')
    expect(getFamiliarityLabel(3)).toBe('熟客')
  })
})

describe('recordDailyVisits', () => {
  it('increments totalVisits and keeps familiarityLevel consistent', () => {
    let progress: GuestProgressMap = {}
    // 3 visits -> level 1
    for (let i = 0; i < 3; i++) progress = recordDailyVisits(['fox'], progress)
    expect(progress.fox.totalVisits).toBe(3)
    expect(progress.fox.familiarityLevel).toBe(1)
    // up to 10 visits -> level 3
    for (let i = 0; i < 7; i++) progress = recordDailyVisits(['fox'], progress)
    expect(progress.fox.totalVisits).toBe(10)
    expect(progress.fox.familiarityLevel).toBe(3)
  })

  it('records multiple guests in one day and leaves others untouched', () => {
    const progress = recordDailyVisits(['cat', 'rabbit'], { bear: { totalVisits: 4, lastVisitDate: '2026-01-01', familiarityLevel: 1 } })
    expect(progress.cat.totalVisits).toBe(1)
    expect(progress.rabbit.totalVisits).toBe(1)
    expect(progress.bear.totalVisits).toBe(4) // untouched
  })

  it('does not mutate the input map', () => {
    const input: GuestProgressMap = {}
    recordDailyVisits(['cat'], input)
    expect(input.cat).toBeUndefined()
  })
})
