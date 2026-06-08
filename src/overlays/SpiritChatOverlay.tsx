import { useState, useRef, useEffect } from 'react'
import { spiritAssets } from '../lib/assets'
import { initialChatMessages, quickReplies, type ChatMessage } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import type { NightType } from '../lib/storage'

interface SpiritChatOverlayProps {
  spiritName: string
  nightType: NightType
  onGoToHut: () => void
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

/* ── API 配置 ── */

/** Same-origin proxy endpoint for local deployment and Vercel */
const DEFAULT_CHAT_API = '/api/chat'

function getChatApiUrl(): string {
  return DEFAULT_CHAT_API
}

/** 用户自带的 AIPing key（可选，不填则用服务端内置 key） */
function getUserApiKey(): string | null {
  try {
    return localStorage.getItem('jinwanzaodian:aiping_key') ?? null
  } catch {
    return null
  }
}

/* ── Chat API 调用 ── */

async function callChat(
  messages: ChatMessage[],
  nightType: NightType,
  spiritName: string,
): Promise<string> {
  const systemPrompt = `${systemPrompts[nightType]}\n\n你的名字是${spiritName}。`

  // OpenAI-compatible 格式：system prompt 放 messages[0]
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
  if (userKey) {
    headers['Authorization'] = `Bearer ${userKey}`
  }

  const response = await fetch(getChatApiUrl(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ messages: apiMessages, max_tokens: 150 }),
  })

  if (!response.ok) {
    const err = await response.text().catch(() => '')
    throw new Error(`api_error_${response.status}: ${err.slice(0, 200)}`)
  }

  const data = await response.json() as { reply?: string }
  return data.reply ?? '……'
}

/* ── Main component ── */

export function SpiritChatOverlay({ spiritName, nightType, onGoToHut, onClose }: SpiritChatOverlayProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages)
  const [isThinking, setIsThinking] = useState(false)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const [hasKey, setHasKey] = useState(() => Boolean(getUserApiKey()))
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  const sendMessage = async (userText: string) => {
    const stamp = Date.now()
    const userMsg: ChatMessage = { id: `user-${stamp}`, speaker: 'user', text: userText }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setIsThinking(true)

    try {
      const reply = await callChat(nextMessages, nightType, spiritName)
      setMessages((current) => [
        ...current,
        { id: `spirit-${stamp}`, speaker: 'spirit', text: reply },
      ])
    } catch (error) {
      const fallback = quickReplies.find((r) => r.label === userText)?.response
        ?? '……铺子里暖着，先不用说话也没关系。'
      setMessages((current) => [
        ...current,
        { id: `spirit-${stamp}`, speaker: 'spirit', text: fallback },
      ])
    } finally {
      setIsThinking(false)
    }
  }

  const saveKey = () => {
    if (keyDraft.trim()) {
      localStorage.setItem('jinwanzaodian:aiping_key', keyDraft.trim())
      setHasKey(true)
    } else {
      localStorage.removeItem('jinwanzaodian:aiping_key')
      setHasKey(false)
    }
    setShowKeyInput(false)
    setKeyDraft('')
  }

  return (
    <GameOverlay onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8]">
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

          {/* API key toggle — 可选：用户自带 key 或用内置服务 */}
          <button
            type="button"
            className={`rounded-full px-2.5 py-1 text-[10px] transition ${
              hasKey ? 'bg-sage/40 text-ink/50' : 'bg-butter/60 text-brown'
            }`}
            onClick={() => setShowKeyInput((v) => !v)}
          >
            {hasKey ? '自定义 AI ✓' : 'AI 已接入'}
          </button>
        </div>

        {/* API key input (collapsible) — 可选，留空则用内置服务 */}
        {showKeyInput ? (
          <div className="mx-4 mb-2 rounded-[18px] bg-white/50 px-3 py-2">
            <p className="mb-1.5 text-[10px] text-ink/40">
              留空使用内置 AI · 填入 AIPing Key 使用自己的额度
            </p>
            <div className="flex gap-2">
              <input
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                placeholder="AIPing API Key（可选）"
                className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={saveKey}
                className="shrink-0 text-xs text-brown"
              >
                保存
              </button>
            </div>
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
                    fromSpirit ? 'bg-white/70 text-ink/80' : 'bg-butter/70 text-ink'
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
              <div className="flex items-center gap-1 rounded-[22px] bg-white/70 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/30" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/30" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/30" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : null}
        </div>

        {/* Quick replies */}
        <div className="grid gap-2 px-4 pb-5 pt-2">
          {quickReplies.map((reply) => (
            <button
              key={reply.label}
              type="button"
              disabled={isThinking}
              className="rounded-full bg-paper/60 px-4 py-3 text-left text-sm text-ink transition hover:bg-paper/80 disabled:opacity-40"
              onClick={() => sendMessage(reply.label)}
            >
              {reply.label}
            </button>
          ))}
        </div>
      </section>
    </GameOverlay>
  )
}
