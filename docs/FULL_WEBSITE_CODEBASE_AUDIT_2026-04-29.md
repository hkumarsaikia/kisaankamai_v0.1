# Kisan Kamai Full Website and Codebase Audit

Date: 2026-04-29
Repository: `/home/hkuma/Work/kisan_kamai`
Production target documented in repo: `https://www.kisankamai.com`
Scope: root Next.js app, public pages, auth flows, owner/renter workspaces, API routes, Firebase data layer, Firebase rules, scripts, tests, and documentation.

## Audit Boundary

This file was originally created as a report-only audit. The implementation follow-up below records the fixes made after the follow-up request to address the issues in this report.

2026-05-08 follow-up:

- Booking status transitions are now guarded server-side by actor and current status in the Firebase data layer.
- Sort dropdown options are no longer keyboard-focusable while the animated dropdown is closed.
- Puppeteer is now dev-only browser automation tooling, with high production transitive advisories reduced through narrow npm overrides.
- `FINAL_TEST_ACCOUNT_LOGIN_GUIDE.md` is ignored so local credential notes are not accidentally committed.
- Static site-map artifacts were regenerated and dynamic template destinations are sanitized before docs rendering.
- Timestamped evidence for this review-driven hardening lives in `docs/bug-fixes/2026-05-08-235352-IST-code-review-hardening/`.

The findings below are based on static source inspection of the current checkout. I did not run `npm run dev`, `npm run verify`, browser smoke tests, Firebase emulators, Firebase production checks, or live website checks during this pass.

## Implementation Follow-up

Status as of the 2026-04-29 fix pass:

- Public listings now require owner-uploaded media before publication/activation; generated fallback images are not accepted for public readiness.
- Newly created owner listings no longer auto-claim verified status or inject a `Verified` tag.
- The owner listing editor uses the shared baseline equipment category catalog.
- `/owner-registration` is now a compatibility redirect to `/list-equipment`.
- `/renter-profile/earnings` no longer redirects renters into owner earnings; it points renter users back to booking activity and browse flows.
- `/report` now posts to `/api/forms/report` and stores a first-class `report` submission type.
- Auth session changes are synchronized across browser tabs through `lib/client/auth-sync.ts`.
- Google Maps map/satellite selection is persisted in `components/MapComponent.tsx` so user-selected satellite view is not overwritten by a hardcoded map type.
- Login, register preflight, register session creation, password reset, profile completion, public forms, and client bug reports now use a shared Firestore-backed rate limiter.
- Booking creation now blocks conflicting date ranges and returns the existing booking for exact duplicate renter/listing/date requests.
- `docs/SETUP.md`, `docs/DEVELOPMENT.md`, and `README.md` were updated to keep the phone-only auth, report, rate-limit, auth-sync, and map-type contracts explicit.

Remaining work that is still intentionally not solved by this pass:

- Admin/moderation UI for identity documents, owner verification, report triage, support assignment, and listing review.
- Captcha or third-party bot protection beyond the Firestore-backed throttles.
- Retention/deletion policy for bug reports, form submissions, identity documents, and uploaded media.
- Full replacement of legacy disabled Google helper code such as `components/auth/GoogleAuthButton.tsx`.
- Regeneration of the static generated site-map artifacts if those generated docs are part of the release artifact set.

## Executive Summary

The codebase is now a real Firebase-backed Next.js App Router application, not just a static mockup. The main public marketplace routes read from Firestore through server-side data helpers. Phone-only auth, registration OTP, password reset OTP, session cookies, profile selection, owner/renter workspaces, listing creation, booking creation, saved listings, public forms, bug reporting, FCM notifications, and Google Sheets mirroring all have code paths in place.

The strongest current parts are:

- Root app structure is coherent and App Router-only.
- Public equipment pages no longer ship a local mock equipment list.
- Login is phone/password only, with legacy password-login email repair logic.
- Registration preflights duplicate phone and optional email before OTP.
- Sessions use Firebase Admin session cookies with a 14-day max age.
- Core owner/renter profile pages are mostly data-backed.
- Public forms use Zod schemas and Firestore-backed submission storage for most routes.
- Firestore and Storage rules exist and block direct client access to sensitive form/bug collections.
- Contract tests cover many of the recent requirements: phone-only auth, dark-mode contracts, route chrome, category baselines, no mock public equipment exports, and workflow routing.

The biggest gaps still remaining are:

- Listing publication can still create active public-ready listings with a generated fallback image if the owner uploads no real image.
- New owner listings are marked `ownerVerified: true`, `rating: 4.8`, and `tags: ["Verified"]` without an actual verification or moderation workflow.
- The real owner listing form only supports a small category subset, while the public catalog supports many more categories.
- `/owner-registration` is a second, mostly static owner listing page that is not wired to the real listing save flow.
- `/renter-profile/earnings` redirects to owner earnings, which is a product and routing mismatch.
- The report page submits to the support-request API and loses report-specific semantics in the backend.
- Several mutation routes bypass the shared `parseJsonBody()` helper and therefore miss the same-origin/content-type/body-size checks used elsewhere.
- Public form APIs have no rate limiting, captcha, abuse throttle, or spam defense.
- Documentation still conflicts about Google auth being enabled vs disabled.
- Legacy/dead components and generated site-map docs still reference older flows.

## Current Architecture

The active app is the root Next.js application.

```text
Browser
  |
  v
Next.js App Router
  |-- public routes: home, categories, rent-equipment, support, report, etc.
  |-- auth routes: login, register, forgot-password, profile-selection
  |-- workspace routes: owner-profile, renter-profile, list-equipment
  |
  v
Server actions and API routes
  |-- local-auth session cookie bridge
  |-- Firebase Admin Auth
  |-- Firestore data helpers
  |-- Cloud Storage upload helper
  |-- FCM notification helper
  |-- Google Sheets best-effort mirror
  |-- bug reporting and runtime logging
  |
  v
Firebase project `gokisaan`
  |-- Authentication
  |-- Cloud Firestore
  |-- Cloud Storage
  |-- Cloud Messaging
  |-- App Hosting
```

Important source areas:

- App routes: `app/`
- Shared components: `components/`
- Data contracts and actions: `lib/`
- Firebase rules: `firebase/firestore.rules`, `firebase/storage.rules`
- Operational scripts: `scripts/`
- Contract tests: `tests/`
- Docs: `README.md`, `docs/`

## Deployment and Runtime Configuration

Observed production hosting configuration:

- Firebase App Hosting config is in `apphosting.yaml`.
- `NEXT_PUBLIC_SITE_URL` is set to `https://www.kisankamai.com`.
- Firebase project is `gokisaan`.
- Runtime config uses `maxInstances: 10`, `concurrency: 40`, `cpu: 1`, `memoryMiB: 1024`.
- `minInstances: 0` means cold starts are allowed.
- Firebase Admin secrets are configured through App Hosting secrets.
- Google Maps API key is configured as a secret.
- Google Sheets ID is configured in `apphosting.yaml`.
- Public Firebase browser config is intentionally exposed as `NEXT_PUBLIC_*`.

Risks and updates needed:

- `minInstances: 0` is cost-efficient but can cause first-request latency. If the site becomes user-facing for real traffic, consider whether one warm instance is worth the cost.
- `maxInstances: 10` and `concurrency: 40` are reasonable for an early launch, but should be revisited when booking, listing, and OTP traffic grows.
- No separate staging App Hosting target was found in the inspected config. A staging target would reduce risk before live changes.
- Optional Sentry remains in the runtime wrapper and package set. This is not blocking because tests intentionally keep Sentry optional, but it is still a production dependency path.

## Package and Tooling State

Observed versions in `package.json`:

- Next.js: `^16.2.4`
- React: `^19.2.5`
- TypeScript: `^6.0.3`
- Tailwind CSS: `^4.2.4`
- Firebase client SDK: `^12.12.1`
- Firebase Admin: `^13.8.0`
- ESLint: `^9.39.4`
- Puppeteer: `^24.42.0` in `devDependencies` only
- Sentry Next.js: `^10.50.0`

Observed scripts:

- Development: `npm run dev`, `npm run dev:logged`, `npm run dev:public`, `npm run tunnel:public`
- Validation: `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:contracts`, `npm run verify`
- Launch gate: `npm run launch:gate`
- Firebase: `npm run firebase:preflight`, `npm run firebase:rules:dry-run`, `npm run firebase:deploy`
- Sheets: `npm run sheets:bootstrap`, `npm run sheets:verify`, `npm run sheets:backfill`
- Auth repair: `npm run auth:repair-password-login-emails`
- Mock-listing cleanup: `npm run pause:mock-listings`
- Live repo sync and Discord notify scripts exist.

Upgrade/update notes:

- I did not query npm registries in this audit, so I cannot confirm whether these are the latest available versions today.
- The stack is already very modern. The higher-risk upgrade work is not "upgrade everything"; it is keeping Next 16, React 19, Tailwind 4, Firebase 12/13, and TypeScript 6 contract tests passing together.
- The Sentry dependency should be intentionally kept or removed. Right now the repo says Sentry is optional, but the app still wraps Next config with Sentry when build env is configured.
- Puppeteer should continue using system Chrome on Ubuntu with `PUPPETEER_SKIP_DOWNLOAD=true` as documented and must remain out of production dependencies.

## Route Inventory and Status

### Public discovery and content routes

| Route | Current state | Main issues |
| --- | --- | --- |
| `/` | Real home page with hero, search, categories, map, trust, FAQ, CTA, register tile. | Heavy external image reliance. Needs runtime visual verification after every major dark-mode change. |
| `/rent-equipment` | Data-backed public equipment list from complete active Firestore listings. | Empty-state copy is now cleaner, but filtering depends on category aliases and data consistency. |
| `/rent-equipment?query=...` | Query filters by category/name/tags/work types/location. | If owners cannot choose full category set during listing, query pages for many categories will stay empty. |
| `/equipment/[id]` | Data-backed detail page; hides incomplete listings by returning not found. | UI shows a service fee in detail booking estimate while backend booking amount stores only hourly amount. |
| `/categories` | Shows baseline catalog and merges live categories from owner listings. | Page copy says categories are published by owners, but baseline categories always appear even with zero inventory. |
| `/about` | Updated team names without old photos. | Uses static marketing claims such as district/user/equipment counts that are not data-backed. |
| `/owner-benefits` | Interactive earning calculator exists and expanded equipment categories are present in code. | Calculator is illustrative; not backed by actual local utilization or booking data. |
| `/how-it-works` | Public explanatory route. | Several sections use strong claims that need product/legal alignment with manual/offline marketplace model. |
| `/terms` | Public terms and safety content. | Needs legal review before real launch; contains product safety rules but no enforcement/admin workflow behind them. |
| `/partner` | Partner inquiry route with live form API. | No rate limiting/captcha on public inquiry form. |
| `/support` | Live support form plus direct contact channels. | Support data goes to generic support submissions; no ticket lifecycle/admin console. |
| `/report` | Public report UI with categories and urgency. | Submits to support-request API rather than a report-specific backend type. |
| `/feature-request` | Live feature request form with Firestore-backed `feature-request` type. | No captcha/rate limit/spam controls. |
| `/feedback` | Live feedback form exists. | Needs abuse controls and admin review workflow. |
| `/coming-soon` | Operating-area and app-notify style route. | Notify behavior should be verified live; map/API-key behavior depends on production Google Maps config. |
| `/faq`, `/legal`, `/trust-safety`, `/owner-experience` | Present as public content routes. | Not all were deeply browser-verified; some content may be stale against the current phone-only/manual marketplace model. |

### Auth and account routes

| Route | Current state | Main issues |
| --- | --- | --- |
| `/login` | Phone number plus password only. Redirects successful users to `/profile-selection` or `/complete-profile`. | Live login still requires production Firebase Auth and Firestore user records to be aligned. Legacy accounts may need the repair script. |
| `/register` | Firebase phone OTP registration with optional email metadata, password, profile details, duplicate preflight. | Uses Firebase phone auth and temporary browser state; live behavior depends on phone auth/reCAPTCHA configuration. |
| `/register/success` | Registration success page. | Should remain plain login redirect flow, no `/login?pleaseLogin=1`. |
| `/register/google-email` | Redirects back to `/register`. | Exists only as compatibility route after Google auth disablement. |
| `/forgot-password` | Mobile-number-only reset lookup. | Endpoint bypasses shared same-origin/body-size helper. |
| `/forgot-password/verify-otp` | Firebase phone OTP verification for reset. | Depends on browser temporary storage and Firebase phone auth availability. |
| `/forgot-password/new-password` | New password form posts reset token/password to server. | Endpoint bypasses shared same-origin/body-size helper. |
| `/forgot-password/success` | Success page. | Visual state should be browser-smoked after future theme changes. |
| `/complete-profile` | Session-protected profile completion. | Uses text inputs for phone/pincode/location; should align with registration district dropdown and duplicate identifier policy. |
| `/profile-selection` | Session-protected owner/renter selection. | Stores a workspace preference, not separate role-specific profiles. That may be fine, but it should be intentional. |
| `/logout` | Clears session cookies. | POST route has no same-origin check. |

### Workspace routes

| Route | Current state | Main issues |
| --- | --- | --- |
| `/owner-profile` | Data-backed dashboard with listings, bookings, payments. | Some fallback placeholders remain when data is missing. |
| `/owner-profile/browse` | Owner equipment browser. | Depends on owner listings and can edit via listing IDs. |
| `/owner-profile/bookings` | Owner booking board. | Booking workflow is status-based and manual, no calendar conflict checks. |
| `/owner-profile/earnings` | Data-backed owner revenue panel from payments/bookings/listings. | Payment records are manual confirmation records, not real payment processor records. |
| `/owner-profile/settings` | Shared profile settings form. | District remains free text here while registration uses Maharashtra district list. |
| `/owner-profile/saved` | Redirects to owner browse. | Acceptable if intentional, but route name is confusing for owners. |
| `/owner-profile/support`, `/owner-profile/feedback` | Workspace support/feedback forms. | No full ticket lifecycle. |
| `/renter-profile` | Data-backed renter dashboard. | No renter earnings should exist unless business model changes. |
| `/renter-profile/browse` | Data-backed equipment browsing. | Depends on public inventory readiness. |
| `/renter-profile/bookings` | Renter booking board. | Booking lifecycle is manual and owner-managed. |
| `/renter-profile/saved` | Saved equipment board. | Works from saved-items data. |
| `/renter-profile/settings`, `/renter-profile/support`, `/renter-profile/feedback` | Shared workspace utilities. | Same profile settings caveats as owner settings. |
| `/renter-profile/earnings` | Redirects to `/owner-profile/earnings`. | This is a product bug unless renter earnings are intentionally mapped to owner revenue. |
| `/list-equipment` | Real authenticated owner listing editor using server actions and Firebase Storage. | Category coverage, image requirements, verified defaults, and publication rules need fixing. |
| `/owner-registration` | Separate static-looking listing page with hard-coded preview and no real save flow. | Should be removed, redirected to `/list-equipment`, or wired to the same backend. |

## Frontend Audit

### Global shell

The global shell is in `app/layout.tsx`, `components/SiteChrome.tsx`, `components/Header.tsx`, `components/Footer.tsx`, and `lib/site-chrome-routes.js`.

Current behavior:

- Header and footer are global by default.
- Workspace routes and `/list-equipment` intentionally bypass the standard public chrome.
- Light mode is the default and system dark mode is disabled.
- Language provider defaults from the server language and applies saved language later.
- Route transitions are a low-opacity fade through `RouteTransitionShell`.
- Public route `loading.tsx` files currently return `null`, matching the user's request to remove the old visible loading animation.

Issues:

- The workspace routes use their own shell instead of the global footer/header. If the product requirement is literally "all pages must have header and footer", this conflicts with the current workspace UX decision.
- The footer newsletter input appears UI-only in `components/Footer.tsx`; no inspected API route handles newsletter signup.
- The Material Symbols font is loaded through Google Fonts. If privacy/performance matters, consider local font hosting or reducing reliance.

### Theme and dark mode

Current assets:

- Shared theme variables live in `app/globals.css`.
- Dark-mode visual contracts exist in `tests/dark-mode-visual-contracts.test.mjs`.
- Auth pages use `kk-auth-*` classes.
- Public imagery tests assert that selected public routes do not use full-page wash overlays.
- Action animation primitives exist: `kk-flow-button`, `kk-flow-spinner`, `kk-login-toast`.

What is good:

- Dark mode now has centralized tokens.
- Many previously reported contrast issues have contract tests.
- Public loading fallbacks are null.
- Shared animation primitives reduce one-off spinner/pulse patterns.

Risks still present:

- Dark mode is only contract-tested at source level in this audit. It still needs actual browser screenshots across desktop/mobile viewports.
- Some older pages not included in the main dark-mode contract list may still have one-off color classes.
- Several content pages use remote `lh3.googleusercontent.com` images directly. If those images change or become unavailable, visual quality can degrade.
- Auth/OTP pages intentionally still use `kk-dark-image-overlay`; public pages should not reintroduce the washed image effect.

### Public marketplace UI

Current behavior:

- Home search routes users to `/rent-equipment` with query and location parameters.
- Categories are baseline plus live merged categories.
- Public equipment lists use Firestore listings transformed through `listingToEquipmentRecord()`.
- Public readiness requires active listing status, name, category, location, district, description, ownerName, coverImage, galleryImages, workTypes, and positive price.

Issues:

- `app/categories/page.tsx` says users can browse live categories published by owners, but baseline categories are shown even without owner-published inventory.
- `/rent-equipment` can show empty states for categories that the owner listing form cannot actually produce because listing category controls are too limited.
- Equipment detail booking estimate includes a hard-coded service fee in UI, while backend booking creation records only hourly amount. This can confuse renters and owners.
- The platform says it does not process online payment, so any "service fee" UI needs product clarification or removal.

### Owner listing UI

Real listing entry point:

- `/list-equipment` uses `components/owner-profile/ListEquipmentEditorPage.tsx`.
- It saves through `createListingAction()` and `updateListingAction()`.
- It uploads images through `uploadListingImage()`.

Problems:

- The real editor offers only `tractor`, `harvester`, `implement`, and `seeder`.
- Public catalog supports many more categories: tractors, harvesters, implements, ploughs, sprayers, rotavators, seeders, threshers, pumps, balers, trolleys.
- `components/forms/OwnerListingWizard.tsx` exists but is not imported anywhere. It supports only tractor/harvester/implement and looks like a stale or unused listing form.
- `components/OwnerSidebar.tsx` and `components/workspace/OwnerWorkspaceOverview.tsx` still link to `/owner-registration`, not consistently to `/list-equipment`.
- `/owner-registration` contains a static form-like UI with hard-coded preview content and no submit/save integration.

This is one of the most important cleanup areas because owner listing is core product functionality.

### Profile and workspace UI

Good current state:

- `owner-profile` dashboard is data-backed.
- Owner bookings and renter bookings are data-backed.
- Saved listings are data-backed.
- Profile settings submit to `/api/profile/complete`.
- Workspace routing helpers exist in `lib/workspace-routing.js`.

Issues:

- `/renter-profile/earnings` redirects to `/owner-profile/earnings`; this is not a valid renter flow unless the business decides renters can become owners from that route.
- Settings allow district as free text while register has a Maharashtra district list. This can create inconsistent location data.
- Placeholder images still exist in profile boards when related listing images are missing:
  - `components/profile/OwnerBookingsBoard.tsx`
  - `components/renter-profile/RenterBookingsBoard.tsx`
  - `app/owner-profile/page.tsx`
  - `components/owner-profile/ListEquipmentEditorPage.tsx`
- These placeholders do not appear to be public marketplace mock listings, but they are still placeholder dependencies.

### Legacy and stale frontend code

Files that appear legacy, compatibility-only, or unused:

- `components/auth/LoginClient.tsx`
- `components/auth/RegisterClient.tsx`
- `components/auth/GoogleAuthButton.tsx`
- `components/forms/OwnerListingWizard.tsx`
- `components/owner-profile/OwnerProfileViews.tsx`
- `components/renter-profile/RenterProfileViews.tsx`

Some tests still read older view files directly, which means those files are not fully dead from the test suite's perspective even if not imported by active pages. This creates confusion: a future developer could modify or reuse an old component thinking it is active product code.

Recommendation:

- Mark inactive components explicitly, move them under a clear archive folder that is not imported/tested, or delete them after confirming no route imports them.
- Update tests to assert active routes/components instead of preserving old component internals.

## Backend and API Audit

### Auth API

Current phone-only auth flow:

- `/api/auth/login` uses `parseJsonBody()` and `loginInputSchema`.
- `loginWithPhoneDetailed()` finds users by phone and tries multiple password-login email candidates.
- Successful login sets a Firebase Admin session cookie.
- Unknown phone returns `not-found`.
- Wrong password returns `invalid-password`.
- `/api/auth/google/resolve` and `/api/auth/google/register` return HTTP 410.
- `/register/google-email` redirects to `/register`.

Good:

- The login logic addresses the earlier "correct password fails on fresh browser" class of problem by trying `passwordLoginEmail`, Firebase Auth email by phone, synthetic `phone.<digits>@kisankamai.local`, and visible email.
- Successful password login repairs `passwordLoginEmail`.
- Sessions persist for 14 days.

Remaining risk:

- Legacy users whose Firebase Auth credential email is not discoverable by the current candidate list may still require `npm run auth:repair-password-login-emails`.
- Login depends on Identity Toolkit password sign-in with the public Firebase API key and referer. Any production Firebase API key restrictions must allow the canonical and apex domains.
- `/api/auth/logout` does not call `ensureSameOrigin()`.

### Registration API

Current flow:

- `/register` preflights duplicate phone/email with `/api/auth/register/preflight`.
- Firebase phone OTP verifies the phone client-side.
- `/api/auth/session` or `/api/auth/register` creates the server session/profile/user data through `createFirebaseBackedSession()`.
- `createOrUpdatePasswordLoginCredential()` writes the synthetic password email credential to Firebase Auth and stores `passwordLoginEmail`.

Good:

- Duplicate phone/email checks consult Firestore users, `auth-identifiers`, and Firebase Auth.
- Identifier reservation uses transaction logic.
- Optional email is metadata, not a login identifier.

Issues:

- `/api/auth/register/preflight`, `/api/auth/register`, and `/api/auth/session` parse `request.json()` directly instead of using the shared `parseJsonBody()` helper. They do not get the same content-type, body-size, and same-origin behavior used by `/api/auth/login`.
- `/api/auth/register/preflight` can be spammed to test whether phone/email identifiers exist. It needs rate limiting and abuse monitoring.
- Registration storage for verification documents collects metadata, but no admin review workflow was found.

### Password reset API

Current flow:

- `/forgot-password` accepts mobile number only.
- `/api/auth/password-reset/request` checks that account exists and returns E.164 phone plus masked phone.
- `/forgot-password/verify-otp` sends Firebase phone OTP.
- `/forgot-password/new-password` posts ID token and new password to `/api/auth/password-reset/complete`.
- `completePasswordResetFromIdToken()` verifies the token and updates the password login credential.

Good:

- Reset requires verified phone ownership.
- Email reset is intentionally disabled.
- New password writes through the same credential writer used by registration.

Issues:

- `/api/auth/password-reset/request` and `/api/auth/password-reset/complete` parse `request.json()` directly rather than `parseJsonBody()`.
- Reset flow depends on browser temporary storage. If storage is blocked or cleared between steps, user must restart.
- No per-phone or per-IP reset attempt throttling was found.
- No admin alerting exists for repeated reset attempts against one phone number.

### Form APIs

Routes using shared parsing:

- `/api/forms/support-request`
- `/api/forms/feature-request`
- `/api/forms/feedback`
- `/api/forms/owner-application`
- `/api/forms/booking-request`
- `/api/forms/partner-inquiry`
- `/api/forms/callback-request`
- `/api/i18n/fallback`
- `/api/profile/complete`
- `/api/auth/login`

Good:

- These routes use Zod schemas.
- They call `parseJsonBody()`, which checks content type, size, and same-origin.
- Form submissions are persisted to `form-submissions`.
- Sheets mirroring is best-effort.

Problems:

- No captcha, rate limit, IP throttle, user throttle, or abuse queue was found for public forms.
- `assertMutationRequestAllowed()` exists but is a no-op.
- `/report` posts to `/api/forms/support-request` with `sourcePath: "/report"` rather than a dedicated `report` submission type.
- `support-request` and `report` therefore share storage semantics, which makes triage and analytics weaker.
- There is no admin UI or internal queue for submissions.

### Booking backend

Current behavior:

- Booking can be created through server action `createBookingAction()` or `/api/forms/booking-request`.
- Booking requires an authenticated renter.
- Owner and renter can read relevant bookings through Firestore rules.
- Owner can update booking status; renter can cancel.
- FCM notification code exists for booking/listing events.
- Payment record is manual confirmation, not real payment processing.

Issues:

- No availability conflict check was found. Multiple renters can request the same equipment for the same date.
- No booking idempotency key was found. Duplicate clicks/network retries can create duplicate requests.
- Resolved 2026-05-08: booking status transitions are now guarded by an actor/current-status matrix before Firestore writes.
- No owner approval SLA, expiry, or reminder flow was found.
- UI and backend amount calculation need alignment on service fee/no-fee policy.

### Listing backend

Current behavior:

- `createListingAction()` writes listings to Firestore.
- `updateListingAction()` edits owner-owned listings.
- `toggleListingStatusAction()` changes active/paused.
- `deleteListingAction()` deletes owner-owned listings and removes uploaded storage objects.
- Public listing queries filter incomplete records through `isPublicListingReady()`.

Critical issues:

- If no image is uploaded, `createListingAction()` sets `coverImage` to `/assets/generated/hero_tractor.png` and `galleryImages` to that same generated image. This allows a listing to become public with generic site imagery.
- New listings default to `ownerVerified: true`.
- New listings default to `rating: 4.8`.
- New listings default to `tags: ["Verified"]`.
- There is no approval/moderation status beyond `active` and `paused`.
- There is no admin verification workflow before a listing can be active.

These defaults conflict with a real trust-based rental marketplace. They can make unverified equipment and owners appear verified.

Recommended model:

- Add a listing lifecycle: `draft`, `submitted`, `under_review`, `active`, `paused`, `rejected`.
- Require at least one real uploaded image before `active`.
- Default `ownerVerified` to false until verified by admin.
- Do not assign a rating until real reviews exist.
- Replace freeform tags like "Verified" with system-controlled badges.

## Firebase Data Model Audit

Observed Firestore collections:

- `users`
- `profiles`
- `listings`
- `bookings`
- `payments`
- `saved-items`
- `form-submissions`
- `bug-reports`
- `auth-identifiers`

### Users and profiles

Good:

- User and profile data are separated.
- `auth-identifiers` helps enforce unique phone/email.
- `passwordLoginEmail` supports synthetic phone-password Firebase Auth login.
- `photoUrl` exists in session/profile contracts.

Issues:

- Firestore rules `userKeys()` do not include fields like `passwordLoginEmail` and `photoUrl`, although server code writes them with Admin SDK. This is acceptable for Admin writes but creates schema drift if future client writes are introduced.
- Profile rules allow only `verificationStatus` values `not_submitted` and `submitted`. There is no `approved`, `rejected`, or `needs_more_info`.
- There is no admin collection or role/claims model visible for moderators.

### Listings

Good:

- Public listing readiness filter prevents many incomplete records from appearing.
- Owner ownership is stored as `ownerUserId`.
- Listing image storage paths are tracked.

Issues:

- No server-side image content sniffing beyond browser-supplied file MIME type.
- No virus/malware scanning for identity documents or listing images.
- No dimensions/quality checks for listing photos.
- No moderation metadata such as reviewer, reason, approval time, rejection reason.
- Rating/trust fields are writable through owner update path in Firestore rules if owner uses direct client access in the future.

### Bookings and payments

Good:

- Booking read access is scoped to owner/renter.
- Renter creates pending bookings.
- Renter can cancel.
- Payment writes are blocked in client rules.

Issues:

- Payment record means "manual confirmation" but the app still has payment issue report categories and price/fee displays. Product copy should consistently say this is an offline owner-managed deal.
- No payment processor or ledger reconciliation exists.
- No dispute state or refund state exists.

### Form submissions and bug reports

Good:

- Client reads/writes are denied in Firestore rules.
- Server/Admin writes control these collections.
- Sheets mirror gives operational visibility.

Issues:

- There is no admin dashboard to process these records.
- There is no retention policy or archival policy in the repo.
- There is no spam/rate-limit layer.

## Firebase Rules Audit

### Firestore rules

Good:

- Users/profiles are self-read/write scoped.
- Listings are public read, owner write.
- Bookings are owner/renter read scoped.
- Payments are read-only to parties and no client writes.
- Saved items are self-owned.
- Form submissions and bug reports are denied to clients.

Issues:

- Direct client listing writes could set trust fields because rules allow `ownerVerified`, `rating`, and `tags`.
- Listing statuses are only `active` and `paused`. This is not enough for review/moderation.
- Booking status update rules allow any valid status by owner, plus renter cancellation, but do not enforce transition order.
- `auth-identifiers` has no explicit match block, which means client access falls to deny-all. That is good, but document this because it is important.
- `userKeys()` and server-written user fields are not fully aligned.
- `firestore.indexes.json` is empty. Current queries appear mostly simple, but search/sort/filter growth will likely need indexes.

### Storage rules

Good:

- Listing images are public read and owner write.
- Profile verification docs are owner-only read/write.
- File size limit is 8 MB.
- Listing content types are restricted to common images.
- Verification docs allow image or PDF.

Issues:

- Client rules trust MIME type. Server upload helper also stores `file.type`; it does not sniff actual file content.
- No malware scan or document review workflow exists.
- Profile verification docs are user-readable but not clearly admin-reviewed in code.

## Authentication and Account Flow Audit

### Login

Current intended behavior:

1. User enters registered mobile number.
2. User enters password set during registration/reset.
3. Server tries all known password-login email shapes.
4. Server creates session cookie.
5. User goes to `/profile-selection` or `/complete-profile`.

Remaining things to verify manually:

- Existing legacy accounts can log in on a clean browser.
- New registrations can log in immediately after success.
- Wrong password shows the correct invalid-password state.
- Unknown phone shows the register-first toast for the intended duration.
- Session persists across browser refreshes and route changes until logout.
- Apex domain and www domain both accept login POST without cross-origin rejection.

### Registration

Current intended behavior:

1. User enters full profile and password.
2. Duplicate phone/email preflight runs.
3. Firebase phone OTP is sent only if identifiers are available.
4. OTP creates Firebase session/profile/user/password credential.
5. Server logs the user out and sends user back to plain `/login`.

Remaining things to verify manually:

- Duplicate phone stops before OTP.
- Duplicate optional email stops before OTP.
- New number receives OTP.
- Correct OTP creates account.
- Incorrect OTP shows Firebase error without creating account.
- Identity document upload succeeds in Storage.
- Identity document metadata appears in profile.

### Google auth

Current state:

- Login and register pages no longer render Google buttons.
- Google auth API routes return HTTP 410.
- Google email route redirects to `/register`.

Gaps:

- `components/auth/GoogleAuthButton.tsx` still contains Google popup logic.
- `registerGoogleVerifiedUser()` still exists in `lib/server/firebase-data.ts`.
- Resolved in docs: `docs/SETUP.md` and `docs/DEVELOPMENT.md` now state that Google sign-in/registration is disabled and the public auth flow is phone-only.

Recommendation:

- Either fully remove legacy Google code/docs or explicitly label them as archived disabled code.
- Keep setup/development docs aligned so future setup does not re-enable Google auth by mistake.

## Notifications Audit

Current state:

- Notification implementation is Firebase Cloud Messaging only.
- `sendPushNotificationToUsers()` loads `fcmTokens` from user docs.
- Invalid FCM tokens are pruned.
- Booking/listing notifications call FCM helpers.
- No MSG91/Twilio/SMS code was found in active booking/listing workflow.

Limitations:

- Browser push requires user permission and token registration.
- FCM web push does not guarantee delivery like SMS.
- No fallback channel exists for critical booking events.
- No notifications inbox page was found.
- No admin notification dashboard was found.

This matches the earlier "avoid MSG91 for now" direction, but product copy should not promise SMS until SMS is actually implemented.

## Google Sheets and Operations Audit

Current state:

- Google Sheets is documented as best-effort operational mirror.
- Scripts exist for bootstrap, verify, and backfill.
- Auth, profile, listing, booking/payment, submissions, and bug reports have mirroring logic.
- The launch gate includes `sheets:verify`.

Risks:

- Sheets is not the database of record, but it can become operationally important. If Sheets mirror fails silently for long enough, support/admin visibility can drift.
- There is no admin web console to replace or complement Sheets.
- Docs should clearly tell operators not to edit Sheets as if it were the source of truth.

## Observability and Bug Reporting Audit

Current state:

- `lib/server/bug-reporting.ts` captures server/action/route errors and client envelopes.
- Sensitive fields such as password, token, cookie, authorization, OTP, idToken, and refreshToken are redacted from request payloads.
- Some event dedupe exists for soft warning/info events.
- Bug reports can mirror to Firestore and Sheets.
- Optional Sentry remains wired through instrumentation/config.

Issues:

- No user-facing admin triage dashboard.
- No retention or deletion policy for bug reports.
- No alerting threshold for repeated login failures, reset attempts, registration failures, or booking failures.
- `/api/bug-reports` uses same-origin check but not full `parseJsonBody()` body-size/content-type validation.

## Security Audit

### Strengths

- Firebase Admin session cookies are httpOnly, sameSite=lax, secure in production.
- Most JSON form APIs enforce same-origin, content-type, and 64 KB body limit through `parseJsonBody()`.
- Firestore rules deny direct client access to form submissions and bug reports.
- Storage rules limit size and content types.
- Registration reserves phone/email identifiers.
- Google auth is disabled at the application layer.

### Main security gaps

- Several auth mutation routes parse raw JSON directly:
  - `/api/auth/register/preflight`
  - `/api/auth/register`
  - `/api/auth/session`
  - `/api/auth/password-reset/request`
  - `/api/auth/password-reset/complete`
  - `/api/auth/logout`
- Public forms lack rate limiting/captcha.
- Identifier preflight can be abused for account enumeration.
- Password reset can be abused without attempt throttling.
- Listing image upload lacks file signature validation.
- Verification document upload lacks malware scanning and admin review.
- Owner-controlled listing trust fields can mislead users.
- No admin/moderator authorization model was found.

Recommended security updates:

1. Use the same JSON parsing and same-origin helper across all mutation routes.
2. Add per-IP and per-identifier rate limits to login, register preflight, OTP/reset, public forms, and bug reports.
3. Add Firebase App Check or equivalent abuse protection where practical.
4. Add admin claims and an admin dashboard for review workflows.
5. Remove owner write control over trust/rating fields.
6. Add server-side file signature checks for uploads.
7. Define retention policies for bug reports, form submissions, and identity documents.

## Data Integrity and Product Model Gaps

The product is a two-sided, owner-managed farm-equipment rental marketplace. The current code mostly reflects that, but a few areas still imply stronger platform control than actually exists.

### Listing trust

Current UI can display verified owner/rating badges before real verification or real review history exists. This is the most important trust gap.

Needed:

- Real owner verification status.
- Real listing review status.
- Real rating/review collection.
- Admin moderation.
- Visible "pending verification" states.

### Booking

Current booking is a request and direct coordination model. It is not a payment/escrow platform.

Needed:

- Availability conflict checks.
- Booking expiry.
- Owner acceptance/rejection reasons.
- Renter cancellation reasons.
- Booking timeline.
- Contact visibility rules.
- Duplicate booking protection.

### Pricing

Current pricing uses `pricePerHour`; UI sometimes mentions fees or payment issues.

Needed:

- Decide if there is any platform fee. If not, remove service-fee calculations from booking UI.
- Add optional per-acre/per-day pricing only if the backend supports it.
- Store pricing unit consistently.

### Categories

Public category catalog is broader than owner category input.

Needed:

- Shared category source used by both public catalog and owner listing form.
- Owner upload should support all baseline categories.
- New live categories should be allowed only through controlled taxonomy or reviewed custom category flow.

### Reports

Report page currently stores reports as support requests.

Needed:

- Dedicated `report` submission type.
- Fields for report category, booking ID, listing ID, target user/listing, urgency, status, assigned operator, resolution notes.
- Admin review workflow.

## Documentation Audit

Good:

- `README.md` identifies the root app as canonical.
- `README.md` says public marketplace routes do not show mock equipment when no published listings exist.
- `README.md` says Google sign-in/registration are disabled.
- `README.md` says FCM only and MSG91/SMS deferred.
- `docs/DEVELOPMENT.md` captures phone-only auth and launch gate workflow.
- Google Sheets operations are documented.

Docs that need correction:

- Resolved in later docs: `docs/SETUP.md` and `docs/DEVELOPMENT.md` now describe phone-only auth and disabled Google sign-in/registration.
- Generated site-map docs are regenerated from current `app/**/page.tsx` routes and sanitize dynamic template expressions before rendering.
- Continue keeping production, compatibility, and deprecated route status explicit in `README.md`, `docs/DEVELOPMENT.md`, and generated site-map docs.

## Test Coverage Audit

Observed contract tests include:

- Production hardening contracts.
- Marketplace/auth/FCM contracts.
- Dark mode visual contracts.
- Navigation and layout contracts.
- Owner/renter workspace contracts.
- Firebase runtime contracts.
- Runtime log contracts.
- Site chrome route contracts.
- Discovery route view tests.
- Single-language runtime contracts.

Strengths:

- Tests assert phone-only auth.
- Tests assert no Google buttons on login/register.
- Tests assert categories are baseline plus live categories.
- Tests assert no public mock equipment exports.
- Tests assert dark-mode contracts for many pages.
- Tests assert visible route loading fallbacks are removed.
- Tests assert login error states and registration behavior.

Gaps:

- Many tests inspect source strings rather than executing real flows.
- No runtime browser test evidence was generated in this audit.
- No Firebase emulator test evidence was generated in this audit.
- No live production smoke evidence was generated in this audit.
- No file upload end-to-end test evidence was generated in this audit.
- No booking concurrency/idempotency test was observed.
- No rate-limit/security tests were observed.

Recommended next tests:

1. Browser E2E: register with test phone, OTP, login, profile selection.
2. Browser E2E: owner adds listing with real image, public list shows it.
3. Browser E2E: renter requests booking, owner sees booking, owner accepts/rejects.
4. Browser E2E: password reset with test phone.
5. API tests for duplicate register preflight, wrong login password, unknown phone, password reset unknown phone.
6. Security tests for same-origin enforcement on all mutation routes.
7. Storage tests for invalid file type and too-large file rejection.
8. Visual screenshots for light/dark desktop/mobile on all public pages.

## Highest Priority Fix List

### P0: Trust and data correctness

1. Stop publishing fallback generated listing images as real equipment images.
2. Stop defaulting owner-created listings to verified and 4.8 rating.
3. Add listing review/moderation states before public visibility.
4. Align booking price display with backend stored amount and no-platform-payment policy.
5. Fix `/renter-profile/earnings` redirect to avoid sending renters into owner earnings.
6. Decide the future of `/owner-registration`; remove, redirect, or wire it to the real listing backend.

### P1: Core product completeness

1. Use the same category list in owner listing form and public catalog.
2. Add availability conflict checks for booking requests.
3. Add duplicate booking protection or idempotency keys.
4. Add a real report submission type and report processing model.
5. Add admin/moderation UI for identity docs, listing review, reports, and support requests.
6. Add public-form and auth-route rate limiting.
7. Apply shared `parseJsonBody()` protections to all JSON mutation routes.

### P2: Cleanup and polish

1. Remove or clearly archive legacy Google auth components and server helpers.
2. Remove or clearly archive unused listing/profile components.
3. Update `docs/SETUP.md` and `docs/DEVELOPMENT.md` Google-auth conflict.
4. Replace remaining placeholder image dependencies in profile boards/editor.
5. Revisit external `lh3.googleusercontent.com` image reliance.
6. Add staging deployment docs.
7. Add admin/operator runbook for Sheets, submissions, reports, and bug triage.

## Feature Gaps

Missing or incomplete features for a fully functional two-sided rental platform:

- Admin dashboard.
- Listing moderation and approval.
- Owner identity verification review.
- Real rating/review system.
- Availability calendar.
- Booking conflict prevention.
- Booking state machine with expiry and rejection reasons.
- Notifications inbox.
- SMS/WhatsApp provider integration, intentionally deferred.
- User account suspension/ban workflow.
- Report triage workflow.
- Support ticket lifecycle.
- Dispute workflow.
- Owner payout/accounting workflow, if platform ever charges or manages payments.
- Search ranking and geospatial distance filtering.
- Image quality checks and unsafe-content checks.
- Accessibility audit.
- SEO/content audit for all public pages.
- Analytics events for search, listing views, bookings, and registration funnel.

## What Appears Done Properly

- Root app is the canonical production app.
- Ubuntu-focused setup is documented.
- App Hosting config exists.
- Phone-only login/register is active in source.
- Google login/register buttons are removed from active login/register pages.
- Google auth API routes return 410.
- Duplicate phone/email preflight exists.
- Password reset uses registered mobile number.
- Public equipment no longer comes from a static mock equipment export.
- Category baseline plus live merge exists.
- Firestore and Storage rules exist.
- Most form APIs use validation and same-origin checks.
- Owner/renter profile pages are mostly data-backed.
- FCM-only notification implementation exists.
- Google Sheets mirror is documented as best-effort.
- Contract tests cover many recently reported UI/auth requirements.

## What Still Has Not Been Done Properly

- Owner-created listings can still look verified without verification.
- Owner-created listings can still use generated fallback imagery.
- Real listing category input does not match public category scale.
- `/owner-registration` duplicates and conflicts with `/list-equipment`.
- `/renter-profile/earnings` is wrong for renter flow.
- Report form is not stored as a first-class report.
- Several auth endpoints do not use shared HTTP mutation protections.
- Public forms do not have abuse protection.
- Docs still contain Google-auth conflict.
- Admin workflows are mostly absent.
- Moderation workflows are absent.
- Booking availability/conflict logic is absent.
- Payment/fee wording and backend amount semantics need product alignment.

## Verification Status

Changed:

- Created this report file only.

Verified by static source inspection:

- Root app routes and major folders exist.
- Package scripts and dependency versions in `package.json`.
- App Hosting env/config in `apphosting.yaml`.
- Firebase rules in `firebase/firestore.rules` and `firebase/storage.rules`.
- Phone-only auth source paths.
- Google auth disablement source paths.
- Public equipment readiness filter.
- Listing create/update actions.
- Owner/renter workspace routes.
- Form API routes.
- Contract test files.
- Documentation conflict around Google auth.

Unverified in this pass:

- Live website behavior.
- Local `npm run dev`.
- `npm run verify`.
- Firebase deploy readiness.
- Firebase Auth live OTP.
- Firestore production data shape.
- Storage upload behavior in browser.
- FCM token registration and delivery.
- Google Sheets write success.
- Browser screenshots.
- Mobile browser behavior.
- Real user login with existing production accounts.

Blocked or intentionally not attempted:

- Any implementation beyond this report.
- Any package install or upgrade.
- Any Firebase write/deploy.
- Any GitHub repo update.
- Any Discord notification.
- Any live production smoke test.

## Recommended Next Work Order

1. Run `npm run verify` and capture current baseline.
2. Fix P0 listing trust issues before encouraging public owner uploads.
3. Remove or redirect `/owner-registration`.
4. Align owner listing categories with `lib/equipment-categories.ts`.
5. Fix `/renter-profile/earnings`.
6. Convert `/report` into a dedicated report submission type.
7. Keep shared mutation protections and booking transition guards covered by contract tests.
8. Add rate limiting for login/register/reset/public forms.
9. Update Google auth docs and remove/mark legacy Google code.
10. Add browser E2E tests for register, login, profile selection, list equipment, rent booking, and password reset.
11. Add admin/moderation tooling.
12. Only after those pass, run launch gate and live smoke tests.
