export interface HotspotDefinition {
  id: 'recipeBook' | 'guestBook' | 'logbook' | 'spiritHut' | 'radio' | 'blackboard'
  label: string
  x: number
  y: number
  width: number
  height: number
}

export const shopHotspots: HotspotDefinition[] = [
  { id: 'recipeBook', label: '菜谱本', x: 10, y: 58, width: 18, height: 16 },
  { id: 'guestBook', label: '电话本', x: 29, y: 59, width: 16, height: 15 },
  { id: 'logbook', label: '账本', x: 46, y: 59, width: 17, height: 15 },
  { id: 'spiritHut', label: '精灵小屋', x: 67, y: 39, width: 21, height: 28 },
  { id: 'radio', label: '收音机', x: 73, y: 61, width: 14, height: 14 },
  { id: 'blackboard', label: '留言板', x: 57, y: 19, width: 23, height: 14 },
]
