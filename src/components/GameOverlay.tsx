import { useEffect } from 'react'

interface GameOverlayProps {
  title?: string
  onClose: () => void
  children: React.ReactNode
}

export function GameOverlay({ title, onClose, children }: GameOverlayProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <div className="absolute inset-0 z-30 flex items-end bg-[#4e403733] p-2">
      <div className="flex h-[92%] w-full animate-[overlayEnter_220ms_ease-out] flex-col overflow-hidden rounded-[34px] border border-line bg-paper shadow-paper">
        <header className="flex items-center justify-between border-b border-line bg-[#f7efe2] px-4 py-3">
          <p className="paper-label">{title ?? '铺子'}</p>
          <button
            type="button"
            className="rounded-full border border-line bg-white/80 px-3 py-1.5 text-xs text-brown"
            onClick={onClose}
          >
            关闭
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
