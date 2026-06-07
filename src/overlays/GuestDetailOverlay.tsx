import type { GuestEntry } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'

interface GuestDetailOverlayProps {
  guest: GuestEntry
  onClose: () => void
}

export function GuestDetailOverlay({ guest, onClose }: GuestDetailOverlayProps) {
  return (
    <GameOverlay title={guest.name} onClose={onClose}>
      <section className="flex h-full flex-col px-4 py-4">
        <div className="rounded-[30px] border border-line bg-cream px-4 py-5 text-center">
          <AssetImage
            src={guest.image.src}
            fallbackSrc={guest.image.fallbackSrc}
            alt={guest.name}
            variant="character"
            className="h-32"
          />
        </div>

        <article className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-[30px] border border-line bg-paper px-5 py-5">
          <h1 className="text-3xl font-semibold text-ink">{guest.name}</h1>
          <p className="mt-2 text-base leading-6 text-ink/75">{guest.description}</p>
          <div className="mt-5 grid gap-3 text-sm leading-6 text-ink/78">
            <p className="rounded-[22px] bg-white/75 px-4 py-3">喜欢的早点：{guest.favoriteFood}</p>
            <p className="rounded-[22px] bg-white/75 px-4 py-3">来访次数：{guest.visitCount}</p>
            <p className="rounded-[22px] bg-white/75 px-4 py-3">熟络程度：{guest.familiarity}</p>
            <p className="rounded-[22px] bg-cream px-4 py-4">小故事：{guest.story}</p>
          </div>
        </article>
      </section>
    </GameOverlay>
  )
}
