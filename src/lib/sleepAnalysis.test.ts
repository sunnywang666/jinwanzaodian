import { describe, it, expect } from 'vitest'
import {
  analyzeNight,
  summarizeNights,
  detectWarnings,
  putDownScale,
  scaleToClock,
  formatDuration,
} from './sleepAnalysis'
import type { LogEntry } from './storage'

// 用本地时间分量构造时间戳，跨时区也稳（rest 是两瞬时之差，与时区无关；
// putDownScale 用 getHours 取本地小时，round-trip 后仍是同一本地小时）
function iso(y: number, mo: number, d: number, h: number, mi: number): string {
  return new Date(y, mo, d, h, mi).toISOString()
}

function night(opts: {
  close?: string
  screenOff?: string
  open?: string
  nightWakes?: number
}): LogEntry {
  return {
    date: 'x',
    openTime: '07:00',
    closeTime: '23:00',
    shopMood: '平常' as LogEntry['shopMood'],
    guestCount: 5,
    closingNote: '按时打烊',
    realCloseTimestamp: opts.close,
    screenOffTimestamp: opts.screenOff,
    realOpenTimestamp: opts.open,
    nightWakes: opts.nightWakes,
  }
}

describe('analyzeNight', () => {
  it('数据不全时返回 null', () => {
    expect(analyzeNight(null)).toBeNull()
    expect(analyzeNight(night({ close: iso(2026, 0, 1, 23, 0) }))).toBeNull() // 没有 open
    expect(analyzeNight(night({ open: iso(2026, 0, 2, 7, 0) }))).toBeNull() // 没有 putDown
  })

  it('用 screenOff 算休息时长与磨蹭延迟', () => {
    const n = analyzeNight(
      night({
        close: iso(2026, 0, 1, 22, 50),
        screenOff: iso(2026, 0, 1, 23, 0),
        open: iso(2026, 0, 2, 7, 0),
        nightWakes: 2,
      }),
    )!
    expect(n).not.toBeNull()
    expect(n.restMinutes).toBe(480) // 23:00 → 07:00 = 8h
    expect(n.settleDelayMinutes).toBe(10) // 22:50 → 23:00
    expect(n.nightWakes).toBe(2)
    expect(n.basedOnScreenOff).toBe(true)
  })

  it('没有 screenOff 时退回打烊时刻，settleDelay 为 null', () => {
    const n = analyzeNight(
      night({ close: iso(2026, 0, 1, 23, 0), open: iso(2026, 0, 2, 7, 30) }),
    )!
    expect(n.restMinutes).toBe(510)
    expect(n.settleDelayMinutes).toBeNull()
    expect(n.basedOnScreenOff).toBe(false)
  })

  it('剔除不合理时长（太短/太长）', () => {
    expect(
      analyzeNight(night({ screenOff: iso(2026, 0, 1, 23, 0), open: iso(2026, 0, 1, 23, 30) })),
    ).toBeNull() // 30 分钟
    expect(
      analyzeNight(night({ screenOff: iso(2026, 0, 1, 20, 0), open: iso(2026, 0, 2, 20, 0) })),
    ).toBeNull() // 24 小时
  })
})

describe('putDownScale / scaleToClock', () => {
  it('傍晚到凌晨单调递增', () => {
    expect(putDownScale(new Date(2026, 0, 1, 22, 0))).toBeLessThan(putDownScale(new Date(2026, 0, 1, 23, 30)))
    expect(putDownScale(new Date(2026, 0, 1, 23, 30))).toBeLessThan(putDownScale(new Date(2026, 0, 2, 0, 30)))
    expect(putDownScale(new Date(2026, 0, 2, 0, 30))).toBeLessThan(putDownScale(new Date(2026, 0, 2, 1, 0)))
  })

  it('刻度能折回 HH:MM', () => {
    expect(scaleToClock(putDownScale(new Date(2026, 0, 1, 23, 18)))).toBe('23:18')
    expect(scaleToClock(putDownScale(new Date(2026, 0, 2, 0, 45)))).toBe('00:45')
  })
})

describe('formatDuration', () => {
  it('中英文格式', () => {
    expect(formatDuration(440, 'zh')).toBe('7 小时 20 分')
    expect(formatDuration(420, 'zh')).toBe('7 小时')
    expect(formatDuration(45, 'zh')).toBe('45 分钟')
    expect(formatDuration(440, 'en')).toBe('7 h 20 min')
  })
})

describe('summarizeNights', () => {
  it('空数据返回 0 夜', () => {
    expect(summarizeNights([]).nights).toBe(0)
    expect(summarizeNights([night({})]).nights).toBe(0)
  })

  it('聚合平均休息、夜醒、规律性、趋势', () => {
    // 最新在前：最近两晚休息更多、放下更早；之前两晚更晚、休息更少
    const entries: LogEntry[] = [
      night({ close: iso(2026, 0, 5, 22, 40), screenOff: iso(2026, 0, 5, 22, 50), open: iso(2026, 0, 6, 7, 0), nightWakes: 0 }), // 490
      night({ close: iso(2026, 0, 4, 22, 50), screenOff: iso(2026, 0, 4, 23, 0), open: iso(2026, 0, 5, 7, 0), nightWakes: 0 }), // 480
      night({ close: iso(2026, 0, 3, 23, 50), screenOff: iso(2026, 0, 4, 0, 0), open: iso(2026, 0, 4, 7, 0), nightWakes: 2 }), // 420
      night({ close: iso(2026, 0, 2, 23, 50), screenOff: iso(2026, 0, 3, 0, 30), open: iso(2026, 0, 3, 7, 0), nightWakes: 1 }), // 390
    ]
    const s = summarizeNights(entries)
    expect(s.nights).toBe(4)
    expect(s.avgRestMinutes).toBe(445) // (490+480+420+390)/4
    expect(s.totalNightWakes).toBe(3)
    // 最近两晚放下更早 → 趋势为负（更早）
    expect(s.putDownTrendMinutes).toBeLessThan(0)
    // 最近两晚休息更多 → 正
    expect(s.restTrendMinutes).toBeGreaterThan(0)
    expect(s.consistencyMinutes).not.toBeNull()
  })
})

describe('detectWarnings', () => {
  function shortNight(day: number): LogEntry {
    // 只休息 5 小时（300 分钟）
    return night({
      close: iso(2026, 0, day, 1, 50),
      screenOff: iso(2026, 0, day, 2, 0),
      open: iso(2026, 0, day, 7, 0),
      nightWakes: 0,
    })
  }

  it('不足 3 晚不预警', () => {
    expect(detectWarnings(summarizeNights([shortNight(1), shortNight(2)]), 'zh')).toHaveLength(0)
  })

  it('平均休息过短时给出 restShort', () => {
    const w = detectWarnings(summarizeNights([shortNight(1), shortNight(2), shortNight(3)]), 'zh')
    expect(w.some((x) => x.kind === 'restShort')).toBe(true)
  })

  it('夜里频繁拿手机给出 restless', () => {
    const restless = [1, 2, 3, 4].map((d) =>
      night({
        close: iso(2026, 0, d, 22, 50),
        screenOff: iso(2026, 0, d, 23, 0),
        open: iso(2026, 0, d + 1, 7, 0),
        nightWakes: 2,
      }),
    )
    const w = detectWarnings(summarizeNights(restless), 'zh')
    expect(w.some((x) => x.kind === 'restless')).toBe(true)
  })
})
