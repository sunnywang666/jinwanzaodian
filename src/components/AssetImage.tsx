import { useEffect, useState } from 'react'

interface AssetImageProps {
  src: string
  alt: string
  className?: string
}

function getExpectedName(src: string) {
  const parts = src.split('/')
  return parts[parts.length - 1] || src
}

export function AssetImage({ src, alt, className = '' }: AssetImageProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [src])

  if (hasError) {
    return (
      <div className={`paper-dashed flex items-center justify-center p-5 text-center ${className}`}>
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-[0.08em] text-brown">缺少素材</p>
          <p className="text-xs text-ink/75">{getExpectedName(src)}</p>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  )
}
