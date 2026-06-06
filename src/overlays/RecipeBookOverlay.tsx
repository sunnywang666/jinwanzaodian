import { useState } from 'react'
import { bookAssets, foodAssets } from '../lib/assets'
import { dishes } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import { PageTurnButton } from '../components/PageTurnButton'

interface RecipeBookOverlayProps {
  onClose: () => void
}

export function RecipeBookOverlay({ onClose }: RecipeBookOverlayProps) {
  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(dishes.length / 2)
  const leftDish = dishes[page * 2]
  const rightDish = dishes[page * 2 + 1]

  return (
    <GameOverlay title="菜谱本" onClose={onClose}>
      <section className="flex h-full flex-col px-4 py-4">
        <div className="flex items-center justify-center">
          <AssetImage
            src={bookAssets.recipeCover.src}
            fallbackSrc={bookAssets.recipeCover.fallbackSrc}
            alt="菜谱本封面"
            variant="item"
            className="h-16"
          />
        </div>

        <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-[26px] border border-line bg-[#f8ecd8]">
          <AssetImage
            src={bookAssets.recipeInner.src}
            fallbackSrc={bookAssets.recipeInner.fallbackSrc}
            alt="菜谱本内页"
            variant="book"
            className="absolute inset-0 h-full bg-[#f8ecd8]"
          />
          <div className="relative grid h-full grid-cols-2 gap-4 px-5 pb-10 pt-6">
            {[leftDish, rightDish].map((dish, index) => (
              <div key={dish?.key ?? `empty-${index}`} className="flex min-h-0 flex-col">
                {dish ? (
                  <>
                    <div className="flex h-28 items-center justify-center">
                      <AssetImage
                        src={dish.image.src}
                        fallbackSrc={dish.image.fallbackSrc}
                        alt={dish.name}
                        variant="item"
                        className="h-24"
                      />
                    </div>
                    <h2 className="mt-2 text-lg font-semibold text-ink">{dish.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-ink/75">{dish.description}</p>
                    <p className="mt-3 text-xs leading-5 text-brown">喜欢它的客人：{dish.lovedBy}</p>
                    <p className="mt-2 text-xs leading-5 text-ink/70">解锁来源：{dish.origin}</p>
                  </>
                ) : null}
              </div>
            ))}
          </div>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-brown">
            {page + 1} / {pageCount}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <PageTurnButton direction="prev" disabled={page === 0} onClick={() => setPage((current) => current - 1)} />
          <PageTurnButton
            direction="next"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((current) => current + 1)}
          />
        </div>
      </section>
    </GameOverlay>
  )
}
