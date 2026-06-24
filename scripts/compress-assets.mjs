/**
 * compress-assets.mjs — 近无损原地压缩 public/assets 下所有 PNG
 *
 * 用 sharp 做调色板量化 + 有损压缩（quality 80），文件名/路径不变，
 * 故无需改任何源码引用（src/lib/assets.ts、AssetImage 的 fallback 都照常工作）。
 * 递归处理 assets/ 与 assets/trimmed/。先写 .tmp 再 rename，避免读写同文件冲突。
 *
 * 跑法：node scripts/compress-assets.mjs （cwd 必须是项目根）
 */

import { readdir, stat, rename, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const assetsDir = path.resolve('public/assets')
const MIN_BYTES = 80 * 1024 // 小于 80KB 的跳过，省时（收益小）

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else if (entry.name.toLowerCase().endsWith('.png')) out.push(full)
  }
  return out
}

async function compressInPlace(file) {
  const before = (await stat(file)).size
  if (before < MIN_BYTES) return { file, before, after: before, skipped: true }

  const tmp = file + '.tmp'
  await sharp(file)
    .png({ palette: true, quality: 80, compressionLevel: 9, effort: 9 })
    .toFile(tmp)

  const after = (await stat(tmp)).size
  if (after < before) {
    await rename(tmp, file)
    return { file, before, after, skipped: false }
  }
  // 压缩反而更大（极少见），保留原图
  await unlink(tmp)
  return { file, before, after: before, skipped: true }
}

const mb = (n) => (n / 1024 / 1024).toFixed(2)

async function main() {
  const files = await walk(assetsDir)
  let totalBefore = 0
  let totalAfter = 0
  for (const file of files) {
    const r = await compressInPlace(file)
    totalBefore += r.before
    totalAfter += r.after
    const rel = path.relative(assetsDir, file)
    if (r.skipped) {
      console.log(`skip  ${rel} (${(r.before / 1024).toFixed(0)}KB)`)
    } else {
      const pct = (((r.before - r.after) / r.before) * 100).toFixed(0)
      console.log(`done  ${rel}  ${(r.before / 1024).toFixed(0)}KB -> ${(r.after / 1024).toFixed(0)}KB  (-${pct}%)`)
    }
  }
  console.log(`\n总计: ${mb(totalBefore)}MB -> ${mb(totalAfter)}MB  (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0)}%)`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
