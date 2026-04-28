# Development

## Root App

The root app is the active development and production frontend.

Current stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript 6, ESLint 9, and Firebase Admin 13. The repo is ESM (`"type": "module"`) and App Router-only.

```bash
PUPPETEER_SKIP_DOWNLOAD=true npm ci
npm run dev
```

Validation:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:contracts
npm run verify
npm run firebase:preflight
npm run firebase:rules:dry-run
npm run launch:gate
```

## Firebase Requirements

Local work that exercises the Firebase-backed root runtime may require:

- Firebase web config in `.env.local`
- Firebase Admin credentials in `.env.local`
- Firebase Auth Google provider enabled when testing Google login/register
- Firebase Auth authorized domains for `kisankamai.com`, `www.kisankamai.com`, and `gokisaan.firebaseapp.com`
- optional Google Maps config
- optional Sentry DSNs for observability

If Firebase Admin credentials are missing, some authenticated/data-backed runtime flows will not function outside mocked/static fallbacks.

Auth is phone-only for public login and registration. Users register with Firebase Auth phone verification, set a password, and later sign in with the registered mobile number only. Optional email remains profile metadata and uniqueness is still reserved when provided.

Phone-only auth flow contract:

- `/login` accepts a registered mobile number and password only.
- `/register` preflights the phone and optional email before sending OTP, so duplicate contacts do not receive OTP.
- `/api/auth/google/resolve` and `/api/auth/google/register` intentionally return HTTP 410; `/register/google-email` redirects back to `/register`.
- Manual register and profile updates must reserve identifiers in the `auth-identifiers` Firestore collection so a phone or optional email cannot create multiple accounts.
- Booking and listing notifications are Firebase Cloud Messaging only. Do not add MSG91/SMS code until that provider is intentionally introduced.

## Ubuntu Runtime Notes

- Active dependencies are installed into root `node_modules` with `PUPPETEER_SKIP_DOWNLOAD=true npm ci`.
- npm cache is project-local under `.cache/npm`.
- Firebase CLI local state is ignored under `.firebase/`; do not commit VS Code/Firebase logs from that folder.
- Tailwind/PostCSS config is ESM: `tailwind.config.mjs` and `postcss.config.mjs`.
- Next.js 16 builds with Turbopack after removing legacy Pages Router stubs.
- Protected pre-render route checks use the Next.js 16 `proxy.js` file convention; `/list-equipment` still performs server-side session verification after the proxy cookie-presence guard.
- Puppeteer browser download is disabled; use `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome`.
- NVIDIA GPU acceleration can be used for Chrome/Playwright rendering checks, but build, lint, typecheck, and Firebase verification are CPU-bound.

## Logs

Use the logged helper scripts when you want captured runtime logs:

```bash
npm run dev:logged
npm run start:logged
```

Generated logs belong in `logs/runtime/`.

## Archived Reference

The old Windows-root snapshot, previous generated folders, and cross-agent handoff subtree are archived under `old/`. Do not restore them into the active root unless explicitly requested.

## Sheets Operations

Operational workbook tooling is script-based and lives under `scripts/`.

```bash
npm run sheets:bootstrap
npm run sheets:verify
npm run sheets:backfill
```

Use `docs/OPERATIONS_GOOGLE_SHEETS.md` for the workbook model, backfill scope, and verification flow.

## Final Test Accounts

Seed the canonical owner and renter test accounts:

```bash
npm run seed:final-test-accounts -- --owner-password "<password>" --renter-password "<password>"
```

Cleanup:

```bash
npm run cleanup:final-test-accounts
```

The latest local summaries are written to `logs/runtime/final-test-accounts/`.

## Launch Gate

Run `npm run launch:gate` before any production deploy. It runs the standard root verification, validates Firebase/App Hosting config, compiles Firestore and Storage rules with a dry run, and verifies the operational workbook.

## Public Data Contract

- `/categories` renders the baseline equipment catalog and merges live owner-published categories into it.
- `/rent-equipment` and `/equipment/[id]` do not render mock listings. Empty public inventory should show a real empty state until owners publish complete listings with images and location details.
- Public pages default to light mode. Dark mode is user-selected only and must keep forms, cards, images, and footer/header contrast readable.
- Dark-mode public imagery should preserve the same image color as light mode. Avoid full-page wash overlays on public hero/category imagery; auth/OTP screens still use the shared `kk-auth-*` classes. Keep `tests/dark-mode-visual-contracts.test.mjs` updated when a new public route gets a dark-mode visual contract.
