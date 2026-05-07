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
- Firebase Auth authorized domains for `kisankamai.com`, `www.kisankamai.com`, and `gokisaan.firebaseapp.com`
- optional Google Maps config
- optional Sentry DSNs for observability

If Firebase Admin credentials are missing, some authenticated/data-backed runtime flows will not function outside mocked/static fallbacks.

Auth is phone-only for public login and registration. Users register with Firebase Auth phone verification, set a password, and later sign in with the registered mobile number only. Optional email remains profile metadata and uniqueness is still reserved when provided.

Phone-only auth flow contract:

- `/login` accepts a registered mobile number and password only.
- Login mutations must accept the live apex and canonical hosts as the same site for writes: `https://kisankamai.com` and `https://www.kisankamai.com`. This prevents valid apex visitors from seeing `Cross-origin form submissions are not allowed.` before password validation.
- Unknown login phone numbers return the `not-found` state and show a 5-second register-first toast. Registered phones with the wrong password return the `invalid-password` state and keep the user on `/login` with the password error visible.
- Successful phone/password login must redirect to `/profile-selection` when profile basics are present, so the user can choose owner or renter workspace.
- `/register` preflights the phone and optional email before sending OTP, so duplicate contacts do not receive OTP.
- `/api/auth/google/resolve` and `/api/auth/google/register` intentionally return HTTP 410; `/register/google-email` redirects back to `/register`.
- Manual register and profile updates must reserve identifiers in the `auth-identifiers` Firestore collection so a phone or optional email cannot create multiple accounts.
- Booking and listing notifications are Firebase Cloud Messaging only. Do not add MSG91/SMS code until that provider is intentionally introduced.
- Login, register preflight, register session creation, password reset, profile completion, public forms, and client bug reports use Firestore-backed per-IP/per-identifier rate limits. Public form routes should pass the authenticated user id when a session exists so a logged-in user can submit multiple different forms with the same account phone.

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

The old Windows-root snapshot, previous generated folders, and cross-agent handoff subtree were removed after the Ubuntu rebuild. Do not restore them into the active root unless explicitly requested.

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
- `/rent-equipment` and `/equipment/[id]` do not render mock listings. Empty public inventory should show a real empty state until owners publish complete listings with images and location details. Keep the search panels compact below the fixed header on the base, query, and empty-state variants.
- `/feature-request` is a live public form. Keep it wired to `/api/forms/feature-request`, the `feature-request` submission type, and the shared Firestore-backed submission pipeline.
- The footer newsletter is a live public form. Keep it wired to `/api/forms/newsletter-subscription`, the `newsletter-subscription` submission type, and the `newsletter_subscriptions` Sheets tab.
- `/coming-soon` notify submissions are live public form submissions. Keep them wired to `/api/forms/coming-soon-notify`, the `coming-soon-notify` submission type, and the `coming_soon_notifications` Sheets tab.
- `/owner-benefits`, `/support`, and `/forgot-password` intentionally port local HTML visual systems into React page bodies while retaining the shared Kisan Kamai header/footer, auth, theme, and language infrastructure. Do not reintroduce duplicate local nav/footer markup when updating those pages.
- `/owner-benefits` is a client-side owner earnings calculator. The calculator does not create backend, Firestore, or Sheets rows unless a real form is added later; it should use the shared equipment category source, Maharashtra district list, and the local HTML calculator treatment including the `More locations coming soon...` location note.
- `/support` is a live public form. Keep the visible page aligned with the current support content and primary contact, keep the contact form visually aligned with `/home/hkuma/Documents/support.html`, keep the urgent-help panel compact, and keep submissions wired to `/api/forms/support-request`, the `support-request` submission type, and the `support_requests` Sheets tab.
- `/forgot-password` is an auth flow, not a public form. Keep the supplied `/home/hkuma/Documents/forgetpassword.html` reset layout, cinematic field image, glass form card, and local overlay treatment wired to `/api/auth/password-reset/request` and the existing OTP/new-password routes instead of adding Sheets submissions. Password reset starts from the registered mobile number only; do not reintroduce email reset lookup in the page copy or server resolver.
- Owner and renter workspace route shells must pass `localizedText(...)` titles and subtitles, and main workspace components must use runtime language hooks (`langText(...)` or `LocalizedText`) for visible copy. Do not render inline English/Marathi slash labels in workspace bodies.
- Workspace support, feedback, and settings pages intentionally port `/home/hkuma/Documents/profile-support.html`, `/home/hkuma/Documents/profile_feedback.html`, and `/home/hkuma/Documents/profile-settings.html` into the shared owner/renter workspace shell. Preserve those supplied structures when editing the forms.
- The profile dropdown intentionally ports `/home/hkuma/Documents/profile_dropdown.html` states. Keep the compact profile rows, notification loading/empty/default states, and sign-out row; do not reintroduce Settings or Help rows in that menu.
- The public `/report` page is removed from the site. Keep `/api/forms/report` only as a backend compatibility endpoint for existing integrations unless product explicitly removes report submissions entirely.
- Login is phone-number and password only. Registration may collect an optional profile email, but Firebase password auth must resolve credentials from `passwordLoginEmail`, the Firebase Auth user found by phone number, the synthetic `phone.<10-digit>@kisankamai.local` address, and the visible legacy email. Successful login repairs `passwordLoginEmail` so fresh browsers keep working for older accounts.
- Use `npm run auth:repair-password-login-emails -- --dry-run` before `npm run auth:repair-password-login-emails -- --apply` when backfilling legacy users whose password credential email exists in Firebase Auth but not in Firestore.
- Successful registration returns to plain `/login` after the success message. Do not reintroduce `/login?pleaseLogin=1` or a separate please-login query state.
- Auth state must synchronize across tabs with `lib/client/auth-sync.ts` so a successful login/logout refreshes already-open public pages in the same browser profile.
- Profile photo uploads must return and apply the refreshed session immediately, then broadcast `session-refresh`, so the header dropdown and owner/renter workspace chrome update without requiring logout/login. Public equipment detail owner cards should read the latest owner profile/user `photoUrl` instead of relying on a stale listing snapshot.
- Google Maps map/satellite selection is user state. Keep `components/MapComponent.tsx` persisting map type with `kk_google_map_type` and do not hardcode `terrain` over the user's selected view.
- Public pages default to light mode. Dark mode is user-selected only and must keep forms, cards, images, and footer/header contrast readable.
- Public banner imagery uses the shared `kk-banner-image-overlay` treatment. Do not apply that overlay to equipment listing/product photos because renters need to inspect machine images clearly.
- Category tiles must keep their baseline catalog images. Owner-uploaded equipment photos should only affect listing cards and equipment detail galleries.
- Ratings are equipment-only. Do not show owner/renter profile ratings, trust badges, or verification-rating pills in workspace profiles, booking cards, or owner cards. Equipment cards and equipment detail pages may show a rating only when the listing has a positive equipment rating.
- Owner listing image uploads are limited to 1-3 real equipment photos. The first photo remains the cover image; all uploaded photos must remain public in logged-out and logged-in listing views, and equipment detail thumbnails must allow switching the main photo.
- `/list-equipment` does not render a live preview tile. Listing create/edit uses the workspace form only, with three photo slots and the shared submit animation.
- Public `/equipment/[id]` routes redirect authenticated users into their active workspace detail route. Unauthenticated users stay on the public detail page and must see the login/register toast when trying to book without a session.
- Equipment detail booking requests collect field location and optional field pincode in the public form. Mirror the pincode as `field_pincode` in `booking_requests` while keeping older API callers compatible.
- Owner workspace dashboard and booking pages should stay operational and compact: do not reintroduce the removed owner KPI tiles, Fleet Snapshot tile, Manage Equipment CTA inside bookings, or owner-side Track actions. Owner bookings use details, call, approve, and decline actions only.
- Owner workspace settings, feedback, and support forms use compact responsive layouts with balanced columns on desktop and a single-column flow on mobile. Avoid full-height centering that creates large empty gaps in these profile pages.
- Primary submit/CTA controls should use the shared `kk-flow-button` and `kk-flow-spinner` animation primitives instead of one-off pulse/spinner treatments.
- Small tile/card surfaces should use the shared `kk-depth-tile` treatment. Pointer-driven depth is installed globally by `components/DepthMotion.tsx` and must respect reduced-motion settings.
- Sentence-length body copy is justified globally from `app/globals.css` for public and workspace pages on desktop and mobile. Keep navigation, buttons, inputs, labels, and form helper/error text start-aligned so controls remain readable.
- Form rows mirror to Google Sheets with pending notification metadata. Keep email delivery in the bound Sheets Apps Script only when the workbook owner wants sheet-side alerts.
