import type { DemoScene, SpiritForm } from './storage'

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

export const spiritAssets: Record<SpiritForm, string> = {
  base: '/assets/dough-spirit-base.png',
  xiaolongbao: '/assets/dough-spirit-xiaolongbao.png',
  sleep: '/assets/dough-spirit-sleep.png',
  croissant: '/assets/dough-spirit-croissant.png',
  donut: '/assets/dough-spirit-donut.png',
}

export const guestAssets = {
  cat: '/assets/animal-cat.png',
  rabbit: '/assets/animal-rabbit.png',
  raccoon: '/assets/animal-raccoon.png',
  bear: '/assets/animal-bear.png',
  owl: '/assets/animal-owl.png',
} as const

export function getSceneAsset(scene: DemoScene) {
  return sceneAssets[scene]
}

export function getSpiritAsset(form: SpiritForm) {
  return spiritAssets[form]
}
