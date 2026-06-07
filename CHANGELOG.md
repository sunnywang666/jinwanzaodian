# Changelog

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
- Package version uses semver format alongside the display version:
  - `v1.0` => `1.0.0`
  - `v1.1` => `1.1.0`
  - `v2.0` => `2.0.0`
