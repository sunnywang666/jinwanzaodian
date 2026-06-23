/**
 * notifications.ts — 本地提醒调度（纯前端，无服务端推送）
 *
 * 落地产品概念里的两个核心提醒窗口：
 *  - 傍晚·预承诺提醒：「今晚打算几点关灯歇着呀？」
 *  - 夜晚·打烊提醒：「要打烊了哦」
 *
 * 能力边界（务必知道）：
 *  Web 通知只能在 app 的 tab 或其 service worker 存活时触发——没有真正的
 *  服务端定时推送。本调度器用前台定时器每分钟检查一次，命中提醒时间窗口
 *  就用 registration.showNotification 弹出（SW 在时通知更稳，且 app 在后台
 *  也可能弹出）。要实现"完全关掉 app 后仍准时推送"，需 Push API + 服务端，
 *  或迁移到 React Native / Flutter 原生壳。这一版覆盖"已安装为 PWA 且近期
 *  用过"的常见场景，先把链路跑通。
 */

import { getNow } from './timeSimulator'

/** 运行期提醒配置（closingTime 通常由 App 用今晚关灯时间填入） */
export interface ReminderSettings {
  eveningEnabled: boolean
  eveningTime: string // 'HH:MM'
  closingEnabled: boolean
  closingTime: string // 'HH:MM'
}

/** 存储期提醒配置（关灯提醒时间不单独存，跟随关灯时间） */
export interface StoredReminderSettings {
  eveningEnabled: boolean
  eveningTime: string
  closingEnabled: boolean
}

export const defaultStoredReminders: StoredReminderSettings = {
  eveningEnabled: false,
  eveningTime: '20:00',
  closingEnabled: false,
}

export type NotifPermission = 'default' | 'granted' | 'denied' | 'unsupported'

export function getNotifPermission(): NotifPermission {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission as NotifPermission
}

export async function requestNotifPermission(): Promise<NotifPermission> {
  if (typeof Notification === 'undefined') return 'unsupported'
  try {
    return (await Notification.requestPermission()) as NotifPermission
  } catch {
    return Notification.permission as NotifPermission
  }
}

async function fireNotification(title: string, body: string, url: string) {
  if (getNotifPermission() !== 'granted') return
  const options: NotificationOptions & { data?: unknown } = {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: 'jwzd-reminder',
    data: { url },
  }
  // 优先用 SW，移动端表现更稳
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration()
      if (reg) {
        await reg.showNotification(title, options)
        return
      }
    }
  } catch {
    /* fall through to Notification 构造器 */
  }
  try {
    // eslint-disable-next-line no-new
    new Notification(title, options)
  } catch {
    /* ignore */
  }
}

function hhmmToMin(s: string): number {
  const [h, m] = s.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

function nowMinutes(): number {
  const n = getNow()
  return n.getHours() * 60 + n.getMinutes()
}

function todayKey(): string {
  const n = getNow()
  return `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}`
}

function firedToday(type: string): boolean {
  try {
    return localStorage.getItem(`jinwanzaodian:notif-fired:${type}`) === todayKey()
  } catch {
    return false
  }
}

function markFired(type: string) {
  try {
    localStorage.setItem(`jinwanzaodian:notif-fired:${type}`, todayKey())
  } catch {
    /* ignore */
  }
}

export interface ReminderCopy {
  eveningTitle: string
  eveningBody: string
  closingTitle: string
  closingBody: string
}

/**
 * 启动前台提醒调度器。每分钟检查一次；每个提醒每个自然日最多触发一次，
 * 且只在到点后的一小段窗口内触发（避免凌晨 2 点回到 app 还补弹晚上 8 点的提醒）。
 * 返回清理函数。
 */
export function startReminderScheduler(
  getSettings: () => ReminderSettings,
  copy: ReminderCopy,
): () => void {
  const WINDOW_MIN = 30

  function check() {
    if (getNotifPermission() !== 'granted') return
    const s = getSettings()
    const cur = nowMinutes()

    if (s.eveningEnabled && !firedToday('evening')) {
      const t = hhmmToMin(s.eveningTime)
      if (cur >= t && cur < t + WINDOW_MIN) {
        markFired('evening')
        void fireNotification(copy.eveningTitle, copy.eveningBody, '/?reminder=evening')
      }
    }

    if (s.closingEnabled && !firedToday('closing')) {
      const t = hhmmToMin(s.closingTime)
      if (cur >= t && cur < t + WINDOW_MIN) {
        markFired('closing')
        void fireNotification(copy.closingTitle, copy.closingBody, '/?reminder=closing')
      }
    }
  }

  check()
  const id = window.setInterval(check, 60_000)
  return () => window.clearInterval(id)
}
