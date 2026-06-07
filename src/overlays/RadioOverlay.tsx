import { toolAssets } from '../lib/assets'
import { AssetImage } from '../components/AssetImage'
import { GameOverlay } from '../components/GameOverlay'

interface RadioOverlayProps {
  onClose: () => void
}

export function RadioOverlay({ onClose }: RadioOverlayProps) {
  return (
    <GameOverlay title="收音机" onClose={onClose}>
      <section className="flex h-full flex-col items-center justify-center bg-[#f5ead8] px-6">
        <div className="mx-auto w-full max-w-[200px]">
          <AssetImage
            src={toolAssets.radio.src}
            fallbackSrc={toolAssets.radio.fallbackSrc}
            alt="收音机"
            variant="item"
            className="h-auto w-full drop-shadow-[0_6px_18px_rgba(138,97,74,0.15)]"
          />
        </div>
        <p className="mt-7 text-center text-base font-semibold text-ink">白噪音</p>
        <p className="mt-2 text-center text-sm text-ink/50">雨声 · 风声 · 咖啡馆 · 壁炉</p>
        <p className="mt-8 text-center text-xs text-ink/30">功能开发中，敬请期待</p>
      </section>
    </GameOverlay>
  )
}
