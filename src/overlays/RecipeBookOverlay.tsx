/**
 * RecipeBookOverlay.tsx — v6.1
 *
 * Change from v5.6: added shop background + translucent overlay
 * (matching GuestBookOpenView's treatment).
 */

import { useState } from 'react'
import { bookAssets, sceneAssets } from '../lib/assets'
import { dishes } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import { PageTurnButton } from '../components/PageTurnButton'
import { getDishUnlockHint, type DishProgressMap } from '../lib/dishProgression'

interface RecipeBookOverlayProps {
  dishProgress: DishProgressMap
  onClose: () => void
}

function RecipePage({
  dish,
  side,
  pageNumber,
  isUnlocked,
}: {
  dish: (typeof dishes)[number] | undefined
  side: 'left' | 'right'
  pageNumber: number
  isUnlocked: boolean
}) {
  if (!dish) return null

  const colLeft = side === 'left' ? '3.5%' : '49.5%'
  const colLeftNum = side === 'left' ? 3.5 : 49.5
  const colWidth = '46.5%'
  const descLeft = side === 'left' ? '8%' : '54%'
  const infoLeft = side === 'left' ? '8%' : '54%'
  const pnLeft = side === 'left' ? '26%' : '72%'

  return (
    <>
      <div className="absolute" style={{ left: colLeft, top: '13.5%', width: colWidth }}>
        <img
          src={bookAssets.dishFrame.src}
          alt=""
          aria-hidden
          className="relative z-10 h-auto w-full"
        />
      </div>

      <div
        className="absolute z-20 flex items-center justify-center overflow-hidden"
        style={{ left: `${colLeftNum + 12}%`, top: '30.5%', width: '22%', height: '12%' }}
      >
        {isUnlocked ? (
          <img
            src={dish.image.src}
            alt={dish.name}
            className="h-full w-full object-contain"
            onError={(e) => {
              if (dish.image.fallbackSrc) {
                (e.target as HTMLImageElement).src = dish.image.fallbackSrc
              }
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-3xl opacity-30">?</span>
          </div>
        )}
      </div>

      <h2
        className="absolute font-semibold text-ink"
        style={{ left: colLeft, top: '46.5%', width: colWidth, textAlign: 'center', fontSize: '17.5px' }}
      >
        {isUnlocked ? dish.name : '???'}
      </h2>

      {isUnlocked ? (
        <>
          <div
            className="absolute flex items-center justify-center overflow-hidden text-center text-ink/68"
            style={{ left: descLeft, top: '53%', width: '36.5%', height: '8%', fontSize: '10px', lineHeight: '1.45' }}
          >
            {dish.description}
          </div>
          <div
            className="absolute overflow-hidden text-ink/68"
            style={{ left: infoLeft, top: '57.5%', width: '35.5%', height: '10%', fontSize: '10px', lineHeight: '1.45' }}
          >
            <p>客人：{dish.lovedBy}</p>
            <p style={{ marginTop: '2px' }}>来源：{dish.origin}</p>
          </div>
        </>
      ) : (
        <div
          className="absolute flex items-center justify-center overflow-hidden text-center italic text-ink/40"
          style={{ left: descLeft, top: '53%', width: '36.5%', height: '18%', fontSize: '10px', lineHeight: '1.45' }}
        >
          {getDishUnlockHint(dish.key)}
        </div>
      )}

      <div
        className="absolute flex items-center justify-center text-brown/65"
        style={{ left: pnLeft, top: '73.5%', width: '5%', height: '3%', fontSize: '10px' }}
      >
        {pageNumber}
      </div>
    </>
  )
}

export function RecipeBookOverlay({ dishProgress, onClose }: RecipeBookOverlayProps) {
  const [page, setPage] = useState(0)
  const spreadCount = Math.ceil(dishes.length / 2)
  const leftDish = dishes[page * 2]
  const rightDish = dishes[page * 2 + 1]
  const leftPageNumber = page * 2 + 1
  const rightPageNumber = page * 2 + 2
  const isLeftUnlocked = leftDish ? (dishProgress[leftDish.key]?.unlocked ?? false) : false
  const isRightUnlocked = rightDish ? (dishProgress[rightDish.key]?.unlocked ?? false) : false

  return (
    <GameOverlay title="菜谱本" onClose={onClose}>
      <section className="relative flex h-full flex-col">
        {/* 铺子背景 + 半透明遮罩 */}
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
        <div className="absolute inset-0 bg-[rgba(72,68,67,0.42)]" />

        <div className="relative z-10 mx-auto mt-[10dvh] w-full max-w-[430px] px-2">
          <div className="relative mx-auto aspect-square w-full">
            <AssetImage
              src={bookAssets.recipeInner.src}
              fallbackSrc={bookAssets.recipeInner.fallbackSrc}
              alt="菜谱本内页"
              variant="book"
              className="h-full w-full object-contain drop-shadow-[0_20px_26px_rgba(54,38,26,0.22)]"
            />
            <RecipePage dish={leftDish} side="left" pageNumber={leftPageNumber} isUnlocked={isLeftUnlocked} />
            <RecipePage dish={rightDish} side="right" pageNumber={rightPageNumber} isUnlocked={isRightUnlocked} />
          </div>
        </div>

        <div className="relative z-10 mt-auto flex items-center justify-between px-5 pb-5 pt-3">
          <PageTurnButton direction="prev" disabled={page === 0} onClick={() => setPage((c) => c - 1)} />
          <span className="text-xs text-paper/70">{page + 1} / {spreadCount}</span>
          <PageTurnButton direction="next" disabled={page >= spreadCount - 1} onClick={() => setPage((c) => c + 1)} />
        </div>
      </section>
    </GameOverlay>
  )
}
