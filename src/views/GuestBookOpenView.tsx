/**
 * GuestBookOpenView.tsx — v5.6
 *
 * Uses independent hotzones for the book layout while preserving
 * the real visit/familiarity data introduced in v5.4.
 */

import { useEffect, useState } from 'react'
import { AssetImage } from '../components/AssetImage'
import { bookAssets, sceneAssets } from '../lib/assets'
import { guests } from '../lib/demoData'
import {
  getFamiliarityLabel,
  getFamiliarityDescription,
  type GuestProgressMap,
} from '../lib/guestProgression'

interface GuestBookOpenViewProps {
  page: number
  guestProgress: GuestProgressMap
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

export function GuestBookOpenView({
  page,
  guestProgress,
  onBackToHome,
  onPrev,
  onNext,
}: GuestBookOpenViewProps) {
  const [displayPage, setDisplayPage] = useState(page)
  const [isVisible, setIsVisible] = useState(false)
  const guest = guests[displayPage]

  // Get real progression data, falling back to static data
  const progress = guestProgress[guest.key]
  const realVisitCount = progress?.totalVisits ?? guest.visitCount
  const familiarityLevel = progress?.familiarityLevel ?? 0
  const familiarityLabel = progress ? getFamiliarityLabel(familiarityLevel) : guest.status
  const familiarityDesc = progress
    ? getFamiliarityDescription(guest.key, familiarityLevel)
    : guest.familiarity

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

  const leftPageNum = displayPage * 2 + 1
  const rightPageNum = displayPage * 2 + 2

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

          {/* Character image */}
          <div
            className="absolute overflow-hidden"
            style={{ left: '24%', top: '28%', width: '15%', height: '14%' }}
          >
            <img
              src={guest.image.src}
              alt={guest.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                if (guest.image.fallbackSrc) {
                  (e.target as HTMLImageElement).src = guest.image.fallbackSrc
                }
              }}
            />
          </div>

          {/* Name */}
          <div
            className="font-tianrandai absolute flex items-center justify-center text-center font-semibold leading-tight text-ink"
            style={{ left: '20%', top: '46%', width: '23%', height: '3%', fontSize: '9.5px' }}
          >
            {guest.name}
          </div>

          {/* Description */}
          <div
            className="font-tianrandai absolute overflow-hidden text-center leading-[1.45] text-ink/72"
            style={{ left: '17%', top: '52%', width: '28%', height: '15%', fontSize: '12.5px' }}
          >
            {guest.description}
          </div>

          {/* Info block */}
          <div
            className="font-tianrandai absolute overflow-hidden leading-[1.6] text-ink/84"
            style={{ left: '54%', top: '29%', width: '31%', height: '22%', fontSize: '10.5px' }}
          >
            <p><span className="text-ink/55">喜欢：</span>{guest.favoriteFood}</p>
            <p><span className="text-ink/55">来访：</span>{realVisitCount} 次</p>
            <p><span className="text-ink/55">熟络：</span>{familiarityDesc}</p>
            <p><span className="text-ink/55">状态：</span>{familiarityLabel}</p>
          </div>

          {/* Story title */}
          <div
            className="font-tianrandai absolute font-semibold text-ink/60"
            style={{ left: '54%', top: '52%', width: '30%', height: '5%', fontSize: '12px' }}
          >
            小故事
          </div>

          {/* Story text */}
          <div
            className="font-tianrandai absolute overflow-hidden leading-[1.55] text-ink/80"
            style={{ left: '54%', top: '58%', width: '31%', height: '12%', fontSize: '10px' }}
          >
            {guest.story}
          </div>

          {/* Left page number */}
          <div
            className="font-tianrandai absolute flex items-center justify-center text-brown/70"
            style={{ left: '28%', top: '70%', width: '5%', height: '3%', fontSize: '10px' }}
          >
            {leftPageNum}
          </div>
          <div
            className="font-tianrandai absolute flex items-center justify-center text-brown/70"
            style={{ left: '67%', top: '71%', width: '5%', height: '3%', fontSize: '10px' }}
          >
            {rightPageNum}
          </div>
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
