/**
 * Settings.tsx — v6.0
 *
 * Changes:
 * - Version updated to v6.0
 * - Added API key management section (compatible with any OpenAI-format API)
 * - Added custom API URL field
 * - Shows current nightType
 */

import { useState } from 'react'
import { GameOverlay } from '../components/GameOverlay'
import { SoftButton } from '../components/SoftButton'
import type { NightType } from '../lib/storage'

interface SettingsProps {
  spiritName: string
  defaultLightsOffTime: string
  nightType: NightType
  onUpdateLightsOffTime: (time: string) => void
  onResetAll: () => void
  onClose: () => void
}

const TIME_OPTIONS = [
  '21:30', '22:00', '22:30', '23:00', '23:30', '00:00', '00:30',
]

const API_KEY_STORAGE = 'jinwanzaodian:aiping_key'
const API_URL_STORAGE = 'jinwanzaodian:chat_api_url'

function loadApiKey(): string {
  try { return localStorage.getItem(API_KEY_STORAGE) ?? '' } catch { return '' }
}
function saveApiKey(key: string) {
  if (key.trim()) localStorage.setItem(API_KEY_STORAGE, key.trim())
  else localStorage.removeItem(API_KEY_STORAGE)
}
function loadApiUrl(): string {
  try { return localStorage.getItem(API_URL_STORAGE) ?? '' } catch { return '' }
}
function saveApiUrl(url: string) {
  if (url.trim()) localStorage.setItem(API_URL_STORAGE, url.trim())
  else localStorage.removeItem(API_URL_STORAGE)
}

export function Settings({
  spiritName,
  defaultLightsOffTime,
  nightType,
  onUpdateLightsOffTime,
  onResetAll,
  onClose,
}: SettingsProps) {
  const [selectedTime, setSelectedTime] = useState(defaultLightsOffTime)
  const [timeSaved, setTimeSaved] = useState(false)
  const [apiKey, setApiKey] = useState(() => loadApiKey())
  const [apiUrl, setApiUrl] = useState(() => loadApiUrl())
  const [apiSaved, setApiSaved] = useState(false)

  return (
    <GameOverlay title="设置" onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-5 pb-6 pt-[11dvh] overflow-y-auto">

        {/* Default lights-off time */}
        <div>
          <h3 className="text-base font-semibold text-ink">默认关灯时间</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">
            每天傍晚准备时会用这个时间作为默认值。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedTime === time
                    ? 'bg-butter/70 text-ink'
                    : 'bg-white/35 text-ink/55'
                }`}
                onClick={() => {
                  setSelectedTime(time)
                  setTimeSaved(false)
                }}
              >
                {time}
              </button>
            ))}
          </div>
          {selectedTime !== defaultLightsOffTime ? (
            <SoftButton
              className="mt-3"
              type="button"
              variant="primary"
              onClick={() => {
                onUpdateLightsOffTime(selectedTime)
                setTimeSaved(true)
              }}
            >
              {timeSaved ? '已保存' : '保存'}
            </SoftButton>
          ) : null}
        </div>

        <div className="my-6 h-px bg-ink/8" />

        {/* API Configuration */}
        <div>
          <h3 className="text-base font-semibold text-ink">精灵对话 API</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">
            铺子内置了精灵的对话服务。如果你有自己的 API，也可以在这里接入。
            支持 OpenAI 格式的接口（DeepSeek、Moonshot 等都兼容）。
          </p>

          <div className="mt-4 space-y-3">
            {/* API URL */}
            <div>
              <label className="text-xs text-ink/40">API 地址（留空用内置服务）</label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => { setApiUrl(e.target.value); setApiSaved(false) }}
                placeholder="https://api.deepseek.com/v1/chat/completions"
                className="mt-1 w-full rounded-[14px] bg-white/30 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/20 focus:bg-white/50"
              />
            </div>

            {/* API Key */}
            <div>
              <label className="text-xs text-ink/40">API Key（留空用内置服务）</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setApiSaved(false) }}
                placeholder="sk-..."
                className="mt-1 w-full rounded-[14px] bg-white/30 px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/20 focus:bg-white/50"
              />
            </div>

            <SoftButton
              type="button"
              variant="primary"
              onClick={() => {
                saveApiKey(apiKey)
                saveApiUrl(apiUrl)
                setApiSaved(true)
              }}
            >
              {apiSaved ? '已保存' : '保存 API 设置'}
            </SoftButton>

            {apiSaved ? (
              <p className="text-xs text-brown/60">
                {apiUrl.trim() || apiKey.trim()
                  ? '已切换到自定义 API，下次对话生效。'
                  : '已恢复使用内置服务。'}
              </p>
            ) : null}
          </div>
        </div>

        <div className="my-6 h-px bg-ink/8" />

        {/* About */}
        <div>
          <h3 className="text-base font-semibold text-ink">关于</h3>
          <div className="mt-3 space-y-2 text-sm leading-6 text-ink/60">
            <p>「今晚早点」v6.0</p>
            <p>一家只在你手机里的早点铺。</p>
            <p>不是闹钟，不是打卡，不是助眠白噪音。</p>
            <p>铺子不会催你睡觉，只是会在你放下手机的时候，安静地陪着你。</p>
            <p className="mt-4 text-ink/35">
              {spiritName} 也想说：谢谢你来看铺子。
            </p>
            <p className="text-ink/25">
              你的类型：{nightType}
            </p>
          </div>
        </div>

        <div className="my-6 h-px bg-ink/8" />

        {/* Data & Privacy */}
        <div>
          <h3 className="text-base font-semibold text-ink">数据与隐私</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">
            所有数据都保存在你的手机本地，铺子不会上传任何信息。
            精灵对话通过你配置的 API 发送，不经过其他服务器。
          </p>
        </div>

        <div className="my-6 h-px bg-ink/8" />

        {/* Reset */}
        <div className="pb-4">
          <h3 className="text-base font-semibold text-ink text-red-800/70">重置铺子</h3>
          <p className="mt-1 text-sm leading-6 text-ink/50">
            清空所有数据，回到开店之前。这个操作无法撤回。
          </p>
          <SoftButton
            className="mt-3"
            type="button"
            variant="secondary"
            onClick={() => {
              if (window.confirm('确定要清空所有数据吗？铺子会回到最初的样子，所有记录都会消失。')) {
                onResetAll()
              }
            }}
          >
            清空所有数据
          </SoftButton>
        </div>

      </section>
    </GameOverlay>
  )
}
