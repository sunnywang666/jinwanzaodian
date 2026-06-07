import { bookAssets, spiritAssets, toolAssets } from './assets'

export type SceneItemTarget =
  | 'recipeBook'
  | 'guestBook'
  | 'radio'
  | 'spiritChat'
  | 'spiritHut'
  | 'logbook'
  | 'messageBoard'

export type SceneItem = {
  id: string
  label: string
  src: string
  fallbackSrc?: string
  x: number
  y: number
  width: number
  zIndex: number
  target: SceneItemTarget
  variant?: 'item' | 'character'
}

export const sceneItems: SceneItem[] = [
  {
    id: 'recipeBook',
    label: '菜谱本',
    src: bookAssets.recipeCover.src,
    fallbackSrc: bookAssets.recipeCover.fallbackSrc,
    x: 20,
    y: 62,
    width: 18,
    zIndex: 6,
    target: 'recipeBook',
    variant: 'item',
  },
  {
    id: 'guestBook',
    label: '客人电话本',
    src: `${import.meta.env.BASE_URL}assets/trimmed/asset-guest-book-cover.png`,
    fallbackSrc: `${import.meta.env.BASE_URL}assets/asset-guest-book-cover.png`,
    x: 42,
    y: 62,
    width: 18,
    zIndex: 7,
    target: 'guestBook',
    variant: 'item',
  },
  {
    id: 'radio',
    label: '收音机',
    src: toolAssets.radio.src,
    fallbackSrc: toolAssets.radio.fallbackSrc,
    x: 72,
    y: 58,
    width: 14,
    zIndex: 5,
    target: 'radio',
    variant: 'item',
  },
  {
    id: 'spirit',
    label: '面点精灵',
    src: spiritAssets.base.src,
    fallbackSrc: spiritAssets.base.fallbackSrc,
    x: 52,
    y: 48,
    width: 16,
    zIndex: 8,
    target: 'spiritChat',
    variant: 'character',
  },
  {
    id: 'logbook',
    label: '营业日志',
    src: toolAssets.logbook.src,
    x: 3,
    y: 60,
    width: 17,
    zIndex: 6,
    target: 'logbook',
    variant: 'item',
  },
  {
    id: 'messageBoard',
    label: '留言板',
    src: toolAssets.messageBoard.src,
    x: 68,
    y: 2,
    width: 26,
    zIndex: 4,
    target: 'messageBoard',
    variant: 'item',
  },
  {
    id: 'spiritHut',
    label: '精灵小屋',
    src: toolAssets.spiritHut.src,
    x: 74,
    y: 38,
    width: 22,
    zIndex: 5,
    target: 'spiritHut',
    variant: 'item',
  },
]
