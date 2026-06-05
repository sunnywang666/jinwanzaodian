import { dishes } from '../lib/demoData'

export function Menu() {
  const unlockedCount = dishes.filter((dish) => dish.unlocked).length

  return (
    <div className="space-y-4">
      <section className="paper-panel px-4 py-4">
        <p className="paper-label">铺子菜单</p>
        <h2 className="mt-3 text-xl font-semibold text-ink">手艺会慢慢增加</h2>
        <p className="mt-2 ink-note">
          不卖价格，不算金币，也不把你推进赚钱升级循环。这里只记录这家铺子已经会做什么、还会慢慢长出什么。
        </p>
        <p className="mt-3 text-sm text-brown">已会做 {unlockedCount} / {dishes.length} 道</p>
      </section>

      <div className="grid grid-cols-1 gap-3">
        {dishes.map((dish) => (
          <article
            key={dish.name}
            className={`rounded-paper border px-4 py-4 ${
              dish.unlocked ? 'border-line bg-white/80' : 'border-line/70 bg-cream/80'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-ink">{dish.name}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/75">{dish.progressNote}</p>
              </div>
              <span className="paper-label">{dish.unlocked ? '已解锁' : '未解锁'}</span>
            </div>
            <div className="mt-4 rounded-3xl bg-paper px-3 py-3 text-sm text-ink/75">
              {dish.origin}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
