import { describe, it, expect } from 'vitest'
import { computeAchievements, achievementProgress, sleepRecords, type AchievementInput } from './achievements'
import type { LogEntry } from './storage'

const baseInput: AchievementInput = {
  goodNights: 0,
  skinsUnlocked: 4,
  totalSkins: 8,
  guestsMet: 0,
  totalGuests: 7,
  dishesMade: 0,
  totalDishes: 5,
  longestRestMinutes: 0,
  earliestPutDownScale: null,
}

describe('computeAchievements', () => {
  it('零数据时早睡/收集类成就都未解锁', () => {
    const list = computeAchievements(baseInput)
    const byKey = Object.fromEntries(list.map((a) => [a.key, a]))
    expect(byKey['firstNight'].unlocked).toBe(false)
    expect(byKey['firstGuest'].unlocked).toBe(false)
    expect(byKey['earlyDown'].unlocked).toBe(false)
  })

  it('累计 7 晚解锁 firstNight + weekEarly，但 monthEarly 未解锁', () => {
    const list = computeAchievements({ ...baseInput, goodNights: 7 })
    const byKey = Object.fromEntries(list.map((a) => [a.key, a]))
    expect(byKey['firstNight'].unlocked).toBe(true)
    expect(byKey['weekEarly'].unlocked).toBe(true)
    expect(byKey['monthEarly'].unlocked).toBe(false)
  })

  it('23:00 前放下手机解锁 earlyDown，之后不解锁', () => {
    expect(computeAchievements({ ...baseInput, earliestPutDownScale: 290 }).find((a) => a.key === 'earlyDown')!.unlocked).toBe(true)
    expect(computeAchievements({ ...baseInput, earliestPutDownScale: 360 }).find((a) => a.key === 'earlyDown')!.unlocked).toBe(false)
  })

  it('睡满 8 小时解锁 soundSleep', () => {
    expect(computeAchievements({ ...baseInput, longestRestMinutes: 500 }).find((a) => a.key === 'soundSleep')!.unlocked).toBe(true)
    expect(computeAchievements({ ...baseInput, longestRestMinutes: 400 }).find((a) => a.key === 'soundSleep')!.unlocked).toBe(false)
  })

  it('集齐所有皮肤解锁 collector', () => {
    expect(computeAchievements({ ...baseInput, skinsUnlocked: 8, totalSkins: 8 }).find((a) => a.key === 'collector')!.unlocked).toBe(true)
  })
})

describe('achievementProgress', () => {
  it('统计已解锁/总数', () => {
    const p = achievementProgress(computeAchievements({ ...baseInput, goodNights: 7 }))
    expect(p.total).toBeGreaterThan(0)
    expect(p.unlocked).toBeGreaterThanOrEqual(2)
    expect(p.unlocked).toBeLessThanOrEqual(p.total)
  })
})

describe('sleepRecords', () => {
  function iso(y: number, mo: number, d: number, h: number, mi: number): string {
    return new Date(y, mo, d, h, mi).toISOString()
  }
  function night(close: string, screenOff: string, open: string): LogEntry {
    return {
      date: 'x', openTime: '07:00', closeTime: '23:00',
      shopMood: '平常' as LogEntry['shopMood'], guestCount: 5, closingNote: '按时打烊',
      realCloseTimestamp: close, screenOffTimestamp: screenOff, realOpenTimestamp: open,
    }
  }

  it('算最长一觉与最早放下手机', () => {
    const entries: LogEntry[] = [
      night(iso(2026, 0, 1, 22, 50), iso(2026, 0, 1, 23, 0), iso(2026, 0, 2, 7, 0)), // 8h, 放下23:00
      night(iso(2026, 0, 2, 22, 10), iso(2026, 0, 2, 22, 20), iso(2026, 0, 3, 7, 20)), // 9h, 放下22:20(更早)
    ]
    const r = sleepRecords(entries)
    expect(r.longestRestMinutes).toBe(540) // 22:20 → 07:20
    // 22:20 比 23:00 早 → earliest 对应 22:20 的刻度
    expect(r.earliestPutDownScale).toBe((22 - 18) * 60 + 20)
  })

  it('无有效记录时返回 0 / null', () => {
    const r = sleepRecords([])
    expect(r.longestRestMinutes).toBe(0)
    expect(r.earliestPutDownScale).toBeNull()
  })
})
