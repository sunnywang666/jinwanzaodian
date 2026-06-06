import { cp, readdir } from 'node:fs/promises'
import path from 'node:path'

const rootDir = path.resolve('.')
const sourceDirs = [path.join(rootDir, '堆'), path.join(rootDir, 'public', 'assets')]
const targetDir = path.join(rootDir, 'public', 'assets')

const mappings = [
  { target: 'shop-main-background.png', patterns: ['暂定主页面背景图'] },
  { target: 'cover-shop.png', patterns: ['早点整体美术参考图'] },
  { target: 'ui-recipe-book-inner.png', patterns: ['UI-菜品图鉴内页'] },
  { target: 'asset-recipe-book-cover.png', patterns: ['资产-菜品图鉴'] },
  { target: 'ui-guest-book-inner.png', patterns: ['UI-客人图鉴内页'] },
  { target: 'asset-guest-book-cover.png', patterns: ['资产-客人图鉴外壳'] },
  { target: 'asset-radio.png', patterns: ['资产-收音机'] },
  { target: 'food-bun.png', patterns: ['菜品-大肉包'] },
  { target: 'food-soy-milk.png', patterns: ['菜品-豆浆'] },
  { target: 'food-millet-porridge.png', patterns: ['菜品-小米粥'] },
  { target: 'food-tremella-porridge.png', patterns: ['菜品-银耳枸杞粥'] },
  { target: 'food-youtiao.png', patterns: ['菜品-油条'] },
  { target: 'dough-spirit-base.png', patterns: ['面点精灵参考'] },
  { target: 'dough-spirit-white-dough.png', patterns: ['面点精灵（基础白面团版）', '基础白面团版'] },
  { target: 'dough-spirit-xiaolongbao.png', patterns: ['面点精灵（小笼包皮肤）', '小笼包皮肤'] },
  { target: 'dough-spirit-normal.png', patterns: ['面点精灵（常规表情）', '常规表情'] },
  { target: 'dough-spirit-confused-awake.png', patterns: ['面点精灵（迷茫睡醒表情）', '面点精灵（迷茫瞌睡表情）', '迷茫瞌睡表情'] },
  { target: 'dough-spirit-bagel.png', patterns: ['面点精灵（基础贝果版）', '面点精灵（基础写实贝果版）', '基础贝果版'] },
  { target: 'dough-spirit-confused-bagel.png', patterns: ['面点精灵（迷茫贝果皮肤）', '迷茫贝果皮肤'] },
  { target: 'animal-fox.png', patterns: ['小狐狸客人图鉴版', '小狐狸客人'] },
  { target: 'animal-raccoon.png', patterns: ['小浣熊客人图鉴版', '小浣熊客人'] },
  { target: 'animal-sparrow.png', patterns: ['小麻雀客人图鉴版', '小麻雀客人'] },
  { target: 'animal-cat.png', patterns: ['小猫客人图鉴版', '小猫客人'] },
  { target: 'animal-bird.png', patterns: ['小鸟客人图鉴版', '小鸟客人'] },
  { target: 'animal-rabbit.png', patterns: ['小兔客人图鉴版', '小兔客人'] },
  { target: 'animal-bear.png', patterns: ['小熊客人图鉴版', '小熊客人'] },
]

function normalize(value) {
  return value.replace(/\s+/g, '').toLowerCase()
}

async function collectFiles() {
  const files = []

  for (const dir of sourceDirs) {
    let entries = []
    try {
      entries = await readdir(dir, { withFileTypes: true })
    } catch {
      continue
    }

    for (const entry of entries) {
      if (!entry.isFile()) {
        continue
      }

      if (!entry.name.toLowerCase().endsWith('.png')) {
        continue
      }

      files.push({
        dir,
        name: entry.name,
        fullPath: path.join(dir, entry.name),
      })
    }
  }

  return files
}

function findSource(files, patterns, targetName) {
  const exactMatch = files.find((file) => file.name === targetName)
  if (exactMatch) {
    return exactMatch
  }

  const normalizedPatterns = patterns.map(normalize)

  for (const file of files) {
    const normalizedName = normalize(file.name)
    if (normalizedPatterns.some((pattern) => normalizedName.includes(pattern))) {
      return file
    }
  }

  return null
}

async function main() {
  const files = await collectFiles()
  console.log('scanned files:')
  files.forEach((file) => console.log(`- ${file.name}`))

  for (const mapping of mappings) {
    const source = findSource(files, mapping.patterns, mapping.target)
    if (!source) {
      console.log(`skip ${mapping.target}: source not found`)
      continue
    }

    const target = path.join(targetDir, mapping.target)
    if (source.fullPath === target) {
      console.log(`keep ${mapping.target}: already canonical source`)
      continue
    }
    await cp(source.fullPath, target, { force: true })
    console.log(`copied ${source.name} -> ${mapping.target}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
