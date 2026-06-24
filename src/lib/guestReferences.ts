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

import { animalAssets } from './assets'
import type { AssetSource } from './assets'

export interface GuestReference {
  key: keyof typeof animalAssets
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
]
