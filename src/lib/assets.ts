import type { DemoScene, SpiritForm } from './storage'

export interface AssetSource {
  src: string
  fallbackSrc?: string
}

function trimmedAsset(filename: string): AssetSource {
  return {
    src: `/assets/trimmed/${filename}`,
    fallbackSrc: `/assets/${filename}`,
  }
}

export const sceneAssets: Record<DemoScene, string> = {
  cover: '/assets/cover-shop.png',
  busy: '/assets/shop-busy-morning.png',
  normal: '/assets/shop-normal-morning.png',
  quiet: '/assets/shop-quiet-morning.png',
  daytime: '/assets/shop-daytime-prep.png',
  nap: '/assets/shop-afternoon-nap.png',
  evening: '/assets/shop-evening-prepare.png',
  night: '/assets/shop-night-close.png',
  lightsOff: '/assets/shop-lights-off.png',
}

export const spiritAssets: Record<SpiritForm, AssetSource> = {
  base: trimmedAsset('dough-spirit-base.png'),
  xiaolongbao: trimmedAsset('dough-spirit-xiaolongbao.png'),
  sleep: trimmedAsset('dough-spirit-sleep.png'),
  croissant: trimmedAsset('dough-spirit-croissant.png'),
  donut: trimmedAsset('dough-spirit-donut.png'),
}

export const guestAssets = {
  cat: trimmedAsset('animal-cat.png'),
  rabbit: trimmedAsset('animal-rabbit.png'),
  raccoon: trimmedAsset('animal-raccoon.png'),
  bear: trimmedAsset('animal-bear.png'),
  owl: trimmedAsset('animal-owl.png'),
} as const

export function getSceneAsset(scene: DemoScene) {
  return sceneAssets[scene]
}

export function getSpiritAsset(form: SpiritForm) {
  return spiritAssets[form]
}
