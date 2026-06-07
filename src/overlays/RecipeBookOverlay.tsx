import { useState } from 'react'
import { bookAssets } from '../lib/assets'
import { dishes } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import { PageTurnButton } from '../components/PageTurnButton'

interface RecipeBookOverlayProps {
  onClose: () => void
}

function RecipePage({
  dish,
  side,
  pageNumber,
}: {
  dish: (typeof dishes)[number] | undefined
  side: 'left' | 'right'
  pageNumber: number
}) {
  if (!dish) {
    return null
  }

  const colLeft = side === 'left' ? '7%' : '53%'
  const colWidth = '38%'
  const pageNumLeft = side === 'left' ? '24%' : '70%'

  return (
    <>
      {/* Dish frame + food image stacked */}
      <div className="absolute" style={{ left: colLeft, top: '12%', width: colWidth }}>
        {/* Frame image */}
        <img
          src={bookAssets.dishFrame.src}
          alt=""
          aria-hidden
          className="relative z-10 h-auto w-full"
        />
        {/* Food image centered inside frame */}
        <div className="absolute inset-[14%] flex items-center justify-center">
          <AssetImage
            src={dish.image.src}
            fallbackSrc={dish.image.fallbackSrc}
            alt={dish.name}
            variant="item"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      {/* Dish name */}
      <h2
        className="absolute text-[clamp(13px,2.2vw,18px)] font-semibold text-ink"
        style={{ left: colLeft, top: '56%', width: colWidth, textAlign: 'center' }}
      >
        {dish.name}
      </h2>

      {/* Description lines */}
      <div
        className="absolute space-y-[2px] text-[clamp(9px,1.5vw,11px)] leading-[1.55] text-ink/70"
        style={{ left: colLeft, top: '63%', width: colWidth }}
      >
        <p>{dish.description}</p>
        <p>喜欢它的客人：{dish.lovedBy}</p>
        <p>解锁来源：{dish.origin}</p>
      </div>

      {/* Page number */}
      <p
        className="absolute text-[10px] text-brown/70"
        style={{ left: pageNumLeft, top: '88%' }}
      >
        {pageNumber}
      </p>
    </>
  )
}

export function RecipeBookOverlay({ onClose }: RecipeBookOverlayProps) {
  const [page, setPage] = useState(0)
  const spreadCount = Math.ceil(dishes.length / 2)
  const leftDish = dishes[page * 2]
  const rightDish = dishes[page * 2 + 1]
  const leftPageNumber = page * 2 + 1
  const rightPageNumber = page * 2 + 2

  return (
    <GameOverlay title="菜谱本" onClose={onClose}>
      <section className="relative flex h-full flex-col bg-[#f5ead8]">
        <div className="relative mx-auto mt-[10dvh] w-full max-w-[430px] px-2">
          <div className="relative mx-auto aspect-square w-full">
            <AssetImage
              src={bookAssets.recipeInner.src}
              fallbackSrc={bookAssets.recipeInner.fallbackSrc}
              alt="菜谱本内页"
              variant="book"
              className="h-full w-full object-contain"
            />
            <RecipePage dish={leftDish} side="left" pageNumber={leftPageNumber} />
            <RecipePage dish={rightDish} side="right" pageNumber={rightPageNumber} />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between px-5 pb-5 pt-3">
          <PageTurnButton direction="prev" disabled={page === 0} onClick={() => setPage((current) => current - 1)} />
          <span className="text-xs text-ink/50">
            {page + 1} / {spreadCount}
          </span>
          <PageTurnButton
            direction="next"
            disabled={page >= spreadCount - 1}
            onClick={() => setPage((current) => current + 1)}
          />
        </div>
      </section>
    </GameOverlay>
  )
}
