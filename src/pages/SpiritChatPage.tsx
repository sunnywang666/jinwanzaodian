import { useState } from 'react'
import { getSpiritAsset } from '../lib/assets'
import { initialChatMessages, quickReplies, type ChatMessage } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'

interface SpiritChatPageProps {
  spiritName: string
}

export function SpiritChatPage({ spiritName }: SpiritChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages)
  const spirit = getSpiritAsset('base')

  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div className="flex items-center gap-3 rounded-[28px] border border-line bg-paper px-4 py-3">
        <AssetImage
          src={spirit.src}
          fallbackSrc={spirit.fallbackSrc}
          alt={spiritName}
          variant="character"
          className="h-12"
        />
        <div>
          <p className="text-lg font-semibold text-ink">{spiritName}</p>
          <p className="text-xs text-ink/60">面点精灵</p>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto rounded-[30px] border border-line bg-cream px-4 py-4">
        {messages.map((message) => {
          const fromSpirit = message.speaker === 'spirit'

          return (
            <div key={message.id} className={`flex items-end gap-2 ${fromSpirit ? 'justify-start' : 'justify-end'}`}>
              {fromSpirit ? (
                <AssetImage
                  src={spirit.src}
                  fallbackSrc={spirit.fallbackSrc}
                  alt={spiritName}
                  variant="character"
                  className="h-9 shrink-0"
                />
              ) : null}
              <p
                className={`max-w-[78%] rounded-[24px] px-4 py-3 text-sm leading-6 ${
                  fromSpirit ? 'bg-white text-ink/78' : 'bg-butter text-ink'
                }`}
              >
                {message.text}
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-3 grid gap-2">
        {quickReplies.map((reply) => (
          <button
            key={reply.label}
            type="button"
            className="rounded-[22px] border border-line bg-white/80 px-4 py-3 text-left text-sm text-ink"
            onClick={() => {
              const time = Date.now()
              setMessages((current) => [
                ...current,
                { id: `user-${time}`, speaker: 'user', text: reply.label },
                { id: `spirit-${time}`, speaker: 'spirit', text: reply.response },
              ])
            }}
          >
            {reply.label}
          </button>
        ))}
      </div>
    </section>
  )
}
