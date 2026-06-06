import { useEffect, useState } from 'react'

type AssetVariant = 'scene' | 'book' | 'character' | 'item' | 'placeholder'

interface AssetImageProps {
  src: string
  alt: string
  variant?: AssetVariant
  fallbackSrc?: string
  className?: string
}

const variantClassName: Record<AssetVariant, string> = {
  scene: 'w-full object-contain',
  book: 'w-full object-contain',
  character: 'h-24 w-auto object-contain mx-auto',
  item: 'h-20 w-auto object-contain mx-auto',
  placeholder: 'w-full',
}

function getExpectedName(src: string) {
  const parts = src.split('/')
  return parts[parts.length - 1] || src
}

export function AssetImage({
  src,
  alt,
  variant = 'scene',
  fallbackSrc,
  className = '',
}: AssetImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setCurrentSrc(src)
    setHasError(false)
  }, [src])

  if (hasError) {
    return (
      <div
        className={`paper-dashed flex min-h-24 items-center justify-center p-4 text-center ${variantClassName.placeholder} ${className}`}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.08em] text-brown">缺少素材</p>
          <p className="break-all text-xs text-ink/75">{getExpectedName(currentSrc)}</p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`${variantClassName[variant]} ${className}`}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc)
          return
        }

        setHasError(true)
      }}
    />
  )
}
