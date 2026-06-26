/**
 * trim-spirit-composite.mjs
 *
 * 把"身体(无脸) + 表情(无身体)"这批合成用图，按【共同包围盒】统一裁切：
 *  - 同一个裁切框 → 裁完仍然对齐（身体和表情叠起来不错位）
 *  - 去掉 1024 画布四周大片透明 → 精灵在框里更饱满、文件更小
 *
 * 必须在 `npm run sync-assets` 之后跑（它对刚同步的整画布原图裁一次；
 * 已裁过的别重复跑，否则会越裁越小——重跑前先 sync 还原）。
 */
import { readdirSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const dir = path.resolve('public/assets')
const ALPHA = 10
const PAD = 10

const files = readdirSync(dir).filter((f) => /^spirit-(body|face)-.*\.png$/.test(f))
if (files.length === 0) { console.log('no spirit-body/face files; run sync-assets first'); process.exit(0) }

async function bbox(file) {
  const { data, info } = await sharp(path.join(dir, file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  let minX = width, minY = height, maxX = -1, maxY = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * channels + (channels - 1)]
      if (a > ALPHA) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y }
    }
  }
  return { minX, minY, maxX, maxY, width, height }
}

const boxes = []
for (const f of files) boxes.push({ f, ...(await bbox(f)) })
const W = boxes[0].width, H = boxes[0].height
let L = Math.min(...boxes.map((b) => b.minX))
let T = Math.min(...boxes.map((b) => b.minY))
let R = Math.max(...boxes.map((b) => b.maxX))
let B = Math.max(...boxes.map((b) => b.maxY))
L = Math.max(0, L - PAD); T = Math.max(0, T - PAD); R = Math.min(W - 1, R + PAD); B = Math.min(H - 1, B + PAD)
const rect = { left: L, top: T, width: R - L + 1, height: B - T + 1 }
console.log(`原 ${W}x${H} → 共同裁切框`, rect)

for (const f of files) {
  const buf = await sharp(path.join(dir, f)).extract(rect).toBuffer()
  await sharp(buf).png().toFile(path.join(dir, f))
  console.log('cropped', f)
}
console.log('done')
