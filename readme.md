# AGENTS.md

## 最高优先级规则

本项目是「今晚早点」图片素材驱动原型。

不要用 emoji 作为角色。
不要用 CSS 画狐狸、小动物、面点精灵。
不要用 SVG 简笔画替代角色插画。
不要用图标库替代主视觉。
所有主要视觉必须来自 public/assets 中的 PNG 图片。

如果图片缺失，请显示统一缺图占位卡片，显示预期文件名。
不要自作主张画临时角色。

## 当前已有素材

- public/assets/cover-shop.png
- public/assets/dough-spirit-base.png
- public/assets/dough-spirit-xiaolongbao.png

## 产品规则

用户是早点铺店长。
面点精灵是常驻伙伴。
面点精灵不是拟人角色，没有手脚，只是小圆面团或点心形态，有豆豆眼。
小动物是客人，不是伙伴。
产品帮助用户放下手机，不是强迫睡觉。
永远不惩罚、不说教。
晚睡只会让铺子安静一点，不会失败、不会关张。
不要金币、货币、赚钱、升级循环。

## 视觉规则

奶油色纸张背景。
低饱和暖色。
手绘治愈感。
暖棕色边框。
圆角、手帐感。
不要科技感。
不要玻璃拟态。
不要 3D。
不要高饱和商业 App 风格。

## 技术规则

使用 React + Vite + TypeScript + Tailwind CSS。
使用 localStorage。
不需要后端。
不需要真实 AI API。

## 每次修改后请运行

npm run build

## 裁剪透明 PNG 素材

角色资产优先读取 `public/assets/trimmed/` 下的裁剪版本。

运行方式：

```bash
npm run trim-assets
```

脚本会处理 `public/assets` 里的 PNG，裁掉透明边缘，并输出到 `public/assets/trimmed/`，文件名保持不变。
