import { useEffect } from 'react'
import { bookAssets, sceneAssets } from '../lib/assets'
import { AssetImage } from '../components/AssetImage'
import { useT } from '../lib/i18n'

interface RecipeBookConfirmViewProps {
  onConfirm: () => void
  onCancel: () => void
}

export function RecipeBookConfirmView({ onConfirm, onCancel }: RecipeBookConfirmViewProps) {
  const { t } = useT()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <section className="absolute inset-0 z-30 overflow-hidden">
      <div className="absolute inset-0 bg-[#d7d3cf]">
        <AssetImage
          src={sceneAssets.mainBackground.src}
          fallbackSrc={sceneAssets.mainBackground.fallbackSrc}
          alt=""
          variant="scene"
          renderFallbackCard={false}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[rgba(72,68,67,0.42)]" />

      <p className="font-tianrandai absolute inset-x-0 top-[12%] z-10 whitespace-nowrap px-4 text-center tracking-[0.04em] text-[#fffaf1] drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
        style={{ fontSize: 'clamp(20px, 6.5vw, 46px)' }}
      >
        {t('confirm.recipeBook')}
      </p>

      <div className="absolute left-1/2 top-[48%] z-10 w-[60%] max-w-[280px] -translate-x-1/2 -translate-y-1/2 animate-[confirmBookIn_300ms_ease-out]">
        <AssetImage
          src={bookAssets.recipeCover.src}
          fallbackSrc={bookAssets.recipeCover.fallbackSrc}
          alt=""
          variant="item"
          renderFallbackCard={false}
          className="h-auto w-full -rotate-[6deg] drop-shadow-[0_24px_34px_rgba(54,38,26,0.28)]"
        />
      </div>

      <button
        type="button"
        className="font-tianrandai absolute bottom-[10%] left-[11%] z-10 text-[clamp(34px,9vw,56px)] tracking-[0.12em] text-[#fffaf1] opacity-90 transition duration-150 ease-out hover:scale-[1.14] hover:opacity-100 hover:drop-shadow-[0_0_14px_rgba(255,245,218,0.85)]"
        onClick={onConfirm}
      >
        {t('confirm.yes')}
      </button>

      <button
        type="button"
        className="font-tianrandai absolute bottom-[10%] right-[8%] z-10 text-[clamp(34px,9vw,56px)] tracking-[0.08em] text-[#fffaf1] opacity-90 transition duration-150 ease-out hover:scale-[1.14] hover:opacity-100 hover:drop-shadow-[0_0_14px_rgba(255,245,218,0.85)]"
        onClick={onCancel}
      >
        {t('confirm.no')}
      </button>
    </section>
  )
}
