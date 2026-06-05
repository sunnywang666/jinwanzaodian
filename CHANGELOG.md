# Changelog

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
