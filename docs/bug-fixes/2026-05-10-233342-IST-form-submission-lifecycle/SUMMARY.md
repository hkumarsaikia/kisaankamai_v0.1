# Form Submission Lifecycle Fix

Date: 2026-05-10 23:33 IST

## Root Cause

Several client forms used React `useTransition` as the network request lifecycle for async `postJson` calls and server-action submissions. `useTransition` is a render-priority primitive, not a durable POST/action pending state, so controls could stop showing loading or allow repeated submits before the backend operation settled.

A second mismatch existed after the visible equipment detail `Work Type` field was removed: booking validation still required `workType`. Older/listing edge cases with an empty work type could reject booking requests even though the user no longer had a visible field to correct.

## Changes

- Replaced transition-backed submit lifecycles with explicit `isSubmitting` state in public and workspace forms.
- Kept submit buttons disabled and loaders bound to the real async request boundary.
- Made equipment booking `workType` optional and normalized booking payloads to `workType/task = "General equipment work"` when no explicit work type is present.
- Prevented the public support placeholder category from being submitted as a real category.
- Added `tests/form-submission-flow-contracts.test.mjs` to prevent these regressions.

## Initial Targeted Verification

- `node --test tests/form-submission-flow-contracts.test.mjs` passed.
- `npm run typecheck` passed after the code changes.
- Targeted form/profile/listing contract suite passed: 38/38.

## Release Verification

- Local rendered QA on `http://localhost:3000` returned 200 for `/`, `/support`, `/coming-soon`, `/feature-request`, `/partner`, `/rent-equipment?query=balers`, `/forgot-password`, and `/owner-benefits`.
- Local rendered QA submitted the newsletter, support, coming-soon, feature-request, and partner forms through real typed browser input.
- `npm run test:contracts` passed: 180/180.
- `npm run verify` passed: lint, typecheck, contracts, and production build.
- `npm run launch:gate` passed: verify, Firebase Firestore/Storage dry-run, and Sheets workbook verification.
