# Dark Icons, Single-Language, and Workspace Alignment Fix

Date: 2026-05-11 23:25 IST

## Scope

This record covers the dark-mode UI regression where Material Symbols appeared as visible ligature words, the logout/workspace pages showed English and Marathi together, and the renter bookings browse action needed better alignment.

## Root Cause

- `app/layout.tsx` used a Google Fonts `icon_names=` Material Symbols subset.
- Any icon outside that subset, such as `track_changes`, rendered as visible text.
- Some pages still rendered bilingual hard-coded strings instead of selecting text through `langText(...)`.

## Fix

- Restored the stable full Material Symbols ligature stylesheet in the root layout.
- Updated contract tests so the root layout must not reintroduce `icon_names=`.
- Converted the visible logout copy and workspace overview labels to language-gated text.
- Tightened the renter bookings browse button alignment and sizing.
- Added dark-mode backgrounds to overview cards that still depended on light `bg-white` surfaces.
- Installed Playwright as a dev dependency for rendered QA and used system Chrome at `/usr/bin/google-chrome` because Playwright's managed Chromium package does not support this Ubuntu 26.04 host.

## Verification Targets

- `npm run test:contracts`: passed, 193/193 contracts.
- `npm run verify`: passed, including lint, typecheck, contract tests, and production build.
- `npm run launch:gate`: passed, including build, Firebase dry run, and workbook verification.
- `git diff --check`: passed.
- `npm audit --omit=dev`: still reports existing production dependency advisories in Next/PostCSS and Firebase Admin transitive packages; not changed in this UI release.
- Playwright rendered QA passed with system Chrome:
  - `/about` dark mode: `track_changes` and other Material Symbols rendered as glyphs, not words.
  - `/logout` dark mode: one selected language rendered at a time.
  - authenticated `/renter-profile/bookings` dark mode: no wide ligature text, no inline slash bilingual copy, and desktop Browse Equipment alignment delta was `0px`.
  - iPhone 13 dark-mode route pass: visible icons used the Material Symbols font and no inline slash bilingual text was detected.
- Live smoke after Firebase App Hosting rollout:
  - `https://www.kisankamai.com/`, `/about`, and `/logout` returned `200`.
  - unauthenticated `/renter-profile/bookings` redirected to `/login`, as expected.
  - the live homepage includes the stable Material Symbols stylesheet and does not include `icon_names=`.
  - authenticated live Playwright check reached `/renter-profile/bookings`, found no wide icon ligature text, no inline slash bilingual copy, and measured Browse Equipment alignment delta as `0px`.
