/**
 * make-icon.mjs — 用面点精灵生成 App 图标源图（给 @capacitor/assets 用）
 * 产出 assets/icon-foreground.png / icon-background.png / icon-only.png（各 1024）
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SPIRIT = 'public/assets/trimmed/dough-spirit-base.png'
const CREAM = { r: 212, g: 165, b: 116, alpha: 1 } // #d4a574 暖棕，让白精灵跳出来
const SIZE = 1024

await mkdir('assets', { recursive: true })

// 自适应图标前景：精灵居中、控制在安全区内（~58%），透明底
const fg = await sharp(SPIRIT).resize({ width: 600, height: 600, fit: 'inside' }).toBuffer()
await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: fg, gravity: 'center' }]).png().toFile('assets/icon-foreground.png')

// 自适应图标背景：纯奶油色
await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: CREAM } })
  .png().toFile('assets/icon-background.png')

// 传统方形图标：精灵 + 奶油底
const onCream = await sharp(SPIRIT).resize({ width: 720, height: 720, fit: 'inside' }).toBuffer()
await sharp({ create: { width: SIZE, height: SIZE, channels: 4, background: CREAM } })
  .composite([{ input: onCream, gravity: 'center' }]).png().toFile('assets/icon-only.png')

console.log('icon sources written to assets/')
