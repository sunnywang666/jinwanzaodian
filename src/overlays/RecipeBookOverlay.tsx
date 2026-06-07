import { useState } from 'react'
import { bookAssets } from '../lib/assets'
import { dishes } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import { PageTurnButton } from '../components/PageTurnButton'

interface RecipeBookOverlayProps {
  onClose: () => void
}

const lineClampStyle = (lines: number): React.CSSProperties => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
})

function RecipePage({
  dish,
  side,
  pageNumber,
}: {
  dish: (typeof dishes)[number] | undefined
  side: 'left' | 'right'
  pageNumber: number
}) {
  if (!dish) return null

  const colLeft = side === 'left' ? '3.5%' : '49.5%'
  const colLeftNum = side === 'left' ? 3.5 : 49.5
  const colWidth = '46.5%'
  const pageNumLeft = side === 'left' ? '26%' : '72%'

  return (
    <>
      {/* Dish frame */}
      <div className="absolute" style={{ left: colLeft, top: '13.5%', width: colWidth }}>
        <img
          src={bookAssets.dishFrame.src}
          alt=""
          aria-hidden
          className="relative z-10 h-auto w-full"
        />
      </div>

      {/* Food image */}
      <div
        className="absolute z-20 flex items-center justify-center overflow-hidden"
        style={{
          left: `${colLeftNum + 12}%`,
          top: '30.5%',
          width: '22%',
          height: '12%',
        }}
      >
        <AssetImage
          src={dish.image.src}
          fallbackSrc={dish.image.fallbackSrc}
          alt={dish.name}
          variant="item"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Dish name */}
      <h2
        className="absolute font-semibold text-ink"
        style={{
          left: colLeft,
          top: '46.5%',
          width: colWidth,
          textAlign: 'center',
          fontSize: '17.5px',
        }}
      >
        {dish.name}
      </h2>

      {/* Description */}
      <div
        className="absolute text-ink/68"
        style={{
          left: `${colLeftNum + 3}%`,
          top: '54.5%',
          width: '35.5%',
          fontSize: '10px',
          lineHeight: '1.45',
        }}
      >
        <p style={lineClampStyle(1)}>{dish.description}</p>
        <p style={{ marginTop: '2px', ...lineClampStyle(1) }}>客人：{dish.lovedBy}</p>
        <p style={{ marginTop: '2px', ...lineClampStyle(1) }}>来源：{dish.origin}</p>
      </div>

      {/* Page number */}
      <p
        className="absolute text-brown/65"
        style={{ left: pageNumLeft, top: '73.5%', fontSize: '10px' }}
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
          <span className="text-xs text-ink/50">{page + 1} / {spreadCount}</span>
          <PageTurnButton direction="next" disabled={page >= spreadCount - 1} onClick={() => setPage((current) => current + 1)} />
        </div>
      </section>
    </GameOverlay>
  )
}
