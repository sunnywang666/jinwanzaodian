import type { SpiritForm } from '../lib/storage'
import { getSpiritAsset } from '../lib/assets'
import { spiritOptions } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { SoftButton } from '../components/SoftButton'

interface SpiritHutProps {
  currentForm: SpiritForm
  spiritName: string
  onSelectForm: (form: SpiritForm) => void
}

export function SpiritHut({ currentForm, spiritName, onSelectForm }: SpiritHutProps) {
  const currentOption = spiritOptions.find((option) => option.form === currentForm) ?? spiritOptions[0]

  return (
    <div className="space-y-4">
      <section className="paper-panel overflow-hidden">
        <AssetImage
          src={getSpiritAsset(currentOption.form)}
          alt={currentOption.name}
          className="h-[220px] w-full bg-cream object-contain p-5"
        />
        <div className="space-y-3 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="paper-label">精灵小屋</p>
            <p className="paper-label">{spiritName}</p>
          </div>
          <h2 className="ink-title">{currentOption.name}</h2>
          <p className="ink-note">
            面点精灵不是拟人角色，没有手脚。它只是同一团面点的不同形态，豆豆眼会一直留着。
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3">
        {spiritOptions.map((option) => (
          <article key={option.form} className="paper-panel overflow-hidden">
            <div className="grid grid-cols-[112px_1fr] gap-0">
              <AssetImage
                src={option.src}
                alt={option.name}
                className="h-full min-h-[140px] w-full bg-cream object-contain p-3"
              />
              <div className="space-y-3 px-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-ink">{option.name}</h3>
                  <span className="paper-label">{option.unlocked ? '已解锁' : '预留缺图'}</span>
                </div>
                <p className="text-sm leading-6 text-ink/75">{option.note}</p>
                <SoftButton
                  type="button"
                  active={currentForm === option.form}
                  onClick={() => onSelectForm(option.form)}
                >
                  {currentForm === option.form ? '当前形态' : '切换形态'}
                </SoftButton>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
