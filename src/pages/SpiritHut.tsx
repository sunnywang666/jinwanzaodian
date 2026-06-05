import type { AppPage, SpiritForm } from '../lib/storage'
import { getSpiritAsset } from '../lib/assets'
import { spiritOptions } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'

interface SpiritHutProps {
  currentForm: SpiritForm
  spiritName: string
  onSelectForm: (form: SpiritForm) => void
  onNavigate: (page: AppPage) => void
}

export function SpiritHut({ currentForm, spiritName, onSelectForm, onNavigate }: SpiritHutProps) {
  const currentOption = spiritOptions.find((option) => option.form === currentForm) ?? spiritOptions[0]
  const currentAsset = getSpiritAsset(currentOption.form)

  return (
    <section className="flex h-full flex-col px-4 py-4">
      <div className="rounded-[32px] border border-line bg-cream px-4 py-5 text-center">
        <p className="paper-label mx-auto w-fit">精灵小屋</p>
        <div className="relative mx-auto mt-4 flex h-44 w-44 items-center justify-center rounded-full bg-butter/35">
          <div className="absolute h-32 w-32 rounded-full border border-line/70" />
          <AssetImage
            src={currentAsset.src}
            fallbackSrc={currentAsset.fallbackSrc}
            alt={currentOption.name}
            variant="character"
            className="h-32"
          />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-ink">{spiritName}</h1>
        <p className="mt-2 text-sm leading-6 text-ink/70">
          它不是拟人角色，没有手脚。只是一个小圆面团，可以漂浮，也可以隔空陪你揉面。
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {spiritOptions.map((option) => (
          <button
            key={option.form}
            type="button"
            className={`rounded-[24px] border bg-white/80 px-2 py-3 text-center ${
              currentForm === option.form ? 'border-brown ring-2 ring-brown/20' : 'border-line'
            }`}
            onClick={() => onSelectForm(option.form)}
          >
            <AssetImage
              src={option.src}
              fallbackSrc={option.fallbackSrc}
              alt={option.name}
              variant="character"
              className="h-16"
            />
            <p className="mt-2 line-clamp-1 text-xs font-semibold text-ink">{option.name}</p>
          </button>
        ))}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
        <SoftButton type="button" block onClick={() => onNavigate('spiritChat')}>
          和精灵说话
        </SoftButton>
        <SoftButton type="button" block onClick={() => onNavigate('nightClosing')}>
          夜晚打烊
        </SoftButton>
      </div>
    </section>
  )
}
