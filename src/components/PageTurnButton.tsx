import { useT } from '../lib/i18n'

interface PageTurnButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
  label?: string
}

export function PageTurnButton({ direction, onClick, disabled = false, label }: PageTurnButtonProps) {
  const { lang } = useT()
  const fallback = direction === 'prev'
    ? (lang === 'en' ? 'Prev' : '上一页')
    : (lang === 'en' ? 'Next' : '下一页')
  return (
    <button
      type="button"
      disabled={disabled}
      className="rounded-[18px] bg-paper/60 px-4 py-2 text-sm text-ink transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
      onClick={onClick}
    >
      {label ?? fallback}
    </button>
  )
}
