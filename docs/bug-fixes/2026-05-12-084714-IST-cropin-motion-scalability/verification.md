# Cropin-Inspired Motion And Scalability Pass

This record covers the May 12, 2026 pass for smoother page flow, reliable icons, and safer public listing scaling.

## Scope

- Reviewed Cropin as an external motion reference for restrained enterprise transitions, soft page flow, and non-jarring reveal timing.
- Kept Kisan Kamai's existing product model, colors, routes, forms, auth, and backend flows.
- Did not use Stitch because no new mockup or generated design screen was required; the implementation changed the existing React/CSS runtime directly.

## Changes

- Self-hosted Material Symbols at `/fonts/material-symbols-outlined.woff2` and preloaded the font from the root layout.
- Added global flow timing tokens, a compositor-friendly route transition bar/veil, and smoother profile dropdown timing.
- Updated scroll reveal and route shell transitions to use the same softer enter curve.
- Throttled 3D tile pointer updates through `requestAnimationFrame` to avoid excessive pointermove work on tile-heavy pages.
- Added status-filtered Firestore public listing reads with a full-scan fallback for older or misconfigured environments.
- Added extra vertical room on empty rent-equipment query pages so the support CTA and footer have clear separation.

## Verification Plan

- `npm run test:contracts`
- `npm run verify`
- `npm run launch:gate`
- Playwright desktop and mobile rendered checks for `/`, `/rent-equipment`, `/rent-equipment?query=balers`, profile pages, and page transitions.
- Live smoke checks after deployment on `https://www.kisankamai.com`.

## Local Verification Result

- Playwright desktop and mobile dark-mode render checks passed for `/`, `/rent-equipment`, `/rent-equipment?query=balers`, `/owner-benefits`, and `/support`.
- Playwright confirmed the self-hosted icon font loaded from `/fonts/material-symbols-outlined.woff2`.
- Playwright confirmed runtime motion tokens were available and a `/` to `/categories` route click completed with transition styles loaded.
- `npm run verify` passed with 198/198 contract tests, lint, typecheck, and production build.
- `npm run launch:gate` passed with 198/198 contract tests, production build, Firebase preflight, Firestore/Storage debug dry-run, and Google Sheets workbook verification.
- `git diff --check` passed.
