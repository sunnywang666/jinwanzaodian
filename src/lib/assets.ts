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

export const spiritAssets = {
  base: trimmedAsset('dough-spirit-base.png'),
  whiteDough: trimmedAsset('dough-spirit-white-dough.png'),
  xiaolongbao: trimmedAsset('dough-spirit-xiaolongbao.png'),
  normal: trimmedAsset('dough-spirit-normal.png'),
  confusedAwake: trimmedAsset('dough-spirit-confused-awake.png'),
  bagel: trimmedAsset('dough-spirit-bagel.png'),
  confusedBagel: trimmedAsset('dough-spirit-confused-bagel.png'),
  sleep: trimmedAsset('dough-spirit-confused-bagel.png'),
  croissant: trimmedAsset('dough-spirit-bagel.png'),
  donut: trimmedAsset('dough-spirit-bagel.png'),
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
