# 面点精灵 · Midjourney 提示词套组

> 配合《产品概念文档 v5》。精灵设定：**本体是一小团白面**，**一双豆豆眼贯穿始终**，外表是可变的点心形态（白面团 → 小笼包 → 可颂 → 甜甜圈……），萌、软、治愈。
> 画风严格沿用《UI 设计提示词套组》的母风格：**手绘绘本 / 蜡笔水彩 / 铅笔描边 / 奶油暖色低饱和，绝不 3D、绝不光面塑料质感、绝不赛博科技感。**

---

## 0. 怎么用（先读这段）

**① 通用风格后缀（每条提示词都接在末尾，保证全套风格统一）：**

```
cozy whimsical hand-drawn children's storybook illustration, crayon and watercolor texture, soft uneven pencil outline, warm cream paper background with subtle grain, low saturation palette of cream white, soft beige, muted sage green, dusty coral, butter yellow, warm brown, soft charcoal outline, naive cute and gentle, not 3D, not glossy plastic, no cyber tech, no commercial polish, flat illustration --no 3D render, photo, glossy, plastic, neon
```

**② 模型与参数建议：**
- 主推 `--niji 6`（可爱插画、表情到位），想更"蜡笔绘本糙感"就用 `--v 7 --style raw`。两套都出，挑你顺眼的。
- 角色设定图用 `--ar 3:2`；单张立绘/图标用 `--ar 1:1`；场景用 `--ar 4:3`。
- 卡通可爱可加 `--niji 6 --style cute`。

**③ 一致性技巧（最关键，让多个形态"还是同一只"）：**
1. 先用下面第 1 条「角色设定图」跑出一张满意的**本体白面团**，存下它的图片链接。
2. 之后画每个点心形态时，在提示词后加 `--cref <那张图的链接> --cw 60`。`--cref` 锁角色，`--cw` 调一致性强度（60 左右：保留豆豆眼/神态，但允许换成点心外形；调太高它会拒绝变形，调太低又不像同一只）。
3. 想锁画风可再加 `--sref <你满意的任一张图链接>`。
4. **豆豆眼 + 软乎乎的神态**是它的身份锚，每条提示词都写死"two tiny black bean dot eyes, same gentle sleepy expression"，比纯靠 --cref 更稳。

**④ 心理预期：** Midjourney 出的是**概念探索图**，用来定调子、给设计师参考，不能直接当游戏美术素材（风格难 100% 复现、也难做成可换装的规范资产）。定稿还得设计师手绘。

---

## 1. 角色设定图（先跑这张，作为后续 --cref 的锚）

```
character reference sheet of a tiny dough sprite mascot named "面点精灵", a small plump ball of soft white wheat dough, two tiny black bean dot eyes, a tiny content smile, no nose, soft rounded body, turnaround views front and side and back, plus three small expression studies (sleepy, happy, curious), simple and adorable, [通用风格后缀] --ar 3:2 --niji 6 --style cute
```

---

## 2. 本体：一小团白面（开局形态）

```
a tiny adorable dough sprite, a small plump ball of soft raw white wheat dough sitting on a wooden counter, two tiny black bean dot eyes, a faint shy smile, slightly squishy soft body with a little flour dusting, gentle and innocent, the most basic humble starting form, [通用风格后缀] --ar 1:1 --niji 6 --style cute
```

---

## 3. 形态 A：小笼包精灵

```
the same tiny dough sprite now shaped as a cute little soup dumpling (xiaolongbao) with delicate pleats gathered on top like a tiny topknot, still the same two tiny black bean dot eyes and the same gentle sleepy expression, soft steamy warmth, sitting in a small bamboo steamer, plump and cozy, [通用风格后缀] --ar 1:1 --niji 6 --style cute --cref <本体图链接> --cw 60
```

---

## 4. 形态 B：可颂精灵

```
the same tiny dough sprite now shaped as a cute crescent croissant, golden buttery layered curves forming its little body, still the same two tiny black bean dot eyes and the same gentle expression, warm and flaky, content little smile, [通用风格后缀] --ar 1:1 --niji 6 --style cute --cref <本体图链接> --cw 60
```

---

## 5. 形态 C：甜甜圈精灵

```
the same tiny dough sprite now shaped as a cute round donut with a soft pastel glaze and a few tiny sprinkles, the donut hole framing its little face, still the same two tiny black bean dot eyes and the same gentle expression, sweet and round, [通用风格后缀] --ar 1:1 --niji 6 --style cute --cref <本体图链接> --cw 60
```

> 同法可继续扩展：包子、贝果、华夫饼、煎饼、麻薯……每条都保留"same two tiny black bean dot eyes / same gentle expression"+ `--cref --cw 60`。

---

## 6. 表情与姿态表（对应 App 里的时段，P0 必须）

**迎客（清晨开门）**
```
the tiny dough sprite waving hello with a warm welcoming smile, standing on the breakfast shop counter in soft morning light, two tiny black bean dot eyes, cheerful and gentle, [通用风格后缀] --ar 1:1 --niji 6 --style cute --cref <本体图链接> --cw 60
```

**备菜（白天）**
```
the tiny dough sprite happily kneading a small lump of dough on a floury wooden counter, tiny apron, focused content expression, two tiny black bean dot eyes, cozy afternoon, [通用风格后缀] --ar 1:1 --niji 6 --style cute --cref <本体图链接> --cw 60
```

**打盹（午睡点缀）**
```
the tiny dough sprite taking a little nap slumped over the counter, eyes closed into two tiny curved lines, a small sleepy bubble, relaxed and soft, warm afternoon glow, [通用风格后缀] --ar 1:1 --niji 6 --style cute --cref <本体图链接> --cw 60
```

**回小屋睡（夜晚打烊）**
```
the tiny dough sprite tucked into a tiny cozy bed inside a small wooden hut, blanket pulled up, eyes closed, peaceful sleeping face, warm dim lamp, moon and a few stars outside a little window, quiet and tender, [通用风格后缀] --ar 1:1 --niji 6 --style cute --cref <本体图链接> --cw 60
```

---

## 7. 精灵小屋（界面入口素材）

```
a tiny cozy hand-drawn wooden hut for a dough sprite, sitting on the back counter of a warm breakfast shop, a small open doorway, a tiny bed inside, little shelves displaying collected pastry figurines, soft warm lamp light, inviting and adorable, [通用风格后缀] --ar 4:3 --niji 6 --style cute
```

---

## 8. 备忘

- 全套核心身份特征写死三点：**①一小团白面本体 ②一双黑豆豆眼 ③同一种软乎乎的温柔神态**。形态再怎么变，这三点不变，"还是同一只"就立得住。
- 想要"成长线"叙事（白面 → 越来越丰盈的点心），出图时可让本体最朴素、后期形态更精致饱满，按解锁顺序排开看一眼是否有"越来越有样子"的递进感。
- 若 `--niji` 出来太像日系动画、缺蜡笔糙感，改用 `--v 7 --style raw` 并在提示词里加重 `crayon texture, picture book, hand-painted, slightly rough edges`。
