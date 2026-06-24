# 今晚早点 · README / AGENTS

> 一句话：一个温柔的早睡陪伴 App。你经营一家「只在清晨开门」的早点铺，铺子开得好不好取决于你昨晚有没有早睡。
> 核心循环：傍晚预承诺（定关灯时间 + 写下心事）→ 提醒 → 夜晚打烊仪式（关灯、放下手机）→ 清晨回报（精灵迎接、客人来、解锁菜品/皮肤）。
> 详细的逐版本改动见 `CHANGELOG.md`，产品/界面设计见 `docs/`。

---

## 最高优先级规则（美术）

本项目是图片素材驱动的产品，主视觉必须用真实插画，不要临时造美术：

- 不要用 emoji 作为角色。
- 不要用 CSS 画狐狸、小动物、面点精灵。
- 不要用 SVG 简笔画替代角色插画。
- 不要用图标库替代主视觉。
- 所有主要视觉必须来自 `public/assets` 中的 PNG 图片。
- 图片缺失时显示统一缺图占位卡片（显示预期文件名），不要自作主张画临时角色。

## 当前素材

`public/assets/` 下约 37 个 PNG，覆盖：四张天色主场景（scene-morning/day/evening/night）、打烊/备菜场景、7 位客人动物（animal-*）、5 道早点（food-*）、5 种精灵形态（dough-spirit-*）、各类道具与书本封面（asset-*/ui-*）。
角色/道具优先读 `public/assets/trimmed/` 下的裁剪版；`AssetImage` 组件会在裁剪版加载失败时自动回退到原图。
所有 PNG 已做近无损压缩（见「构建/资产」），`public/assets` 体积约 14MB。

## 产品规则

- 用户是早点铺店长；面点精灵是常驻伙伴（不是拟人角色，没有手脚，只是带豆豆眼的小圆面团/点心形态）。
- 小动物是客人，不是伙伴；客人有熟络度（新客→渐熟→常来→熟客），随之解锁「来往」叙事与带来的家乡菜。
- 产品帮助用户放下手机，不是强迫睡觉。永远不惩罚、不说教。
- 晚睡只会让铺子安静一点，不会失败、不会关张。
- 不要金币、货币、赚钱、升级循环。

## 视觉规则

奶油色纸张背景、低饱和暖色、手绘治愈感、暖棕色边框、圆角手帐感。
不要科技感 / 玻璃拟态 / 3D / 高饱和商业 App 风格。

## 技术栈

- React + Vite + TypeScript + Tailwind CSS。
- 持久化用 localStorage，统一存档在 `src/lib/dataStore.ts`（`AppStore`，含向后兼容的 `validateAndRepair`）。**没有自建后端。**
- 精灵对话接**真实 LLM**：用户在设置里填自己的 API key（支持 Anthropic 及 OpenAI 兼容端点，如 DeepSeek），key 存在本地，App 直接 fetch 该端点。见 `src/overlays/SpiritChatOverlay.tsx`、`src/pages/Settings.tsx`。
- 本地提醒：傍晚预承诺 + 夜晚打烊。Web 用前台调度兜底；打包成原生后走 OS 级定时通知（app 关掉也能弹），见 `src/lib/notifications.ts`、`src/lib/nativeNotifications.ts`。
- 原生壳用 **Capacitor**（`android/` 已生成，可打 APK；iOS 需 Mac + Xcode，尚未打包）。
- 演示数据与真实数据分离：客人身份在 `src/lib/guestReferences.ts`，演示进度种子在 `src/lib/demoSeed.ts`，仅 `isDemoMode()`（`src/lib/devMode.ts`）时注入。

## 构建 / 测试 / 资产命令

| 命令 | 用途 |
|---|---|
| `npm run dev` | 本地开发（base `/`，自动开 demo 模式） |
| `npm run build` | GitHub Pages 构建（base `/jinwanzaodian/`）。**注意：这个 base 装进安卓会白屏** |
| `npm run build:app` | 安卓/原生构建（相对 base `./`）。改完代码先跑它过 TS |
| `npm run cap:android` | build:app + `npx cap sync android` |
| `npm test` | vitest 跑纯逻辑单测（`src/lib/*.test.ts`） |
| `npm run compress-assets` | 用 sharp 近无损原地压缩 `public/assets` 的 PNG |
| `npm run prepare-assets` | 同步中文命名素材 + 裁剪透明边 |

每次改完：`npm run build:app` 过 TS + `npm test` 通过，再提交。

## 双版本打包（可同机共存）

一键打两个 APK 到桌面：`powershell -ExecutionPolicy Bypass -File scripts\build-apks.ps1`

- **正式版**：`com.jinwanzaodian.app`「今晚早点」，无演示数据，纯净给真实用户。
- **路演版**：`com.jinwanzaodian.app.demo`「今晚早点·演示」，预填示例数据 + 首次说明弹窗，给路演/截图。

机制：web 侧 `VITE_DEMO=1` 注入演示数据；安卓侧 `gradlew assembleDebug -Pdemo` 加包名后缀 `.demo` 并换应用名。两个包名不同，可同时装在一部手机上。
（脚本是中文文件名，`.ps1` 必须存成 **UTF-8 BOM**，否则 Windows PowerShell 5.1 按 GBK 解析会乱码。）
