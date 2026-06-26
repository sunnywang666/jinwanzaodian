/**
 * guestReferences.ts — 客人的「永恒身份」参考数据
 *
 * 只含身份字段（key/name/image/description/favoriteFood），永远真实、对任何用户都成立。
 * 来访次数、熟络度等「进度」数据不在这里——它们的权威来源是 guestProgress（[[guestProgression]]），
 * 演示用的进度种子见 [[demoSeed]]，仅 demo 模式注入。
 *
 * 这样拆分是为了根治「新用户被显示成 demo 假值（阿橘来访9次/熟客）」这一类 bug：
 * 身份和进度分离后，真实用户只会看到 guestProgress 里的真实进度。
 */

import { animalAssets, guestSpiritAssets } from './assets'
import type { AssetSource } from './assets'

// 客人身份 key。动物用 animalAssets 的键；单体精灵用 spirit1~3；
// 成套精灵用 `spiritFamily{系列号}_{成员号}`——这里的"系列"只是美术上成套（同款不同色），
// 各成员剧情上彼此无关，各过各的日子，别写成一家人。
export type GuestKey =
  | keyof typeof animalAssets
  | 'spirit1' | 'spirit2' | 'spirit3'
  | `spiritFamily${number}_${number}`

export interface GuestReference {
  key: GuestKey
  /** 精灵客人 = true（用合成/整张精灵图）；动物客人省略或 false */
  isSpirit?: boolean
  name: string
  image: AssetSource
  description: string
  favoriteFood: string
}

export const guestReferences: GuestReference[] = [
  { key: 'cat', name: '橘猫阿橘', image: animalAssets.cat, description: '总是第一个来，但只轻轻点头。', favoriteFood: '油条' },
  { key: 'rabbit', name: '白兔小团', image: animalAssets.rabbit, description: '喜欢慢慢喝完一整碗热粥。', favoriteFood: '粥' },
  { key: 'raccoon', name: '小浣熊灰灰', image: animalAssets.raccoon, description: '手里总想拿点什么，停下来时反而很乖。', favoriteFood: '豆浆' },
  { key: 'bear', name: '小熊栗子', image: animalAssets.bear, description: '抱着热包子时最安心。', favoriteFood: '包子' },
  { key: 'fox', name: '小狐狸桂花', image: animalAssets.fox, description: '看起来很精神，其实也会困。', favoriteFood: '银耳枸杞粥' },
  { key: 'sparrow', name: '小麻雀啾啾', image: animalAssets.sparrow, description: '小小一只，但很认真地记得路。', favoriteFood: '茶叶蛋' },
  { key: 'bird', name: '小鸟阿音', image: animalAssets.bird, description: '为这一屋子的安静而来。', favoriteFood: '豆浆' },

  // ── 精灵客人（名字为占位，待用户定稿）──
  { key: 'spirit1', isSpirit: true, name: '云絮', image: guestSpiritAssets.spirit1, description: '软软地挨着柜台，话不多，但来得很勤。', favoriteFood: '豆浆' },
  { key: 'spirit2', isSpirit: true, name: '晚棠', image: guestSpiritAssets.spirit2, description: '心里揣着点甜，遇到熟人才肯露出来。', favoriteFood: '包子' },
  { key: 'spirit3', isSpirit: true, name: '盈月', image: guestSpiritAssets.spirit3, description: '圆滚滚的，笑起来会轻轻晃。', favoriteFood: '小米粥' },

  // ── 成套精灵：spiritFamily{系列号}_{成员号}，现仅系列1·1号一张图。
  //    后续系列1会补 2~5 号（同款不同色），并会有系列2、3…；各成员剧情独立。──
  { key: 'spiritFamily1_1', isSpirit: true, name: '归迟', image: guestSpiritAssets.spiritFamily1, description: '总在快打烊时才慢悠悠晃进来，有自己的一套日子。', favoriteFood: '油条' },
]
