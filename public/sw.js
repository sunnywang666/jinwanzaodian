/**
 * sw.js — 「今晚早点」service worker
 *
 * 作用：
 *  1. 让 app 可被"添加到主屏"安装（PWA 安装条件之一）。
 *  2. 离线兜底：缓存 app 外壳与访问过的静态资源，断网也能开门。
 *  3. 承接本地提醒通知的点击（notificationclick → 聚焦/打开对应界面）。
 *
 * 注意：这是纯前端 SW，没有服务端推送。提醒通知由前端在 app/SW 存活时
 * 通过 registration.showNotification 触发（见 src/lib/notifications.ts）。
 * 要做"关掉 app 后定时推送"，需引入 Push API + 服务端，或打原生壳。
 */

const CACHE = 'jwzd-v1';
const CORE = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 页面导航：优先网络，断网回退到缓存的外壳
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    );
    return;
  }

  // 静态资源：stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

// 点击提醒通知 → 聚焦已开的窗口并跳转，否则新开
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          if ('navigate' in client) {
            try { client.navigate(target); } catch (e) { /* ignore */ }
          }
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
      return undefined;
    })
  );
});
