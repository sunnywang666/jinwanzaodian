# 面点精灵 · Midjourney 提示词套组（v2 · 平面手绘版）

> 配合《产品概念文档 v5》。精灵设定：**本体一小团白面**、**一双豆豆眼贯穿始终**，外表是可变点心形态（白面团 → 小笼包 → 可颂 → 甜甜圈……），萌、软、治愈。
> **目标画风 = 参考图那种手绘蜡笔/水粉、纸面颗粒的平面绘本质感**，不是 3D 毛绒/黏土渲染。
> 本版相对上一版的修正：① 风格后缀全面压向"平面手绘、反 3D"；② 改成单体出图（不再要三视图/设定图）；③ 加白底 + 透明 PNG 工作流；④ 加"用参考图当 --sref"的核心技巧；⑤ 主推 `--v 7`（不是 niji）。

---

## 0. 怎么用（务必先读）

### ⓪ 最有效的一招：用参考图当 `--sref`
想让画风跟某张参考图一致，最可靠的办法不是堆文字，而是**把那张参考图当风格参考**：上传你的参考图 → 拿到图片链接 → 在提示词末尾加 `--sref <参考图链接>`。Midjourney 会照着它的笔触、质感、配色来画。**画风对不上时，第一步永远是先挂 --sref，而不是改文字。** 可加 `--sw 100`（默认）调风格强度，想更像就调高（如 `--sw 200`）。

### ① 通用风格后缀（平面手绘，接在每条末尾）
```
flat 2D hand-drawn children's picture book illustration, colored pencil and gouache and oil pastel on textured paper, heavy visible paper grain and dry-brush strokes, matte finish, muted warm storybook palette of cream beige sage green dusty coral warm brown soft charcoal, soft hand-drawn outline, naive cozy and tender, hand-painted, not 3D, not a render, not plush, not clay, no smooth gradient shading, no glossy, no realistic lighting --no 3D, render, plush, clay, glossy, plastic, smooth shading, drop shadow, photo, anime gloss
```

### ② 单体白底后缀（要做成可抠图素材时，再追加这句）
```
single subject centered on a plain solid white background, clean clear edges, isolated, no other characters, no scene, no text
```

### ③ 透明底怎么来（Midjourney 做不到，需后处理）
Midjourney **不支持直接生成透明背景**，只能输出实色背景的 RGB 图、没有透明通道，提示词写 "transparent" 也没用。正确工作流：
1. 用"②单体白底后缀"让它在**干净白底、边缘清楚**的条件下出图；
2. 挑一张放大（U1–U4）；
3. 用抠图工具（remove.bg / Photoshop"移除背景" / 其他）把白底去掉 → 得到透明 PNG。

### ④ "只出一张"说明
Midjourney 每次固定出 **4 宫格变体**，没法只生成 1 张；挑中满意的用 U1–U4 放大成单图即可。**但"画面里只有一个角色"是能控制的**——别写"reference sheet / turnaround / 三视图"，改写"a single ... centered"，并加"②单体白底后缀"，就不会出一堆挤在一格。

### ⑤ 模型与参数（重要，避免报错与跑偏）
- **主推 `--v 7`**：这种蜡笔/水粉纸面质感 v7 更在行。**不要用 `--niji 6`**——它偏日系动漫光滑感，正是上次出成 3D 毛绒的元凶之一。
- **一条命令里 `--niji` 和 `--v` 只能留一个**，别混用。
- **不要写 `--style cute`**（旧 Niji 5 参数，niji6/v7 都报错）。
- 别带自动补全加的 `--p`、多余的 `--s 250` 之类。
- `--s`（stylize，0–1000）调 MJ 自身风格强度：**想更贴参考、少点 MJ 味，就调低，如 `--s 100` 甚至 `--s 50`**。
- `--ar`：单体立绘/图标 `--ar 1:1`；场景 `--ar 4:3`。

### ⑥ 一致性技巧（多个形态"还是同一只"）
1. 先用第 1 条跑出一张满意的**本体白面团**，存图片链接。
2. 画各点心形态时加 `--cref <本体图链接> --cw 60`（`--cw` 60 左右：保留豆豆眼/神态、允许换点心外形）。
3. **注意：`--cref` 用于 V6 / niji；用 `--v 7` 时角色一致性改用 Omni Reference：`--oref <本体图链接> --ow 60`（V7 已用 Omni 取代 Character Reference）。**
4. 身份锚写死在文字里："two tiny black bean dot eyes, same gentle expression"，比纯靠引用更稳。

### ⑦ 心理预期
MJ 出的是**概念探索图**，用于定调子、给设计师参考，难 100% 复现、也做不成可换装的规范资产。精灵定稿仍需设计师手绘。

---

## 1. 本体：一小团白面（先跑这张，作 --sref/--oref 锚）

```
a single tiny dough sprite, one small plump ball of soft white wheat dough with two tiny black bean dot eyes and a faint gentle smile, no nose, sitting still and centered, the humble basic starting form, [①通用风格后缀] [②单体白底后缀] --ar 1:1 --v 7 --s 120 --sref <参考图链接>
```

---

## 2. 形态 A：小笼包精灵

```
a single tiny dough sprite shaped as a cute little soup dumpling (xiaolongbao) with delicate pleats gathered on top like a tiny topknot, same two tiny black bean dot eyes and same gentle expression, [①通用风格后缀] [②单体白底后缀] --ar 1:1 --v 7 --s 120 --sref <参考图链接> --oref <本体图链接> --ow 60
```

## 3. 形态 B：可颂精灵

```
a single tiny dough sprite shaped as a cute crescent croissant, golden buttery layered curves forming its little body, same two tiny black bean dot eyes and same gentle expression, [①通用风格后缀] [②单体白底后缀] --ar 1:1 --v 7 --s 120 --sref <参考图链接> --oref <本体图链接> --ow 60
```

## 4. 形态 C：甜甜圈精灵

```
a single tiny dough sprite shaped as a cute round donut with a soft pastel glaze and a few tiny sprinkles, the hole framing its little face, same two tiny black bean dot eyes and same gentle expression, [①通用风格后缀] [②单体白底后缀] --ar 1:1 --v 7 --s 120 --sref <参考图链接> --oref <本体图链接> --ow 60
```

> 同法扩展：包子、贝果、华夫饼、煎饼、麻薯…… 每条都保留"same two tiny black bean dot eyes / same gentle expression" + `--sref` + `--oref --ow 60`。

---

## 5. 表情 / 姿态（单体白底，对应 App 时段）

**迎客（清晨）**
```
a single tiny dough sprite waving hello with a warm welcoming smile, two tiny black bean dot eyes, cheerful and gentle, [①通用风格后缀] [②单体白底后缀] --ar 1:1 --v 7 --s 120 --sref <参考图链接> --oref <本体图链接> --ow 60
```

**备菜（白天）**
```
a single tiny dough sprite happily kneading a small lump of dough, tiny apron, focused content expression, two tiny black bean dot eyes, [①通用风格后缀] [②单体白底后缀] --ar 1:1 --v 7 --s 120 --sref <参考图链接> --oref <本体图链接> --ow 60
```

**打盹（午睡）**
```
a single tiny dough sprite taking a little nap, slumped and relaxed, eyes closed into two tiny curved lines, a small sleepy bubble, [①通用风格后缀] [②单体白底后缀] --ar 1:1 --v 7 --s 120 --sref <参考图链接> --oref <本体图链接> --ow 60
```

**睡觉（夜晚打烊）**
```
a single tiny dough sprite curled up asleep under a tiny blanket, peaceful sleeping face, eyes closed, [①通用风格后缀] [②单体白底后缀] --ar 1:1 --v 7 --s 120 --sref <参考图链接> --oref <本体图链接> --ow 60
```

---

## 6. 场景版（自带背景，不抠图 —— 用于界面，不加②白底后缀）

**精灵小屋**
```
a tiny cozy hand-drawn wooden hut for a dough sprite, on the back counter of a warm breakfast shop, a small open doorway, a tiny bed inside, little shelves displaying collected pastry figurines, soft warm lamp light, [①通用风格后缀] --ar 4:3 --v 7 --s 120 --sref <参考图链接>
```

---

## 7. 备忘

- 身份三锚永不变：**①一小团白面本体 ②一双黑豆豆眼 ③同一种软乎温柔神态**。
- 画风对不上 → 先挂 `--sref 参考图`、再调低 `--s`、再加重 "colored pencil, gouache, paper grain, hand-painted, flat 2D"，最后才考虑改别的。
- 出现 3D/毛绒/光滑 → 检查是不是误用了 `--niji`，并确认 `--no 3D, render, plush, clay, glossy, smooth shading` 还在。
- 要透明 PNG → 白底出图 → 抠图工具去白底。
