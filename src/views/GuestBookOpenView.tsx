import { useEffect, useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { bookAssets, sceneAssets } from '../lib/assets'
import { guests } from '../lib/demoData'

interface GuestBookOpenViewProps {
  page: number
  onBackToHome: () => void
  onPrev: () => void
  onNext: () => void
}

function preloadImage(src?: string) {
  return new Promise<void>((resolve) => {
    if (!src) { resolve(); return }
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = src
  })
}

export function GuestBookOpenView({ page, onBackToHome, onPrev, onNext }: GuestBookOpenViewProps) {
  const [displayPage, setDisplayPage] = useState(page)
  const [isVisible, setIsVisible] = useState(false)
  const guest = guests[displayPage]

  useEffect(() => {
    let active = true
    setIsVisible(false)

    void Promise.all([
      preloadImage(bookAssets.guestBookInner.src),
      preloadImage(bookAssets.guestBookInner.fallbackSrc),
      preloadImage(guests[page]?.image.src),
      preloadImage(guests[page]?.image.fallbackSrc),
    ]).then(() => {
      if (!active) return
      setDisplayPage(page)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (active) setIsVisible(true)
        })
      })
    })

    return () => { active = false }
  }, [page])

  return (
    <section className="absolute inset-0 z-30 h-full overflow-hidden">
      <div className="absolute inset-0 bg-[#d7d3cf]">
        <AssetImage
          src={sceneAssets.mainBackground.src}
          fallbackSrc={sceneAssets.mainBackground.fallbackSrc}
          alt="早点铺主场景"
          variant="scene"
          renderFallbackCard={false}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[rgba(72,68,67,0.4)] transition-opacity duration-300" />

      <button
        type="button"
        className="font-tianrandai absolute left-4 top-4 z-20 rounded-full bg-ink/20 px-4 py-2 text-base text-paper backdrop-blur-sm transition hover:bg-ink/30"
        onClick={onBackToHome}
      >
        返回铺子
      </button>

      <div className="absolute inset-x-0 top-[10%] z-10 px-2">
        <div
          className={`relative mx-auto aspect-square w-[94%] max-w-[430px] transition-all duration-[220ms] ease-out ${
            isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.94] opacity-0'
          }`}
        >
          <AssetImage
            src={bookAssets.guestBookInner.src}
            fallbackSrc={bookAssets.guestBookInner.fallbackSrc}
            alt="翻开的客人电话本"
            variant="book"
            renderFallbackCard={false}
            className="h-full w-full object-contain drop-shadow-[0_20px_26px_rgba(54,38,26,0.22)]"
          />

          {/* Left page: character image */}
          <div
            className="absolute flex items-center justify-center overflow-hidden"
            style={{ left: '10%', top: '20%', width: '30%', height: '32%' }}
          >
            <AssetImage
              src={guest.image.src}
              fallbackSrc={guest.image.fallbackSrc}
              alt={guest.name}
              variant="character"
              renderFallbackCard={false}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Left page: name */}
          <div
            className="font-tianrandai absolute text-center leading-tight text-ink"
            style={{
              left: '9%',
              top: '55%',
              width: '32%',
              fontSize: 'clamp(13px, 2.4vw, 18px)',
            }}
          >
            {guest.name}
          </div>

          {/* Left page: description (one short line) */}
          <p
            className="font-tianrandai absolute leading-[1.4] text-ink/75"
            style={{
              left: '9%',
              top: '63%',
              width: '32%',
              fontSize: 'clamp(9px, 1.5vw, 11px)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {guest.description}
          </p>

          {/* Right page: details */}
          <div
            className="font-tianrandai absolute space-y-[3px] text-ink/84"
            style={{
              left: '52%',
              top: '22%',
              width: '36%',
              fontSize: 'clamp(10px, 1.7vw, 12px)',
              lineHeight: '1.5',
            }}
          >
            <p>喜欢：{guest.favoriteFood}</p>
            <p>来访：{guest.visitCount} 次</p>
            <p>熟络：<span style={{
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>{guest.familiarity}</span></p>
          </div>

          {/* Right page: story */}
          <div
            className="font-tianrandai absolute text-ink/80"
            style={{
              left: '52%',
              top: '50%',
              width: '36%',
              fontSize: 'clamp(9px, 1.6vw, 12px)',
              lineHeight: '1.55',
            }}
          >
            <p className="mb-[3px] font-semibold text-ink/60" style={{ fontSize: 'clamp(9px, 1.5vw, 11px)' }}>小故事</p>
            <p style={{
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>{guest.story}</p>
          </div>

          {/* Page number */}
          <p className="font-tianrandai absolute left-1/2 -translate-x-1/2 text-brown/70"
            style={{ top: '86%', fontSize: 'clamp(11px, 1.8vw, 14px)' }}
          >
            {displayPage + 1} / {guests.length}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 z-20 flex items-end justify-between px-5">
        <button
          type="button"
          className="font-tianrandai min-w-[104px] rounded-full bg-ink/20 px-5 py-2.5 text-lg text-paper backdrop-blur-sm transition duration-150 ease-out hover:bg-ink/30"
          onClick={onPrev}
        >
          上一位
        </button>
        <button
          type="button"
          className="font-tianrandai min-w-[104px] rounded-full bg-ink/20 px-5 py-2.5 text-lg text-paper backdrop-blur-sm transition duration-150 ease-out hover:bg-ink/30"
          onClick={onNext}
        >
          下一位
        </button>
      </div>
    </section>
  )
}
