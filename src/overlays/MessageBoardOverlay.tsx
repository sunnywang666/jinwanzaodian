import { messageBoardNotes } from '../lib/demoData'
import { GameOverlay } from '../components/GameOverlay'

interface MessageBoardOverlayProps {
  onClose: () => void
}

export function MessageBoardOverlay({ onClose }: MessageBoardOverlayProps) {
  return (
    <GameOverlay title="留言板" onClose={onClose}>
      <section className="flex h-full flex-col px-4 py-4">
        <div className="grid gap-3">
          {messageBoardNotes.map((note, index) => (
            <article
              key={note}
              className={`rounded-[24px] border border-line px-4 py-4 text-sm leading-6 text-ink/78 shadow-sm ${
                index % 2 === 0 ? 'rotate-[-0.8deg] bg-[#fff5d8]' : 'rotate-[0.8deg] bg-[#f9efe6]'
              }`}
            >
              {note}
            </article>
          ))}
        </div>
      </section>
    </GameOverlay>
  )
}
