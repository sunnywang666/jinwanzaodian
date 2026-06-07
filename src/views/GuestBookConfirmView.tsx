import { useEffect } from 'react'
import { bookAssets, sceneAssets } from '../lib/assets'
import { AssetImage } from '../components/AssetImage'

interface GuestBookConfirmViewProps {
  onConfirm: () => void
  onCancel: () => void
}

export function GuestBookConfirmView({ onConfirm, onCancel }: GuestBookConfirmViewProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <section className="absolute inset-0 z-30 overflow-hidden">
      <AssetImage
        src={sceneAssets.mainBackground.src}
        fallbackSrc={sceneAssets.mainBackground.fallbackSrc}
        alt="早点铺主场景"
        variant="scene"
        renderFallbackCard={false}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(72,68,67,0.34)] backdrop-blur-[1px]" />

      <div className="absolute inset-x-0 top-[13%] z-10 px-8 text-center">
        <p className="text-[clamp(28px,6vw,44px)] font-semibold tracking-[0.04em] text-[#fffaf1] drop-shadow-[0_3px_8px_rgba(0,0,0,0.24)]">
          要打开客人图鉴吗？
        </p>
      </div>

      <div className="absolute left-1/2 top-[44%] z-10 w-[62%] max-w-[290px] -translate-x-1/2 -translate-y-1/2 animate-[confirmBookIn_300ms_ease-out]">
        <AssetImage
          src={bookAssets.guestBookCover.src}
          fallbackSrc={bookAssets.guestBookCover.fallbackSrc}
          alt="客人电话本封面"
          variant="item"
          renderFallbackCard={false}
          className="h-auto w-full -rotate-[7deg] drop-shadow-[0_18px_34px_rgba(54,38,26,0.28)]"
        />
      </div>

      <button
        type="button"
        className="absolute bottom-[12%] left-[12%] z-10 text-[clamp(34px,8vw,52px)] font-semibold tracking-[0.1em] text-[#fffaf1] opacity-90 transition duration-150 ease-out hover:scale-[1.15] hover:opacity-100 hover:drop-shadow-[0_0_14px_rgba(255,245,218,0.72)]"
        onClick={onConfirm}
      >
        要
      </button>

      <button
        type="button"
        className="absolute bottom-[12%] right-[10%] z-10 text-[clamp(34px,8vw,52px)] font-semibold tracking-[0.08em] text-[#fffaf1] opacity-90 transition duration-150 ease-out hover:scale-[1.15] hover:opacity-100 hover:drop-shadow-[0_0_14px_rgba(255,245,218,0.72)]"
        onClick={onCancel}
      >
        不要
      </button>
    </section>
  )
}
