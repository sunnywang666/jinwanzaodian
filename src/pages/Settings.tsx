/**
 * Settings.tsx — v6.2
 *
 * Added language switcher section.
 * All text uses i18n via useT().
 */

import { useState } from 'react'
import { GameOverlay } from '../components/GameOverlay'
import { SoftButton } from '../components/SoftButton'
import type { NightType } from '../lib/storage'
import { useT, type Lang } from '../lib/i18n'

interface SettingsProps {
  spiritName: string
  defaultLightsOffTime: string
  nightType: NightType
  onUpdateLightsOffTime: (time: string) => void
  onResetAll: () => void
  onClose: () => void
}

const TIME_OPTIONS = ['21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30']

const API_KEY_STORAGE = 'jinwanzaodian:aiping_key'
const API_URL_STORAGE = 'jinwanzaodian:chat_api_url'

function loadApiKey(): string { try { return localStorage.getItem(API_KEY_STORAGE) ?? '' } catch { return '' } }
function saveApiKey(key: string) { if (key.trim()) localStorage.setItem(API_KEY_STORAGE, key.trim()); else localStorage.removeItem(API_KEY_STORAGE) }
function loadApiUrl(): string { try { return localStorage.getItem(API_URL_STORAGE) ?? '' } catch { return '' } }
function saveApiUrl(url: string) { if (url.trim()) localStorage.setItem(API_URL_STORAGE, url.trim()); else localStorage.removeItem(API_URL_STORAGE) }

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
]

export function Settings({
  spiritName, defaultLightsOffTime, nightType,
  onUpdateLightsOffTime, onResetAll, onClose,
}: SettingsProps) {
  const { t, lang, setLang } = useT()
  const [selectedTime, setSelectedTime] = useState(defaultLightsOffTime)
  const [timeSaved, setTimeSaved] = useState(false)
  const [apiKey, setApiKey] = useState(() => loadApiKey())
  const [apiUrl, setApiUrl] = useState(() => loadApiUrl())
  const [apiSaved, setApiSaved] = useState(false)

  return (
    <GameOverlay title={t('settings.title')} onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-5 pb-6 pt-[11dvh] overflow-y-auto">

        {/* Language */}
        <div>
          <h3 className="text-base font-semibold text-ink">{t('settings.language')}</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">{t('settings.languageDesc')}</p>
          <div className="mt-3 flex gap-2">
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  lang === opt.value ? 'bg-butter/70 text-ink' : 'bg-white/35 text-ink/55'
                }`}
                onClick={() => setLang(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="my-6 h-px bg-ink/8" />

        {/* Lights-off time */}
        <div>
          <h3 className="text-base font-semibold text-ink">{t('settings.lightsOffTime')}</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">{t('settings.lightsOffDesc')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TIME_OPTIONS.map((time) => (
              <button key={time} type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedTime === time ? 'bg-butter/70 text-ink' : 'bg-white/35 text-ink/55'}`}
                onClick={() => { setSelectedTime(time); setTimeSaved(false) }}>
                {time}
              </button>
            ))}
          </div>
          {selectedTime !== defaultLightsOffTime ? (
            <SoftButton className="mt-3" type="button" variant="primary" onClick={() => { onUpdateLightsOffTime(selectedTime); setTimeSaved(true) }}>
              {timeSaved ? t('common.saved') : t('common.save')}
            </SoftButton>
          ) : null}
        </div>

        <div className="my-6 h-px bg-ink/8" />

        {/* API */}
        <div>
          <h3 className="text-base font-semibold text-ink">{t('settings.api.title')}</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">{t('settings.api.desc')}</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-ink/40">{t('settings.api.urlLabel')}</label>
              <input type="url" value={apiUrl} onChange={(e) => { setApiUrl(e.target.value); setApiSaved(false) }}
                placeholder="https://api.deepseek.com/v1/chat/completions"
                className="mt-1 w-full rounded-[14px] bg-white/30 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/20 focus:bg-white/50" />
            </div>
            <div>
              <label className="text-xs text-ink/40">{t('settings.api.keyLabel')}</label>
              <input type="password" value={apiKey} onChange={(e) => { setApiKey(e.target.value); setApiSaved(false) }}
                placeholder="sk-..."
                className="mt-1 w-full rounded-[14px] bg-white/30 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/20 focus:bg-white/50" />
            </div>
            <SoftButton type="button" variant="primary" onClick={() => { saveApiKey(apiKey); saveApiUrl(apiUrl); setApiSaved(true) }}>
              {apiSaved ? t('common.saved') : t('settings.api.saveBtn')}
            </SoftButton>
            {apiSaved ? (
              <p className="text-xs text-brown/60">
                {apiUrl.trim() || apiKey.trim() ? t('settings.api.savedCustom') : t('settings.api.savedDefault')}
              </p>
            ) : null}
          </div>
        </div>

        <div className="my-6 h-px bg-ink/8" />

        {/* About */}
        <div>
          <h3 className="text-base font-semibold text-ink">{t('settings.about.title')}</h3>
          <div className="mt-3 space-y-2 text-sm leading-6 text-ink/60">
            <p>{t('settings.about.version')}</p>
            <p>{t('settings.about.line1')}</p>
            <p>{t('settings.about.line2')}</p>
            <p>{t('settings.about.line3')}</p>
            <p className="mt-4 text-ink/35">{t('settings.about.spiritSays', { name: spiritName })}</p>
            <p className="text-ink/25">{t('settings.about.yourType', { type: t(`onboarding.types.${nightType}`) })}</p>
          </div>
        </div>

        <div className="my-6 h-px bg-ink/8" />

        {/* Privacy */}
        <div>
          <h3 className="text-base font-semibold text-ink">{t('settings.privacy.title')}</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">{t('settings.privacy.desc')}</p>
        </div>

        <div className="my-6 h-px bg-ink/8" />

        {/* Reset */}
        <div className="pb-4">
          <h3 className="text-base font-semibold text-ink text-red-800/70">{t('settings.reset.title')}</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">{t('settings.reset.desc')}</p>
          <SoftButton className="mt-3" type="button" variant="secondary"
            onClick={() => { if (window.confirm(t('settings.reset.confirmMsg'))) onResetAll() }}>
            {t('settings.reset.btn')}
          </SoftButton>
        </div>

      </section>
    </GameOverlay>
  )
}
