import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const assetsDir = path.resolve('public/assets')
const outputDir = path.join(assetsDir, 'trimmed')
// 背景/封面图是整幅满铺，不该裁透明边（旧的 shop-main-background.png 已废弃删除，改为现役 scene-* 全保护）
const skipFiles = new Set([
  'scene-morning.png', 'scene-day.png', 'scene-evening.png', 'scene-night.png',
  'cover-shop.png', 'cover-shop-transparent.png',
])

async function trimPng(filename) {
  if (skipFiles.has(filename)) {
    console.log(`skipped ${filename}`)
    return
  }

  const input = path.join(assetsDir, filename)
  const output = path.join(outputDir, filename)

  await sharp(input)
    .trim({
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      threshold: 1,
    })
    .png()
    .toFile(output)

  console.log(`trimmed ${filename}`)
}

async function main() {
  await mkdir(outputDir, { recursive: true })
  const files = await readdir(assetsDir)
  const pngFiles = files.filter((file) => file.toLowerCase().endsWith('.png'))

  await Promise.all(pngFiles.map(trimPng))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
