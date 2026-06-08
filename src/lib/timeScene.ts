/**
 * timeScene.ts — v6.5
 *
 * Updated to accept optional `now` parameter for time simulation.
 */

import type { DemoScene } from './storage'
import { getNow } from './timeSimulator'

function parseHHMM(timeStr: string): { h: number; m: number } {
  const [h, m] = timeStr.split(':').map(Number)
  return { h: h ?? 23, m: m ?? 0 }
}

function minutesFromDate(date: Date) {
  return date.getHours() * 60 + date.getMinutes()
}

function timeToMinutes(h: number, m: number) {
  return h * 60 + m
}

export interface TimeSceneOptions {
  lightsOffTime: string
  tonightClosed: boolean
  todayMood: 'busy' | 'normal' | 'quiet'
}

const moodToScene: Record<'busy' | 'normal' | 'quiet', DemoScene> = {
  busy: 'busy',
  normal: 'normal',
  quiet: 'quiet',
}

export function getSceneForCurrentTime(options: TimeSceneOptions): DemoScene {
  const { lightsOffTime, tonightClosed, todayMood } = options

  if (tonightClosed) return 'lightsOff'

  const now = minutesFromDate(getNow())
  const close = parseHHMM(lightsOffTime)
  const closeMin = timeToMinutes(close.h, close.m)

  const isAfterClose =
    closeMin < timeToMinutes(6, 0)
      ? now >= closeMin || now < timeToMinutes(6, 0)
      : now >= closeMin

  if (isAfterClose || now < timeToMinutes(6, 0)) return 'night'
  if (now < timeToMinutes(9, 0)) return moodToScene[todayMood]
  if (now < timeToMinutes(11, 0)) return 'normal'
  if (now < timeToMinutes(14, 0)) return 'daytime'
  if (now < timeToMinutes(16, 0)) return 'nap'

  const eveningStart = Math.max(timeToMinutes(16, 0), closeMin - 120)
  if (now >= eveningStart) return 'evening'

  return 'daytime'
}
