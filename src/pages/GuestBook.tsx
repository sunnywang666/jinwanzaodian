import { guestAssets } from '../lib/assets'
import { guests } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'

export function GuestBook() {
  return (
    <div className="space-y-4">
      <section className="paper-panel px-4 py-4">
        <p className="paper-label">电话本</p>
        <h2 className="mt-3 text-xl font-semibold text-ink">来过铺子的客人</h2>
        <p className="mt-2 ink-note">
          客人不是精灵的替代品。他们只是会在不同清晨出现的小动物，慢慢和你把关系处熟。
        </p>
      </section>

      <div className="grid grid-cols-1 gap-3">
        {guests.map((guest) => (
          <article key={guest.name} className="paper-panel overflow-hidden">
            <div className="grid grid-cols-[112px_1fr] gap-0">
              <AssetImage
                src={guestAssets[guest.key]}
                alt={guest.name}
                className="h-full min-h-[148px] w-full bg-cream object-cover"
              />
              <div className="space-y-3 px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-ink">{guest.name}</h3>
                  <span className="paper-label">{guest.closeness}</span>
                </div>
                <p className="text-sm text-ink/75">{guest.line}</p>
                <dl className="grid grid-cols-1 gap-2 text-sm text-ink/80">
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-3 py-2">
                    <dt>喜欢的早点</dt>
                    <dd>{guest.favorite}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-3 py-2">
                    <dt>来访次数</dt>
                    <dd>{guest.visits}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-3 py-2">
                    <dt>熟络程度</dt>
                    <dd>{guest.closeness}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
