/**
 * appView.ts — 顶层视图类型 + 初始视图决策
 *
 * 从 App.tsx 抽出，让初始路由逻辑成为可单测的纯函数。
 */

export type AppView =
  | 'home'
  | 'guestBookConfirm'
  | 'guestBookOpen'
  | 'recipeBookConfirm'
  | 'recipeBookOpen'
  | 'spiritChat'
  | 'spiritHut'
  | 'radio'
  | 'logbook'
  | 'messageBoard'
  | 'eveningPrepare'
  | 'nightClosing'
  | 'morningOpening'
  | 'middayTransition'
  | 'settings'

/**
 * 决定 App 启动时落在哪个视图：
 *  - 新的一天（needsMorningOpening）→ 开门仪式
 *  - 点了傍晚/打烊提醒的深链 → 直达对应界面
 *  - 否则 → 首页
 */
export function resolveInitialView(opts: {
  needsMorningOpening: boolean
  reminderParam: string | null
}): AppView {
  if (opts.needsMorningOpening) return 'morningOpening'
  if (opts.reminderParam === 'evening') return 'eveningPrepare'
  if (opts.reminderParam === 'closing') return 'nightClosing'
  return 'home'
}
