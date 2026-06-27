/**
 * chatStore.ts — 精灵对话记录持久化
 *
 * 把和精灵的聊天存到 localStorage，关掉再开能接着上次聊。演示/正式分键存，
 * 上限最近 50 条防止无限增长。也是日后②（精灵从聊天里总结心事）的数据来源。
 */

import type { ChatMessage } from './demoData'
import { isDemoMode } from './devMode'

const BASE = 'jinwanzaodian:chat_history'
const MAX = 50

function storageKey(): string {
  return isDemoMode() ? `${BASE}:demo` : BASE
}

export function loadChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(storageKey())
    if (!raw) return []
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) {
      return arr.filter(
        (m): m is ChatMessage =>
          m && typeof m.text === 'string' && (m.speaker === 'spirit' || m.speaker === 'user'),
      )
    }
  } catch { /* ignore */ }
  return []
}

export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(messages.slice(-MAX)))
  } catch { /* ignore */ }
}

export function clearChatHistory(): void {
  try {
    localStorage.removeItem(BASE)
    localStorage.removeItem(`${BASE}:demo`)
  } catch { /* ignore */ }
}
