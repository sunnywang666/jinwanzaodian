/**
 * SpiritSprite.tsx — 精灵"身体 + 表情"合成渲染
 *
 * 身体图(无脸) 与 表情图(无身体) 同为 1024 整画布，叠两层即对齐成一只带表情的精灵。
 * 用法：<SpiritSprite body={spiritForm} face="sleepy" className="h-24" />
 *   - 容器是正方形(aspect-square)，外面给高度(如 h-24)即可。
 *   - body 落在七个身体之外(旧值/无图)时回退到 base，绝不破图。
 */

import { spiritBodyAssets, spiritFaceAssets, type SpiritBodyKey, type SpiritFaceKey } from '../lib/assets'
import type { SpiritForm } from '../lib/storage'

interface SpiritSpriteProps {
  /** 身体形态（接受 SpiritForm；不在七个身体内则回退 base） */
  body: SpiritForm | SpiritBodyKey
  /** 表情：normal 日常 / daze 发呆 / sleepy 迷糊困 */
  face?: SpiritFaceKey
  className?: string
  alt?: string
  style?: React.CSSProperties
}

function resolveBody(body: string): SpiritBodyKey {
  return (body in spiritBodyAssets ? body : 'base') as SpiritBodyKey
}

// 身体/表情共同裁切后的画布比例（见 scripts/trim-spirit-composite.mjs 输出 748x487）。
// 改裁切框后同步这里即可。
const SPIRIT_RATIO = '748 / 487'

export function SpiritSprite({ body, face = 'normal', className = '', alt = '', style }: SpiritSpriteProps) {
  const b = spiritBodyAssets[resolveBody(body)]
  const f = spiritFaceAssets[face] ?? spiritFaceAssets.normal
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: SPIRIT_RATIO, ...style }}>
      <img src={b.src} alt={alt} className="absolute inset-0 h-full w-full object-contain" />
      <img src={f.src} alt="" aria-hidden className="absolute inset-0 h-full w-full object-contain" />
    </div>
  )
}
