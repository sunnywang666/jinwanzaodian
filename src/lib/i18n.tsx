/**
 * i18n.tsx — v6.2
 *
 * Lightweight i18n system:
 * - React context + useT() hook
 * - Auto-detect from navigator.language
 * - Store preference in localStorage
 * - Type-safe translation keys
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { zh } from '../locales/zh'
import { en } from '../locales/en'

export type Lang = 'zh' | 'en'
export type TranslationMap = typeof zh

const STORAGE_KEY = 'jinwanzaodian:lang'

const translations: Record<Lang, Record<string, unknown>> = {
  zh: zh as unknown as Record<string, unknown>,
  en: en as unknown as Record<string, unknown>,
}

/** Detect language from browser, fallback to 'en' */
function detectLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'zh' || stored === 'en') return stored
  } catch { /* ignore */ }

  const nav = navigator.language ?? ''
  if (nav.startsWith('zh')) return 'zh'
  return 'en'
}

function saveLang(lang: Lang) {
  try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* ignore */ }
}

/** Get nested value by dot-path: t('onboarding.story.beat1.title') */
function resolve(obj: Record<string, unknown>, path: string): string {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return path
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : path
}

// ── Context ──

interface I18nContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string, vars?: Record<string, string>) => string
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'zh',
  setLang: () => {},
  t: (key) => key,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    saveLang(next)
  }, [])

  const t = useCallback((key: string, vars?: Record<string, string>): string => {
    let text = resolve(translations[lang], key)
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.split(`{${k}}`).join(v)
      }
    }
    return text
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useT() {
  return useContext(I18nContext)
}
