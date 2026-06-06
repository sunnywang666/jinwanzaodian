import { useState } from 'react'
import { spiritAssets, toolAssets } from '../lib/assets'
import { initialChatMessages, quickReplies, type ChatMessage } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'

interface RadioChatOverlayProps {
  spiritName: string
  onClose: () => void
}

export function RadioChatOverlay({ spiritName, onClose }: RadioChatOverlayProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages)

  return (
    <GameOverlay title="收音机" onClose={onClose}>
      <section className="flex h-full flex-col px-4 py-4">
        <div className="rounded-[28px] border border-line bg-cream px-4 py-4 text-center">
          <AssetImage
            src={toolAssets.radio.src}
            fallbackSrc={toolAssets.radio.fallbackSrc}
            alt="收音机"
            variant="item"
            className="h-24"
          />
        </div>

        <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto rounded-[30px] border border-line bg-[#f8ecd8] px-4 py-4">
          {messages.map((message) => {
            const fromSpirit = message.speaker === 'spirit'

            return (
              <div key={message.id} className={`flex items-end gap-2 ${fromSpirit ? 'justify-start' : 'justify-end'}`}>
                {fromSpirit ? (
                  <AssetImage
                    src={spiritAssets.normal.src}
                    fallbackSrc={spiritAssets.normal.fallbackSrc}
                    alt={spiritName}
                    variant="character"
                    className="h-10 shrink-0"
                  />
                ) : null}
                <p className={`max-w-[78%] rounded-[24px] px-4 py-3 text-sm leading-6 ${fromSpirit ? 'bg-white text-ink/78' : 'bg-butter text-ink'}`}>
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
                const stamp = Date.now()
                setMessages((current) => [
                  ...current,
                  { id: `user-${stamp}`, speaker: 'user', text: reply.label },
                  { id: `spirit-${stamp}`, speaker: 'spirit', text: reply.response },
                ])
              }}
            >
              {reply.label}
            </button>
          ))}
        </div>
      </section>
    </GameOverlay>
  )
}
