/**
 * timeSimulator.ts — v6.5
 *
 * Global time override for testing.
 * When enabled, all app logic uses simulated time instead of new Date().
 *
 * Usage:
 *   import { getNow, isSimulating } from './timeSimulator'
 *   const now = getNow()  // returns simulated Date or real Date
 */

let simulatedTime: Date | null = null

/** Get current time — simulated if active, real otherwise */
export function getNow(): Date {
  return simulatedTime ? new Date(simulatedTime.getTime()) : new Date()
}

/** Check if time simulation is active */
export function isSimulating(): boolean {
  return simulatedTime !== null
}

/** Set simulated time (null to disable) */
export function setSimulatedTime(time: Date | null) {
  simulatedTime = time ? new Date(time.getTime()) : null
}

/** Get simulated time or null */
export function getSimulatedTime(): Date | null {
  return simulatedTime ? new Date(simulatedTime.getTime()) : null
}

/** Advance simulated time by minutes */
export function advanceSimMinutes(minutes: number) {
  if (!simulatedTime) return
  simulatedTime = new Date(simulatedTime.getTime() + minutes * 60 * 1000)
}

/** Advance simulated time by days */
export function advanceSimDays(days: number) {
  if (!simulatedTime) return
  simulatedTime = new Date(simulatedTime.getTime() + days * 24 * 60 * 60 * 1000)
}
