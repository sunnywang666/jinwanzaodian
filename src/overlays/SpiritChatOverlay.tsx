/**
 * SpiritChatOverlay.tsx — v6.0
 *
 * Changes from v5.9:
 * - Removed "去小屋看看" link from header (unnecessary in chat context)
 * - Improved fallback: when API fails, show a more varied offline response
 * - Added error toast when API is unreachable
 * - Removed onGoToHut prop
 */

import { useState, useRef, useEffect } from 'react'
import { spiritAssets } from '../lib/assets'
import { type ChatMessage } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import type { DemoScene, NightType } from '../lib/storage'
import { useT } from '../lib/i18n'

interface SpiritChatOverlayProps {
  spiritName: string
  nightType: NightType
  currentScene: DemoScene
  tonightWorry: string
  onGoToEveningPrepare: () => void
  onGoToNightClosing: () => void
  onClose: () => void
}

/* ── System prompts by night type ── */

const systemPrompts: Record<NightType, string> = {
  '报复型': '你是「今晚早点」的面点精灵，名字由店长起。你陪着一个报复型夜熬者——他不是不困，只是想把白天失去的时间拿回来。你懂得夜晚对他来说是唯一属于自己的时间。你不催促，不说教，只是温柔陪伴。铺子的语气是暖的、松的，像一个老朋友。回复控制在2-3句以内，说中文，不用"好的"开头。',
  '惯性型': '你是「今晚早点」的面点精灵，名字由店长起。你陪着一个惯性型夜熬者——知道该停下来但手总是停不下来。你用铺子里的小事转移注意力，让放下手机这件事变得自然。回复温暖、简短、不催促。2-3句，说中文。',
  '焦虑型': '你是「今晚早点」的面点精灵，名字由店长起。你陪着一个焦虑型夜熬者——脑子里停不下来。你帮他们把明天的事放到明天，说话慢而稳，让今晚不用担心。不给建议，只是陪着。2-3句，说中文。',
  '工作型': '你是「今晚早点」的面点精灵，名字由店长起。你陪着一个工作型夜熬者——总想把活儿做完再休息。你帮他们把待办放到明天，把早睡转化成"明天才能早起开门"的期待。温柔而实际。2-3句，说中文。',
  '猫头鹰型': '你是「今晚早点」的面点精灵，名字由店长起。你陪着一个天生节奏偏晚的店长。你不评判他们的作息，只是温柔陪着，把早睡变成可能而非任务。2-3句，说中文。',
  '说不清': '你是「今晚早点」的面点精灵，名字由店长起。你陪着一个今晚说不清是什么感觉的店长。你只是在，不追问，不定义，铺子的灯还亮着，你还在。说话极简，2句以内，说中文。',
}

/* ── API ── */

/** 兜底后端：安卓 APK / GitHub Pages 静态页没有同源后端时用。本项目自己的 Vercel（见 v6.0.1 提交）。 */
const OWN_BACKEND = 'https://jinwanzaodian-mk8xhm66e-sunny-happy-projects.vercel.app/api/chat'

function getChatApiUrl(): string {
  // 1. 用户在设置里自定义的地址优先
  try {
    const custom = localStorage.getItem('jinwanzaodian:chat_api_url')
    if (custom && custom.trim()) return custom.trim()
  } catch { /* ignore */ }
  // 2. 部署在自己的 Web 后端上（如 Vercel）→ 走同源 /api/chat，自动命中本项目自己的后端，不依赖别的部署
  try {
    const { origin, protocol, hostname } = window.location
    if (
      protocol.startsWith('http') &&
      !hostname.endsWith('github.io') &&
      hostname !== 'localhost' &&
      hostname !== '127.0.0.1'
    ) {
      return `${origin}/api/chat`
    }
  } catch { /* ignore */ }
  // 3. 兜底（APK / GitHub Pages 无同源后端）
  return OWN_BACKEND
}

function getUserApiKey(): string | null {
  try { return localStorage.getItem('jinwanzaodian:aiping_key') ?? null } catch { return null }
}

async function callChat(
  messages: ChatMessage[],
  nightType: NightType,
  spiritName: string,
  worry: string,
): Promise<string> {
  let systemPrompt = `${systemPrompts[nightType]}\n\n你的名字是${spiritName}。`

  if (worry.trim()) {
    systemPrompt += `\n\n店长今晚写下了一件放不下的事："${worry.trim()}"。如果店长聊到相关话题，你可以温柔地回应，但不要主动提起，等店长自己说。`
  }

  const apiMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages
      .filter((m) => m.speaker === 'user' || m.speaker === 'spirit')
      .slice(-12)
      .map((m) => ({
        role: (m.speaker === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.text,
      })),
  ]

  const userKey = getUserApiKey()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (userKey) headers['Authorization'] = `Bearer ${userKey}`

  const url = getChatApiUrl()
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages: apiMessages, max_tokens: 150 }),
  })

  if (!response.ok) throw new Error(`api_error_${response.status}`)
  const data = await response.json() as { reply?: string }
  return data.reply ?? '……'
}

/* ── Offline fallback pool ── */

const offlineFallbacks = [
  '……铺子里暖着，先不用说话也没关系。',
  '嗯，我在听。',
  '铺子的灯还亮着，不急。',
  '今天不用把所有事都想明白。',
  '没事的，慢慢来。',
  '我就在柜台后面，你想说什么都行。',
]

let fallbackIndex = 0

function getOfflineFallback(): string {
  const text = offlineFallbacks[fallbackIndex % offlineFallbacks.length]
  fallbackIndex++
  return text
}

/* ── Scene-based quick replies ── */

interface QuickReply {
  label: string
  action: 'chat' | 'navigate'
  target?: 'eveningPrepare' | 'nightClosing'
  fallback?: string
}

function getQuickReplies(scene: DemoScene): QuickReply[] {
  if (scene === 'evening' || scene === 'night') {
    return [
      { label: '今天有点累', action: 'chat', fallback: '那今天就少做一点，铺子也可以慢慢来。' },
      { label: '写下今晚的心事', action: 'navigate', target: 'eveningPrepare' },
      { label: '该打烊了', action: 'navigate', target: 'nightClosing' },
    ]
  }

  if (scene === 'lightsOff') {
    return [
      { label: '睡不着', action: 'chat', fallback: '没关系，铺子的灯虽然关了，我还在。' },
      { label: '今晚辛苦了', action: 'chat', fallback: '你也辛苦了，明天铺子还会开门的。' },
    ]
  }

  return [
    { label: '今天有点累', action: 'chat', fallback: '那今天就少做一点，铺子也可以慢慢来。' },
    { label: '聊聊天', action: 'chat', fallback: '好呀，想说什么都行。' },
    { label: '昨晚又晚了', action: 'chat', fallback: '没关系，铺子今天只是安静一点。' },
  ]
}

/* ── Time-based initial messages ── */

function getInitialMessages(spiritName: string, scene: DemoScene): ChatMessage[] {
  const hour = new Date().getHours()

  if (scene === 'lightsOff') {
    return [
      { id: 'init-1', speaker: 'spirit', text: '铺子已经关灯了，我在小屋里陪你。' },
      { id: 'init-2', speaker: 'spirit', text: '睡不着的话，就在这里待一会儿也好。' },
    ]
  }

  if (scene === 'evening' || scene === 'night' || hour >= 20) {
    return [
      { id: 'init-1', speaker: 'spirit', text: '店长，今天铺子开着。我在柜台后面，先陪你待一会儿。' },
      { id: 'init-2', speaker: 'spirit', text: '如果有什么放不下的事，可以先写在纸条上。' },
    ]
  }

  if (hour < 12) {
    return [
      { id: 'init-1', speaker: 'spirit', text: '早上好呀，今天铺子的豆浆已经热好了。' },
      { id: 'init-2', speaker: 'spirit', text: '有什么想聊的，随时说。' },
    ]
  }

  return [
    { id: 'init-1', speaker: 'spirit', text: '下午了，铺子安静下来了。' },
    { id: 'init-2', speaker: 'spirit', text: '想聊聊天，还是安静待一会儿？' },
  ]
}

/* ── Main component ── */

export function SpiritChatOverlay({
  spiritName,
  nightType,
  currentScene,
  tonightWorry,
  onGoToEveningPrepare,
  onGoToNightClosing,
  onClose,
}: SpiritChatOverlayProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getInitialMessages(spiritName, currentScene),
  )
  const [isThinking, setIsThinking] = useState(false)
  const [inputText, setInputText] = useState('')
  const [apiError, setApiError] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { t } = useT()

  const quickReplies = getQuickReplies(currentScene)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  // 自动清除 API 错误提示
  useEffect(() => {
    if (!apiError) return
    const timer = setTimeout(() => setApiError(false), 5000)
    return () => clearTimeout(timer)
  }, [apiError])

  const sendMessage = async (userText: string) => {
    if (!userText.trim()) return

    const stamp = Date.now()
    const userMsg: ChatMessage = { id: `user-${stamp}`, speaker: 'user', text: userText.trim() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInputText('')
    setIsThinking(true)

    try {
      const reply = await callChat(nextMessages, nightType, spiritName, tonightWorry)
      setMessages((current) => [
        ...current,
        { id: `spirit-${stamp}`, speaker: 'spirit', text: reply },
      ])
    } catch {
      setApiError(true)
      const qr = quickReplies.find((r) => r.label === userText)
      const fallback = qr?.fallback ?? getOfflineFallback()
      setMessages((current) => [
        ...current,
        { id: `spirit-${stamp}`, speaker: 'spirit', text: fallback },
      ])
    } finally {
      setIsThinking(false)
    }
  }

  const handleQuickReply = (qr: QuickReply) => {
    if (qr.action === 'navigate') {
      if (qr.target === 'eveningPrepare') onGoToEveningPrepare()
      else if (qr.target === 'nightClosing') onGoToNightClosing()
      return
    }
    sendMessage(qr.label)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputText)
  }

  return (
    <GameOverlay onClose={onClose}>
      <section
        className="flex h-full flex-col"
        style={{
          background: 'linear-gradient(180deg, #f5ead8 0%, #efe1cb 40%, #e8d8c4 100%)',
        }}
      >
        {/* Header — clean, no "去小屋" link */}
        <div className="flex items-center gap-3 px-4 pb-2 pt-[9dvh]">
          <AssetImage
            src={spiritAssets.base.src}
            fallbackSrc={spiritAssets.base.fallbackSrc}
            alt={spiritName}
            variant="character"
            className="h-12 drop-shadow-[0_4px_12px_rgba(138,97,74,0.15)]"
          />
          <h1 className="text-base font-semibold text-ink">{spiritName}</h1>
        </div>

        {/* API error toast */}
        {apiError ? (
          <div className="mx-4 rounded-[14px] bg-[#d4a574]/15 px-3 py-2 text-center text-xs text-brown/60">
            {t('spiritChat.apiError')}
          </div>
        ) : null}

        {/* Chat area */}
        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-2">
          {messages.map((message) => {
            const fromSpirit = message.speaker === 'spirit'
            return (
              <div key={message.id} className={`flex items-end gap-2 ${fromSpirit ? 'justify-start' : 'justify-end'}`}>
                {fromSpirit ? (
                  <AssetImage
                    src={spiritAssets.base.src}
                    fallbackSrc={spiritAssets.base.fallbackSrc}
                    alt={spiritName}
                    variant="character"
                    className="h-9 shrink-0"
                  />
                ) : null}
                <p
                  className={`max-w-[78%] rounded-[22px] px-4 py-3 text-sm leading-6 ${
                    fromSpirit
                      ? 'bg-white/60 text-ink/80 backdrop-blur-sm'
                      : 'bg-[#d4a574]/40 text-ink'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            )
          })}

          {isThinking ? (
            <div className="flex items-end gap-2 justify-start">
              <AssetImage
                src={spiritAssets.base.src}
                fallbackSrc={spiritAssets.base.fallbackSrc}
                alt={spiritName}
                variant="character"
                className="h-9 shrink-0"
              />
              <div className="flex items-center gap-1 rounded-[22px] bg-white/60 px-4 py-3 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/30" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/30" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/30" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : null}
        </div>

        {/* Quick replies */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2" style={{ scrollbarWidth: 'none' }}>
          {quickReplies.map((qr) => (
            <button
              key={qr.label}
              type="button"
              disabled={isThinking}
              className={`shrink-0 rounded-full px-4 py-2 text-xs transition disabled:opacity-40 ${
                qr.action === 'navigate'
                  ? 'bg-[#d4a574]/25 text-brown font-medium'
                  : 'bg-white/40 text-ink/60'
              }`}
              onClick={() => handleQuickReply(qr)}
            >
              {qr.action === 'navigate' ? `→ ${qr.label}` : qr.label}
            </button>
          ))}
        </div>

        {/* Free text input */}
        <form onSubmit={handleSubmit} className="flex gap-2 px-4 pb-5 pt-1">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isThinking}
            placeholder={t('spiritChat.inputPlaceholder')}
            className="min-w-0 flex-1 rounded-full bg-white/50 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/25 focus:bg-white/65 disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={isThinking || !inputText.trim()}
            className="shrink-0 rounded-full bg-[#d4a574]/40 px-5 py-3 text-sm font-medium text-ink/70 transition hover:bg-[#d4a574]/55 disabled:opacity-30"
          >
            {t('spiritChat.send')}
          </button>
        </form>
      </section>
    </GameOverlay>
  )
}
