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

### 形态（换"形状那一句"，其余不动；都挂 `--oref ... --ow 50`）
出形态时在末尾加：
```
--oref https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/public/assets/dough-spirit-base.png --ow 50
```
- **小笼包**：`shaped as a little soup dumpling (xiaolongbao) with cute pleats gathered on top, soft round white body`
- **可颂**：`shaped as a cute crescent croissant, soft rounded buttery curves forming its body, simplified`
- **甜甜圈**：`shaped as a round donut with a soft simple glaze and a few tiny sprinkles`
- **包子**：`shaped as a soft round steamed bun (baozi) with a tiny pinched top`
- **贝果**：`shaped as a small round bagel with a soft hole, simplified`

### 状态（换"神态那一句"，**无手脚版**；都挂 `--sref` + `--oref --ow 50`）
- **迎客 greet**：`leaning forward a little with a warm welcoming smile, a happy gentle bounce, eyes bright`
- **备菜 cook**：`wearing a tiny chef hat, a small lump of dough resting beside it, calm focused expression`（不靠手揉,只是旁边有面团）
- **打盹 doze**：`eyes closed into two tiny curved lines, a tiny sleepy bubble, drowsy and peaceful`
- **回小屋睡 sleep**：`wearing a tiny soft sleeping cap, a small blanket draped over its round body, eyes closed, peaceful`
- **开心 happy**：`eyes curved into joyful crescents, a little hop, a few tiny sparkles around it`

---

## 4. 主场景图（这次最该先做的图）⭐

**目标**：一张"可交互的早点铺室内主界面背景图"——不是宣传插画,是**首页底图**。物件要清晰、彼此不遮挡、留好放热区的位置;**先不放任何角色**(精灵和客人是单独贴纸,代码里叠上去,这样能动、能换)。

### 主场景图 · 终版提示词（白昼中性版，文件名 `cover-shop.png`）
```
a warm cozy interior of a small humble Chinese breakfast shop, drawn as an interactive game main-screen background, fixed front-on slightly high viewpoint, the whole room visible at once. clearly arranged distinct objects, each separated and not overlapping, evenly spaced and easy to recognize: a wooden hanging menu board on the wall, a small worn contacts booklet on the counter, a thick handwritten ledger book on the counter, a tiny cozy little wooden sprite house in a corner, a small wall message board with a few sticky notes, a small retro wooden radio, a stack of round bamboo steamer baskets, a little pot of soy milk with a gentle wisp of steam, a woven basket of fried dough sticks, a simple round wall clock with a plain dial, a small warm table lamp, a little potted plant, a wooden counter across the lower middle, a soft blue-and-white checkered rug on the floor, a window on the wall. calm uncluttered composition, generous spacing, no characters, no people, no animals. hand-drawn crayon and gouache illustration on textured paper, rough soft pencil outline, flat matte coloring, low saturation warm cream palette, childlike naive and cozy, warm brown wooden tones, not realistic, no gradient, no 3D, no render, no glossy, no plastic --ar 2:3 --v 7 --s 50 --sref https://raw.githubusercontent.com/sunnywang666/jinwanzaodian/main/%E6%97%A9%E7%82%B9%E6%95%B4%E4%BD%93%E7%BE%8E%E6%9C%AF%E5%8F%82%E8%80%83%E5%9B%BE.png --no characters, people, fox, animals, crowd, hands, text, words, readable numbers, logo, watermark, 3D, render, glossy, plastic, photorealistic, cluttered, overlapping objects, busy
```

### 时段变体（可选，文件名 `cover-shop-morning.png` / `cover-shop-night.png`）
> 物件布局尽量保持一致,只改窗外天色与灯光。最省事的做法:**先出好白昼版,把它的链接同时当 `--sref`**(锁住同一个房间),再改下面这句光线描述。
- **清晨版**：把 `a window on the wall` 改成 `a window glowing with soft warm sunrise light, golden morning glow filling the room`
- **夜晚打烊版**：改成 `a window showing a deep blue night sky with a moon, the room dim and quiet, only the warm table lamp glowing softly, shutters half down` ;`--no` 里去掉对灯光的压制,保留 `--no characters, text, 3D, glossy`
> 注意:窗外天色若想**在 App 里随真实时间变**,更稳的做法是主图里"窗户"留空/留浅,用代码单独叠一张会变的"天色贴片",而不是出 3 张完整大图。看 demo 排期取舍。

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
- **物件/精灵还带摊位场景** → 确认参考图是 `--sref`(末尾)不是垫图(最前);删掉描述里的 "breakfast shop / stall" 等场景词;加重 `--no scene, stall, building, objects`。
- **主图物件太挤/重叠** → 加 `generous spacing, each object clearly separated, fewer objects`;`--no overlapping objects, cluttered, busy`;或分两次出(墙面物件一版、柜台物件一版)再在代码里拼。
- **主图冒出人物/客人** → `--no characters, people, fox, animals, crowd` 加重;描述里强调 `empty room, no characters`。
- **画风不像参考** → 确认 `--sref` 挂上了;调高 `--sw 150`;调低 `--s`;去掉 `--p`。
- **出 3D/毛绒/光滑** → 没用 `--niji`;`--no 3D, render, glossy, plastic` 保留。
- **形态之间不像同一只** → 加 `--oref <本体链接> --ow 50` 并写死三锚点。
- **图上有乱码文字** → `--no text, words, readable numbers`;菜单板/黑板/时钟都强调 `no readable text / no numbers`。
- **要透明 PNG** → 白底出图 → 抠图工具去白底 → `npm run trim-assets`。
