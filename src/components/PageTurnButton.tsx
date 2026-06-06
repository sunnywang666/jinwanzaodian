interface PageTurnButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled?: boolean
}

export function PageTurnButton({ direction, onClick, disabled = false }: PageTurnButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="rounded-[20px] border border-line bg-paper px-4 py-2 text-sm text-ink shadow-sm disabled:opacity-40"
      onClick={onClick}
    >
      {direction === 'prev' ? '上一页' : '下一页'}
    </button>
  )
}
