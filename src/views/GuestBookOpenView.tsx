import { bookAssets, sceneAssets } from '../lib/assets'
import { guests } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { PageTurnButton } from '../components/PageTurnButton'

interface GuestBookOpenViewProps {
  page: number
  onBackToHome: () => void
  onBackToConfirm: () => void
  onPrev: () => void
  onNext: () => void
}

export function GuestBookOpenView({
  page,
  onBackToHome,
  onBackToConfirm,
  onPrev,
  onNext,
}: GuestBookOpenViewProps) {
  const guest = guests[page]

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
      <div className="absolute inset-0 bg-[rgba(72,68,67,0.3)] backdrop-blur-[1px]" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between px-4 pt-4">
        <button
          type="button"
          className="rounded-full border border-line bg-paper/92 px-4 py-2 text-sm text-ink shadow-sm backdrop-blur"
          onClick={onBackToHome}
        >
          返回铺子
        </button>
        <span className="rounded-full border border-line bg-paper/92 px-4 py-2 text-sm text-brown shadow-sm backdrop-blur">
          客人电话本
        </span>
      </div>

      <div className="absolute inset-x-0 top-[12%] z-10 px-2">
        <div className="relative mx-auto aspect-square w-[94%] max-w-[420px] animate-[bookOpenIn_260ms_ease-out]">
          <AssetImage
            src={bookAssets.guestBookInner.src}
            fallbackSrc={bookAssets.guestBookInner.fallbackSrc}
            alt="客人电话本内页"
            variant="book"
            renderFallbackCard={false}
            className="h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(54,38,26,0.22)]"
          />

          <div className="absolute" style={{ left: '18%', top: '26%', width: '22%' }}>
            <AssetImage
              src={guest.image.src}
              fallbackSrc={guest.image.fallbackSrc}
              alt={guest.name}
              variant="character"
              renderFallbackCard={false}
              className="h-auto w-full object-contain"
            />
          </div>

          <div
            className="absolute flex items-center justify-center text-center text-[clamp(14px,2.2vw,18px)] font-semibold leading-tight text-ink"
            style={{ left: '20%', top: '56%', width: '20%', minHeight: '11%' }}
          >
            <span className="line-clamp-2">{guest.name}</span>
          </div>

          <div
            className="absolute space-y-3 text-[clamp(10px,1.9vw,13px)] leading-[1.45] text-ink/82"
            style={{ left: '55%', top: '26%', width: '32%' }}
          >
            <p>{guest.line}</p>
            <p>喜欢的早点：{guest.favorite}</p>
            <p>来访次数：{guest.visits}</p>
            <p>熟络程度：{guest.closeness}</p>
            <div className="space-y-1">
              <p className="font-semibold text-ink/88">小故事</p>
              <p className="line-clamp-3 text-[clamp(10px,1.8vw,12px)] leading-[1.45]">{guest.story}</p>
            </div>
          </div>

          <p className="absolute left-1/2 top-[87.8%] -translate-x-1/2 text-[11px] text-brown/80">
            {page + 1} / {guests.length}
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-5 pb-5 pt-3">
        <PageTurnButton direction="prev" label="上一位" disabled={page === 0} onClick={onPrev} />
        <button
          type="button"
          className="rounded-full border border-line bg-paper/92 px-4 py-2 text-sm text-brown shadow-sm backdrop-blur"
          onClick={onBackToConfirm}
        >
          回到封面
        </button>
        <PageTurnButton
          direction="next"
          label="下一位"
          disabled={page >= guests.length - 1}
          onClick={onNext}
        />
      </div>
    </section>
  )
}
