import { guestAssets } from '../lib/assets'
import { guests } from '../lib/demoData'
import type { GuestEntry } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'

interface GuestBookProps {
  onSelectGuest: (guest: GuestEntry) => void
}

export function GuestBook({ onSelectGuest }: GuestBookProps) {
  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div>
        <p className="paper-label">客人图鉴</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">来过铺子的客人</h1>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {guests.map((guest) => {
          const asset = guestAssets[guest.key]

          return (
            <button
              key={guest.name}
              type="button"
              className="rounded-[24px] border border-line bg-white/80 px-2 py-3 text-center shadow-sm"
              onClick={() => onSelectGuest(guest)}
            >
              <div className="flex h-24 items-center justify-center rounded-[18px] bg-cream">
                <AssetImage
                  src={asset.src}
                  fallbackSrc={asset.fallbackSrc}
                  alt={guest.name}
                  variant="character"
                  className="h-20"
                />
              </div>
              <p className="mt-2 line-clamp-1 text-sm font-semibold text-ink">{guest.name}</p>
              <p className="mt-1 text-xs text-brown">{guest.status}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
