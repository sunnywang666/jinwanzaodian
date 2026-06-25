/**
 * make-android-icons.mjs — 用 assets/ 里的精灵源图生成安卓各密度启动图标
 * 需先跑 make-icon.mjs 生成 assets/icon-only.png 与 icon-foreground.png
 *
 * 生成：每个 mipmap 密度的 ic_launcher.png（方）/ ic_launcher_round.png（圆）
 *      / ic_launcher_foreground.png（自适应前景，精灵透明底）
 * 自适应背景色在 res/values/ic_launcher_background.xml 里设。
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const RES = 'android/app/src/main/res'
const ICON = 'assets/icon-only.png'        // 精灵 + 暖棕底，方形
const FG = 'assets/icon-foreground.png'     // 精灵透明底（自适应前景）

const densities = [
  { dir: 'mipmap-mdpi', legacy: 48, fg: 108 },
  { dir: 'mipmap-hdpi', legacy: 72, fg: 162 },
  { dir: 'mipmap-xhdpi', legacy: 96, fg: 216 },
  { dir: 'mipmap-xxhdpi', legacy: 144, fg: 324 },
  { dir: 'mipmap-xxxhdpi', legacy: 192, fg: 432 },
]

function circleMask(size) {
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  )
}

for (const d of densities) {
  const dir = path.join(RES, d.dir)
  await mkdir(dir, { recursive: true })

  await sharp(ICON).resize(d.legacy, d.legacy).png().toFile(path.join(dir, 'ic_launcher.png'))

  const sq = await sharp(ICON).resize(d.legacy, d.legacy).png().toBuffer()
  await sharp(sq).composite([{ input: circleMask(d.legacy), blend: 'dest-in' }]).png()
    .toFile(path.join(dir, 'ic_launcher_round.png'))

  await sharp(FG).resize(d.fg, d.fg).png().toFile(path.join(dir, 'ic_launcher_foreground.png'))
}

console.log('android launcher icons written')
