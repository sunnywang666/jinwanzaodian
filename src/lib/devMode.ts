/**
 * devMode.ts — 单一开关：是否启用"演示/开发"模式
 *
 * 控制两件事：
 *  1. 是否给新用户预填一周假的营业流水（路演/开发好看，真实用户应为空）。
 *  2. 是否暴露首页的 DEBUG（时间模拟）与顶部"重置"按钮。
 *
 * 判定优先级：
 *  - URL 带 ?demo=1 → 开启并记住；?demo=0 → 关闭并清除。
 *  - localStorage 标记。
 *  - Vite 开发服务器（import.meta.env.DEV）。
 *  - 构建注入的 VITE_DEMO=1。
 *
 * 即：正常 `npm run build` 部署且未设 VITE_DEMO 时，是干净的真实 App；
 * `npm run dev` 或加 ?demo=1 时是完整演示态。
 */

const FLAG_KEY = 'jinwanzaodian:demo'

export function isDemoMode(): boolean {
  try {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('demo')
    if (q === '1') {
      try { localStorage.setItem(FLAG_KEY, '1') } catch { /* ignore */ }
      return true
    }
    if (q === '0') {
      try { localStorage.removeItem(FLAG_KEY) } catch { /* ignore */ }
      return false
    }
    if (localStorage.getItem(FLAG_KEY) === '1') return true
  } catch {
    /* ignore */
  }

  const env = import.meta.env as Record<string, unknown>
  if (env.DEV === true) return true
  if (env.VITE_DEMO === '1' || env.VITE_DEMO === true) return true
  return false
}
