/**
 * SpiritHutOverlay.tsx — v5.4
 *
 * Now receives spiritProgress to enforce unlock checks.
 * Locked skins show a lock icon + milestone hint.
 */

import type { SpiritForm } from '../lib/storage'
import { spiritAssets } from '../lib/assets'
import { spiritOptions } from '../lib/demoData'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'
import { isFormUnlocked, getFormMilestoneHint, type SpiritProgressState } from '../lib/spiritProgression'

interface SpiritHutOverlayProps {
  spiritName: string
  currentForm: SpiritForm
  spiritProgress: SpiritProgressState
  onSelectForm: (form: SpiritForm) => void
  onClose: () => void
}

export function SpiritHutOverlay({
  spiritName,
  currentForm,
  spiritProgress,
  onSelectForm,
  onClose,
}: SpiritHutOverlayProps) {
  const currentAsset = spiritAssets[currentForm]

  return (
    <GameOverlay title="精灵小屋" onClose={onClose}>
      <section className="flex h-full flex-col bg-[#f5ead8] px-4 pb-5 pt-[11dvh]">
        <div className="flex flex-col items-center px-4 py-5 text-center">
          <div className="mx-auto flex h-44 w-44 items-center justify-center">
            <AssetImage
              src={currentAsset.src}
              fallbackSrc={currentAsset.fallbackSrc}
              alt={spiritName}
              variant="character"
              className="h-36 drop-shadow-[0_8px_24px_rgba(138,97,74,0.18)]"
            />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-ink">{spiritName}</h1>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            它只是一个漂浮的小圆面团，可以隔空揉面，没有手脚。
          </p>
          <p className="mt-1 text-xs text-ink/35">
            累计早睡 {spiritProgress.totalGoodNights} 晚
          </p>
        </div>

        <div className="mt-2 flex gap-3 overflow-x-auto px-1 pb-3">
          {spiritOptions.map((option) => {
            const unlocked = isFormUnlocked(spiritProgress, option.form)
            const isActive = currentForm === option.form

            return (
              <button
                key={option.form}
                type="button"
                disabled={!unlocked}
                className={`relative flex shrink-0 flex-col items-center px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? 'scale-105 opacity-100 drop-shadow-[0_0_16px_rgba(240,221,179,0.8)]'
                    : unlocked
                      ? 'opacity-55 hover:opacity-75'
                      : 'opacity-30'
                }`}
                onClick={() => {
                  if (unlocked) onSelectForm(option.form)
                }}
              >
                <div className="relative">
                  <AssetImage
                    src={option.image.src}
                    fallbackSrc={option.image.fallbackSrc}
                    alt={option.name}
                    variant="character"
                    className={`h-20 ${!unlocked ? 'grayscale' : ''}`}
                  />
                  {!unlocked ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">🔒</span>
                    </div>
                  ) : null}
                </div>
                <p className={`mt-2 text-sm font-semibold ${isActive ? 'text-ink' : 'text-ink/60'}`}>
                  {option.name}
                </p>
                {!unlocked ? (
                  <p className="mt-0.5 text-[10px] leading-tight text-ink/35">
                    {getFormMilestoneHint(option.form, spiritProgress.totalGoodNights)}
                  </p>
                ) : null}
              </button>
            )
          })}
        </div>
      </section>
    </GameOverlay>
  )
}
