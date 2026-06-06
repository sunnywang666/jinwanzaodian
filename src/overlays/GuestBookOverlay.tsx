import { useState } from 'react'
import { bookAssets } from '../lib/assets'
import { guests, type GuestEntry } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import { GuestDetailOverlay } from './GuestDetailOverlay'

interface GuestBookOverlayProps {
  onClose: () => void
}

export function GuestBookOverlay({ onClose }: GuestBookOverlayProps) {
  const [selectedGuest, setSelectedGuest] = useState<GuestEntry | null>(null)

  if (selectedGuest) {
    return <GuestDetailOverlay guest={selectedGuest} onClose={() => setSelectedGuest(null)} />
  }

  return (
    <GameOverlay title="客人电话本" onClose={onClose}>
      <section className="flex h-full flex-col px-4 py-4">
        <div className="flex items-center justify-center">
          <AssetImage
            src={bookAssets.guestBookCover.src}
            fallbackSrc={bookAssets.guestBookCover.fallbackSrc}
            alt="电话本封面"
            variant="item"
            className="h-16"
          />
        </div>

        <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-[26px] border border-line bg-[#f8ecd8]">
          <AssetImage
            src={bookAssets.guestBookInner.src}
            fallbackSrc={bookAssets.guestBookInner.fallbackSrc}
            alt="电话本内页"
            variant="book"
            className="absolute inset-0 h-full bg-[#f8ecd8]"
          />
          <div className="relative grid h-full grid-cols-3 gap-3 overflow-y-auto px-4 pb-4 pt-6">
            {guests.map((guest) => (
              <button
                key={guest.name}
                type="button"
                className="rounded-[22px] border border-line bg-white/80 px-2 py-3 text-center shadow-sm"
                onClick={() => setSelectedGuest(guest)}
              >
                <div className="flex h-20 items-center justify-center">
                  <AssetImage
                    src={guest.image.src}
                    fallbackSrc={guest.image.fallbackSrc}
                    alt={guest.name}
                    variant="character"
                    className="h-16"
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-ink">{guest.name}</p>
                <p className="mt-1 text-xs text-brown">{guest.status}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </GameOverlay>
  )
}
