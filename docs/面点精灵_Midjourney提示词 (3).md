# 面点精灵 · Midjourney 提示词套组（v3 · 透明底贴纸资产版）

> 配合《产品概念文档 v5》《界面设计说明 v5》。
> 本版目标：做出一套**风格统一、单体、白底可抠成透明、可反复复用的 UI 贴纸/图标资产**，画风严格贴合「早点整体美术参考图」（手绘蜡笔水粉、纸面颗粒、奶油暖色）。
> 不再以"完整场景插画"为目标——精灵是**贴在界面里的小角色资产**，不是一张配图。

---

## 0. 怎么用（务必先读，这版的关键全在这）

### ⓪ 垫图 vs --sref vs --oref（解决"精灵老带小摊位"的根因）
| 用法 | 链接放哪 | 效果 | 什么时候用 |
|------|---------|------|-----------|
| 图像提示（垫图） | 提示词**最前面** | 抄风格 **+ 抄构图内容** | ⚠️ 别用参考图垫图！会把摊位/客人/场景抄进精灵 |
| **风格参考 `--sref`** | 提示词**末尾** | **只抄风格**（笔触/质感/配色），不抄构图 | ✅ 想要参考图的画风就用这个 |
| 角色参考 `--oref`（v7） | 提示词末尾 | 只抄**角色**（保持"同一只"） | 出完基础本体后，画各形态时保持一致 |

**一句话：把「早点整体美术参考图」放末尾当 `--sref <链接>`，不要放最前面垫图。** 这样拿到画风、甩掉摊位。

### ① 三个身份锚点（每条都写死）
1. `a small soft plump round ball of white dough`（一团软白面）
2. `two tiny black bean dot eyes`（豆豆眼）
3. `a small gentle calm expression`（温柔安静神态）

### ② 资产构图固定词（保证是"贴纸资产"而不是"插画"）
```
single isolated character, centered, the character fills most of the frame, clean simple silhouette, on a plain flat solid cream-white background, no scene, no stall, no building, no other characters, no objects, no text, no clock, no border, sticker-style character asset, readable at small size
```

### ③ 风格固定词（贴参考图，反 3D）
```
hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic, no gradient, no 3D, no render, no glossy, no plastic
```

### ④ 透明底怎么来（MJ 做不到，需后处理 —— GPT 那条"transparent background"是错的）
MJ 生不出透明底，写 "transparent" 没用。正确流程：
1. 用"②构图固定词"让它出在**纯色奶白底、边缘清楚**上；
2. 挑一张放大（U1–U4）；
3. 用抠图工具（remove.bg / Photoshop 移除背景）去掉白底 → 透明 PNG。

### ⑤ 模型与参数
- **用 `--v 7`**，不要 `--niji 6`（niji 偏日系光滑，画不出蜡笔颗粒）。
- **末尾挂 `--sref <参考图链接>`** 锁画风；不够像就加 `--sw 150` 调高风格强度。
- `--s 50` 左右（低 stylize = 更听话、更贴提示与参考，少 MJ 自己的味）。
- `--ar 1:1`。
- **`--p`（个性化）建议先去掉**：它会叠加你账号的训练风格，可能跟参考图打架；先纯靠 `--sref` 对齐，对上了再考虑加不加。
- 别写 `--style cute`（旧 niji5 参数，报错）。

### ⑥ 你之前为什么老出摊位（诊断）
两个原因叠加：① 拿场景参考图当了**垫图**（抄了构图）；② 提示词里 "breakfast shop companion" 这类词本身会召唤摊子。修法：参考图改用 `--sref`；角色描述里**别写"in a breakfast shop"之类的场景词**，"早点铺伙伴"只作为气质，放进 `--no` 里把 scene/stall 压掉。

---

## 1. 母版提示词（以后所有版本从这里改）

```
a tiny adorable dough sprite mascot, single isolated character, centered, the character fills most of the frame, clean simple silhouette, on a plain flat solid cream-white background, no scene, no stall, no building, no other characters, no objects, no text, no clock, no border, sticker-style character asset, readable at small size. a small soft plump round ball of white dough, two tiny black bean dot eyes, a small gentle calm expression, optional faint blush, squishy and minimal, cute and comforting. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic, no gradient, no 3D, no render, no glossy, no plastic --ar 1:1 --v 7 --s 50 --sref <参考图链接> --no scene, stall, building, other characters, text, clock, border, 3D, render, glossy, plastic, drop shadow, gradient, realistic shading
```

---

## 2. 首发先做这 4 张（验证画风稳不稳、豆豆眼统不统一、抠图好不好用）

### ① 基础本体 · 白面团（先跑这张，作为 --oref 锚）
```
a tiny adorable dough sprite mascot, single isolated character, centered, fills most of the frame, clean simple silhouette, on a plain flat solid cream-white background, no scene, no other characters, no objects, no text, no border, sticker-style asset. a small soft plump round ball of white dough, the humble basic form, two tiny black bean dot eyes, a small gentle calm smile, squishy and minimal, cute and comforting. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic, no gradient, no 3D, no glossy --ar 1:1 --v 7 --s 50 --sref <参考图链接> --no scene, stall, building, other characters, text, clock, border, 3D, render, glossy, plastic, gradient
```

### ② 小笼包精灵（最贴"早点"）
```
a tiny adorable dough sprite shaped as a little soup dumpling (xiaolongbao) with cute pleats gathered on top, single isolated character, centered, fills most of the frame, clean silhouette, on a plain flat solid cream-white background, no scene, no other characters, no objects, no text, no border, sticker-style asset. soft round white body, same two tiny black bean dot eyes, same small gentle calm expression, squishy and minimal. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic, no gradient, no 3D, no glossy --ar 1:1 --v 7 --s 50 --sref <参考图链接> --oref <本体图链接> --ow 50 --no scene, stall, other characters, text, border, 3D, render, glossy, plastic, gradient
```

### ③ 可颂精灵（体现"外表可变"）
```
a tiny adorable dough sprite shaped as a cute crescent croissant, soft rounded buttery curves forming its body, simplified, single isolated character, centered, fills most of the frame, clean silhouette, on a plain flat solid cream-white background, no scene, no other characters, no objects, no text, no border, sticker-style asset. same two tiny black bean dot eyes, same small gentle calm expression. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic, no gradient, no 3D, no glossy --ar 1:1 --v 7 --s 50 --sref <参考图链接> --oref <本体图链接> --ow 50 --no scene, stall, other characters, text, border, 3D, render, glossy, plastic, gradient
```

### ④ 打盹精灵（体现"陪伴 / 夜晚气质"）
```
a tiny adorable dough sprite taking a little nap, single isolated character, centered, fills most of the frame, clean silhouette, on a plain flat solid cream-white background, no scene, no other characters, no objects, no text, no border, sticker-style asset. a small soft plump white dough body, eyes closed into two tiny curved lines, a tiny sleepy bubble, curled slightly, sleepy and peaceful, soft and healing. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic, no gradient, no 3D, no glossy --ar 1:1 --v 7 --s 50 --sref <参考图链接> --oref <本体图链接> --ow 50 --no scene, stall, other characters, text, border, 3D, render, glossy, plastic, gradient
```

---

## 3. 其余状态（同母版，只换"动作那一句"）

把母版里的角色描述换成下面这句即可，其余构图/风格/参数全部不变（都带 `--sref` + `--oref --ow 50`）：

- **迎客**：`waving hello with one tiny raised arm, a warm welcoming smile`
- **备菜**：`wearing a tiny simple apron, gently kneading a tiny lump of dough, focused but cute`
- **回小屋睡**：`wearing a tiny soft sleeping cap, holding a tiny blanket, drowsy and peaceful`
- **开心**：`happy, eyes curved into joy, tiny arms up`
- **甜甜圈形态**：`shaped as a round donut with a soft simple glaze and a few tiny sprinkles`

---

## 4. 资产三层体系（先定规范，别先出一堆图）

只要这 4 件事固定住，后面出 20 个变体都不会散：**①豆豆眼固定 ②圆润轮廓固定 ③低饱和手绘蜡笔固定 ④白底单体构图固定。**

- **第一层 · 基础本体**：白面团（所有变体的 `--oref` 母体）。
- **第二层 · 点心形态**：小笼包 / 可颂 / 甜甜圈 / 包子 / 贝果 / 麻薯……每只都留三锚点 + 同 `--sref`。
- **第三层 · 状态**：迎客 / 备菜 / 打盹 / 回小屋睡 / 开心……做 UI 状态与动效。

---

## 5. 排错备忘

- **还带摊位/场景** → 确认参考图是用 `--sref`（末尾）不是垫图（最前）；删掉角色描述里的"breakfast shop / stall"等词；加重 `--no scene, stall, building, objects`。
- **画风不像参考** → 先确认 `--sref` 挂上了；调高 `--sw 150`；调低 `--s`；去掉 `--p`。
- **出 3D/毛绒/光滑** → 确认没用 `--niji`；`--no 3D, render, glossy, plastic` 还在。
- **形态之间不像同一只** → 加 `--oref <本体图链接> --ow 50`，并写死三锚点。
- **留白太多/角色太小** → 加 `character enlarged, fills the frame, minimal empty space`。
- **要透明 PNG** → 白底出图 → 抠图工具去白底。
