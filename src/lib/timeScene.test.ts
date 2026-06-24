import { describe, it, expect, afterEach } from 'vitest'
import { getSceneForCurrentTime, type TimeSceneOptions } from './timeScene'
import { setSimulatedTime } from './timeSimulator'

// getSceneForCurrentTime 读 getNow()，用时间模拟器固定当前时间
function at(h: number, m = 0) {
  setSimulatedTime(new Date(2026, 0, 1, h, m))
}
afterEach(() => setSimulatedTime(null))

const base: TimeSceneOptions = { lightsOffTime: '23:00', tonightClosed: false, todayMood: 'normal' }

describe('getSceneForCurrentTime', () => {
  it('returns lightsOff whenever tonight is already closed, regardless of time', () => {
    at(7, 0)
    expect(getSceneForCurrentTime({ ...base, tonightClosed: true })).toBe('lightsOff')
    at(15, 0)
    expect(getSceneForCurrentTime({ ...base, tonightClosed: true })).toBe('lightsOff')
  })

  it('is night before 6:00', () => {
    at(3, 0)
    expect(getSceneForCurrentTime(base)).toBe('night')
  })

  it('uses the day mood in the morning window (6:00-9:00)', () => {
    at(7, 0)
    expect(getSceneForCurrentTime({ ...base, todayMood: 'busy' })).toBe('busy')
    expect(getSceneForCurrentTime({ ...base, todayMood: 'normal' })).toBe('normal')
    expect(getSceneForCurrentTime({ ...base, todayMood: 'quiet' })).toBe('quiet')
  })

  it('walks through the daytime windows', () => {
    at(10, 0)
    expect(getSceneForCurrentTime(base)).toBe('normal')
    at(12, 0)
    expect(getSceneForCurrentTime(base)).toBe('daytime')
    at(15, 0)
    expect(getSceneForCurrentTime(base)).toBe('nap')
  })

  it('turns to evening within 2h before lights-off, daytime before that', () => {
    // close 23:00 -> eveningStart = max(16:00, 21:00) = 21:00
    at(20, 0)
    expect(getSceneForCurrentTime(base)).toBe('daytime')
    at(21, 30)
    expect(getSceneForCurrentTime(base)).toBe('evening')
  })

  it('is night at/after lights-off time', () => {
    at(23, 30)
    expect(getSceneForCurrentTime(base)).toBe('night')
  })
})
