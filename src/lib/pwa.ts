/**
 * pwa.ts — service worker registration
 *
 * 只在生产构建注册，避免开发时 SW 缓存干扰 Vite HMR。
 */

export function registerServiceWorker() {
  if (!import.meta.env.PROD) return
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* 注册失败不影响 app 正常使用 */
    })
  })
}
