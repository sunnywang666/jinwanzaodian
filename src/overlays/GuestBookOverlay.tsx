import { useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import { PageTurnButton } from '../components/PageTurnButton'
import { bookAssets } from '../lib/assets'
import { guests } from '../lib/demoData'

interface GuestBookOverlayProps {
  onClose: () => void
}

export function GuestBookOverlay({ onClose }: GuestBookOverlayProps) {
  const [opened, setOpened] = useState(false)
  const [page, setPage] = useState(0)
  const guest = guests[page]

  if (!opened) {
    return (
      <GameOverlay title="客人电话本" onClose={onClose}>
        <section className="flex h-full flex-col items-center justify-center bg-[#f5ead8] px-6">
          <div className="w-full max-w-[300px]">
            <AssetImage
              src={bookAssets.guestBookCover.src}
              fallbackSrc={bookAssets.guestBookCover.fallbackSrc}
              alt="客人电话本封面"
              variant="item"
              className="h-auto w-full"
            />
          </div>
          <button
            type="button"
            className="mt-8 rounded-full border border-line bg-paper px-5 py-3 text-sm text-ink shadow-sm"
            onClick={() => setOpened(true)}
          >
            翻开电话本
          </button>
        </section>
      </GameOverlay>
    )
  }

  return (
    <GameOverlay title="客人电话本" onClose={onClose}>
      <section className="relative flex h-full flex-col bg-[#f5ead8]">
        <div className="relative mx-auto mt-[12dvh] w-full max-w-[430px] px-2">
          <div className="relative mx-auto aspect-square w-full">
            <AssetImage
              src={bookAssets.guestBookInner.src}
              fallbackSrc={bookAssets.guestBookInner.fallbackSrc}
              alt="客人电话本内页"
              variant="book"
              className="h-full w-full object-contain"
            />

            <div className="absolute" style={{ left: '13%', top: '20%', width: '26%' }}>
              <AssetImage
                src={guest.image.src}
                fallbackSrc={guest.image.fallbackSrc}
                alt={guest.name}
                variant="character"
                className="h-auto w-full"
              />
            </div>

            <div
              className="absolute rounded-full border border-line bg-paper/88 px-4 py-2 text-center text-[clamp(14px,2.2vw,18px)] font-semibold text-ink shadow-sm"
              style={{ left: '15%', top: '51%', width: '22%' }}
            >
              {guest.name}
            </div>

            <div
              className="absolute text-[clamp(10px,1.7vw,13px)] leading-[1.7] text-ink/78"
              style={{ left: '53%', top: '22%', width: '34%' }}
            >
              <p>{guest.description}</p>
              <p className="mt-3">喜欢的早点：{guest.favoriteFood}</p>
              <p className="mt-2">来访次数：{guest.visitCount}</p>
              <p className="mt-2">熟络程度：{guest.familiarity}</p>
            </div>

            <div
              className="absolute text-[clamp(10px,1.7vw,13px)] leading-[1.75] text-ink/76"
              style={{ left: '53%', top: '58%', width: '34%' }}
            >
              <p>小故事</p>
              <p className="mt-2">{guest.story}</p>
            </div>

            <p className="absolute left-1/2 top-[88%] -translate-x-1/2 text-[11px] text-brown/80">
              {page + 1} / {guests.length}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between px-5 pb-5 pt-3">
          <PageTurnButton
            direction="prev"
            label="上一位"
            disabled={page === 0}
            onClick={() => setPage((current) => current - 1)}
          />
          <button
            type="button"
            className="rounded-full border border-line bg-paper px-4 py-2 text-xs text-brown shadow-sm"
            onClick={() => setOpened(false)}
          >
            回到封面
          </button>
          <PageTurnButton
            direction="next"
            label="下一位"
            disabled={page >= guests.length - 1}
            onClick={() => setPage((current) => current + 1)}
          />
        </div>
      </section>
    </GameOverlay>
  )
}
