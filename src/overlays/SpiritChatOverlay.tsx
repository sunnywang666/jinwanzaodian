/**
 * SpiritChatOverlay.tsx — v5.8
 *
 * 精灵对话完整重建：
 * - 自由文本输入（用户可以打字）
 * - 快捷回复可触发导航（写心事→傍晚准备，打烊→打烊流程）
 * - 温暖背景（渐变色调，非纯白）
 * - 保留 AIPing API 调用（已在 v5.7 接入）
 */

import { useState, useRef, useEffect } from 'react'
import { spiritAssets } from '../lib/assets'
import { initialChatMessages, type ChatMessage } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import type { NightType } from '../lib/storage'

interface SpiritChatOverlayProps {
  spiritName: string
  nightType: NightType
  onGoToHut: () => void
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

const DEFAULT_CHAT_API = 'https://jinwanzaodian-mk8xhm66e-sunny-happy-projects.vercel.app/api/chat'

function getUserApiKey(): string | null {
  try { return localStorage.getItem('jinwanzaodian:aiping_key') ?? null } catch { return null }
}

async function callChat(
  messages: ChatMessage[],
  nightType: NightType,
  spiritName: string,
): Promise<string> {
  const systemPrompt = `${systemPrompts[nightType]}\n\n你的名字是${spiritName}。`
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

  const response = await fetch(DEFAULT_CHAT_API, {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages: apiMessages, max_tokens: 150 }),
  })

  if (!response.ok) throw new Error(`api_error_${response.status}`)
  const data = await response.json() as { reply?: string }
  return data.reply ?? '……'
}

/* ── Quick replies with actions ── */

interface QuickReply {
  label: string
  /** 'chat' = 正常对话, 'navigate' = 跳转到其他页面 */
  action: 'chat' | 'navigate'
  /** action='navigate' 时的目标 */
  target?: 'eveningPrepare' | 'nightClosing' | 'spiritHut'
  /** action='chat' 时 API 失败的 fallback 回复 */
  fallback?: string
}

const quickReplies: QuickReply[] = [
  { label: '今天有点累', action: 'chat', fallback: '那今天就少做一点，铺子也可以慢慢来。' },
  { label: '写下今晚的心事', action: 'navigate', target: 'eveningPrepare' },
  { label: '该打烊了', action: 'navigate', target: 'nightClosing' },
]

/* ── Main component ── */

export function SpiritChatOverlay({
  spiritName,
  nightType,
  onGoToHut,
  onGoToEveningPrepare,
  onGoToNightClosing,
  onClose,
}: SpiritChatOverlayProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages)
  const [isThinking, setIsThinking] = useState(false)
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  const sendMessage = async (userText: string) => {
    if (!userText.trim()) return

    const stamp = Date.now()
    const userMsg: ChatMessage = { id: `user-${stamp}`, speaker: 'user', text: userText.trim() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInputText('')
    setIsThinking(true)

    try {
      const reply = await callChat(nextMessages, nightType, spiritName)
      setMessages((current) => [
        ...current,
        { id: `spirit-${stamp}`, speaker: 'spirit', text: reply },
      ])
    } catch {
      // API 失败时用 fallback
      const qr = quickReplies.find((r) => r.label === userText)
      const fallback = qr?.fallback ?? '……铺子里暖着，先不用说话也没关系。'
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
      else if (qr.target === 'spiritHut') onGoToHut()
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
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2 pt-[9dvh]">
          <div className="flex items-center gap-3">
            <AssetImage
              src={spiritAssets.base.src}
              fallbackSrc={spiritAssets.base.fallbackSrc}
              alt={spiritName}
              variant="character"
              className="h-12 drop-shadow-[0_4px_12px_rgba(138,97,74,0.15)]"
            />
            <div>
              <h1 className="text-base font-semibold text-ink">{spiritName}</h1>
              <button
                type="button"
                className="text-xs text-ink/40 transition hover:text-ink/60"
                onClick={onGoToHut}
              >
                去小屋看看 →
              </button>
            </div>
          </div>
        </div>

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

          {/* Typing indicator */}
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
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isThinking}
            placeholder="想说点什么……"
            className="min-w-0 flex-1 rounded-full bg-white/50 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/25 focus:bg-white/65 disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={isThinking || !inputText.trim()}
            className="shrink-0 rounded-full bg-[#d4a574]/40 px-5 py-3 text-sm font-medium text-ink/70 transition hover:bg-[#d4a574]/55 disabled:opacity-30"
          >
            发送
          </button>
        </form>
      </section>
    </GameOverlay>
  )
}
