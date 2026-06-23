# Changelog

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
