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

          {/* Left page: character image */}
          <div
            className="absolute flex items-center justify-center overflow-hidden"
            style={{ left: '17%', top: '18.5%', width: '30%', height: '32%' }}
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
            className="font-tianrandai absolute text-center font-semibold leading-tight text-ink"
            style={{ left: '15%', top: '45%', width: '32.5%', fontSize: '12.5px' }}
          >
            {guest.name}
          </div>

          {/* Left page: description */}
          <p
            className="font-tianrandai absolute leading-[1.45] text-ink/72"
            style={{
              left: '18%',
              top: '52.5%',
              width: '26.5%',
              fontSize: '12.5px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {guest.description}
          </p>

          {/* Right page: 喜欢 */}
          <p
            className="font-tianrandai absolute leading-[1.5] text-ink/84"
            style={{ left: '55.5%', top: '31.5%', width: '36%', fontSize: '10px' }}
          >
            喜欢：{guest.favoriteFood}
          </p>

          {/* Right page: 来访 */}
          <p
            className="font-tianrandai absolute leading-[1.5] text-ink/84"
            style={{ left: '55.5%', top: '38.5%', width: '36%', fontSize: '10px' }}
          >
            来访：{guest.visitCount} 次
          </p>

          {/* Right page: 熟络 */}
          <p
            className="font-tianrandai absolute leading-[1.5] text-ink/84"
            style={{
              left: '55.5%',
              top: '45.5%',
              width: '36%',
              fontSize: '10px',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            熟络：{guest.familiarity}
          </p>

          {/* Right page: story label */}
          <p
            className="font-tianrandai absolute font-semibold text-ink/60"
            style={{ left: '55.5%', top: '50.5%', width: '30%', fontSize: '13px' }}
          >
            小故事
          </p>

          {/* Right page: story text */}
          <p
            className="font-tianrandai absolute leading-[1.55] text-ink/80"
            style={{
              left: '55.5%',
              top: '58%',
              width: '29.5%',
              fontSize: '10px',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {guest.story}
          </p>

          {/* Page number left */}
          <p
            className="font-tianrandai absolute text-brown/70"
            style={{ left: '30%', top: '70%', fontSize: '10px' }}
          >
            {leftPageNum}
          </p>

          {/* Page number right */}
          <p
            className="font-tianrandai absolute text-brown/70"
            style={{ left: '69%', top: '70.5%', fontSize: '10px' }}
          >
            {rightPageNum}
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
