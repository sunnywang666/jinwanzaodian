/**
 * nativeNotifications.ts — Capacitor 原生本地通知（解决 P0.5）
 *
 * 与 Web 版（notifications.ts 的前台调度器）的关键区别：
 * 这里把提醒交给**操作系统**定时（每日重复），所以 **app 完全关闭也能准时弹**。
 * 仅在原生壳（iOS/Android）生效；Web 端 isNativePlatform() 为 false，
 * 由 notifications.ts 的前台调度兜底。
 *
 * 依赖（需先安装）：
 *   npm i @capacitor/core @capacitor/local-notifications
 */

import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import type { ReminderSettings, ReminderCopy } from './notifications'

const EVENING_ID = 1001
const CLOSING_ID = 1002

export function isNativePlatform(): boolean {
  try {
    return Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

export type NativePermission = 'granted' | 'denied' | 'prompt' | 'unsupported'

export async function getNativePermission(): Promise<NativePermission> {
  if (!isNativePlatform()) return 'unsupported'
  try {
    const res = await LocalNotifications.checkPermissions()
    return res.display as NativePermission
  } catch {
    return 'unsupported'
  }
}

export async function requestNativePermission(): Promise<boolean> {
  if (!isNativePlatform()) return false
  try {
    const res = await LocalNotifications.requestPermissions()
    return res.display === 'granted'
  } catch {
    return false
  }
}

function hhmm(s: string): { hour: number; minute: number } {
  const [h, m] = s.split(':').map(Number)
  return { hour: h ?? 0, minute: m ?? 0 }
}

/**
 * 按当前提醒设置重排 OS 通知：先取消旧的两条，再排启用的。
 * 每条是"每天 hour:minute 重复"，OS 负责按时触发，无需 app 在前台。
 */
export async function syncNativeReminders(runtime: ReminderSettings, copy: ReminderCopy): Promise<void> {
  if (!isNativePlatform()) return

  try {
    await LocalNotifications.cancel({ notifications: [{ id: EVENING_ID }, { id: CLOSING_ID }] })
  } catch {
    /* ignore */
  }

  const notifications: Parameters<typeof LocalNotifications.schedule>[0]['notifications'] = []

  if (runtime.eveningEnabled) {
    const { hour, minute } = hhmm(runtime.eveningTime)
    notifications.push({
      id: EVENING_ID,
      title: copy.eveningTitle,
      body: copy.eveningBody,
      schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
      extra: { url: '/?reminder=evening' },
    })
  }

  if (runtime.closingEnabled) {
    const { hour, minute } = hhmm(runtime.closingTime)
    notifications.push({
      id: CLOSING_ID,
      title: copy.closingTitle,
      body: copy.closingBody,
      schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
      extra: { url: '/?reminder=closing' },
    })
  }

  if (notifications.length > 0) {
    try {
      await LocalNotifications.schedule({ notifications })
    } catch {
      /* ignore */
    }
  }
}

let tapHandlerRegistered = false

/** 注册"点击通知"监听：把 extra.url 里的 reminder 类型回调出去，用于深链跳转 */
export async function registerNativeTapHandler(
  onReminder: (kind: 'evening' | 'closing') => void,
): Promise<void> {
  if (!isNativePlatform() || tapHandlerRegistered) return
  tapHandlerRegistered = true
  try {
    await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
      const url = action?.notification?.extra?.url as string | undefined
      if (!url) return
      if (url.includes('reminder=evening')) onReminder('evening')
      else if (url.includes('reminder=closing')) onReminder('closing')
    })
  } catch {
    /* ignore */
  }
}
