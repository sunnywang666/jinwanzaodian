import { guestAssets } from '../lib/assets'
import type { GuestEntry } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'

interface GuestDetailProps {
  guest: GuestEntry
  onBack: () => void
}

export function GuestDetail({ guest, onBack }: GuestDetailProps) {
  const asset = guestAssets[guest.key]

  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div className="rounded-[32px] border border-line bg-cream px-4 py-6 text-center">
        <AssetImage
          src={asset.src}
          fallbackSrc={asset.fallbackSrc}
          alt={guest.name}
          variant="character"
          className="h-36"
        />
      </div>

      <article className="mt-4 flex min-h-0 flex-1 flex-col rounded-[30px] border border-line bg-paper px-5 py-5">
        <p className="paper-label w-fit">角色来信</p>
        <h1 className="mt-4 text-3xl font-semibold text-ink">{guest.name}</h1>
        <p className="mt-2 text-base leading-6 text-ink/75">{guest.line}</p>

        <div className="mt-5 grid gap-3 text-sm text-ink/78">
          <p className="rounded-[22px] bg-white/75 px-4 py-3">喜欢的早点：{guest.favorite}</p>
          <p className="rounded-[22px] bg-white/75 px-4 py-3">来访次数：{guest.visits}</p>
          <p className="rounded-[22px] bg-white/75 px-4 py-3">熟络程度：{guest.closeness}</p>
        </div>

        <p className="mt-5 min-h-0 flex-1 overflow-y-auto rounded-[24px] bg-cream px-4 py-4 text-sm leading-7 text-ink/75">
          小故事：{guest.story}
        </p>
      </article>

      <SoftButton className="mt-4" type="button" block onClick={onBack}>
        返回电话本
      </SoftButton>
    </section>
  )
}
