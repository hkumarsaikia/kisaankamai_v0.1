# Kisan Kamai

Kisan Kamai now uses the root Next.js app as the only public frontend for `https://www.kisankamai.com`.

- Live app: repo root, deployed with Firebase App Hosting
- Canonical domain: `https://www.kisankamai.com`
- Current frontend stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript 6

## Root App

The root app is the production-facing application. It owns:

- Firebase Auth session-cookie auth
- Firebase Auth phone verification for manual registration
- Firebase Auth phone-only password login for registered mobile numbers
- Firebase Cloud Messaging web push notifications for booking and listing updates
- Firestore-backed listings, bookings, offline booking-value records, submissions, and saved items
- Cloud Storage-backed uploads
- Google Sheets mirroring for admin/reporting visibility only
- public routes, owner flows, and renter flows

Current workspace behavior to know while validating `npm run dev`:

- `/owner-profile/*` is the owner-side workspace family.
- `/renter-profile/*` is the renter-side workspace family.
- `/owner-profile/earnings` is the live owner earnings route.
- `/list-equipment` supports create mode and edit mode via `?listingId=<id>`.
- `/list-equipment` is the owner-controlled availability source. Available-now/date listings publish as active, temporarily unavailable listings publish as paused, and public tiles show the matching green/red availability dot.
- `/list-equipment` is protected by the root `proxy.js` guard before App Router rendering, then re-verified server-side with the Firebase session cookie.
- successful booking submissions redirect back into `/renter-profile`.
- owner listing edit buttons route into `/list-equipment?listingId=<id>`.
- `/support` is the public contact/help flow. The old public `/report` page is removed from navigation and sitemap.
- `/feature-request` submits community feature ideas through `/api/forms/feature-request` into Firestore form submissions.
- The footer newsletter submits through `/api/forms/newsletter-subscription` into Firestore and the `newsletter_subscriptions` Google Sheet.
- `/coming-soon` notify submissions go through `/api/forms/coming-soon-notify` into Firestore and the `coming_soon_notifications` Google Sheet.
- the public theme defaults to light mode; explicit dark-mode choices are still respected.
- `/categories` shows the baseline equipment catalog and merges live owner-published categories into it.
- `/rent-equipment` and equipment detail pages stay live-data only; they do not show mock equipment when Firestore has no published listings.
- `/rent-equipment` and renter browse sorting use the shared availability, price-low-to-high, and distance order. Booking is blocked for paused or future-available listings.

Useful commands:

```bash
PUPPETEER_SKIP_DOWNLOAD=true npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test:contracts
npm run verify
npm run firebase:preflight
npm run firebase:rules:dry-run
npm run launch:gate
npm run firebase:deploy
npm run sheets:bootstrap
npm run sheets:verify
npm run sheets:backfill
npm run seed:final-test-accounts -- --owner-password "<password>" --renter-password "<password>"
npm run cleanup:final-test-accounts
npm run pause:mock-listings -- --dry-run
npm run pause:mock-listings
```

Runtime logs captured with the helper scripts are stored under `logs/runtime/`.

Ubuntu rebuild notes:

- The previous Windows/dirty-root reference and generated local artifact archive were removed after the Ubuntu rebuild.
- Do not depend on archived local files for the active root app; restore any missing behavior from tracked source or documented backups only.
- Active installs use `.npmrc` with project-local `.cache/npm`.
- Local Firebase CLI state and logs belong under `.firebase/` and are ignored by git.
- The app is App Router-only; legacy `pages/_app` and `pages/_document` are not part of the active root because they trigger unnecessary hybrid fallback behavior in Next 16.
- Tailwind/PostCSS config is ESM: `tailwind.config.mjs` and `postcss.config.mjs`.
- Use `PUPPETEER_SKIP_DOWNLOAD=true npm ci` on Ubuntu so Puppeteer does not download browser binaries into dependency folders; use `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome` for browser checks.
- NVIDIA GPU acceleration is only useful for browser rendering/profiling work, not for lint/typecheck/build.

## Firebase App Hosting

The root deployment contract lives in `apphosting.yaml`.

Required runtime configuration includes:

- Firebase web config (`NEXT_PUBLIC_FIREBASE_*`)
- Firebase Admin credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
- optional Google Maps key
- optional Sentry DSNs if production observability should send events

## Backend Contract

- Firebase is the source of truth for authentication, profiles, listings, bookings, offline booking-value records, submissions, saved items, and bug reports.
- Registration is phone-only for account creation. The form can store an optional email on the profile, but sign-in uses the registered mobile number plus password.
- Google sign-in and Google registration are disabled at the application layer. The Google API routes return HTTP 410 and `/register/google-email` redirects to `/register`.
- Account uniqueness is enforced in Firestore through `auth-identifiers`: one normalized email and one normalized phone number can belong to only one app user.
- Session cookies are long-lived for normal use; users should remain signed in until logout or cookie expiry.
- Browser tabs synchronize login/logout state through a local auth-sync channel, so already-open pages refresh after a session changes in another tab.
- User profile updates keep the session/profile record, Firebase Auth display name, email, phone, and photo URL aligned where Firebase allows it.
- Booking and listing notifications persist to the Firestore inbox first, show the total unread badge in the profile dropdown, refresh while the user is active, and use Firebase Cloud Messaging for optional browser push. MSG91/SMS provider integration is intentionally deferred.
- Legacy `payments` storage and Sheets tabs are compatibility mirrors for offline booking-value estimates only. New rows must use booking statuses, `Direct Settlement`, and booking-value source labels because Kisan Kamai does not collect, refund, or settle money.
- Public feature-request, feedback, support, partner, owner-application, coming-soon notify, and newsletter forms write to Firestore first and mirror to Sheets where configured. The legacy `/api/forms/report` endpoint remains available for backend compatibility, but there is no public `/report` page.
- Auth mutations, profile completion, public forms, and bug-report submissions use Firestore-backed rate limits by IP and relevant identifier. Logged-in public-form submissions include the authenticated user id in the limiter so reusing the account phone across forms does not block all form submission.
- Owner listings accept up to 3 equipment photos. Those photos can be removed before submit, are saved to Cloud Storage, stored on the listing as public gallery URLs, and mirrored to Sheets as explicit URL/path columns.
- Map/satellite selection in Google Maps is persisted per browser and must not be overwritten by a hardcoded map type after the user selects satellite view.
- Google Sheets is a secondary mirror for admin/reporting workflows only.
- Sheets writes are best-effort and must never replace Firebase writes or block successful user-facing operations.
- Form rows mirror to Google Sheets with pending notification metadata. Email alerts are handled only by the optional bound Sheets Apps Script when the workbook owner installs and authorizes it.

## Operational Tooling

Run the operational scripts from the repo root:

```bash
npm run sheets:bootstrap
npm run sheets:verify
npm run sheets:backfill
npm run seed:final-test-accounts -- --owner-password "<password>" --renter-password "<password>"
npm run cleanup:final-test-accounts
npm run pause:mock-listings -- --dry-run
npm run pause:mock-listings
npm run repo:sync-live -- --repo-url "<git-url>" --branch main
npm run discord:notify -- --channel deploy --title "..." --summary "..."
```

Manual Firebase Console prerequisites still required outside repo code:

- Authentication > Phone > Phone numbers for testing:
  - `+91 90000 00101` with OTP code `123456`
  - `+91 90000 00102` with OTP code `123456`
- Cloud Messaging > Web Push certificates:
  - generate or import the VAPID key pair
  - expose the public key as `NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY`

Runbooks:

- Google Sheets ops: `docs/OPERATIONS_GOOGLE_SHEETS.md`
- Final test accounts: `docs/OPERATIONS_FINAL_TEST_ACCOUNTS.md`
- Live repo sync + Discord: `docs/OPERATIONS_LIVE_REPO_SYNC.md`
- Deferred domain cutover: `docs/RUNBOOK_GODADDY_FIREBASE_DOMAIN_MIGRATION.md`

## Repository Notes

- `main` is the only long-term branch target.
- Vendored repositories in `vendor/` are reference-only and are not runtime dependencies.
- Cross-agent handoff files are not part of the active root app.
