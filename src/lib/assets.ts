import type { DemoScene, SpiritForm } from './storage'

export interface AssetSource {
  src: string
  fallbackSrc?: string
}

const assetBase = `${import.meta.env.BASE_URL}assets/`

function asset(filename: string): AssetSource {
  return { src: `${assetBase}${filename}` }
}

function trimmedAsset(filename: string): AssetSource {
  return {
    src: `${assetBase}trimmed/${filename}`,
    fallbackSrc: `${assetBase}${filename}`,
  }
}

export const sceneAssets = {
  // 主场景天色四图（用户提供）：清晨 / 白天 / 傍晚 / 夜晚
  mainBackground: asset('scene-day.png'),
  coverShop: asset('cover-shop.png'),
  coverShopTransparent: asset('cover-shop-transparent.png'),
  busyMorning: asset('scene-morning.png'),
  normalMorning: asset('scene-morning.png'),
  quietMorning: asset('scene-morning.png'),
  daytimePrep: asset('scene-day.png'),
  afternoonNap: asset('scene-day.png'),
  eveningPrepare: asset('scene-evening.png'),
  nightClose: asset('scene-night.png'),
  lightsOff: asset('scene-night.png'),
} as const

export const bookAssets = {
  recipeCover: trimmedAsset('asset-recipe-book-cover.png'),
  recipeInner: asset('ui-recipe-book-inner.png'),
  guestBookCover: trimmedAsset('asset-guest-book-cover.png'),
  guestBookInner: asset('ui-guest-book-inner.png'),
  dishFrame: asset('asset-dish-frame.png'),
} as const

export const toolAssets = {
  radio: trimmedAsset('asset-radio.png'),
  spiritHut: asset('asset-spirit-hut.png'),
  logbook: asset('asset-logbook.png'),
  messageBoard: asset('asset-message-board.png'),
} as const

export const foodAssets = {
  bun: trimmedAsset('food-bun.png'),
  soyMilk: trimmedAsset('food-soy-milk.png'),
  milletPorridge: trimmedAsset('food-millet-porridge.png'),
  tremellaPorridge: trimmedAsset('food-tremella-porridge.png'),
  youtiao: trimmedAsset('food-youtiao.png'),
} as const

// ⚠️ 文件命名历史遗留坑（图本身没错，是文件名贴反了）：
//   dough-spirit-bagel.png         画的其实是【可颂 🥐】
//   dough-spirit-confused-bagel.png 才是真正的【贝果 🥯】（带迷糊脸）
//   dough-spirit-normal.png        是【单独的表情/脸】（无身体），表情系统用
//   dough-spirit-white-dough.png   是【无脸的白面团身体】，表情系统用
// 下面按"语义正确"映射，不改文件名以免影响外部引用。等用户补正常脸的贝果图后再替换 bagel。
export const spiritAssets = {
  base: trimmedAsset('dough-spirit-base.png'),               // 白面团（带脸）
  whiteDough: trimmedAsset('dough-spirit-white-dough.png'),  // 白面团身体（无脸）
  xiaolongbao: trimmedAsset('dough-spirit-xiaolongbao.png'), // 小笼包
  normal: trimmedAsset('dough-spirit-normal.png'),           // 表情：普通脸
  confusedAwake: trimmedAsset('dough-spirit-confused-awake.png'), // 表情：迷糊
  croissant: trimmedAsset('dough-spirit-bagel.png'),         // 可颂（这张文件名虽叫 bagel，画的是可颂）
  bagel: trimmedAsset('dough-spirit-confused-bagel.png'),    // 贝果（暂用迷糊脸版，待替换为正常脸贝果图）
  confusedBagel: trimmedAsset('dough-spirit-confused-bagel.png'), // 贝果·迷糊脸
  sleep: trimmedAsset('dough-spirit-confused-bagel.png'),    // 睡（迷糊贝果）
  // ↓ 靠累计早睡解锁的新形态，图待补（未解锁时显示剪影，不会加载这些文件）
  donut: trimmedAsset('dough-spirit-donut.png'),             // 甜甜圈（待补图）
  baozi: trimmedAsset('dough-spirit-baozi.png'),             // 包子（待补图）
  waffle: trimmedAsset('dough-spirit-waffle.png'),           // 华夫饼（待补图）
  mochi: trimmedAsset('dough-spirit-mochi.png'),             // 麻糬（待补图）
} satisfies Record<SpiritForm | 'normal' | 'confusedAwake', AssetSource>

export const animalAssets = {
  fox: trimmedAsset('animal-fox.png'),
  raccoon: trimmedAsset('animal-raccoon.png'),
  sparrow: trimmedAsset('animal-sparrow.png'),
  cat: trimmedAsset('animal-cat.png'),
  bird: trimmedAsset('animal-bird.png'),
  rabbit: trimmedAsset('animal-rabbit.png'),
  bear: trimmedAsset('animal-bear.png'),
} as const

export const guestAssets = animalAssets

export const sceneByDemo: Record<DemoScene, AssetSource> = {
  cover: sceneAssets.coverShop,
  busy: sceneAssets.busyMorning,
  normal: sceneAssets.normalMorning,
  quiet: sceneAssets.quietMorning,
  daytime: sceneAssets.daytimePrep,
  nap: sceneAssets.afternoonNap,
  evening: sceneAssets.eveningPrepare,
  night: sceneAssets.nightClose,
  lightsOff: sceneAssets.lightsOff,
}

export function getSpiritAsset(form: SpiritForm) {
  return spiritAssets[form]
}

export function getSceneAsset(scene: DemoScene) {
  return sceneByDemo[scene].src
}

export function getCoverTransparent() {
  return sceneAssets.coverShopTransparent.src
}
