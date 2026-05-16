# Development

## Root App

The root app is the active development and production frontend.

Current stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript 6, ESLint 9, and Firebase Admin 13. The repo is ESM (`"type": "module"`) and App Router-only.

```bash
PUPPETEER_SKIP_DOWNLOAD=true npm ci
python3 -m pip install -r requirements.txt
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

Optional AI/code-review pass for scoped local diffs:

```bash
coderabbit review --agent -t uncommitted -c AGENTS.md
```

If the working tree has unrelated untracked generated folders, exclude them locally with `.git/info/exclude` or review a committed branch/PR so the review service does not exceed file-count limits.

## Hardware-Tuned Local Commands

The root npm scripts run through `scripts/hardware-tuned-runner.mjs` so local
checks can use this machine efficiently without treating the CPU as disposable.
On this device the runner detects the AMD Ryzen 5 5600H as 12 logical threads
and the NVIDIA GeForce GTX 1650 as the fixed NVIDIA GPU path for browser-capable
work. CPU work defaults to `KK_CPU_MODE=balanced`, which leaves system headroom
while still parallelizing independent checks.

The runner is process-local. It does not change global CPU governors, BIOS
settings, kernel settings, or permanent power policy. For system health it sets
bounded Node memory, `UV_THREADPOOL_SIZE`, Node test concurrency, cached ESLint,
and Linux `nice`/`ionice` priority wrappers when available. For GPU routing it
sets fixed NVIDIA PRIME render offload variables, Chrome/Puppeteer executable
paths, and Chrome GPU flags including GPU rasterization and disabled software
rasterizer fallback.

Useful overrides:

```bash
KK_CPU_MODE=performance npm run verify   # more workers, for short focused runs
KK_CPU_MODE=eco npm run dev              # lower pressure while multitasking
KK_MAX_WORKERS=6 npm run test:contracts  # explicit worker cap
KK_DISABLE_NICE=1 npm run build          # disable nice/ionice wrapping
KK_VERIFY_SEQUENTIAL=1 npm run verify    # old sequential verification shape
```

Chrome/Puppeteer/Playwright checks should keep using the project npm scripts or
the same environment variables when launched manually. Browser automation must
use the fixed NVIDIA GPU route where this local machine controls the browser
process. Build, lint, typecheck, Firebase CLI, and Sheets verification remain
CPU/network bound even though they inherit the same GPU environment.

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
- Booking and listing notifications are written to the Firestore notification inbox and delivered through Firebase Cloud Messaging when the user has enabled browser push. The profile dropdown must show the total unread badge, refresh the inbox on open/focus/visibility changes, and revert optimistic read changes if the read API fails. Do not add third-party phone-message providers until one is intentionally introduced.
- Login, register preflight, register session creation, password reset, profile completion, public forms, and client bug reports use Firestore-backed per-IP/per-identifier rate limits. Public form routes should pass the authenticated user id when a session exists so a logged-in user can submit multiple different forms with the same account phone.
- Full registration OTP E2E on the live host uses Firebase fictional phone numbers only. The public register page may call `/api/auth/phone-test-mode`, but that route returns `enabled: true` only when the phone is a configured final-account test number and the caller supplies the matching E2E token. The registration preflight accepts the same token-gated final test numbers so deterministic E2E can continue when Firebase Auth cleanup or reserved final-account state is still visible to the live backend. The token may come from `KK_PHONE_AUTH_TEST_MODE_TOKEN` or be derived from the existing Firebase Admin private key. Do not enable `NEXT_PUBLIC_PHONE_AUTH_TEST_MODE` for the production live site because it is a broad client-side switch.
- Client bug reporting is also throttled and deduplicated in the browser before `/api/bug-reports` is called. The report budget is stored in browser `localStorage`, not only in memory, so route-by-route QA and full navigations do not flood the backend rate limiter. Web-vitals diagnostics should only send poor-rated metrics; needs-improvement metrics are too noisy for production crawls.
- Language preference is server-readable through the `kk_language` cookie and mirrored into `localStorage` for client controls. The root layout must read that cookie and pass `initialLanguage` into `LanguageProvider`; do not reintroduce a client-only initial language because it causes saved-language flashes or hydration mismatches.
- Public requests without a `kisan_kamai_session` cookie must not eagerly import the Firebase-backed session resolver from the root layout. Keep the dynamic session import guarded by the cookie check so anonymous pages avoid unnecessary Firebase/Admin cold-start work.
- Generated marketing images under `/assets/generated/*.png` should have matching optimized `.webp` siblings. App image references should go through `assetPath(...)`, which serves the WebP variant for generated assets while leaving uploaded listing media unchanged.
- Material Symbols are self-hosted at `/public/fonts/material-symbols-outlined.woff2` and preloaded from `app/layout.tsx`. Do not reintroduce the deferred `kk-material-symbols-loader`, a remote-only Google Fonts stylesheet, or an `icon_names` subset URL; if the icon font request fails, ligature icon names can render as visible words.

## Ubuntu Runtime Notes

- Active dependencies are installed into root `node_modules` with `PUPPETEER_SKIP_DOWNLOAD=true npm ci`.
- npm cache is project-local under `.cache/npm`.
- Firebase CLI local state is ignored under `.firebase/`; do not commit VS Code/Firebase logs from that folder.
- Tailwind/PostCSS config is ESM: `tailwind.config.mjs` and `postcss.config.mjs`.
- Next.js 16 builds with Turbopack after removing legacy Pages Router stubs.
- Protected pre-render route checks use the Next.js 16 `proxy.js` file convention; `/list-equipment` is a compatibility redirect, and `/owner-profile/list-equipment` performs server-side session verification before rendering the owner editor.
- Puppeteer browser download is disabled; use `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome`.
- Playwright is intentionally a `devDependency` for rendered QA. On Ubuntu 26.04, Playwright's managed Chromium package may be unavailable; launch Playwright with `executablePath: "/usr/bin/google-chrome"` instead of committing downloaded browser binaries.
- Puppeteer is intentionally a `devDependency`. Do not move it back into production dependencies; browser automation and smoke checks are tooling, not runtime.
- NVIDIA GPU routing is fixed for Chrome/Puppeteer/Playwright rendering checks through the root runner, but build, lint, typecheck, Firebase verification, and Sheets verification remain CPU/network-bound.

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
npm run sheets:decorate
npm run sheets:backfill
```

Use `docs/OPERATIONS_GOOGLE_SHEETS.md` for the workbook model, decoration
scope, backfill scope, and verification flow. Decoration is a presentation
layer only: it must preserve manifest headers, filters, mirrored rows, and
backend data contracts.

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
The cleanup flow also removes the final accounts' reserved `auth-identifiers`
documents so a true registration probe can reuse those test phone numbers.

Live owner/renter account verification:

```bash
npm run live:e2e:final-accounts
```

This uses the final account manifest, resets only the dedicated final test
accounts, runs live owner/renter listing and booking workflows, verifies
in-app notification records, and removes the temporary live E2E listings and
bookings before exiting. For full public registration OTP automation on the
live host, configure Firebase fictional phone numbers with
`npm run firebase:phone-test-numbers`. The E2E token is either the optional
`KK_PHONE_AUTH_TEST_MODE_TOKEN` value or a token derived from the existing
Firebase Admin private key already available to the server and local runner.
The token-gated route enables Firebase's test-only app-verification bypass only
for configured fictional final-account phone numbers; normal production users
keep the real Firebase phone verification path.

## Launch Gate

Run `npm run launch:gate` before any production deploy. It runs the standard root verification, validates Firebase/App Hosting config, compiles Firestore and Storage rules with the debug dry-run mode used by this environment, and verifies the operational workbook with read-only retry handling for transient Google Sheets connection timeouts.

## Bug-Fix Evidence Bundles

Timestamped bug-fix records live under `docs/bug-fixes/<timestamp>-<slug>/`.
Use these bundles for operational evidence that should travel with the repo:

- root-cause notes
- changed-file manifests
- generated artifact copies when useful for review
- verification command summaries
- CodeRabbit or manual review summaries

Do not move canonical runtime files into a bug-fix bundle. Source files, generated docs used by tests, and package lockfiles must remain in their expected project paths; the bundle may contain timestamped copies or notes.

## Public Data Contract

- `/categories` renders the baseline equipment catalog and merges live owner-published categories into it.
- `/catalog/[slug]` is the approved programmatic SEO category page family. It is limited to baseline equipment category slugs, source-controlled category guidance, live listing counts, sitemap entries, and JSON-LD. Do not add category-location pages until they have enough first-party inventory and reviewed local content.
- `/rent-equipment` and `/equipment/[id]` do not render mock listings. Empty public inventory should show a real empty state until owners publish complete listings with images and location details. Keep the search panels compact below the fixed header on the base, query, and empty-state variants, but preserve a visible gap between the empty-state support CTA and the shared footer.
- Public and workspace equipment tiles show availability only from listing data: active/current listings get a green dot, paused or future-available listings get a red dot. Public lists may still show paused complete listings so renters can inspect them, but booking actions must reject them until they become active/current.
- All active Sort/Sorting controls on public rent-equipment and renter browse views must use the shared availability, price-low-to-high, and distance sort contract. Do not add visual-only sort buttons.
- `/feature-request` is a live public form. Keep it wired to `/api/forms/feature-request`, the `feature-request` submission type, and the shared Firestore-backed submission pipeline.
- The footer newsletter is a live public form. Keep it wired to `/api/forms/newsletter-subscription`, the `newsletter-subscription` submission type, and the `newsletter_subscriptions` Sheets tab.
- `/coming-soon` notify submissions are live public form submissions. Keep them wired to `/api/forms/coming-soon-notify`, the `coming-soon-notify` submission type, and the `coming_soon_notifications` Sheets tab.
- `/owner-benefits`, `/support`, and `/forgot-password` intentionally port local HTML visual systems into React page bodies while retaining the shared Kisan Kamai header/footer, auth, theme, and language infrastructure. Do not reintroduce duplicate local nav/footer markup when updating those pages.
- `/owner-benefits` is a client-side owner earnings calculator. The calculator does not create backend, Firestore, or Sheets rows unless a real form is added later; it should use the shared equipment category source, Maharashtra district list, and the local HTML calculator treatment including the `More locations coming soon...` location note.
- `/support` is a live public form. Keep the visible page aligned with the current support content and primary contact, keep the contact form visually aligned with `/home/hkuma/Documents/support.html`, keep the urgent-help panel compact, and keep submissions wired to `/api/forms/support-request`, the `support-request` submission type, and the `support_requests` Sheets tab.
- `/owner-profile/earnings` is an offline booking-value view, not a payment-processing ledger. Show owner-listed rates, booking request counts, booking statuses, estimated rental values, and direct/offline settlement language only. Do not show platform payment states such as processing, paid out, refunded, payout, billing, or settlement handled by Kisan Kamai. Legacy `payments` storage and Sheets tabs are compatibility mirrors for booking values only; new mirror rows must use booking statuses, `Direct Settlement`, and booking-value source labels.
- Booking status changes must stay guarded in the server data layer. Keep tests covering terminal states and actor-specific transitions whenever owner/renter booking actions change.
- `/forgot-password` is an auth flow, not a public form. Keep the supplied `/home/hkuma/Documents/forgetpassword.html` reset layout, cinematic field image, glass form card, and local overlay treatment wired to `/api/auth/password-reset/request` and the existing OTP/new-password routes instead of adding Sheets submissions. Password reset starts from the registered mobile number only; do not reintroduce email reset lookup in the page copy or server resolver.
- Owner and renter workspace route shells must pass `localizedText(...)` titles and subtitles, and main workspace components must use runtime language hooks (`langText(...)` or `LocalizedText`) for visible copy. Do not render inline English/Marathi slash labels in workspace bodies.
- Workspace support, feedback, and settings pages intentionally port `/home/hkuma/Documents/profile-support.html`, `/home/hkuma/Documents/profile_feedback.html`, and `/home/hkuma/Documents/profile-settings.html` into the shared owner/renter workspace shell. Preserve those supplied structures when editing the forms.
- The profile dropdown intentionally ports `/home/hkuma/Documents/profile_dropdown.html` states. Keep the compact profile rows, notification loading/empty/default states, total unread badge, and sign-out row; do not reintroduce Settings or Help rows in that menu. The dropdown notification area is backed by the Firestore notification inbox through `/api/notifications`, `/api/notifications/read-all`, and `/api/notifications/[id]/read`; do not restore fake sample notifications or local-only clear state.
- The public `/report` page is removed from the site. Keep `/api/forms/report` only as a backend compatibility endpoint for existing integrations unless product explicitly removes report submissions entirely.
- Login is phone-number and password only. Registration may collect an optional profile email, but Firebase password auth must resolve credentials from `passwordLoginEmail`, the Firebase Auth user found by phone number, the synthetic `phone.<10-digit>@kisankamai.local` address, and the visible legacy email. Successful login repairs `passwordLoginEmail` so fresh browsers keep working for older accounts.
- Use `npm run auth:repair-password-login-emails -- --dry-run` before `npm run auth:repair-password-login-emails -- --apply` when backfilling legacy users whose password credential email exists in Firebase Auth but not in Firestore.
- Successful registration returns to plain `/login` after the success message. Do not reintroduce `/login?pleaseLogin=1` or a separate please-login query state.
- Auth state must synchronize across tabs with `lib/client/auth-sync.ts` so a successful login/logout refreshes already-open public pages in the same browser profile.
- Profile photo uploads must return and apply the refreshed session immediately, then broadcast `session-refresh`, so the header dropdown and owner/renter workspace chrome update without requiring logout/login. Public equipment detail owner cards should read the latest owner profile/user `photoUrl` instead of relying on a stale listing snapshot.
- Google Maps map/satellite selection is user state. Keep `components/MapComponent.tsx` persisting map type with `kk_google_map_type` and do not hardcode `terrain` over the user's selected view.
- Public pages default to light mode. Dark mode is user-selected only and must keep forms, cards, images, and footer/header contrast readable.
- Mobile dark-mode QA should cover public auth/form pages and workspace pages before release. Dark surfaces must not rely on light-only semantic pairs such as `bg-secondary text-white` or `bg-white text-primary` without explicit dark-mode counterparts.
- Keep `public/fonts/material-symbols-outlined.woff2` subset to the active icon set. Do not restore the full Material Symbols font or remote Google Fonts runtime loader; the subset keeps icons from flashing as words without adding a large first-load payload.
- Root fonts should stay self-hosted through `next/font`. Do not add Google Fonts runtime preconnects unless a real runtime font request is reintroduced.
- Public banner imagery uses the shared `kk-banner-image-overlay` treatment. Do not apply that overlay to equipment listing/product photos because renters need to inspect machine images clearly.
- Category tiles must keep their baseline catalog images. Owner-uploaded equipment photos should only affect listing cards and equipment detail galleries.
- Ratings are equipment-only. Do not show owner/renter profile ratings, trust badges, or verification-rating pills in workspace profiles, booking cards, or owner cards. Equipment cards, saved equipment tiles, owner earnings cards, and equipment detail pages may show stars or rating numbers only through `getVisibleEquipmentRating(...)`, which requires both a positive equipment rating and a positive real `ratingCount`/`reviewCount`/`ratingsCount`. Seeded or owner-created listings must not default to fake 4.x ratings.
- Owner listing image uploads are limited to 1-3 real equipment photos. The first photo remains the cover image; all uploaded photos must remain public in logged-out and logged-in listing views, equipment detail thumbnails must allow switching the main photo, and users must be able to remove a selected photo slot before submitting.
- `/owner-profile/list-equipment` does not render a live preview tile. Listing create/edit uses the workspace form only, with three photo slots, owner-controlled availability (`now`, `date`, or `temporarily unavailable`), and the shared submit animation.
- Public `/equipment/[id]` routes redirect authenticated users into their active workspace detail route. Unauthenticated users stay on the public detail page and must see the login/register toast when trying to book without a session.
- Equipment detail booking requests collect field location and optional field pincode in the public form. Mirror the pincode as `field_pincode` in `booking_requests` while keeping older API callers compatible.
- Owner workspace dashboard and booking pages should stay operational and compact: do not reintroduce the removed owner KPI tiles, Fleet Snapshot tile, Manage Equipment CTA inside bookings, or owner-side Track actions. Owner bookings use details, call, approve, and decline actions only.
- Owner workspace settings, feedback, and support forms use compact responsive layouts with balanced columns on desktop and a single-column flow on mobile. Avoid full-height centering that creates large empty gaps in these profile pages.
- Primary submit/CTA controls should use the shared `kk-flow-button` and `kk-flow-spinner` animation primitives instead of one-off pulse/spinner treatments.
- Route/page changes should use the native React view-transition path: keep `experimental.viewTransition` enabled, keep page bodies inside pathname-keyed `PageViewTransition`, and route internal links through `AppLink` so `transitionTypes` are applied consistently. Public header/footer and workspace side/header/mobile nav are persistent transition elements and should not be renamed without updating the global view-transition CSS and contracts.
- Async form submissions must use explicit request lifecycle state (`isSubmitting`/`setIsSubmitting`) instead of React `useTransition` as the network pending source. This keeps submit buttons disabled, loaders visible, and duplicate submissions blocked until the POST/server action actually settles.
- The home hero should keep only the active hero image in the initial render, defer the homepage map until it enters the viewport, and avoid auto-rotating the hero carousel during the first Lighthouse/Core Web Vitals window. Manual carousel controls may still change the hero immediately.
- Small tile/card surfaces should use the shared `kk-depth-tile` treatment. Pointer-driven depth is installed globally by `components/DepthMotion.tsx` and must respect reduced-motion settings.
- Sentence-length body copy is justified globally from `app/globals.css` for public and workspace pages on desktop and mobile. Keep navigation, buttons, inputs, labels, and form helper/error text start-aligned so controls remain readable.
- Form rows mirror to Google Sheets with pending notification metadata. Keep email delivery in the bound Sheets Apps Script only when the workbook owner wants sheet-side alerts.
