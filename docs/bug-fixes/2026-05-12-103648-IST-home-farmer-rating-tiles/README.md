# Home Farmer Rating Tiles

This record covers the May 12, 2026 homepage refinement that replaces the
Cropin-inspired practical-use cards with farmer rating style tiles.

## Scope

- Refined the homepage section below the operating area map.
- Removed the three `platformUseCases` cards shown as practical ways to use the
  platform.
- Restored the earlier farmer-rating card pattern with star visuals, profile
  imagery, local area labels, and three compact experience cues.
- Kept copy conservative: no named customer testimonials, unsupported numeric
  claims, rankings, or fake success stories.
- Preserved the existing shared header, footer, auth behavior, language switch,
  dark mode, and backend/data flows.

## Source Changes

- `app/page.tsx`
- `app/globals.css`
- `tests/seo-contracts.test.mjs`
- `tests/cropin-motion-scalability-contracts.test.mjs`

## Verification Plan

## Verification

- `node --test tests/seo-contracts.test.mjs tests/cropin-motion-scalability-contracts.test.mjs`: 9/9 tests passed.
- `npm run test:contracts`: 199/199 contract tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `npm run verify`: passed with 199/199 contract tests and a successful production build.
- `npm run launch:gate`: passed with 199/199 contract tests, successful production build, Firebase preflight/rules dry run, and Sheets workbook verification.
- Local Playwright render check for `/`: desktop and mobile rendered three farmer rating cards, 15 star icons, English and Marathi copy independently, no old `Practical ways to use Kisan Kamai` heading, and no page or console errors.

## Generated Evidence

- `generated/home-desktop-farmer-ratings-section-en.png`
- `generated/home-mobile-farmer-ratings-section-en.png`
- `generated/home-desktop-farmer-ratings-section-mr.png`
- `generated/home-mobile-farmer-ratings-section-mr.png`

## Release Follow-Up

- Commit, push, Firebase App Hosting rollout, live smoke, and Discord notification are part of the release workflow for this bundle.
