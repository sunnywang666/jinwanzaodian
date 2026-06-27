# Changelog

## v6.44

新手店铺导览重做（聚光灯版）+ 导览结尾文案按时段分两套。

- **聚光灯导览**：保留全屏暗蒙版；讲到哪个物件，就在**真实场景模板**上按 `sceneItems` 真实坐标把那个物件**原地重绘高亮**（位置/大小和首页一致、带呼吸光晕），其余压暗。面点精灵浮在屏幕下方中间、带对话气泡讲解；**点屏幕任意处 = 知道了，下一个**（结尾页除外，保留按钮）。精灵那一步不另点亮场景里的旧静态精灵，由浮动的精灵代表。
- **结尾分时段**：当前是清晨（6:00–11:00）→「这会儿铺子正热闹」+ 引导去定关灯、回头开门招呼；否则维持「现在铺子安安静静的，别急」+ 明早开门那套。
- 验证：tsc + 45 单测全过。更新 `package.json` 版本号为 `6.44.0`。

## v6.43

留言板样式 + 精灵客人尺寸适配。

- **精灵客人尺寸**：之前 `guest-spirit-*` 没生成裁剪版，渲染的是 1024 整画布，主体小小一只缩在空白里——和动物客人（已裁剪、占满画框）一比"大小差太多"、还看不清。现跑 `trim-transparent-assets` 补齐裁剪版，`guestSpiritAssets` 改用 `trimmedAsset`，精灵客人在首页/留言板/图鉴都占满画框、清晰且与动物大小相当。
- **留言板头像**：去掉发光阴影，改成沿剪影描的**一圈白边（拼贴风）**。
- 留言板逻辑澄清：每位客人的专属台词对**所有用户**生效（演示只是预置示例进度），新用户的板子从真实来访自然长出。
- 验证：tsc + 45 单测全过。更新 `package.json` 版本号为 `6.43.0`。

## v6.42

交作业前的 7 处修复（钟/新手测试/收音机/对话页/留言板/字体/图鉴确认页）。

- **挂钟**：改为在固定高宽比舞台内可调（调试模式拖动移位 + ＋/− 改大小，左下读数 + 复位），数值存 localStorage。默认坐标定为 L45.1/T13.8/W12.7（盖住背景墙上画的钟）；表盘底色改为**不透明**并加边，彻底遮住背景钟的指针，消除重影。
- **新手熬夜测试**：①答题后聊天**自动滚到底**；②本步固定一屏高（`h-[100dvh]`），聊天区内部滚动，**所有选项常驻底部全部可见**（之前 `OnboardingFrame` 用 `min-h-screen` 导致最后一个选项被挤出屏幕）。
- **收音机**：4 个白噪音频道（雨声/微风/咖啡馆/壁炉）从"首字圆圈"换成**真正的小图标**。
- **精灵对话页**：删掉顶部那个与消息头像重复的大精灵；每条精灵消息头像在最左（微信式）。
- **留言板重做**：每位客人一句**专属台词（按性格写死、互不相同，并随熟络度从生面孔切到熟客那句）**，不再套同一句模板；用**客人头像**取代名字；时间改为「今天/昨天/具体 M月D日」。演示进度的上次来访日期也错开。明确定位=铺子小黑板/熟客留言墙。
- **字体**：把 **华文宋体裁成 GB2312 子集（2.68MB）打进包**，设为正文首选衬线字体，手机不再回退黑体，和浏览器一致显示宋体。新增 `scripts`/裁剪流程。
- **图鉴打开确认页**：标题 `whitespace-nowrap` + 字号自适应，**一行显示不折行**（客人 / 菜品两页）。
- 验证：tsc + 45 单测全过。更新 `package.json` 版本号为 `6.42.0`。

## v6.41

精灵「身体+表情」合成系统接线 + 新增精灵客人 + 小组件跟随皮肤 + 清晨开门按时辰分流。

**精灵「身体+表情」合成系统**
- 全部场景的精灵从旧单图改用 `SpiritSprite`：身体（`spirit-body-*`）+ 表情（`spirit-face-*`）两层叠加，同 1024 画布天然对齐，共同包围盒裁到 748×487。覆盖首页活精灵/静态精灵、清晨开门各拍 + 午间过场、夜晚打烊、精灵小屋、精灵对话头像、Onboarding（转盘/问答/结果/命名）、新手引导。表情按时段：夜晚/打烊 `sleepy`，其余 `normal`。
- 资产管线：`sync-assets.mjs` 映射新身体/表情/精灵客人图；新脚本 `trim-spirit-composite.mjs` 按共同包围盒统一裁剪身体+表情，裁完仍对齐又瘦身。

**新增精灵客人（"添加"进现有动物客人系统，机制不变）**
- 7 位动物客人之外新增 4 位精灵客人（云絮 / 晚棠 / 盈月 / 归迟，名字为占位）。沿用同一套作息 roll / 熟络度 / 「来往」四拍故事 / 演示进度。
- `GuestKey` 类型放宽，成套精灵用 `spiritFamily{系列号}_{成员号}`——"系列"只指美术成套（同款不同色），各成员剧情独立、互不相关。

**桌面小组件跟随皮肤**
- 组件里的精灵随当前皮肤变化（此前是固定图）。新脚本 `build-widget-skins.mjs` 把各皮肤「身体+普通表情」合成为安卓 drawable；`ZaodianWidgetProvider` 按皮肤 key 选图、无图回退白面团；React 侧把关灯时间 + 皮肤一起同步给组件。

**清晨开门按时辰分流**
- 修复"注册当天清晨进店没触发开门仪式、铺子一个客人都没有"：注册完成不再把"上次开门"锁成今天。
- 落到首页按时辰分流：清晨（6:00–11:00）且今天还没开门 → 开门仪式 + 客人到来（落首页即时判断一次，不等 60s 轮询）；下午/晚上不强行开门，按时辰走备菜/打烊场景（`timeScene.ts` 加 `isMorningOpenTime`）。

**其它**
- 客人图鉴恢复到原样（撤销之前未落地的单页/翻页改动）。
- 验证：tsc + 45 单测全过。
- 更新 `package.json` 版本号为 `6.41.0`。

## v6.40

删除重复背景图，给 APK 瘦身约 1.9MB。

- `public/assets` 里 `shop-*` 三张背景与 `scene-*` 经 MD5 确认**完全重复**，且运行程序只用 `scene-*`。删 `shop-main-background.png`(=scene-day) / `shop-evening-prepare.png`(=scene-evening) / `shop-night-close.png`(=scene-night)。
- `sync-assets.mjs`：主背景源图『暂定主页面背景图』的同步目标，由废弃的 `shop-main-background.png` 改为现役 `scene-day.png`。
- `trim-transparent-assets.mjs`：`skipFiles` 改为保护现役 `scene-*` 四张 + `cover-*` 两张（满铺背景不裁透明边），移除已删的 `shop-main-background.png`。
- 程序实际使用的背景未变：`scene-morning/day/evening/night` + `cover-shop`/`cover-shop-transparent`。（注：早晨 `scene-morning` 本就没有 shop- 旧名重复。）
- 更新 `package.json` 版本号为 `6.40.0`。

## v6.39

D. 删除死代码（已与用户逐一核对：均为被现役 `*Overlay`/组件取代的早期原型，本就没打进包）。

- 删 9 个孤儿文件：`pages/{Menu,Logbook,SpiritHut,SpiritChatPage,DemoMode}`、`overlays/RadioChatOverlay`、`components/{DemoControls,SceneHotspot}`、`lib/hotspots`。
- 删 `demoData` 死导出：`personaCopy`、`sceneCopy`、`demoSceneOptions`、`initialChatMessages`、`quickReplies`、`messageBoardNotes`、`morningGreetings`、`middayTransitionCopy`(+`MiddayTransitionCopyEntry`)，及随之失效的 `owlType` 常量、`DemoScene` 导入。
- 删统一存档前遗留、零调用的函数：`spiritProgression` 的 `getFormMilestoneHint`/`load·save·clearSpiritProgress`（+`ALL_BODIES`/`STORAGE_KEY`/`DEFAULT_STATE`）、`dishProgression` 的 `load·save·clearDishProgress`（+`STORAGE_KEY`）。
- 保留：`ChatMessage` 接口、`getFamiliarityLabel` 等仍在用的导出。
- 验证：45 单测 + tsc + 构建全过；体积略减。
- 更新 `package.json` 版本号为 `6.39.0`。

## v6.38

通读修复一批（A 真 bug + B 英文露中文 + C 健壮性）。

**A. 真 bug**
- 清晨睡眠小结加"昨晚确实打烊"判断，不再把几天前那晚的休息数据当昨晚显示（`App.tsx`）。
- 修设置错字"焦进"→"嵌进"。
- 新皮肤（甜甜圈/包子/华夫饼/麻糬）改为目录 + `comingSoon` 机制：图未到位前停在"待上新"剪影、不解锁、不可选、不庆祝，杜绝长期用户解锁后主场景破图；补图后把 `comingSoon` 改 `false` 即全链路生效（`spiritProgression`）。这也顺带消除了清晨"解锁皮肤"庆祝的 off-by-one。
- 删掉从未被写入的 `'未打烊'` 死判定（trend/spirit/dish 三处），与"不惩罚"一致。

**B. 英文模式露中文（切英文才可见；UI 文案已扫干净）**
- 所有浮层关闭键、重新开门确认、翻页键、账本（状态/日期按语言）、午间过场、收音机整页 + 频道名 + 定时、首页迷你播放器。
- 精灵对话全双语：英文模式下系统提示让 AI 用英文回复，开场白/快捷回复/兜底语同步。
- 注：客人/菜品的**身份数据**（名字/描述/爱吃）仍为中文且全 App 一致，属整套数据本地化的大工程，不在本次范围。

**C. 健壮性**
- 演示态与真实态分用不同存储键，避免同浏览器 demo→正式 切换时演示数据被当真实数据继承（`dataStore`）。
- `resetAll` 在演示版下重新派生客人/累计早睡种子，重置后状态自洽。
- `validateAndRepair` 兜底极旧存档可能缺的 `today` 字段（防 `scene=undefined` 取图报错）。
- App 整夜常驻、跨零点停在首页时自动进开门仪式。
- 修正 `dataStore` 注释里过时的 key 名。

- 更新 `package.json` 版本号为 `6.38.0`。
- 待办：精灵"表情+身体"分层、客人/菜品英文数据、死代码删除（D，删文件被安全策略拦在等确认）。

## v6.37

四项打磨：演示数据有进度 + 小屋/成就视觉 + onboarding 跳过(演示) + 主流程小修。

Included in this version:
- **演示版进度有数据**：示例 7 晚标记 `isRealData`，累计早睡=7，成就（第一个好觉/攒够一周）点亮、新皮肤显示"再早睡 3 晚解锁甜甜圈"——路演时小屋/成就是活的。App 在演示且无存档时从这 7 晚推导累计早睡，与日后 morning/closing 重算口径一致；连带让演示版菜品更全、留言板多一条"开了一周"。
- **小屋/成就视觉**：头部显示当前皮肤名；皮肤陈列加陈列架质感（暖木底 + 陈列台投影）；成就页加总进度条 + 按"早睡之路/铺子收集/安睡"分组。
- **Onboarding 一键跳过（仅演示版）**：右上角"跳过"用当前/默认值直接进店，省去路演反复走开场；真实用户仍走完整人格化流程。
- **主流程小修**：`EveningPrepare` 保存后再编辑会复位"已保存"状态（按钮/提示不再卡住）；App 的演示示例数据改用 `useMemo` 只算一次（避免每次渲染重复构造）。
- 更新 `package.json` 版本号为 `6.37.0`。

## v6.36

换装真正生效：选的皮肤会显示在主场景（不再永远是白面团）。

Included in this version:
- 之前在小屋换皮肤后，首页/清晨/打烊/对话/静态精灵热点里精灵仍写死显示白面团（base），换装看不出来。现把当前形态 `spiritForm` 一路传下去：
  - `ShopGuests`（首页活精灵）、`ShopSceneInteractive`（静态精灵热点）、`MorningOpening`/`MiddayTransition`（清晨/午间仪式）、`NightClosing`（打烊）、`SpiritChatOverlay`（对话头像）全部改用 `spiritAssets[spiritForm]`。
- 只用现有 4 张身体图（白面团/小笼包/贝果/可颂），无需新图；锁定的新形态选不了，不会出现缺图。
- 时段表情（迎客/打盹/睡）仍待新图——到位后在此基础上叠加"身体 × 表情"。
- 更新 `package.json` 版本号为 `6.36.0`。

## v6.35

精灵小屋重做 + 成就系统 + 靠早睡解锁的新皮肤（框架，待补图）。

Included in this version:
- 精灵小屋（`SpiritHutOverlay`）重做成两个 tab：
  - **换装/陈列**：成长线上所有形态的网格陈列，已解锁可切换，未解锁显示剪影 + "再早睡 X 晚"。
  - **成就**：从已有数据纯计算的里程碑（`achievements.ts` + 单测），已点亮高亮、未点亮显示进度条。
- 新增靠"累计熄屏早睡"解锁的点心形态：甜甜圈@10、包子@25、华夫饼@60、麻糬@120（文档铁律：只累计、断了不清零、长而稀有）。`SpiritForm` 扩展 baozi/waffle/mochi，donut 归位为甜甜圈。图待补（未解锁显示剪影，不加载缺失文件）。
- 清晨开门"解锁新形态 / 差 X 晚"庆祝接回（由 `EARNED_SKINS` 单一数据源驱动，阈值不再多处写）。
- 成就涵盖：早睡阶梯(1/7/30/100)、认识客人、学会菜品、集齐形态、睡满 8 小时、23:00 前放下手机；数据复用睡眠洞察(v6.33)那套。
- 成就入口放进精灵小屋（守"不另造铺子物件"）。
- **待补图**（用户提供后按文件名自动点亮）：`dough-spirit-bagel-normal.png`(正常脸贝果)、`dough-spirit-donut/baozi/waffle/mochi.png`(新形态)、各身体的表情/时段姿态(迎客/打盹/睡)。
- 更新 `package.json` 版本号为 `6.35.0`。

## v6.34

精灵相关修复：新手导览跳过键失灵、贝果/可颂被锁、贝果可颂图贴反。

Included in this version:
- 修复 `GuideTour` 跳过键点了没反应：它是 `z-10`，被同为 `z-10`、DOM 里靠后的居中内容容器盖住（手机宽屏下容器铺满整屏吃掉点击）。把跳过键提到 `z-30`。
- 解锁贝果与可颂：onboarding 本就让用户在 白面团/小笼包/贝果/可颂 里自由选身体，但 `spiritProgression` 却把可颂(5晚)/贝果(10晚)/迷糊(15晚)设成里程碑解锁，自相矛盾。现这四个身体都是可自由选择的外观，默认全解锁（`dataStore`/`spiritProgression` 含老存档回填），不再靠早睡解锁；清晨回报相应去掉"解锁新皮肤"分支（待将来有"靠早睡解锁的新皮肤"时再接回）。
- 修正精灵图映射：文件名贴反了——`dough-spirit-bagel.png` 画的其实是【可颂】，`dough-spirit-confused-bagel.png` 才是【贝果】。`assets.ts` 按语义重映射（croissant→可颂图，bagel→贝果图），onboarding 与小屋里贝果/可颂不再是同一张。贝果暂用迷糊脸版，待补正常脸贝果图。
- 统一精灵命名：小屋 `spiritOptions` 改为与 onboarding 一致的四个身体（去掉与"贝果"重复的旧 `donut`）。
- 更新 `package.json` 版本号为 `6.34.0`。
- 注：精灵"表情+身体"分层、靠早睡解锁的新皮肤、成就界面 仍待开发（需补素材）。

## v6.33

睡眠检测与分析升级：真正用上"放下手机的时间"，而不只是"点打烊的时间"。

Included in this version:
- 新增 `src/lib/sleepAnalysis.ts`（纯函数 + 单测）：从已经在记的 `screenOffTimestamp`（打烊后真正放下手机的时刻）、`realOpenTimestamp`（早上开门）与新增的 `nightWakes`（夜里又把 App 唤到前台的次数）算出——真正放下手机的时间、休息时长、打烊后磨蹭多久才放下、入睡规律性、休息/入睡的近期趋势，以及据此的温柔预警。
- `src/lib/visibility.ts` 新增 `countNightReturns()`：从可见性日志数"打烊后到次日开门间，App 回前台几次"。诚实局限：只能抓到"重新打开本 App"，抓不到"切去刷别的 App"——是诚实的近似，不是睡眠监测。
- 清晨开门（`MorningOpening`）Beat 1 加一行"昨晚你 X 点放下手机，休息了约 Y"（磨蹭久/夜里醒了会温柔补一句）；状态变差时新增一屏精灵口吻的温柔预警（休息太短/越睡越晚/夜里总醒/打烊后还刷很久），绝不指责。
- 账本"趋势" tab（`LogbookTrend`）加详细"睡眠洞察"卡：平均放下手机、平均休息、入睡规律 ±X 分、夜里拿手机次数 + 近期趋势 + "只用前台信号估算，不监测睡眠"的声明。
- 设置加"睡眠洞察"总开关（`settings.sleepInsights`，默认开）。关掉就回到只看关灯时间——本身契合"不监工"，焦虑型用户可关。
- 铺子心情/场景的核心评分（`trendCalculation`）仍用关灯时间，未改动核心机制。
- 演示数据 `createDefaultLogEntries()` 补了 realClose/screenOff/realOpen 时间戳与 nightWakes，路演版才看得到睡眠分析。
- `LogEntry` 新增 `nightWakes` 字段；`dataStore` 设置新增 `sleepInsights`（含向后兼容回填，默认开）。
- 更新 `package.json` 版本号为 `6.33.0`。

## v6.32

In-place app updates (no uninstall) + the in-app version stays in sync.

Included in this version:
- `android/app/build.gradle`: `versionCode`/`versionName` now derive from `package.json` (e.g. 6.32.0 → versionCode 63200) instead of a fixed `1`. So a new APK installs as an update over the old one — no need to uninstall first (same signing key required, which all local builds share).
- The Settings "About" version is no longer hardcoded (was stuck at v6.7). `vite.config.ts` injects the real `package.json` version as `__APP_VERSION__`; `Settings` renders it (`settings.about.version` → `「今晚早点」v{v}`), so it always shows the current version.
- Updated `package.json` version metadata to `6.32.0`.

## v6.31

App icon: the dough spirit, replacing the default Capacitor logo.

Included in this version:
- New Android launcher icon — the 面点精灵 (white dough spirit) on a warm tan (`#D4A574`) background so it reads clearly at small sizes. Replaces the default blue Capacitor "X".
- Generated all densities (mdpi→xxxhdpi) for `ic_launcher` (square), `ic_launcher_round` (circle), and `ic_launcher_foreground` (adaptive), via the project's own `sharp`; adaptive background color set in `ic_launcher_background.xml`. (`@capacitor/assets` couldn't install — its bundled sharp hit a TLS error — so the icons are generated by `scripts/make-icon.mjs` + `scripts/make-android-icons.mjs`.)
- Verified on emulator: the launcher icon is now the spirit.
- Updated `package.json` version metadata to `6.31.0`.

## v6.30

Spirit chat calls its own backend, not the test project's.

Included in this version:
- `getChatApiUrl()` no longer hardcodes the test deployment (`jinwanzaodian-test.vercel.app/api/chat`). It now: (1) honors a user-set custom URL, (2) on a real web origin (e.g. the project's own Vercel deployment) calls **same-origin `/api/chat`** so it hits this project's own `api/chat.js` backend, (3) falls back to `OWN_BACKEND` for the APK / GitHub Pages (no same-origin backend).
- Removes the dependency on the separate test deployment for live AI chat.
- `OWN_BACKEND` is the project's real Vercel deployment (`jinwanzaodian-mk8xhm66e-sunny-happy-projects.vercel.app`, recovered from the v6.0.1 commit). The hardcoded `*-test.vercel.app` was a regression an earlier full-file patch overwrote in; this restores the project's own backend.
- Updated `package.json` version metadata to `6.30.0`.

## v6.29

Android home-screen widget (MVP) — the spirit + tonight's lights-off, on your home screen.

Included in this version:
- Added a native Android app widget (`ZaodianWidgetProvider` + `res/layout/widget_zaodian.xml` + `res/xml/zaodian_widget_info.xml` + a cream rounded background and the dough-spirit image): shows the spirit and a time-aware line centered on tonight's commitment — "今晚 23:00 关灯" through the day, "早呀，铺子开门了" in the morning, "打烊了，放下手机，明早见" after close. Tap opens the app.
- Added a tiny custom Capacitor plugin `ZaodianWidget` (registered in `MainActivity`) so the React app writes the lights-off time into native SharedPreferences and refreshes the widget; `src/lib/widget.ts` wraps it and `App` calls it whenever `eveningPrepare.plannedLightsOffTime` changes. Snapshot architecture (widget self-refreshes ~30min, opening the app syncs immediately) — the same approach Finch uses.
- Android only for now (iOS widgets are a separate WidgetKit build, needs a Mac). Verified on emulator: provider registered, appears in the widget picker, preview renders.
- To use it: long-press the home screen → Widgets → 今晚早点 → drag onto home.
- Updated `package.json` version metadata to `6.29.0`.

## v6.28

A small "overnight" surprise in the morning open — a daily reason to come back.

Included in this version:
- `MorningOpening` Beat 1 now shows a short "while the shop slept…" vignette below the greeting — a gentle overnight happening (Ginger left a note, the spirit dreamed of a new treat, a little rain, a sprouting bud, a napping cat…). One of 8, chosen by the date so it's stable through the day and different each day.
- Pure ambience: no mechanics, no reward, nothing to grind — just the variable-reward "what happened overnight?" delight that drives daily opens in Pokémon Sleep / Finch, done the cozy way.
- Updated `package.json` version metadata to `6.28.0`.

## v6.27

The evening spirit now offers a concrete, per-persona method — not just company.

Included in this version:
- `EveningPrepare`'s spirit line is now `evening.method.{revenge|inertia|anxiety|work|owl|unsure}` (zh/en) instead of one generic reply. Each is a warm, evidence-informed one-liner adapted from the project's own earlier intervention work: anxiety → brain-dump into the worry box; work → "does it really have to be tonight? jot a morning list"; revenge → 15 min of something you truly enjoy instead of scrolling; inertia → "three more then stop"; owl → a steady lights-off rather than forced-early.
- Lands in the evening window (when the user is rational), per v5's deliberate "no 1am intervention" stance. No chat engine, no crisis detection.
- Updated `package.json` version metadata to `6.27.0`.

## v6.26

Give the logbook's spirit commentary a by-weekday observation.

Included in this version:
- `LogbookTrend.getCommentary` replaces a dead day-grouping block (which used the "月日" string and had no weekday info) with real weekday analysis derived from `realCloseTimestamp`. When one weekday is consistently >35min later than the overall average (≥2 samples), the spirit gently asks "you tend to close later on Wednesdays — anything regular happening then?" — the warm shopkeeper read v5 described.
- No store schema change (reuses existing `realCloseTimestamp`).
- Updated `package.json` version metadata to `6.26.0`.

## v6.25

Polish the home shop scene (ShopGuests).

Included in this version:
- Guest profile card: long `favoriteFood` text now truncates instead of stretching the card; raised the card overlay z-index (32→50) so nothing overlaps it.
- Thought-bubble emoji offset nudged so it's less likely to clip at the top on small screens.
- Extracted the serve-and-greet animation timing into a named `ARRIVAL` constant (same timing, clearer to tune). Seat coordinates left as-is — the scene's locked aspect ratio keeps them on the art.
- Updated `package.json` version metadata to `6.25.0`.

## v6.24

Small polish across the morning ceremony, onboarding, and guided tour.

Included in this version:
- `MorningOpening` worry-review: the two choices (let go / still on my mind) now have distinct gentle colors so they're not mis-tapped — different hues, neither framed as the "right" answer.
- `Onboarding` naming step shows a soft hint ("give it a name first to continue") when the name is empty, so the disabled button isn't a dead end.
- `GuideTour` progress dots are a little more visible (ink/15→25).
- Updated `package.json` version metadata to `6.24.0`.

## v6.23

Polish the night-closing ritual.

Included in this version:
- `NightClosing` step list: future steps are a touch more visible (opacity 15→25), completed steps keep their ✓ + strikethrough, and non-current steps get `cursor-default` so they read as not-tappable.
- The completion screen now scrolls safely on short screens (`overflow-y-auto` + padding) instead of risking clipped text.
- Animations (lamp-off, spirit float, moonrise, zz, breathe) respect `prefers-reduced-motion`.
- Updated `package.json` version metadata to `6.23.0`.

## v6.22

Deepen the evening pre-commitment (the product's core window).

Included in this version:
- `EveningPrepare` now personalizes the spirit's opening line by night-type (`evening.ask.{revenge|inertia|anxiety|work|owl|unsure}` in `zh.ts`/`en.ts`), instead of the same "Ginger is coming for youtiao" for everyone. Closes the biggest design-vs-implementation gap (the persona was wired everywhere except this window). `App` passes `profile.nightType`.
- The worry textarea gets a `{n}/500` character counter, a 500-char cap, and a warmer placeholder; input now silently auto-saves a draft ~0.7s after you stop typing, so closing the screen no longer loses what you wrote.
- The selected lights-off time is more clearly highlighted; save shows a clearer confirmation.
- Updated `package.json` version metadata to `6.22.0`.

## v6.21

Conservative App.tsx refactor — extract routing decision and persistence, behavior unchanged.

Included in this version:
- Added `src/lib/appView.ts`: moved the `AppView` type out of `App.tsx` and added `resolveInitialView()` — a pure function for the startup view decision (new-day ceremony > reminder deep-link > home). Covered by `appView.test.ts`.
- Added `src/hooks/usePersistStore.ts`: the centralized "assemble all state into an AppStore and save" effect, typed via `AppStore` indexed types so tsc enforces the store shape. `App.tsx` now calls `usePersistStore({...})` instead of the inline effect.
- Net: `App.tsx` is smaller and the two most bug-prone seams (initial routing, persistence) are isolated and (for routing) unit-tested. No behavior change — same branches, same store assembly, same effect deps.
- 25 tests passing across 5 files.
- Updated `package.json` version metadata to `6.21.0`.

## v6.20

Add a test harness and unit tests for the bug-prone pure logic.

Included in this version:
- Added vitest (`npm test` → `vitest run`); `vite.config.ts` gains a `test` block (node env, `src/**/*.test.ts`).
- `guestProgression.test.ts`: familiarity thresholds (0/3/6/10), `recordDailyVisits` increment + consistency + no-mutation.
- `dishProgression.test.ts`: default unlock, milestone (youtiao @ 3 good nights), guest unlock (fox @ familiarity 3), no re-unlock, no-mutation.
- `timeScene.test.ts`: scene-by-time windows + evening boundary + closed/night, driven via the time simulator.
- `dataStore.test.ts`: `validateAndRepair` backfills (homeGuestKeys, eveningPrepare, reminders, tourDone-from-profile) and array/spirit-form repair. Exported `validateAndRepair` for testing.
- 22 tests passing across 4 files.
- Updated `package.json` version metadata to `6.20.0`.

## v6.19

Persist today's guests so they survive a mid-day reload.

Included in this version:
- Added `today.homeGuestKeys: string[]` to the store schema (`dataStore.ts`): `createDefaultStore` defaults it to `[]`, `validateAndRepair` backfills it for old saves, and `migrateFromScatteredKeys` includes it.
- `App.tsx` now initializes `homeGuestKeys` from the store, writes it in the centralized persistence effect, and lists it as a dependency.
- Fixes the morning guests and the midday-transition avatar row disappearing when the app is reloaded part-way through the day (they were previously in-memory only). A new day still resets them via the opening ceremony.
- Updated `package.json` version metadata to `6.19.0`.

## v6.18

Two coexisting builds: a clean app for real users and a demo app for showcases.

Included in this version:
- Added `src/components/DemoNotice.tsx`: a one-time first-launch modal shown only in demo mode (`isDemoMode()`), explaining the data is pre-filled sample data. Remembered per device via localStorage. Mounted on both the onboarding screen and the main shell so it shows on the very first launch.
- Android: `android/app/build.gradle` adds `applicationIdSuffix ".demo"` and a different app label when built with `-Pdemo`, and `AndroidManifest.xml` uses `${appLabel}`. So the demo build installs as `com.jinwanzaodian.app.demo` / 「今晚早点·演示」 alongside the regular `com.jinwanzaodian.app` / 「今晚早点」 — both can live on one phone.
- Added `scripts/build-apks.ps1`: one command builds both APKs to the desktop — regular (no demo data) and demo (sample data via `VITE_DEMO=1` + `-Pdemo`).
- Verified on emulator: both packages coexist; demo shows the notice + sample data; the clean build shows no notice and starts empty.
- Updated `package.json` version metadata to `6.18.0`.

## v6.17

Split guest data into permanent identity vs demo-only progress — root-fixes the recurring fake-data leak.

Included in this version:
- Added `src/lib/guestReferences.ts`: `GuestReference` (key/name/image/description/favoriteFood) + `guestReferences` — pure identity, true for every user.
- Added `src/lib/demoSeed.ts`: `injectDemoGuestSeeds(progress)` writes demo visit counts into `guestProgress` only when `isDemoMode()`; real builds stay empty (new guests = 0 visits / 新客).
- Removed `GuestEntry` and the `guests` array (with `visitCount`/`familiarity`/`status`/`story`) from `src/lib/demoData.ts`; the progress fields can no longer leak to real users.
- Updated live consumers (`App.tsx`, `ShopGuests.tsx`, `GuestBookOpenView.tsx`, `MessageBoardOverlay.tsx`, `MorningOpening.tsx`) to read identity from `guestReferences` and progress from `guestProgress`. `App` seeds demo progress on init.
- Deduped `FAMILIARITY_LABELS`: `ShopGuests` now uses the single source `getFamiliarityLabel()` in `guestProgression.ts`.
- Deleted dead, unreachable components that displayed raw demo values: `GuestBookOverlay`, `GuestDetailOverlay`, `GuestDetail`, `GuestBook`.
- Updated `package.json` version metadata to `6.17.0`.

## v6.16

Near-lossless image compression — shrinks the asset payload by ~75%.

Included in this version:
- Added `scripts/compress-assets.mjs` (npm script `compress-assets`): in-place PNG compression of everything under `public/assets/` (incl. `trimmed/`) via sharp palette quantization (`palette: true, quality: 80`). Filenames/paths unchanged, so no source references needed touching.
- Recompressed all assets: total `public/assets` ~56.5MB -> ~14.2MB (-75%). Scene backgrounds ~2.5-2.9MB -> ~0.6-0.8MB each; food/UI art similarly. Watercolor art verified visually with no noticeable quality loss.
- Updated `package.json` version metadata to `6.16.0`.

## v6.15

Wire the morning guests into the midday transition (completes the v6.13 follow-up TODO).

Included in this version:
- `MiddayTransition` now takes a `guestKeys` prop and renders a row of this morning's guest avatars above the body copy, instead of only a count. Falls back to count-only when no keys are available.
- `App.tsx` passes the persisted `homeGuestKeys` to `MiddayTransition`.
- Added a self-contained `guestAppear` keyframe inside `MiddayTransition` (it renders independently of `MorningOpening`, which owns the original keyframe).
- Updated `package.json` version metadata to `6.15.0`.

## v6.14

Fixes for the living-home (v6.13) feature found in review.

Included in this version:
- Fixed a duplicate spirit on the home screen: the static `spirit` scene-item hotspot and the new `ShopGuests` live spirit both rendered, showing two spirits in the morning. `ShopSceneInteractive` now hides the static `spirit` hotspot when guests are shown (morning); day/evening/night still keep the tappable spirit hotspot.
- Fixed the guest profile card showing fake demo data: `ShopGuests` accepted a `guestProgress` prop but nothing passed it, so tapping a guest fell back to demo values (e.g. a brand-new user seeing "阿橘 visited 9 times / regular"). Wired real `guestProgress` through `App → Home → ShopSceneInteractive → ShopGuests` so the card shows true visit count and familiarity, falling back to defaults only when a guest has no record.
- Updated `package.json` version metadata to `6.14.0`.

## v6.13

Living home: guests inhabit the scene, a serve-and-greet open animation, tappable guests, and four time-of-day backgrounds.

Included in this version:
- Added `src/components/ShopGuests.tsx`: a live guest layer in the shop — seated guests with breathing + occasional side shuffle, the "serve and greet" open animation (lights up → guests walk in staggered with thought bubbles → spirit brings real dishes), tap a guest for a profile card, tap the spirit to open chat.
- Added four scene backgrounds (`scene-morning/day/evening/night.png`) and pointed `src/lib/assets.ts` at them, replacing the shop-busy-morning etc. images that were missing from the repo.
- Updated `src/components/ShopSceneInteractive.tsx` to render `<ShopGuests>` inside the scaled scene container; guests only show in the morning scene (day/evening/night stay naturally quiet).
- Updated `src/pages/Home.tsx` and `src/App.tsx` to thread today's guests to the home screen and play the walk-in once when the ceremony ends; tapping the spirit opens spirit chat; reset clears the state.
- Updated `src/pages/MorningOpening.tsx`: Beat 4 drops the static guest-preview icon row (avoids double-spoiling the walk-in) in favor of a one-line count + push-the-door-in.
- Updated `package.json` version metadata to `6.13.0`.
- Next (not in this patch): wire the "who came this morning" icon row into `MiddayTransition` (needs `todayGuestKeys` passed in); seat coordinates may need a couple of percent of fine-tuning on real devices.

## v6.12

New-user pass: fix fake data in the guest book, add a first-run guided tour, and persist a tour flag.

Included in this version:
- Fixed a real bug in `src/views/GuestBookOpenView.tsx`: guests who had never visited were falling back to demo values (e.g. "阿橘 visited 9 times / regular" with a full story). Now a never-visited guest shows a blurred silhouette + "？？？" + "还没来过你的铺子"; real data only appears once they've actually visited.
- Added `src/pages/GuideTour.tsx`: a first-run store tour — spirit welcome → introduces recipe book / guest book / logbook / blackboard / hut (thumbnail + description + location) → a cold-start retention closing beat.
- Updated `src/lib/dataStore.ts` with a `settings.tourDone` flag so the tour runs only once; existing users (already have a profile) auto-skip. Also fixed the missing `tourDone` on the legacy-settings backfill path so the build type-checks.
- Updated `src/App.tsx` to wire the tour after onboarding, gated on `settings.tourDone`.
- Note: the "no onboarding shown" report was stale WebView localStorage surviving reinstalls, not a code bug. To see a true first run, clear app data (`adb shell pm clear com.jinwanzaodian.app` / reinstall / Settings → reset shop). New users still start with 2 signature dishes (包子 + 豆浆) by design.
- Updated `package.json` version metadata to `6.12.0`.

## v6.11

Native shell patch: Capacitor wrapper + OS-level local notifications (resolves the P0.5 gap — reminders fire even when the app is fully closed).

Included in this version:
- Added `capacitor.config.ts` (appId / appName / `webDir: 'dist'` / theme color / LocalNotifications plugin).
- Added `src/lib/nativeNotifications.ts`: native notification module — permission requests, daily-repeating OS-scheduled notifications rebuilt from settings, and deep-link routing on notification tap (`extra.url`).
- Updated `src/App.tsx` so reminders branch by platform: native uses `syncNativeReminders()` (OS scheduling), web keeps the foreground scheduler as a fallback; added a native notification-tap listener.
- Updated `src/pages/Settings.tsx` so "enable notifications" requests native permission on native platforms, with permission state adapting to native/web.
- Added Capacitor deps (`@capacitor/core`, `@capacitor/local-notifications`, `@capacitor/ios`, `@capacitor/android`, dev `@capacitor/cli`). Same copy and settings as the web version; only the trigger upgrades from foreground polling to OS scheduling. On web, `isNativePlatform()` is false so native calls are skipped.
- Updated `package.json` version metadata to `6.11.0`.
- Note: building/signing/shipping the native apps must be done locally (Mac + Xcode / Android Studio + developer account) via `npx cap add ios|android`, `npx cap sync`, `npx cap open`. The `ios/`/`android/` native projects are not committed here.

## v6.10

P2 patch: surface the "a regular teaches you a dish" hidden thread during the morning opening ceremony.

Included in this version:
- The dish-unlock was previously silent — `App.tsx` discarded `evaluateDishUnlocks`'s `newUnlocks` and dishes just quietly appeared in the recipe book. This version makes it a felt beat in the morning opening.
- Updated `src/lib/dishProgression.ts` to export `getDishUnlockSource(key)`, attributing a newly unlocked dish to the regular who taught it (or to milestone R&D).
- Updated `src/pages/MorningOpening.tsx` with a new "new recipe" beat: dish illustration + "{guest} taught you to make {dish}", with a pipeline-style rhythm (greet → (reward) → (new recipe) → (thoughts) → open), showing "and N more" when several unlock.
- Updated `src/App.tsx` to pre-compute today's visits and dish unlocks before rendering the ceremony and pass the attributed unlocks in; `onComplete` still commits via the original logic using the same `todayGuestKeys`, so display and persistence agree and nothing double-fires.
- Updated `package.json` version metadata to `6.10.0`.

## v6.9

P1 patch: split demo vs. real data, and hide debug entry points from real users.

Included in this version:
- Added `src/lib/devMode.ts` with a single `isDemoMode()` switch controlling fake data + debug entry points. Resolution order: `?demo=1/0` → localStorage → `npm run dev` (DEV) → build-injected `VITE_DEMO=1`.
- Updated `src/App.tsx` so new/reset users start with an empty logbook; fake data is only injected in demo mode; the home "reset" button only shows in demo mode (real users reset via Settings).
- Updated `src/pages/Home.tsx` so the home DEBUG (time simulation) only shows in demo mode.
- Updated `src/overlays/LogbookOverlay.tsx` with a friendly empty state and fixed the `1 / 0` pager indicator on an empty logbook.
- Net effect: `npm run build` deploy = clean real app (empty logbook, no debug); `npm run dev` or `?demo=1` = full demo state for showcases. Trend/opening logic is already safe on empty arrays.
- Updated `package.json` version metadata to `6.9.0`.

## v6.8

P0 patch: local notifications, installable PWA shell, and reminder settings — the three things needed to make 「今晚早点」usable day-to-day.

Included in this version:
- Added a PWA shell: `public/manifest.webmanifest`, `public/sw.js`, app icons under `public/icons/`, and `src/lib/pwa.ts` to register the service worker in production builds. Enables "add to home screen" install and an offline fallback.
- Added `src/lib/notifications.ts`, a local reminder scheduler that fires an evening pre-commitment reminder and a night closing reminder, with notification clicks deep-linking to the matching screen.
- Updated `src/pages/Settings.tsx` with a new "Reminders" section: enable-notifications button, evening reminder toggle + time, and closing reminder toggle.
- Updated `src/lib/dataStore.ts` so `settings` carries a `reminders` field, with `createDefaultStore`, `validateAndRepair` (backward-compatible with old saves), and legacy-key migration all handled.
- Updated `index.html` (manifest link, theme-color, apple-touch-icon, PWA meta, `viewport-fit=cover`), `src/main.tsx` (calls `registerServiceWorker()`), and `src/App.tsx` (reminder state/persistence, scheduler startup, `/?reminder=evening|closing` deep links).
- Reminder copy uses inline bilingual strings rather than touching the large locale files, to keep the patch isolated.
- Updated `package.json` version metadata to `6.8.0`.
- Note: web notifications only fire while the app/SW is alive; true "push even when fully closed" needs Push API + a server or a native shell — planned as the next P0.5 step.

## v6.7

Logbook trend visualization, broader i18n migration, and onboarding/confirm-copy polish.

Included in this version:
- Added `LogbookTrend.tsx`, a hand-drawn style trend view for the logbook.
- Updated `LogbookOverlay` with a tabbed interface so players can switch between entry records and the new trend chart.
- Expanded i18n coverage across more screens, including spirit chat, recipe book, guest-book confirmation, recipe-book confirmation, and parts of the opening flow.
- Updated `Home`, `EveningPrepare`, `NightClosing`, `LogbookOverlay`, `SpiritHutOverlay`, and `MessageBoardOverlay` to rely more consistently on translated UI strings.
- Updated `MorningOpening` so greeting and reward copy are increasingly locale-driven instead of hardcoded.
- Updated `package.json` version metadata to `6.7.0`.
- Kept the current time-simulation flow, spirit chat API path, and guest bond system while broadening translation coverage and adding trend visibility.

## v6.6

Guest encounter "Bond" system, replacing static guest stories with familiarity-based relationship beats.

Included in this version:
- Added `guestEncounters.ts` with bilingual four-beat relationship writing for all seven guests, unlocking by familiarity level.
- Updated `GuestBookOpenView` so the right page now shows `来往 / Bond` instead of a single static story block.
- Added familiarity badges beside guest names, aligned to the new four-stage relationship framing.
- Updated the guest book to reveal only the unlocked encounter beats, letting each guest's relationship history grow over time.
- Updated `guestProgression.ts` to align its labels with the new Bond system (`新客 → 渐熟 → 常来 → 熟客`) and removed the old familiarity-description helper.
- Synced `demoData.ts` with the new guest naming and food-preference details so the guest book and dish references stay consistent.
- Kept App-level wiring unchanged; this upgrade works through guest data and guest-book rendering changes only.

## v6.5

Time simulation debug tooling for scene flow, date changes, and opening-cycle testing.

Included in this version:
- Added `timeSimulator.ts` with a global `getNow()` abstraction so app logic can run on simulated time or real time from one place.
- Added `TimeSimPanel` as a richer debug tool with a clock-face display, date stepping, time slider, and quick jumps for morning/noon/evening/late night.
- Updated `timeScene.ts` to derive scene decisions from `getNow()`, allowing automatic scene changes to follow simulated time without extra branching.
- Updated `Home.tsx` so the DEBUG panel now opens the time simulation panel instead of the old scene picker.
- Updated `App.tsx` so `getTodayString()` also respects simulated time.
- Wired `sceneOptions` and `onTimeSimChange` into `Home`, allowing the debug panel to recalculate the active scene immediately when simulated time changes.
- Added cross-day handling so stepping the simulated date forward can naturally trigger the morning opening flow.
- Simplified the top home HUD by removing the old auto/manual scene toggle, since the time simulator now serves as the more powerful debug path.

## v6.4

Animated night-closing ceremony, broader i18n migration, and language-aware default spirit naming.

Included in this version:
- Rebuilt `NightClosing` as a more cinematic four-step ceremony with progressive scene darkening, fading lamp glow, spirit-to-hut motion, and a moonlit final resting state.
- Added CSS animation layers to the closing flow, including hut glow, moonrise, floating sleep markers, and a breathing silhouette effect for the sleeping shop.
- Migrated additional UI surfaces to `useT()`, including Home, EveningPrepare, NightClosing, LogbookOverlay, SpiritHutOverlay, and MessageBoardOverlay.
- Updated MessageBoardOverlay's generated guest/shop/worry notes so they respond to the current UI language.
- Changed `defaultOnboardingDraft.spiritName` from a hardcoded Chinese value to an empty string, allowing onboarding to fall back to the translated naming placeholder per language.
- Kept the app structure unchanged at the router level; this version works through file replacements only and does not require new App-level wiring.

## v6.3

Morning opening ceremony upgrade with a five-beat animated ritual and guest reveal.

Included in this version:
- Rebuilt `MorningOpening` into a five-beat opening ritual: shutter opening, light-on greeting, small reward, worry review, and guest arrival.
- Added personalized greeting copy for each night type across both "closed properly" and "not closed" outcomes.
- Added reward feedback that can surface skin-progress milestones, near-milestones, or warm encouragement depending on the previous night.
- Preserved the worry-review beat from `v5.8`, now integrated into the wider opening ceremony with smarter skipping.
- Added a final beat that reveals a subset of today's guests with staggered entry animation before opening the shop.
- Added smart beat skipping so users without a reward or worry can reach the live shop state faster.
- Updated `App.tsx` so `todayGuestKeys` are computed before rendering `MorningOpening`, allowing the opening ceremony to preview the actual guests that will visit that day.
- Wired `nightType`, `trend`, `spiritProgress`, and `todayGuestKeys` into `MorningOpening` while keeping the rest of the daily progression flow intact.

## v6.2

Lightweight i18n architecture, onboarding narrative redesign, and language switching.

Included in this version:
- Added `i18n.tsx` as a lightweight React context plus `useT()` hook with browser-language detection and localStorage persistence.
- Added `zh.ts` and `en.ts` translation dictionaries, predefining keys across the wider app so other screens can migrate gradually.
- Rebuilt `Onboarding.tsx` with a more narrative story arc that explains why the shop needs someone who can sleep well and transitions naturally into a spirit-led dialogue quiz.
- Reframed the onboarding quiz as chat-style spirit conversation instead of a cold multi-step questionnaire.
- Added a top-right language switcher to onboarding for fast `中文 / English` toggling.
- Updated `Settings.tsx` with a language section at the top and migrated the settings copy to use `t()` translation lookups.
- Updated the settings version display to `v6.2`.
- Wrapped the app with `I18nProvider` in `main.tsx` so translated onboarding and settings screens share the same language state.

## v6.1

Persistent ambient audio, dynamic message board content, recipe-book backdrop polish, and safe dead-code cleanup.

Included in this version:
- Added `ambientAudio.ts` and lifted the ambient audio engine to the app level so radio playback can continue after closing the radio overlay.
- Updated `RadioOverlay` to consume shared audio controls instead of managing its own `AudioContext`.
- Added a mini now-playing indicator on the home HUD so active ambient audio can be reopened quickly.
- Fixed the `onSceneChange` confirmation ordering bug by prompting before mutating scene state.
- Updated `MessageBoardOverlay` to generate guest notes, shop milestone notes, and released-worry notes dynamically from live progression data.
- Updated `RecipeBookOverlay` to render over the shop background with a translucent dim layer, matching the more immersive book presentation used elsewhere.
- Applied safe dead-code cleanup for unused legacy overlays/pages/helpers that are no longer imported by the active app flow.
- Kept the existing store, spirit chat API configuration, and worry-loop behavior intact while layering in the `v6.1` media and board improvements.

## v6.0

Post-closing state protection, spirit chat polish, and upgraded settings for API management.

Included in this version:
- Fixed post-closing scene behavior so switching away from `lightsOff` no longer silently reopens the shop; reopening after closing now requires explicit confirmation.
- Updated `SpiritChatOverlay` to remove the redundant "go to hut" path from chat, keeping the spirit hut accessible from the main scene instead.
- Added a rotating offline fallback pool in spirit chat so API failures no longer repeat the same single line.
- Added a gentle API error toast in spirit chat to make offline fallback behavior visible to the player.
- Added configurable API URL support via localStorage, with the current Vercel proxy kept as the default fallback endpoint.
- Upgraded `Settings.tsx` with API URL and API key management, version `v6.0` labeling, and the current `nightType` shown in the about section.
- Expanded the settings privacy copy to explain that spirit chat uses the configured API route.
- Updated `App.tsx` to pass `nightType` into settings, remove the deprecated hut callback from spirit chat, and guard post-closing scene changes with confirmation.

## v5.9

Flow integration for worries, scene-aware spirit chat context, and richer logbook notes.

Included in this version:
- Updated `SpiritChatOverlay` so the AI prompt can receive tonight's worry as optional context without proactively bringing it up first.
- Added scene-aware quick replies in spirit chat, with different actions and fallback lines for daytime, evening, and lights-off states.
- Added time- and scene-based opening lines in spirit chat so the first messages feel more grounded in the current moment.
- Updated `LogbookOverlay` to render worry notes as small paper slips with status labels such as released, carrying, and pending review.
- Updated `EveningPrepare` so saving tonight's plan can lead directly back into spirit chat for a softer flow.
- Updated `NightClosing` so the final screen acknowledges the saved note with a gentle "paper slip" line when the player wrote a worry that evening.
- Updated `App.tsx` to pass current scene and current worry into spirit chat, route evening prepare back into chat, and pass tonight's worry into the night-closing flow.
- Kept the existing Vercel-backed API endpoint and `v5.8` worry-loop behavior intact while layering in the `v5.9` flow integration.

## v5.8

Spirit chat rebuild, free text input, and worry-loop closure across evening and morning flows.

Included in this version:
- Rebuilt `SpiritChatOverlay` with free text input so the player can type directly instead of relying only on fixed reply chips.
- Added actionable quick replies in spirit chat, including shortcuts that jump directly to evening preparation and the night-closing flow.
- Refreshed the spirit chat presentation with a warmer gradient background and softer message-bubble styling.
- Expanded `LogEntry` with `worry` and `worryStatus` so an evening note can travel into the nightly log and be revisited the next morning.
- Updated `createCloseLogEntry()` to optionally capture the current evening worry when closing the shop.
- Added a worry-review beat to `MorningOpening`, letting the player mark last night's note as released, still carrying, or skip it entirely.
- Updated `App.tsx` to pass the new spirit-chat navigation callbacks, persist worry data into the closing log, and handle the morning worry-review callback.
- Kept the current Vercel-backed spirit chat API path in place while applying the new `v5.8` chat UI.

## v5.7

Spirit chat API migration to AIPing, with a server-side proxy and optional user keys.

Included in this version:
- Replaced the direct Claude browser integration in `SpiritChatOverlay` with an AIPing-based chat flow.
- Added `api/chat.js` as a server-side proxy that forwards chat requests to AIPing and keeps the default API key off the client.
- Switched the client chat payload to an OpenAI-compatible `messages` format with the system prompt inserted as the first message.
- Added optional user-supplied AIPing key support in `SpiritChatOverlay`, stored under `jinwanzaodian:aiping_key` and sent through the proxy only when provided.
- Added `.env.example` documenting `AIPING_API_KEY`, `AIPING_MODEL`, and `AIPING_API_ENDPOINT`.
- Removed the old Anthropic-specific browser headers and direct client-side Claude request path.
- Pointed the default chat endpoint at same-origin `/api/chat` so the proxy works cleanly in deployment without a manual URL replacement step.

## v5.6

UI hotspot recalibration, scene item sizing fixes, and book layout polish.

Included in this version:
- Recalibrated the main scene item hotspots to match the trimmed asset geometry used by the app, fixing the mismatch between the tuning tool and the rendered scene.
- Updated `sceneItems.ts` with the v3-calibrated coordinates for all seven interactive objects in the shop.
- Fixed `SceneItemButton` sizing by removing the conflicting `item` variant height class, so scene props render at their intended natural height.
- Polished `GuestBookOpenView` with independently positioned layout zones for character art, text blocks, story content, and page numbers, while preserving the real guest progression data from `v5.4`.
- Updated the guest-book text layout to wrap naturally without truncation and to adapt more cleanly to new animal entries.
- Polished `RecipeBookOverlay` with independent left/right text parameters, centered description copy, left-aligned guest/origin metadata, centered page numbers, and unclamped text.
- Switched recipe food images to plain `img` rendering inside the calibrated layout so they no longer inherit conflicting asset-size classes.
- Kept the existing real-time clock and dish unlock logic intact while applying the `v5.6` layout fixes.

## v5.5

Unified data layer with a versioned store, single-key persistence, and automatic migration.

Included in this version:
- Added `dataStore.ts` as the single source of truth for persistent app data, using one localStorage key (`jinwanzaodian:store`) with `schemaVersion: 1`.
- Added `loadStore()`, `saveStore()`, and `clearStore()` as the main persistence entry points.
- Added automatic migration from the old scattered keys into the unified store on first load, followed by cleanup of the migrated legacy keys.
- Added `validateAndRepair()` safeguards so the store structure is repaired if required sections are missing or malformed.
- Slimmed down `storage.ts` into a types-and-utilities module, keeping type exports, onboarding draft helpers, and pure helpers such as `createCloseLogEntry()` and `stampOpenTime()`.
- Updated `App.tsx` to load persistent state from a single `loadStore()` call and save it through one centralized `useEffect`.
- Updated reset behavior to use `clearStore()` instead of clearing many independent keys.
- Preserved existing user data by migrating current `v5.4` local data automatically and without loss on first load after the update.

## v5.4

Guest progression, dish and spirit unlocks, settings page, and visibility-session recovery.

Included in this version:
- Added `guestProgression.ts` to track guest visits and familiarity tiers from stranger to regular, with daily guest rolls weighted toward higher-familiarity visitors.
- Added `dishProgression.ts` for dish unlock progression: buns and soy milk are available by default, while later dishes unlock through good-night milestones or specific guest relationships.
- Added `spiritProgression.ts` for spirit skin milestones, unlocking additional forms after 5, 10, and 15 cumulative good nights recorded from screen-off events after closing.
- Added `Settings.tsx`, including default lights-off time controls, an about section, a data/privacy note, and a full reset action.
- Fixed `visibility.ts` so reopening the app after closing the tab can still trigger the return greeting by restoring the previous session's `endedAt` timestamp from localStorage.
- Updated `storage.ts` so `clearDemoStorage()` also clears the three progression-system keys.
- Updated `Home.tsx` to add a settings gear entry in the top-right corner.
- Updated `SpiritHutOverlay.tsx` so locked skins show grayscale styling, a lock marker, an unlock hint, and cumulative good-night progress.
- Updated `RecipeBookOverlay.tsx` so locked dishes show a hidden silhouette and unlock-condition copy instead of appearing fully available.
- Updated `GuestBookOpenView.tsx` to display real visit counts and familiarity text from progression data, while still falling back to static demo data when needed.
- Updated `App.tsx` to wire guest rolling, dish unlock checks, spirit unlock checks, the settings route, onboarding defaults, and full reset handling across the new progression systems.

## v5.3

Time-driven scene logic, real-time clock, visibility tracking, and trend-based mood calculation.

Included in this version:
- Added `ClockOverlay`, syncing the painted wall clock to the user's system time with live hour, minute, and second hands.
- Added `timeScene.ts` to switch the shop scene automatically by real-world time, using the planned lights-off time and the current daily mood.
- Added `visibility.ts` to track `visibilitychange`, detect away/return events, and record screen-off timestamps after nightly closing.
- Added `trendCalculation.ts` to replace the old binary mood decision with a weighted recent-days trend model based on the latest 5-7 log entries.
- Expanded `LogEntry` in `storage.ts` with `realCloseTimestamp`, `realOpenTimestamp`, and `screenOffTimestamp`, and added helpers such as `createCloseLogEntry()` and `stampOpenTime()`.
- Updated `ShopSceneInteractive.tsx` to embed the live `ClockOverlay` directly in the main scene.
- Updated `App.tsx` to wire automatic scene polling, visibility tracking, real open/close logging, weighted trend calculation, and an automatic/manual scene toggle on the home HUD.
- Kept the current onboarding and overlay flow intact while adding the new time-based systems.

## v5.1

Morning opening flow and midday transition.

Included in this version:
- Added `MorningOpening` page with a 3-beat opening flow: spirit greeting, light recap of last night, and shop opening transition.
- Added `MiddayTransition`, triggered once per day when switching into the daytime prep scene.
- Added `morningGreetings`, `middayTransitionCopy`, `MiddayTransitionCopyEntry`, and `getGuestCountByMood()` to `demoData.ts`.
- Switched the new morning and midday copy to Unicode-escaped strings to avoid encoding corruption.
- Added `lastOpenDate`, `todayMood`, and `middayDone` persistence to `storage.ts` for daily flow tracking.
- Updated `App.tsx` to trigger morning opening on the first launch of a new day and to gate the midday transition so it only appears once per day.

## v5.0

Radio / white noise feature, upgraded from placeholder to a working ambient audio tool.

Included in this version:
- Rebuilt `RadioOverlay` into a functional white-noise player using the Web Audio API, without relying on external audio files.
- Added four ambient channels: `雨声`, `微风`, `咖啡馆`, and `壁炉`, each with distinct noise generation and filter settings.
- Added play/pause controls, channel switching, volume control, and a sleep timer with preset durations.
- Added a breathing guide with a `4s inhale / 4s hold / 6s exhale` loop and animated visual cue.
- Added cleanup for the audio engine on overlay close and unmount.
- Kept the overlay in the de-carded immersive style introduced in earlier versions.

## v4.9

Fixed scene container ratio, hotspot calibration, and spirit image mapping.

Included in this version:
- Changed `ShopSceneInteractive` to use a fixed `2:3` aspect-ratio container with `object-contain` instead of `object-cover`, matching the scene art and preventing hotspot drift across devices.
- Applied the recalibrated hotspot positions and sizes from the matching `2:3` tuning pass in `sceneItems.ts`.
- Fixed spirit image mapping in `assets.ts`: `bagel` now maps to `dough-spirit-bagel.png`, while `confusedBagel` and `sleep` use the confused bagel asset.

## v4.8

Evening prepare and night closing flow integration.

Included in this version:
- Added two new hand-drawn scene backgrounds: `shop-evening-prepare.png` and `shop-night-close.png`.
- Wired `EveningPrepare` into `App.tsx` so switching the demo scene to `evening` opens the evening prepare overlay.
- Wired `NightClosing` into `App.tsx` so switching the demo scene to `night` opens the night closing overlay.
- Rebuilt `EveningPrepare` as a `GameOverlay` with immersive styling, pill time buttons, borderless worry input, and inline spirit response text.
- Rebuilt `NightClosing` as a dark warm `GameOverlay` with a four-step tap-through closing ceremony and final completion state.
- Completing the closing ceremony now sets `tonightClosed` to `true` and switches the scene to `lightsOff`.
- Updated `assets.ts` so the `lightsOff` scene maps to `shop-night-close.png`.
- Added `eveningPrepare` and `nightClosing` to the `AppView` flow in `App.tsx`.
- Both overlays include `onClose` support for returning to the shop.

## v4.7

Hotfix: recipe text visibility and scene item sizing.

Included in this version:
- Fixed recipe book description text not showing: replaced Tailwind `line-clamp-1` classes with inline `-webkit-line-clamp` styles (project lacks the line-clamp plugin).
- Reverted SceneItemButton to width-only sizing (removed explicit height percentage) — height auto-derives from image aspect ratio, fixing distortion caused by different viewport ratios between the tuning tool (9:16) and actual devices (9:19.5 on iPhone etc).
- Removed `height` from SceneItem type definition.
- Fine-tuned scene item widths: radio 14%, logbook 17%, messageBoard 30%, spiritHut 28% for better proportions.

## v4.6

Story-driven onboarding, hotspot tuning, guest book fix, recipe layout, Claude API spirit chat.

Included in this version:
- Rebuilt onboarding Step 0 as a 4-beat tap-through story: setting → characters → plot hook → invitation. Each beat advances on tap with dot progress indicator.
- Replaced cover illustration with transparent-background PNG (cover-shop-transparent.png); displayed larger (92% width) directly on background with no container or color line.
- Added getCoverTransparent() helper in assets.ts for the new transparent cover image.
- Fixed GuestBookOpenView text overflow: reduced layout sizes, added line-clamp to descriptions.
- Added Claude API integration to SpiritChatOverlay: claude-3-haiku with six NightType-specific system prompts. API key stored in localStorage. Falls back to mock responses without key. Typing indicator animation.
- Updated App.tsx to pass nightType to SpiritChatOverlay and wire radio/logbook/messageBoard views.
- Tuned RecipeBookOverlay layout with user-calibrated values (frame 3.5%/49.5%, food +12%, name 46.5%, desc +3% at 54.5%).
- Updated sceneItems.ts with user-calibrated hotspot positions and added optional `height` property to SceneItem type.
- Updated SceneItemButton.tsx to support explicit height percentage on hotspots.

- Tuned GuestBookOpenView layout with user-calibrated values: charImg 17%/18.5%/30%×32%, name 15%/45% at 12.5px, desc 18%/52.5% at 12.5px 2-line, right-page fields at 55.5% left, story at 58%/10px 4-line, left page number at 30%/70%, right page number at 69%/70.5%.

## v4.5

Bug fixes: spirit chat avatar, radio separation, hotspot positions, recipe layout.

Included in this version:
- Fixed SpiritChatOverlay using spiritAssets.normal (expression-only image) — replaced with spiritAssets.base (full body) in both the header avatar and chat bubble avatar.
- Created RadioOverlay as a dedicated placeholder for the radio/white noise feature, separating it from spirit chat.
- Updated App.tsx routing: radio target now opens RadioOverlay instead of SpiritChatOverlay.
- Adjusted scene item positions: logbook moved from y:60 to y:72 (lower on carpet where the book actually appears); spirit hut adjusted from y:38 to y:50 (mid-level); message board adjusted to x:62 for better wall alignment.
- Fixed RecipeBookOverlay text overflow: reduced column width (34%), compressed font sizes, added line-clamp-1 on description lines, moved page numbers inside book boundary (top:83%).
- Fixed RecipeBookConfirmView title overflowing to multiple lines — reduced font to clamp(22px,5vw,34px) to fit on one line.

## v4.4

Onboarding welcome screen redesign.

Included in this version:
- Rebuilt Step 0 (welcome screen) as a story-driven full-bleed layout.
- Illustration now fills the full screen width without a rounded bounding box, using mix-blend-mode: multiply to dissolve the white background against the warm cream, making the stall scene appear to float naturally.
- Replaced generic "欢迎来到你的早点铺" heading with a narrative-driven framing: "一家早点铺在等你来开张", with supporting copy that positions the user as the new shop owner.
- Changed CTA button from "开始开店" to "领这家铺子" to reinforce the shop handover narrative.
- Added small brand subtitle "今晚早点" above the heading for context.

## v4.3

Recipe book confirm flow, dish frame layout, and scene item hover effect.

Included in this version:
- Added RecipeBookConfirmView — clicking the recipe book in the scene now shows a full-screen confirm screen (matching the guest book flow) before opening the recipe overlay.
- Updated App.tsx to route recipeBook → recipeBookConfirm → recipeBookOpen.
- Rebuilt RecipeBookOverlay dish layout: each dish now uses the asset-dish-frame.png decorative border as a container; food image is centered inside the frame; name and description text flow below the frame cleanly.
- Added page numbers to recipe book pages.
- Added asset-dish-frame.png to public/assets.
- Added hover interaction to SceneItemButton: items gently lift and glow on mouse hover, providing desktop click affordance.

## v4.2

New scene items: logbook, message board, spirit hut.

Included in this version:
- Added three new hand-drawn assets to the shop scene: 营业日志 (logbook), 留言板 (message board), 精灵小屋 (spirit hut).
- Added asset references to assets.ts under toolAssets (spiritHut, logbook, messageBoard).
- Added three new scene item hot-spots to sceneItems.ts with positioned click areas; logbook placed left of the recipe book on the carpet, message board on the upper-right wall, spirit hut in the right corner.
- Expanded SceneItemTarget type to include logbook, messageBoard, and spiritHut (now an independent entry separate from spiritChat).
- Wired LogbookOverlay and MessageBoardOverlay into App.tsx view system — both are now reachable by tapping their scene objects.
- Spirit hut is now separately tappable in the scene (independent from the spirit itself, which still opens chat).

## v4.1

Onboarding carousel redesign and quiz expansion.

Included in this version:
- Expanded persona quiz from 3 to 5 questions; added "夜里你最常在做什么" and "你跟早晨的关系是" dimensions for more accurate night-type profiling.
- Merged the old "result display" and "spirit appears" into a single step — spirit now floats in alongside the result text.
- Rebuilt spirit skin selection as a 3D perspective carousel with touch-swipe support, replacing the old 2×2 card grid.
- Carousel features: foreground selected skin at full size/opacity, side skins as smaller transparent ghosts, dot indicators, circular looping, CSS perspective depth effect.
- Added `SpiritBody` type (base/xiaolongbao/bagel/croissant) to storage.ts for the 4 main onboarding body forms, separate from the full `SpiritForm` type.
- Expanded `spiritAppearance` in OnboardingProfile and OnboardingDraft from `'base' | 'xiaolongbao'` to `SpiritBody`, allowing all 4 skins to be selected during onboarding.
- Added `onboardingSkins` array in demoData.ts with the 4 carousel options (白面团, 小笼包, 贝果, 可颂).
- Renamed spirit naming step input from card-style to underline-style centered input.
- Reduced total onboarding steps from 7 to 6 by merging result + spirit reveal.
- Updated quiz progress indicator from text label to segmented progress bar with animated fill.

## v4.0

Card frame removal and spirit chat entry restructure.

Included in this version:
- Removed all card frame structures (border, shadow, paper-panel) across the entire app to achieve a unified immersive game-style UI.
- Replaced bordered HUD badges on the home screen with translucent borderless overlays using backdrop-blur.
- Stripped card wrappers from GameOverlay back-button and title label; now translucent HUD-style floaters.
- Rebuilt SpiritHutOverlay without card panels; spirit displays directly on scene background with horizontal scrolling skin shelf using opacity/glow for selection state.
- Created SpiritChatOverlay as a dedicated spirit dialogue interface, replacing the old RadioChatOverlay; chat bubbles float directly on warm background without container card.
- Changed spirit scene item target from spiritHut to spiritChat — tapping the spirit in the shop now opens dialogue directly.
- Added "go to hut" secondary navigation inside SpiritChatOverlay for accessing the spirit hut from within chat.
- Rebuilt LogbookOverlay without card panels; journal entries use ruled-line background styling instead of bordered cards.
- Rebuilt MessageBoardOverlay with a dark blackboard background; sticky notes use colored fills and rotation with drop shadows instead of bordered cards.
- Removed card borders from GuestBookOpenView navigation buttons; now translucent HUD-style.
- Removed card border from RecipeBookOverlay page indicator.
- Updated PageTurnButton, SoftButton, and DemoControls to remove border and shadow styling.
- Updated CSS utility classes (paper-panel, paper-dashed, paper-label) to remove borders and shadows.
- Updated App.tsx view system to wire spiritChat view and remove radioChat references.

## v3.3

Guest book presentation polish.

Included in this version:
- Rebuilt the guest-book confirm view into a full-screen dimmed scene with a floating cover and text-only yes/no choices.
- Rebuilt the open guest-book view into a single animated book presentation with synchronized page, avatar, name, and text reveal.
- Added the TianRanDai font for the guest-book confirm and open flows.
- Unified the guest mapping data and aligned the orange cat asset with its displayed guest profile.
- Removed the extra center button from the open view and switched prev/next paging to wrap cyclically.

## v3.2

Guest book interaction flow rebuild.

Included in this version:
- Added a dedicated guest book confirm scene before opening the guest archive.
- Rebuilt the guest book open view around the provided inner-page template and single-guest paging flow.
- Switched app-level navigation to explicit guest book states instead of opening the archive directly from the home scene.
- Added guest book scene-entry and page-open animations with dimmed shop-scene backgrounds.

## v3.1

Spirit base art replacement.

Included in this version:
- Replaced the default dough spirit and xiaolongbao skin with the newly cut-out PNG versions.
- Updated asset sync logic to prefer canonical asset filenames already placed in `public/assets`, so future `prepare-assets` runs do not overwrite these replacements with older source images.

## v3.0

Full-screen scene app rebuild.

Included in this version:
- Rebuilt the home screen into a true full-screen shop scene without the previous outer card shell or large section blocks.
- Replaced text hotspot entry areas with positioned PNG scene items for the recipe book, guest book, radio, and spirit.
- Added a centralized `sceneItems` configuration and a new scene item button interaction with tap glow and delayed open.
- Rebuilt the recipe book as a full-screen inner-book template with absolutely positioned dish content overlays.
- Rebuilt the guest book into a cover page plus single-guest inner pages using the provided guest-book template instead of a grid.
- Converted item pages from card-like overlays into full-screen game-style views with lightweight page transitions.

## v2.1

GitHub Pages asset path fix.

Included in this version:
- Fixed all image asset URLs to respect the Vite `BASE_URL` instead of hardcoding `/assets/...`.
- Restored image loading on the deployed GitHub Pages site under `/jinwanzaodian/`.

## v2.0

Image-driven interactive scene rebuild.

Included in this version:
- Added asset sync and trim pipeline for the new source image set.
- Rebuilt the home screen into a clickable shop scene with interactive hotspots.
- Replaced section-style pages with game overlays for recipes, guest book, guest detail, spirit hut, radio chat, logbook, and message board.
- Switched asset usage to centralized English-named paths with trimmed fallback handling.
- Updated the demo data to use the new food, guest, and spirit image assets.

## v1.2

Single-screen app prototype restructure.

Included in this version:
- Rebuilt onboarding as a step-by-step page flow.
- Converted the home screen into a single-screen shop view with four main app entrances.
- Reworked the menu into a paged recipe book.
- Reworked the guest book into a collectible grid with a guest detail page.
- Reworked the logbook into paged handwritten records.
- Added a fixed-response spirit chat page with chat bubbles and quick replies.
- Split scene and character image rendering rules in `AssetImage`.
- Added trimmed asset lookup for character PNG files with fallback to original assets.
- Added `scripts/trim-transparent-assets.mjs` and `npm run trim-assets`.

## v1.1

GitHub Pages deployment setup.

Included in this version:
- Added a GitHub Actions workflow to build and deploy the Vite app to GitHub Pages.
- Updated the Vite base path for the `sunnywang666/jinwanzaodian` repository deployment.
- Bumped the project version from `1.0.0` to `1.1.0`.

## v1.0

Initial demo release.

Included in this version:
- Initialized the project with React + Vite + TypeScript + Tailwind CSS.
- Reorganized the source documents into `docs/product-concept-v5.md` and `docs/ui-spec-v5.md`.
- Mapped the existing image assets into `public/assets/`.
- Built the mobile-first app shell and bottom navigation.
- Implemented `AssetImage` with a unified missing-asset placeholder card.
- Implemented the core demo pages:
  - Home
  - Onboarding
  - Menu
  - GuestBook
  - Logbook
  - SpiritHut
  - EveningPrepare
  - NightClosing
- Added localStorage persistence for onboarding, spirit form, lights-off time, demo scene, and closing state.
- Verified the project with `npm run build`.

## Versioning rule

- Small change: `v1.1`, `v1.2`, `v1.3`...
- Large change: `v2.0`, `v3.0`...
- Mainline commit subjects should follow `vX.Y: short english summary`, using concise lowercase English phrases.
- Changelog entries should use an English summary sentence followed by `Included in this version:` and verb-led bullets such as `Added`, `Updated`, `Fixed`, `Expanded`, or `Kept`.
- Package version uses semver format alongside the display version:
  - `v1.0` => `1.0.0`
  - `v1.1` => `1.1.0`
  - `v2.0` => `2.0.0`
