/**
 * build-widget-skins.mjs — 为桌面小组件生成「跟随皮肤」的精灵图
 *
 * 把每个皮肤的 身体(spirit-body-*) + 普通表情(spirit-face-normal) 叠合成一张完整精灵，
 * 裁掉透明边、缩到组件用的小图，输出到 android 的 drawable-nodpi。
 * 小组件 Provider 按 SharedPreferences 里的皮肤 key 选 `widget_spirit_{皮肤}`，
 * 没有对应图则回退 `widget_spirit`(=base)。补了新身体图后重跑本脚本即可。
 *
 * 运行：node scripts/build-widget-skins.mjs   （需先有 public/assets/spirit-body-*、spirit-face-normal）
 */

import sharp from 'sharp'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS = join(root, 'public', 'assets')
const OUT = join(root, 'android', 'app', 'src', 'main', 'res', 'drawable-nodpi')
const FACE = join(ASSETS, 'spirit-face-normal.png')

// 有身体美术的皮肤（baozi/mochi 暂无图，运行时回退 base）
const SKINS = ['base', 'xiaolongbao', 'bagel', 'croissant', 'waffle', 'donut', 'matcha']
const TARGET_W = 240 // 组件 ImageView fitCenter，给张清晰小图即可

async function buildOne(skin) {
  const body = join(ASSETS, `spirit-body-${skin}.png`)
  if (!existsSync(body)) {
    console.warn(`skip ${skin}: 缺 spirit-body-${skin}.png`)
    return false
  }
  const composed = await sharp(body)
    .composite([{ input: FACE }]) // 同画布叠脸，自动对齐
    .png()
    .toBuffer()
  await sharp(composed)
    .trim()
    .resize({ width: TARGET_W, fit: 'inside', withoutEnlargement: true })
    .png()
    .toFile(join(OUT, `widget_spirit_${skin}.png`))
  return true
}

async function main() {
  if (!existsSync(FACE)) {
    console.error('缺 public/assets/spirit-face-normal.png，先跑 sync-assets')
    process.exit(1)
  }
  let n = 0
  for (const skin of SKINS) {
    if (await buildOne(skin)) n++
  }
  // 默认/回退图同步成 base 合成版，老组件也能正常显示
  if (existsSync(join(OUT, 'widget_spirit_base.png'))) {
    await sharp(join(OUT, 'widget_spirit_base.png')).toFile(join(OUT, 'widget_spirit.png'))
  }
  console.log(`done: 生成 ${n} 张皮肤组件图 + 回退 widget_spirit.png`)
}

main().catch((e) => { console.error(e); process.exit(1) })
