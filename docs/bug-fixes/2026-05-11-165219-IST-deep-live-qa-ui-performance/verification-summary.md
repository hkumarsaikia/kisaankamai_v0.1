# Deep Live QA UI And Performance Pass

Date: 2026-05-11 16:52 IST

## Scope

User request: continue the full live-site QA pass across public pages, profile workspaces, forms, dark mode, mobile layouts, loaders, lazy loading, and performance.

This evidence folder records the release notes for the code changes. Canonical source files remain in their normal app and component locations.

## Root Causes Found

- Several dark-mode surfaces used semantic light-theme foreground tokens on primary containers, making icons or labels hard to read in rendered dark mode.
- Some responsive `Image` / `ContentImage` usage missed `sizes`, so Next.js emitted image optimization warnings and the browser had less useful preload/layout information.
- Above-fold equipment media on listing and search pages did not consistently opt into eager/high-priority loading.
- The owner-benefits floating earnings tile could overflow on narrow mobile widths because its negative horizontal offset was applied at all breakpoints.

## Changes Made

- Replaced problematic primary-container foreground combinations with stable white or dark-mode fixed-primary foreground colors.
- Added responsive `sizes` attributes to fill-based images in public, equipment, owner workspace, renter workspace, and listing preview surfaces.
- Marked above-fold equipment detail/search images as eager/high-priority while keeping lower list images lazy.
- Constrained the owner-benefits floating earnings tile on mobile and preserved the desktop offset.
- Expanded contract tests for dark-mode visual tokens and production image-loading contracts.

## Verification

- `npm run test:contracts -- tests/production-hardening-contracts.test.mjs tests/dark-mode-visual-contracts.test.mjs`: passed, 186/186 contracts.
- `npm run verify`: passed, lint/typecheck/contracts/build.
- `npm run launch:gate`: passed, 186/186 contracts, production build, Firebase preflight, Firestore/Storage dry run, and Google Sheets workbook verification.

Additional rendered QA was performed locally with Puppeteer across desktop, Android-sized, and iPhone-sized viewports for changed public/auth/profile routes. The Browser plugin runtime was not available in this session, so regular Puppeteer was used for rendered validation.

Rendered QA results:

- `/register/success` dark mobile: 200, no console errors, no icon-font failure, no horizontal overflow, no invisible form controls.
- `/rent-equipment?query=balers` desktop: 200, no console errors, no icon-font failure, no horizontal overflow, empty-state CTA has 64px visible space before the footer.
- `/rent-equipment` dark mobile: 200, no console errors, no icon-font failure, no horizontal overflow, no invisible form controls.
- `/owner-benefits` dark mobile: 200, no console errors, no icon-font failure, no horizontal overflow.
- `/about` dark desktop: 200, no console errors, no icon-font failure, no horizontal overflow.
- `/` light mobile: 200, no console errors, no icon-font failure, no horizontal overflow.

## Release Checklist

- Commit source and this evidence note.
- Push `origin/main`.
- Sync the live mirror if configured.
- Create a Firebase App Hosting rollout for the pushed commit.
- Deploy Firestore and Storage rules through the standard release path.
- Smoke test apex and `www` live routes after rollout.
