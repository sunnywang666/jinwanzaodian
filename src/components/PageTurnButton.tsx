interface PageTurnButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
  label?: string
}

export function PageTurnButton({ direction, onClick, disabled = false, label }: PageTurnButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="rotate-[-1deg] rounded-[18px] border border-line bg-paper px-4 py-2 text-sm text-ink shadow-sm transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
      onClick={onClick}
    >
      {label ?? (direction === 'prev' ? '上一页' : '下一页')}
    </button>
  )
}
