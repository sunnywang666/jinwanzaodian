# 面点精灵 & 铺子场景 · Midjourney 提示词套组（v4 · 场景 + 资产整合版）

> 配合《产品概念文档 v5》《界面设计说明 v5》与 GitHub 仓库 `sunnywang666/jinwanzaodian`（Codex 网页 demo）。
> 用法说明中文，提示词全部英文。模型与参数沿用上一版（`--v 7` + `--sref` 锁画风 + `--oref` 保持"同一只"）。
> 这版的目标：从"只有精灵贴纸"扩到**一整套可交互界面要用的图**——可点击的主场景背景图 + 单体物件资产 + 客人资产 + overlay 道具图，且全部风格统一、可抠成透明 PNG、文件名对齐 Codex 仓库。

---

## 0. 这版改了什么（相对 v3）

1. **新增「主场景图」**：一张可交互的早点铺室内主界面背景图（首页底图，用来放热区）。这是这次最该先做的图。
2. **新增「单体物件资产」**：菜单板 / 电话本 / 账本 / 精灵小屋 / 黑板 / 收音机 + 蒸笼、豆浆锅、油条篮等。点击热区放大、进 overlay 都靠它们。
3. **新增「客人小动物资产」**：狐狸阿橘等 6 只，做成和精灵一样的单体贴纸（仓库 `AGENTS.md` 明令禁止用 emoji 当角色）。
4. **新增「overlay 道具图」**：打开的菜谱本 / 账本 / 客人来信卡，做弹层背景。
5. **⚠️ 重要修正**：仓库硬规则是**精灵没有手脚**（只是小圆面团/点心 + 豆豆眼）。v3 里"迎客举手 / 备菜揉面 / 开心举手"这几句带手,本版全部改成**无手脚**版（见第 3 节）。
6. **给出现成 `--sref` / `--oref` 直链**：直接复制粘贴,不用再上传图。

---

## 1. 怎么用（这版的关键，务必先读）

### ① 现成链接（直接抄进提示词）
仓库里的图是公开可访问的,MJ 能直接读。把下面两条原样粘贴进提示词末尾即可:

- **风格参考 `--sref`（锁"早点整体美术参考图"的画风）**
  ```
  https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/%E6%97%A9%E7%82%B9%E6%95%B4%E4%BD%93%E7%BE%8E%E6%9C%AF%E5%8F%82%E8%80%83%E5%9B%BE.png
  ```
- **角色参考 `--oref`（锁"同一只面点精灵"的本体）**
  ```
  https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/public/assets/dough-spirit-base.png
  ```
> 若哪天链接打不开:在 GitHub 上点开那张图 → 点 **Raw / Download** → 复制地址栏链接替换即可。
> 等你把**新的主场景图**生成并 push 上去后,出"单体物件 / 客人"时,可以把它们的 `--sref` 换成**新主图的链接**,物件会和场景长得更一致（见第 9 节工作流）。

### ② 垫图 vs `--sref` vs `--oref`（"老带摊位"的根因）
| 用法 | 链接放哪 | 效果 | 何时用 |
|------|---------|------|--------|
| 图像提示（垫图） | 提示词**最前面** | 抄风格 **+ 抄构图** | ⚠️ 别拿参考图垫图,会把摊位/场景抄进来 |
| **风格参考 `--sref`** | 提示词**末尾** | **只抄风格**(笔触/质感/配色) | ✅ 想要参考图画风就用它 |
| 角色参考 `--oref` | 提示词末尾 | 只抄**角色**(保持同一只) | 出各精灵形态时保持一致(物件/场景**不用** `--oref`) |

### ③ 模型与参数（沿用上版）
- **`--v 7`**,不要 `--niji 6`(niji 太光滑,出不来蜡笔颗粒)。
- 末尾挂 `--sref <上面那条链接>` 锁画风;不够像就加 `--sw 150`。
- `--s 50` 左右(低 stylize = 更听话、更贴提示与参考)。
- 精灵/物件/客人单体贴纸用 `--ar 1:1`;**主场景图用竖图 `--ar 2:3`**(贴手机屏,也可试 `--ar 3:4`);overlay 道具用 `--ar 4:3` 或 `--ar 3:4`。
- **先别加 `--p`**(个性化会叠你账号风格,跟参考图打架);别写 `--style cute`(旧参数,报错)。

### ④ 透明底怎么来（MJ 出不了透明,写 "transparent" 没用）
1. 用"白底单体"构图词,让它出在**纯奶白底、边缘清楚**上;
2. 放大挑一张(U1–U4);
3. 用抠图工具(remove.bg / Photoshop)去白底 → 透明 PNG;
4. 丢进 `public/assets/`,跑仓库的 `npm run trim-assets` 裁掉透明边。
> **主场景图和 overlay 道具图不用抠**——它们本来就带奶白底,直接当背景用。要抠的只有"精灵 / 单体物件 / 客人"这些会叠在场景上的贴纸。

### ⑤ 三个身份锚点（精灵每条都写死）
1. `a small soft plump round ball of white dough`（一团软白面）
2. `two tiny black bean dot eyes`（豆豆眼）
3. `a small gentle calm expression`（温柔安静神态）
> 仓库硬规则:**no hands, no feet, no arms, no legs**——精灵只是会表情的小面团/点心,靠**身体倾斜、弹跳、眼睛弯**表达情绪,不靠手脚。

---

## 2. 风格 / 构图固定词（复制用）

**风格固定词（贴参考图、反 3D，所有图都加）：**
```
hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, warm brown framing feel, not realistic, no gradient, no 3D, no render, no glossy, no plastic
```

**单体贴纸构图词（精灵 / 物件 / 客人用，保证是"资产"而非"插画")：**
```
single isolated subject, centered, fills most of the frame, clean simple silhouette, on a plain flat solid cream-white background, no scene, no stall, no building, no other characters, no objects around, no text, no clock numbers, no border, sticker-style asset, readable at small size
```

**主场景构图词（只有主图用，见第 4 节）：**
```
interior scene used as an interactive game main-screen background, fixed front-on slightly high viewpoint, all objects clearly separated and not overlapping, evenly spaced, each object reads as a distinct clear silhouette, calm and uncluttered, no characters
```

---

## 3. 精灵 · 母版 + 各形态/状态（已修正为无手脚）

### 母版（所有精灵版本从这里改）
```
a tiny adorable dough sprite mascot, single isolated subject, centered, fills most of the frame, clean simple silhouette, on a plain flat solid cream-white background, no scene, no other characters, no objects around, no text, no border, sticker-style asset, readable at small size. a small soft plump round ball of white dough, two tiny black bean dot eyes, a small gentle calm expression, optional faint blush, no hands, no feet, no arms, no legs, squishy and minimal, cute and comforting. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic, no gradient, no 3D, no glossy --ar 1:1 --v 7 --s 50 --sref https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/%E6%97%A9%E7%82%B9%E6%95%B4%E4%BD%93%E7%BE%8E%E6%9C%AF%E5%8F%82%E8%80%83%E5%9B%BE.png --no scene, stall, building, hands, feet, arms, legs, other characters, text, clock, border, 3D, render, glossy, plastic, drop shadow, gradient
```

### ⚠️ 形态的核心原则：身份 = 脸，不是颜色
精灵的"同一只"靠的是 **豆豆眼 + 温柔小嘴这张脸**，不是"白色"。白面团只是"原味"那张皮，换皮时**颜色要跟着点心一起变**，白色不能留下。
> 之前可颂中间留一团白的原因：① 母版里 `a ball of white dough`（白面团）和 `croissant`（可颂）打架，MJ 当成两个东西拼一起（白团子 + 可颂壳）；② `--oref` 指向白本体 + `--ow 50` 把白色硬拽了回来。

形态分两类，配方不同：

#### A. 本白系（原味/白色点心：本体、小笼包、包子）—— 保留白身，`--oref ... --ow 50` 没问题
用上面母版，把形状句换成（其余不动）：
- **小笼包**：`its whole body shaped as a little soup dumpling (xiaolongbao) with cute pleats gathered on top, soft pale dumpling skin`
- **包子**：`its whole body shaped as a soft round steamed bun (baozi) with a tiny pinched top, pale soft skin`
- 末尾加：`--oref https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/public/assets/dough-spirit-base.png --ow 50`

#### B. 变色系（有颜色的点心：可颂、甜甜圈、贝果、麻薯…）

#### ✅ 首选：身体 / 脸 分两层（最稳，且让"表情"以后几乎免费）
**别再让 MJ 在每张皮肤上重画脸了。** MJ 只出"无脸面包体"，脸用一张固定 PNG 盖上去。
- 好处：脸成了**同一张图**，跨所有皮肤分毫不差（这才是真正的"标志"）；MJ 画"均匀的可颂"远比画"带统一小脸的可颂"容易，两色肚子/脸坐浅块**一次性消失**。
- **两条轴**：皮肤轴=换身体脸不变（可颂/甜甜圈/…）；表情轴=换脸身体不变（默认/开心/打盹/眨眼…）。**几个身体 PNG × 几个脸 PNG** 就能组合出一大片。皮肤先用一张默认脸跑通，表情留到以后当脸的图层加。

**第 1 步：MJ 出"无脸面包体"（注意摁住 MJ 别自己加脸）**
> **白面团基础体（白身，留 `--oref` 保持憨憨比例）：**
> ```
> a small soft plump round ball of white dough, a chubby cute mascot body, completely faceless, no eyes, no mouth, no expression, smooth blank front surface, no hands, no feet, front view, single isolated object, centered, fills most of the frame, clean simple silhouette, on a plain flat solid cream-white background, no scene, no objects, no text, no border, sticker-style asset. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic --ar 1:1 --v 7 --s 50 --sref <STYLE> --oref <BODY> --ow 50 --no face, eyes, mouth, smile, expression, hands, feet, scene, text, border, 3D, glossy
> ```
> **有色皮肤（可颂等，去掉 `--oref`，身体均匀同色）：**
```
a chubby cute plump croissant, one whole croissant with a single uniform even golden-brown color all over, fat short stubby shape with three or four plump rolled segments like a little fan, a smooth blank front surface, completely faceless, no eyes, no mouth, no expression, front view, single isolated object, centered, fills most of the frame, clean silhouette, on a plain flat solid cream-white background, no scene, no objects, no text, no border, sticker-style asset. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm palette, cozy, not realistic --ar 1:1 --v 7 --s 50 --sref <STYLE> --no face, eyes, mouth, smile, expression, character face, pale belly, lighter underside, two-tone, white patch, scene, text, border, 3D, glossy
```
> `completely faceless, no eyes, no mouth` + `--no face, eyes, mouth, smile, expression` 必须写——MJ 默认爱给可爱东西加脸。所有皮肤同模板，只换"那是什么面包"那句（配下面"形状库大法"）。`front view, smooth blank front surface` 保证有块平整的地方放脸。**白身留 `--oref`、有色去 `--oref`**（避免浅肚子）。

**第 2 步：做一张固定脸 PNG（透明底，就一张）**
内容：两颗实心小黑点(眼) + 一道温柔波浪小嘴(～/◡) + 可选两小块淡粉腮红。来源：格画/Figma/Procreate 画一次，或从现有白面团精灵上把脸抠出来去背景。

**第 3 步：合成（推荐代码分层）**
- **代码分层（推荐）**：body PNG 在下、face PNG 绝对定位固定偏移盖在上面。以后换表情=换 face 那张图（夜里自动换"打盹脸"、点一下"眨眼"都几乎免费）。
- **PS/格画手动合并**：把脸贴到每个身体导出合并 PNG。简单，但失去随时换表情的灵活。
> React demo 里走代码分层几乎零成本，**变色皮肤一律建议用这套**。下面"在 MJ 里直接写脸"的方案降级为：不想分层、想一次成图时的备选。

---

#### 备选：在 MJ 里直接把脸写进去（不分层时用）—— 身体一整块均匀同色，脸是固定"标志"
**核心认知（解决"不同颜色的肚子"）**：精灵的"同一只"只靠**那张脸**(两颗豆豆眼 + 一个温柔波浪嘴)——它是永远不变的**标志**，直接画在身体表面，像盖个章。**身体是一整块、均匀同色**(整只可颂金棕、整块面包一个色)，**绝不能有浅色肚子 / 两色**。
> "两色肚子"哪来的？两个源头：① `--oref` 指向的是**白身**精灵，MJ 会硬留一块浅色当"脸的地盘" → 脸坐在浅肚子上；② 你垫的那张面包图本身就是"上深下浅"的真实可颂。
> **修法（变色系一律照做）**：
> 1. **去掉 `--oref`**——它就是浅肚子的元凶。脸这么简单(俩点+一道嘴)，用文字写死最稳、最自由。
> 2. 身体写成 `one whole ___, the entire body a single uniform even ___ color all over, no pale areas, no lighter underside`。
> 3. 脸写成 `drawn as simple dark marks directly on the colored surface`(直接画在有色表面上，不留浅底)。
> 4. `--no` 加 `pale belly, light belly, lighter underside, two-tone, two color body, white face patch, pale patch behind face`。

**可颂 · 均匀同色版（可直接跑；只需 `<STYLE>`，不用 `--oref`）：**
```
a tiny adorable breakfast-shop sprite that is one whole croissant, the entire body a single uniform even golden-brown color all over with no pale areas and no lighter underside, a fat chubby short stubby croissant shape with three or four plump rolled segments like a little fan and short curled tips, simplified and cute, single isolated character, centered, fills most of the frame, clean silhouette, on a plain flat solid cream-white background, no scene, no objects, no text, no border, sticker-style asset. on the golden body, drawn as simple dark marks: two tiny solid black bean dot eyes and a small calm wavy mouth, the same signature face every time, no hands, no feet. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm palette, childlike naive and cozy, not realistic, no gradient, no 3D, no glossy --ar 1:1 --v 7 --s 50 --sref <STYLE> --no pale belly, light belly, cream belly, lighter underside, two-tone body, two color body, white face patch, pale patch behind face, white center, white dough, dumpling, potsticker, jiaozi, plain crescent horn, long thin horn, scene, other characters, text, border, hands, feet, 3D, render, glossy, plastic, gradient
```
> 关键：`one whole croissant, single uniform even golden-brown color all over, no pale areas, no lighter underside` + 脸 `simple dark marks directly on the golden body` + **不挂 `--oref`** + `--no pale belly, two-tone, white face patch`。

#### 🍞 形状库大法（"用面包参考图的形状 + 面点精灵的风格和脸"的正解）
当文字描述还不够像（可颂尤其难），用**三个引用各管一件事**：
- **形状** ← 一张该面包的简笔画（image prompt，垫在提示词**最前面**）
- **画风** ← 你的蜡笔风格图（`--sref`）
- **脸** ← 面点精灵本体（`--oref`）

做法：① 从面包简笔画教程里**把那一只单独裁出来**（只裁一只，别带其他面包和标题字，否则会把整页都抄进来），传上去拿到链接 `<BREAD>`；② 放最前面当 image prompt（**注意：不挂 `--oref`**，脸用文字写，避免浅肚子；并强写"均匀同色"盖掉面包图自带的上深下浅）：
```
<BREAD> a tiny adorable breakfast-shop sprite that is one whole croissant, the entire body a single uniform even golden-brown color all over with no pale belly and no lighter underside, fat chubby short stubby shape, on its body two tiny solid black bean dot eyes and a small calm wavy mouth drawn as simple dark marks, the same signature face, no hands, no feet, hand-drawn crayon and gouache illustration on textured paper, flat matte coloring, low saturation warm palette, cozy, not realistic --ar 1:1 --v 7 --s 50 --iw 1 --sref <STYLE> --no pale belly, lighter underside, two-tone, white face patch, dumpling, potsticker, jiaozi, plain horn, scene, text, border, hands, feet, 3D, glossy
```
> 原理：`<BREAD>` 出形状、`--sref` 出蜡笔风、文字出"均匀同色身体 + 固定脸"。`--iw`（默认 1，范围 0–3）控形状影响：**形状不够像→升到 1.5–2；面包图的粗描边/高饱和/上深下浅被带进来→降到 0.5。**
> **这招对所有皮肤通用**：那张面包简笔画就是你的"形状库"——要小笼包裁小笼包、要吐司裁吐司、甜甜圈/贝果/瑞士卷/麻花/法棍同理，当 image prompt；风格靠 `--sref`、脸靠文字、身体永远"均匀同色"。

**其余变色系（同配方：均匀同色 + 固定脸 + 不挂 oref；都强调 even color all over）：**
- **甜甜圈**：`one whole donut with a clear round hole in the middle, the entire body evenly colored, soft pink strawberry glaze all over the top, no pale belly`；`--no` 加 `solid ball, no hole, bun, croissant, two-tone, pale belly`
- **贝果**：`one whole bagel ring with a clear hole, the entire body a single uniform even golden-brown all over, no pale areas`；`--no` 加 `donut, sprinkles, glaze, croissant, two-tone, pale belly`
- **麻薯/糯米团**：`one whole mochi ball, the entire body a single uniform soft pastel color all over, smooth lightly dusted surface`；`--no` 加 `bread, crust, flaky, croissant, two-tone, pale belly`

> 还有浅肚子？→ `--no` 再补 `pale lower half, light bottom`；身体颜色词写满 `evenly the same color everywhere`。
> 形状不够像？→ 用上面"形状库大法"垫 `<BREAD>`，或把那 4 张里最接近的一张 U 出来、当 `--sref` 继续 vary 逼近，比从头重抽稳。
> 脸不够统一？→ 脸就固定这一句 `two tiny solid black bean dot eyes and a small calm wavy mouth, drawn as simple dark marks`，每款照抄、别改字。

### 状态（换"神态那一句"，**无手脚版**；都挂 `--sref` + `--oref --ow 50`）
- **迎客 greet**：`leaning forward a little with a warm welcoming smile, a happy gentle bounce, eyes bright`
- **备菜 cook**：`wearing a tiny chef hat, a small lump of dough resting beside it, calm focused expression`（不靠手揉,只是旁边有面团）
- **打盹 doze**：`eyes closed into two tiny curved lines, a tiny sleepy bubble, drowsy and peaceful`
- **回小屋睡 sleep**：`wearing a tiny soft sleeping cap, a small blanket draped over its round body, eyes closed, peaceful`
- **开心 happy**：`eyes curved into joyful crescents, a little hop, a few tiny sparkles around it`

---

## 4. 主场景图（这次最该先做的图）⭐

**目标**：一张"可交互的早点铺室内主界面背景图"。最终方案 = **平视/微俯 + 上下两段式**：**上面一条窄柜台**(老板 + 面团在柜台后)，**下面一大块待客区**(小动物坐着吃饭)，**几乎是平的、浅纵深**——这样角色不管放哪都同尺寸，好摆好动。**先不放任何角色**(老板/面团/客人都是贴纸，代码叠上去)。

> **🔑 最关键的一条分界线：哪些"烤进背景"、哪些"单独做贴纸盖上去"。** 分清这条，"突出菜谱/减杂物/换家具翻新/菜单乱码"这些问题大半自动解决。
> | 烤进背景（不会变的"房子壳子"） | 做成贴纸盖上去（要突出 / 要换 / 有文字） |
> |---|---|
> | 墙、地、窗、柜台、墙搁板、地毯、灯光 | 菜单板、联络簿、账本、收音机、桌椅、精灵小屋、老板、面团、客人 |
> | 要**干净、少东西、留白** | 想多大多显眼随你；翻新=换贴纸，背景不动 |
> - **菜单永远会乱码**(MJ 写不对中文) → 必须做贴纸，文字用代码/PS 另出再盖上（见 §4 末"菜单文字"）。
> - **以后要翻新换家具** → 凡是会换的(桌椅、地毯、装饰、灯)都别烤进背景，全做贴纸；翻新=切换贴纸。
> - 所以**背景壳子只留：墙/地/窗/柜台/一两样必要陈设/灯/地毯**，其余全交给贴纸层。

> **视角三选一（为什么定平视两段式）**：
> | 视角 | 空间感 | 角色缩放 | 手绘还原 | 结论 |
> |------|--------|---------|---------|------|
> | 深墙角透视(P3) | 最强 | ❌ 近大远小，移动难处理 | 中 | 弃（角色摆放是噩梦） |
> | 等距 isometric(P2) | 强 | ✅ 平行投影，到哪都一样大 | ❌ 蜡笔风难稳、客人要画 45°斜角 | 备选（费工，赶 demo 不推荐） |
> | **平视/微俯 两段式(P4·P6)** | 中 | ✅ 几乎不变 | ✅ 最贴手绘 | **✅ 主推（最好摆角色、最省事）** |
>
> **翻车记录**：①居中小摆件留白 → 加满画幅词修好；②正对墙的平面立面、没处放动物 → 一度改深墙角透视；③深透视带来"近大远小"角色缩放难题 → **回到平视两段式**，浅纵深、上小下大。

### 主场景图 · 终版提示词（留 sref + 调低 `--sw`：风格和填满兼得，文件名 `cover-shop.png`）
> **三条血泪教训（合起来才是解）**：
> 1. **`mobile game main screen` 在逼它填满**——删了会退回"纸上小插画"。下面这版改用 `full-bleed ... fills the whole canvas` 顶上同样效果、还不出刘海。
> 2. **`--sref` 是画风的唯一来源——丢了它画风全没**（变成线稿/日漫感）。所以**不能丢 sref**。
> 3. **但 `--sref` 默认强度(`--sw 100`)会把"纸上小插画+留白+杂物"的构图也一起抄。** → **留 sref，把 `--sw` 调低**（默认 100 调到 ~50），就能"借到蜡笔画风、构图听文字的"。这才是风格 + 填满兼得的正解。
```
a full-bleed flat background illustration of a cozy small Chinese breakfast shop interior, the artwork completely fills the whole canvas wall-to-wall and floor-to-ceiling, reaching all four edges and corners, absolutely no border, no margins, no cream paper showing around it, no rounded corners, no vignette. simple flat front-facing composition with a slight high tilt. upper third: a long wooden counter across the full width with one small stack of bamboo steamer baskets, behind it a plain wall with a window, one round clock, one small shelf with two or three bowls, and one warm hanging lamp. lower two thirds: a large mostly empty wooden floor with a single blue-and-white gingham rug and lots of open empty space. very minimal, very few objects, calm and almost empty, warm daytime light, no characters. hand-drawn crayon and gouache illustration, rough soft pencil outline, flat matte coloring, low saturation warm cream and brown palette, childlike naive and cozy, not realistic --ar 2:3 --v 7 --s 50 --sref https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/%E6%97%A9%E7%82%B9%E6%95%B4%E4%BD%93%E7%BE%8E%E6%9C%AF%E5%8F%82%E8%80%83%E5%9B%BE.png --sw 50 --no border, margins, frame, cream paper border, paper texture around the art, rounded corners, vignette, floating illustration, small centered illustration, phone frame, notch, isometric, deep perspective, top-down, pixel art, clutter, busy shelves, many bowls, many steamers, too many objects, characters, people, animals, text, words, 3D render, glossy
```
> **只调 `--sw` 这一个数**（默认 100）：还留白/杂物多 → 往下调 `30`、`20`（构图更听文字）；画风还不够像蜡笔参考 → 往上调 `70`、`90`。**甜点大概在 30–60**，先 50 跑一张再往对应方向挪。
> **最快止血**：之前已抽到过一张填满的（带刘海那张），直接裁掉刘海那一条就能用。
> **角色坑位**：柜台后 = 老板 + 面团；下面地面 = 客人桌椅(桌椅做贴纸，方便翻新)。

### 如果 MJ 的 `--sw` 在 30–70 都搞不定：换 GPT Image 2 做场景
| | MJ（`--sref`+`--sw`） | GPT Image 2（gpt-image-1） |
|---|---|---|
| 听话程度（填满/控杂物/指定物件） | 一般，要反复调 | **强，照说的画** |
| 贴一张参考图的画风 | **强**（`--sref` 精准） | 一般（像那个味儿，但非同款笔触） |
| 写对中文（菜单/招牌） | ❌ 永远乱码 | ✅ **能写对** |
> **关键是一致性**：精灵/皮肤/客人若继续用 MJ 出，场景**最好也留 MJ**（用上面 `--sw` 法），否则背景和角色像两个画师画的。**若愿意把角色也一起搬去 GPT Image**（它做角色 + 文字很顺），整套都用 GPT Image 也成立、更省心。
> GPT Image 做场景的话术：把那张风格参考图喂给它 →「照这张的手绘蜡笔暖色画风，画一张**铺满整个画面**的早点铺室内，平视微俯、上面一条窄柜台、下面一大块空待客区、东西尽量少、不要人物」。
> 建议顺序：① 先花一张成本试 MJ `--sw 50`（大概率就成）；② 30–70 都不行再果断换 GPT Image，并考虑角色是否一并迁移。

#### ⭐ 重要发现：风格参考图本来就是 GPT 画的 → 场景（乃至整套）改用 GPT Image 更准
MJ 调 `--sref` 始终差一层，是因为它在**逆向模仿一张 GPT 图**，隔了一个引擎。**回到 GPT 来画，才能复刻出同款手感。** GPT Image 没有 `--sref`/`--ar`/`--no` 参数，全靠自然语言 + **把参考图一起上传**。

**GPT Image 场景提示词（连「早点整体美术参考图」一起上传，发给 GPT）：**
> 参考我上传的这张图的画风——手绘水粉 + 彩铅质感、暖奶油色底、低饱和大地色系、柔和的纸面颗粒、柔软不生硬的描边、温柔治愈的绘本感——用**一模一样的画风**，重新画一张【早点铺的室内背景图】。
> - **竖图，手机屏比例(2:3)。画面铺满整张图，延伸到四个边和四个角，不要任何白边、边框、留白、圆角、暗角**，绝不要"一小幅插画浮在纸面上"。
> - 视角：**平视、只略微俯一点点能看到地面，基本是平的、浅纵深**（以后摆的小动物大小一致）。
> - **上面**一条木头长柜台横跨整宽，柜台上只放一两摞竹蒸笼；柜台后墙上有一扇窗、一个圆挂钟、一个放两三个碗的小木搁板、一盏暖色吊灯、和**一块空白菜单板(不写字)**。**下面**一大片空荡木地板，铺一张蓝白格子地毯，旁边两三个小圆木凳，**留大片空地**。
> - 干净、安静、东西尽量少，暖暖的白天光线。
> - **不要任何人物或小动物角色**（之后单独加），招牌和菜单板留空不写字。不要 3D、光泽塑料感、照片写实、杂乱堆满。

> **GPT Image 的优势**：① 画风同源会真的对；② 改图用嘴说（"蒸笼再少点""柜台压低""地面再空"），不用圈区域调参数；③ 填满更听话；④ 能写对中文菜单。
> **顺手定的决定**：既然画风是 GPT 原生，**精灵 / 皮肤 / 客人最好也都用 GPT Image 出，整套一个手感**，避免"GPT 背景 + MJ 精灵"割裂。之前在 MJ 踩的坑（两色肚子、填不满、乱码）换到 GPT 大半会轻松很多。
> **迁 GPT 后这份 MJ 文档怎么用**：把每节的"形状/构图/不要什么"的**意图**照搬成自然语言描述给 GPT 即可（如"无脸面包体""身体均匀同色、脸是固定标志另一层叠""单体物件白底贴纸"），只是不再带 `--v/--sref/--no` 参数。第 3 节 B 的"身体/脸分层法"在 GPT 下同样适用、甚至更稳。

### 时段变体（可选，文件名 `cover-shop-morning.png` / `cover-shop-night.png`）
> 布局保持一致，只改光线。最省事：**先出好白昼版，把它的链接当 `--sref`**(锁住同一个房间)，再改光线那几句。
- **清晨版**：把 `window with soft daylight` + `warm daytime light` 改成 `window glowing with soft warm sunrise light, golden morning glow filling the whole room`
- **夜晚打烊版**：改成 `window showing a deep blue night sky with a moon, the whole room dim and quiet, only the warm table lamp glowing softly`；保留 `--no deep perspective, isometric, top-down, pixel art, blank margins, characters, text, 3D render, glossy`
> 注意：窗外天色若想**在 App 里随真实时间变**，更稳的是主图"窗户"区域留浅，用代码单独叠一张会变的"天色贴片"，而不是出 3 张完整大图。看排期取舍。

### 场景微调：元素太多怎么减
**原则：背景图要故意"欠装修"。** 之后老板、面团、客人、食物、UI 按钮都要叠上去，背景越满、叠完越糊。主图只留**要做热区的英雄物件**（菜单板、黑板、钟、蒸笼、柜台、几张桌凳、地毯、精灵小屋），氛围小物尽量砍，多留空墙空地。三种减法，从精到糙：
1. **Vary (Region)**（生成图下方那个按钮）= **局部重画**。框选太挤的那块（比如一排碗碟、多出来的第二个钟），把那块重写成 `empty wall` / `simpler shelf with fewer items`，只改这一块、其他不动——**"就想去掉某几样东西"用这个最准。**
2. **改词重抽**：把不要的物件从描述里删掉，加 `minimal and uncluttered, only a few objects, lots of empty wall and empty floor`，多余的丢进 `--no`（如 `--no extra clocks, extra bowls, clutter, too many objects`）。
3. **Upscale 后 PS 擦**：背景不用抠透明，放大后在 Photoshop 直接把多余物件涂掉/盖掉，最稳。
> **顶部冒出"手机刘海"形状** = `mobile game main screen` 被理解成"画一部手机"了。不想要就改成 `cozy game background art`，加 `--no phone frame, phone mockup, device frame, notch, ui frame`。

### 菜单/黑板文字：别让 MJ 写，用代码或 PS 盖上去
MJ 写不对中文（必出乱码），所以**菜单板、黑板、招牌上的字一律不靠出图**。两种盖法：
- **给 Codex（前端）**：背景里那块"空白菜单板"做成一个透明热区，上面用 HTML/CSS **直接打中文字**(店里的早点 + 价格)，字体用项目里的手写体。这样字清晰、还能随时改、点击还能展开菜谱 overlay。给 Codex 的话术示例：
  > "菜单板区域用一个绝对定位的 div 盖在背景上，里面用手写风字体列出 3–5 样早点和价格，文字是真实可读的中文，不要用图片里的文字；点击该区域打开 RecipeBookOverlay。"
- **不接代码、只想要一张图**：在 Figma/PS 里单独做一张干净的"菜单贴图"(白底手写菜单)，导出 PNG，盖到背景菜单板的位置。
> 同理：招牌"今晚早点"、黑板留言、账本上的字，全部走这条——**背景只画空板子，字是另一层。**

---

## 5. 单体物件资产（点击热区 / 放大 / overlay 都靠它们）

**统一规则**：都用"②单体贴纸构图词" + 风格词,白奶底出图后抠成透明 PNG。**只挂 `--sref`(风格),不挂 `--oref`**(物件不是精灵)。`--ar 1:1`。
下面每条把 `<风格>` 替换为第 1 节那条 `--sref` 链接(或你新主图的链接)。

> 母版(物件通用):
> ```
> a single small hand-drawn prop for a cozy breakfast shop: <物件描述>. single isolated subject, centered, fills most of the frame, clean simple silhouette, on a plain flat solid cream-white background, no scene, no other objects, no characters, no text, no readable numbers, no border, sticker-style asset, readable at small size. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic, no gradient, no 3D, no glossy --ar 1:1 --v 7 --s 50 --sref <风格> --no scene, other objects, characters, text, readable numbers, border, 3D, render, glossy, plastic, gradient, drop shadow
> ```

把 `<物件描述>` 换成下面这些（P0 = 有热区、必做；P1 = 氛围、锦上添花）：

**P0 · 功能物件（点击 → 进 overlay）**
- 菜单板 `menu-board.png`：`a wooden hanging menu board with a warm wood frame, surface with a few tiny faint food doodles, no readable text`
- 电话本 `phone-book.png`：`a small worn little contacts booklet with a soft cover and a tiny ribbon bookmark, gently dog-eared, closed`
- 账本 `logbook.png`：`a thick handwritten ledger book with a soft cloth cover and a small pencil resting on top, closed`
- 精灵小屋 `spirit-hut.png`：`a tiny cozy little wooden house where a small dough sprite sleeps, a soft round cushion just inside the doorway, a faint warm glow from inside, empty (no sprite shown)`
- 黑板/留言板 `blackboard.png`：`a small wall message board with a few cute pastel sticky notes pinned on it, faint doodles, no readable text`
- 收音机 `radio.png`：`a small retro wooden radio with a round speaker grille and two little knobs, vintage and warm`

**P1 · 氛围物件**
- 蒸笼 `steamer.png`：`a small stack of round bamboo steamer baskets with a gentle wisp of steam rising`
- 豆浆锅 `soy-milk-pot.png`：`a small warm pot of soy milk on a tiny stove, a gentle wisp of steam`
- 油条篮 `youtiao-basket.png`：`a small woven basket holding a few golden fried dough sticks (youtiao)`
- 明日便签盒 `note-box.png`：`a small wooden box holding a few folded paper notes, a couple of notes peeking out, no readable text`
- 小桌灯 `table-lamp.png`：`a small warm desk lamp with a soft round shade casting a cozy glow`
- 墙上时钟 `wall-clock.png`：`a simple round wall clock with a plain blank dial and a warm wooden rim, no numbers`
- 小盆栽 `plant.png`：`a small potted plant with a few soft round leaves in a little clay pot`

---

## 6. 客人 · 小动物资产（仓库禁止用 emoji 当角色，必须出图）

**规则**：和精灵一样的单体贴纸(白奶底→抠透明)。客人是**小动物、是客人不是伙伴**,坐着安静吃早点。只挂 `--sref`,`--ar 1:1`。

> 母版(客人通用):
> ```
> a small cute round <动物> sitting cozily and gently holding a tiny breakfast bowl, calm happy expression, a breakfast-shop customer. single isolated subject, centered, fills most of the frame, clean simple silhouette, on a plain flat solid cream-white background, no scene, no other characters, no text, no border, sticker-style asset, readable at small size. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, not realistic, no gradient, no 3D, no glossy --ar 1:1 --v 7 --s 50 --sref https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/%E6%97%A9%E7%82%B9%E6%95%B4%E4%BD%93%E7%BE%8E%E6%9C%AF%E5%8F%82%E8%80%83%E5%9B%BE.png --no scene, other characters, text, border, 3D, render, glossy, plastic, gradient
> ```

把 `<动物>` 换成：
- 狐狸阿橘 `guest-fox.png`：`orange fox`
- 浣熊 `guest-raccoon.png`：`raccoon`
- 兔子 `guest-rabbit.png`：`white rabbit`
- 小熊 `guest-bear.png`：`brown bear`
- 猫头鹰 `guest-owl.png`：`little owl`
- 小猫 `guest-cat.png`：`tabby cat`

---

## 7. Overlay 道具图（弹层背景，可选）

**规则**：这些是**打开的册子/卡片**,做 overlay 的底图,内容用代码叠上去。**不用抠透明**,带奶白底直接用。`--ar 4:3` 或 `--ar 3:4`,只挂 `--sref`。

- 打开的菜谱本 `recipe-book-open.png`：
  ```
  an open hand-drawn recipe book seen from straight above, two facing blank cream pages with faint guide lines, a warm soft cover, a few tiny food doodles in the page corners, no readable text. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, cozy, not realistic, no 3D, no glossy --ar 4:3 --v 7 --s 50 --sref https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/%E6%97%A9%E7%82%B9%E6%95%B4%E4%BD%93%E7%BE%8E%E6%9C%AF%E5%8F%82%E8%80%83%E5%9B%BE.png --no readable text, words, numbers, characters, 3D, render, glossy
  ```
- 打开的账本 `logbook-open.png`：把上句的 `recipe book` 换成 `handwritten ledger book`,`food doodles` 换成 `a small pencil resting on the page, faint ruled lines`。
- 客人来信卡 `guest-letter.png`：
  ```
  a cozy little letter card on warm paper, a soft hand-drawn border, a small empty round portrait area at the top, blank body with faint writing lines, no readable text, like a note from a friend. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, cozy, not realistic, no 3D, no glossy --ar 3:4 --v 7 --s 50 --sref https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/%E6%97%A9%E7%82%B9%E6%95%B4%E4%BD%93%E7%BE%8E%E6%9C%AF%E5%8F%82%E8%80%83%E5%9B%BE.png --no readable text, words, numbers, 3D, render, glossy
  ```

---

## 8. 资产清单与文件命名（对齐 Codex 仓库 `public/assets/`）

| 物件 | 文件名 | 类型 | 抠透明? | 对应热区 → overlay |
|------|--------|------|--------|-------------------|
| 主场景(白昼) | `cover-shop.png` | 场景底图 | 否 | 首页底图 |
| 主场景(清晨/夜) | `cover-shop-morning.png` / `cover-shop-night.png` | 场景底图 | 否 | 时段切换(可选) |
| 精灵本体 | `dough-spirit-base.png` ✅已有 | 贴纸 | 是 | `--oref` 锚 / 叠在场景 |
| 精灵·小笼包 | `dough-spirit-xiaolongbao.png` ✅已有 | 贴纸 | 是 | 皮肤 |
| 精灵·可颂/甜甜圈/打盹… | `dough-spirit-croissant.png` 等 | 贴纸 | 是 | 皮肤 / 状态 |
| 菜单板 | `menu-board.png` | 贴纸 | 是 | → 菜谱本 |
| 电话本 | `phone-book.png` | 贴纸 | 是 | → 客人图鉴 |
| 账本 | `logbook.png` | 贴纸 | 是 | → 营业日志 |
| 精灵小屋 | `spirit-hut.png` | 贴纸 | 是 | → 精灵换装 |
| 黑板/留言板 | `blackboard.png` | 贴纸 | 是 | → 留言板 |
| 收音机 | `radio.png` | 贴纸 | 是 | → 白噪音/聊天 |
| 蒸笼/豆浆锅/油条篮/便签盒/桌灯/时钟/盆栽 | `steamer.png`…`plant.png` | 贴纸 | 是 | 氛围(可不做热区) |
| 客人 ×6 | `guest-fox.png`…`guest-cat.png` | 贴纸 | 是 | 叠在场景/柜台 |
| 菜谱本/账本/来信(打开) | `recipe-book-open.png` 等 | overlay 底图 | 否 | 弹层背景 |

---

## 9. 工作流顺序（别一次乱出一堆）

1. **先出主场景图** `cover-shop.png`(第 4 节)。先把房间结构、物件位置、留白定下来——它决定后面所有热区坐标。
2. push 上去 → 拿它的 raw 链接,**当后续单体物件/客人的 `--sref`**(物件就会和场景里长得一样;没 push 之前先用"早点整体美术参考图"当 `--sref`)。
3. **再出 P0 功能物件 6 张**(第 5 节),抠透明。这 6 张做完,热区点击就能进 overlay 了。
4. 出 **客人 ×6**(第 6 节)、**精灵其余形态/状态**(第 3 节)、**P1 氛围物件**、**overlay 道具图**(第 7 节)。
5. 全部丢 `public/assets/` → 跑 `npm run trim-assets` 裁边。
> **别从主图硬抠物件**(会缺角、变形、比例不齐)。正确做法是"照着主图、用同一个 `--sref` 单独再出一张干净的"。

---

## 10. 资产三层体系（先定规范，后出变体就不会散）

只要四件事固定住,出 30 个变体都不会乱:**①豆豆眼固定 ②圆润轮廓固定 ③低饱和手绘蜡笔固定 ④白底单体构图固定。**
- **第一层 · 基础本体**：白面团(所有精灵变体的 `--oref` 母体)。
- **第二层 · 形态/物件/客人**：点心形态、铺子物件、小动物客人——同 `--sref`、同构图词。
- **第三层 · 状态**：迎客/备菜/打盹/回小屋睡/开心——做 UI 状态与动效。

---

## 11. 排错备忘

- **精灵又长手脚了** → 三锚点写死 `no hands, no feet, no arms, no legs`,`--no` 里也加 hands/feet/arms/legs;状态句别用"举手/揉面"等动作。
- **变色点心中间留一团白** → 见第 3 节 B:删掉 "white dough" 句、身体整体上色、`--ow` 从 50 降到 20、`--no` 加 `white center, white blob, two-tone body, pale center`;还白就降到 15 或干脆去掉 `--oref`。
- **物件/精灵还带摊位场景** → 确认参考图是 `--sref`(末尾)不是垫图(最前);删掉描述里的 "breakfast shop / stall" 等场景词;加重 `--no scene, stall, building, objects`。
- **主图物件太挤/重叠** → 加 `generous spacing, each object clearly separated, fewer objects`;`--no overlapping objects, cluttered, busy`;或分两次出(墙面物件一版、柜台物件一版)再在代码里拼。
- **主图冒出人物/客人** → `--no characters, people, fox, animals, crowd` 加重;描述里强调 `empty room, no characters`。
- **画风不像参考** → 确认 `--sref` 挂上了;调高 `--sw 150`;调低 `--s`;去掉 `--p`。
- **出 3D/毛绒/光滑** → 没用 `--niji`;`--no 3D, render, glossy, plastic` 保留。
- **形态之间不像同一只** → 加 `--oref <本体链接> --ow 50` 并写死三锚点。
- **图上有乱码文字** → `--no text, words, readable numbers`;菜单板/黑板/时钟都强调 `no readable text / no numbers`。
- **要透明 PNG** → 白底出图 → 抠图工具去白底 → `npm run trim-assets`。
