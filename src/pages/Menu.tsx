import { useState } from 'react'
import { dishes } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'

function clampPage(page: number) {
  const maxPage = Math.ceil(dishes.length / 2) - 1
  return Math.max(0, Math.min(page, maxPage))
}

export function Menu() {
  const [page, setPage] = useState(0)
  const pageDishes = dishes.slice(page * 2, page * 2 + 2)
  const pageCount = Math.ceil(dishes.length / 2)

  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="paper-label">菜谱本</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">铺子菜单</h1>
        </div>
        <p className="paper-label">
          {page + 1} / {pageCount}
        </p>
      </div>

      <div className="mt-4 grid min-h-0 flex-1 grid-cols-2 gap-2 rounded-[30px] border border-line bg-[#f8ecd8] p-3 shadow-sm">
        {pageDishes.map((dish) => (
          <article key={dish.key} className="flex min-h-0 flex-col rounded-[24px] border border-line bg-paper p-3">
            <div className="flex h-28 items-center justify-center rounded-[20px] bg-cream">
              <AssetImage src={dish.image} alt={dish.name} variant="character" className="h-20" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-ink">{dish.name}</h2>
            <p className="mt-1 line-clamp-3 text-sm leading-5 text-ink/70">{dish.description}</p>
            <div className="mt-auto space-y-2 pt-3 text-xs leading-5 text-ink/70">
              <p>喜欢它的客人：{dish.lovedBy}</p>
              <p>解锁来源：{dish.origin}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="rounded-[24px] border border-line bg-white/80 px-4 py-3 text-sm text-ink disabled:opacity-40"
          disabled={page === 0}
          onClick={() => setPage((current) => clampPage(current - 1))}
        >
          上一页
        </button>
        <button
          type="button"
          className="rounded-[24px] border border-line bg-white/80 px-4 py-3 text-sm text-ink disabled:opacity-40"
          disabled={page === pageCount - 1}
          onClick={() => setPage((current) => clampPage(current + 1))}
        >
          下一页
        </button>
      </div>
    </section>
  )
}
