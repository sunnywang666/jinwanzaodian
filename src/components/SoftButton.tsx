import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface SoftButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  active?: boolean
  block?: boolean
}

const variantClassName: Record<Variant, string> = {
  primary: 'border-brown bg-butter text-ink hover:bg-[#ecd59f]',
  secondary: 'border-line bg-white/80 text-ink hover:bg-white',
  ghost: 'border-line/70 bg-transparent text-ink hover:bg-white/60',
}

export function SoftButton({
  variant = 'secondary',
  active = false,
  block = false,
  className = '',
  children,
  ...props
}: PropsWithChildren<SoftButtonProps>) {
  const activeClassName = active ? 'ring-2 ring-brown/30 shadow-sm' : ''
  const widthClassName = block ? 'w-full justify-center' : ''

  return (
    <button
      className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm transition ${variantClassName[variant]} ${activeClassName} ${widthClassName} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
