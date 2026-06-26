/**
 * usePersistStore.ts — 集中持久化
 *
 * 从 App.tsx 抽出的「把全部状态拼成 AppStore 存一次」副作用。
 * 用 AppStore 的索引类型描述快照，所以只依赖 dataStore，不用散装导入各类型；
 * saveStore 的入参类型也强制了 store 形状，少传/写错字段 tsc 直接报错。
 */

import { useEffect } from 'react'
import { saveStore, type AppStore } from '../lib/dataStore'

export interface PersistSnapshot {
  profile: AppStore['profile']
  spiritForm: AppStore['spirit']['currentForm']
  spiritProgress: AppStore['spirit']['progress']
  demoScene: AppStore['today']['scene']
  todayMood: AppStore['today']['mood']
  middayDone: boolean
  tonightClosed: boolean
  eveningPrepare: AppStore['today']['eveningPrepare']
  lastOpenDate: AppStore['today']['date']
  homeGuestKeys: string[]
  guestProgress: AppStore['guests']
  dishProgress: AppStore['dishes']
  logEntries: AppStore['days']
  autoSceneEnabled: boolean
  reminders: AppStore['settings']['reminders']
  tourDone: boolean
  sleepInsights: boolean
}

export function usePersistStore(s: PersistSnapshot) {
  useEffect(() => {
    saveStore({
      schemaVersion: 1,
      profile: s.profile,
      spirit: { currentForm: s.spiritForm, progress: s.spiritProgress },
      today: {
        date: s.lastOpenDate,
        mood: s.todayMood,
        scene: s.demoScene,
        middayDone: s.middayDone,
        tonightClosed: s.tonightClosed,
        eveningPrepare: s.eveningPrepare,
        homeGuestKeys: s.homeGuestKeys,
      },
      guests: s.guestProgress,
      dishes: s.dishProgress,
      days: s.logEntries,
      settings: { autoSceneEnabled: s.autoSceneEnabled, reminders: s.reminders, tourDone: s.tourDone, sleepInsights: s.sleepInsights },
    })
  }, [
    s.profile, s.spiritForm, s.spiritProgress, s.demoScene, s.todayMood,
    s.middayDone, s.tonightClosed, s.eveningPrepare, s.lastOpenDate, s.homeGuestKeys,
    s.guestProgress, s.dishProgress, s.logEntries, s.autoSceneEnabled,
    s.reminders, s.tourDone, s.sleepInsights,
  ])
}
