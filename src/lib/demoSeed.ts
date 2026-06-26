/**
 * demoSeed.ts — 仅 demo 模式注入的客人进度种子
 *
 * 这些来访次数只对「演示/路演」有意义，对真实新用户是假的。
 * 之前它们混在 demoData 的 guests 里被无条件读取，导致真实用户也看到「阿橘来访9次/熟客」。
 * 现在拆出来：只有 isDemoMode() 为真时，才把这些种子写进 guestProgress，
 * 让 demo 包仍有完整演示数据，真实包则保持空白（新客/0 次）。
 *
 * 身份数据见 [[guestReferences]]；进度规则见 [[guestProgression]]。
 */

import { getFamiliarityLevel, type GuestProgressMap } from './guestProgression'
import { isDemoMode } from './devMode'

/** 演示用来访次数（仅 demo 模式注入） */
const demoGuestSeeds: Array<{ key: string; visitCount: number }> = [
  { key: 'cat', visitCount: 9 },
  { key: 'rabbit', visitCount: 6 },
  { key: 'raccoon', visitCount: 5 },
  { key: 'bear', visitCount: 4 },
  { key: 'fox', visitCount: 3 },
  { key: 'sparrow', visitCount: 2 },
  { key: 'bird', visitCount: 2 },
  // 精灵客人
  { key: 'spirit1', visitCount: 7 },
  { key: 'spirit2', visitCount: 4 },
  { key: 'spirit3', visitCount: 3 },
  { key: 'spiritFamily1_1', visitCount: 1 },
]

/**
 * demo 模式下，给还没有进度记录的客人补上演示进度；非 demo 原样返回。
 * 用于 App 初始化 guestProgress（仅当尚无真实进度时）。
 */
export function injectDemoGuestSeeds(progress: GuestProgressMap): GuestProgressMap {
  if (!isDemoMode()) return progress
  const today = new Date().toISOString().split('T')[0]!
  const seeded: GuestProgressMap = { ...progress }
  for (const seed of demoGuestSeeds) {
    if (seeded[seed.key]) continue
    seeded[seed.key] = {
      totalVisits: seed.visitCount,
      lastVisitDate: today,
      familiarityLevel: getFamiliarityLevel(seed.visitCount),
    }
  }
  return seeded
}
