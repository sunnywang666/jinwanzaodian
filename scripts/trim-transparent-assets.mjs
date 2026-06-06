import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const assetsDir = path.resolve('public/assets')
const outputDir = path.join(assetsDir, 'trimmed')
const skipFiles = new Set(['shop-main-background.png', 'cover-shop.png'])

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
