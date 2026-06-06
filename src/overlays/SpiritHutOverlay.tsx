import type { SpiritForm } from '../lib/storage'
import { spiritAssets } from '../lib/assets'
import { spiritOptions } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'

interface SpiritHutOverlayProps {
  spiritName: string
  currentForm: SpiritForm
  onSelectForm: (form: SpiritForm) => void
  onClose: () => void
}

export function SpiritHutOverlay({ spiritName, currentForm, onSelectForm, onClose }: SpiritHutOverlayProps) {
  const currentAsset = spiritAssets[currentForm]

  return (
    <GameOverlay title="精灵小屋" onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-4 pb-5 pt-[11dvh]">
        <div className="rounded-[28px] border border-line bg-paper/84 px-4 py-5 text-center shadow-sm">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-butter/35">
            <AssetImage
              src={currentAsset.src}
              fallbackSrc={currentAsset.fallbackSrc}
              alt={spiritName}
              variant="character"
              className="h-32"
            />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-ink">{spiritName}</h1>
          <p className="mt-2 text-sm leading-6 text-ink/72">它只是一个漂浮的小圆面团，可以隔空揉面，没有手脚。</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 overflow-y-auto">
          {spiritOptions.map((option) => (
            <button
              key={option.form}
              type="button"
              className={`rounded-[24px] border px-3 py-4 text-center shadow-sm ${
                currentForm === option.form ? 'border-brown bg-butter/35' : 'border-line bg-paper/84'
              }`}
              onClick={() => onSelectForm(option.form)}
            >
              <AssetImage
                src={option.image.src}
                fallbackSrc={option.image.fallbackSrc}
                alt={option.name}
                variant="character"
                className="h-20"
              />
              <p className="mt-2 text-sm font-semibold text-ink">{option.name}</p>
            </button>
          ))}
        </div>
      </section>
    </GameOverlay>
  )
}
