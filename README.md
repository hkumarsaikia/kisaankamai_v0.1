# Kisan Kamai

Kisan Kamai now uses the root Next.js app as the only public frontend for `https://www.kisankamai.com`.

- Live app: repo root, deployed with Firebase App Hosting
- Canonical domain: `https://www.kisankamai.com`
- Alternate maintained app surface: `apps/production`

## Root App

The root app is the production-facing application. It owns:

- Firebase Auth session-cookie auth
- Firestore-backed listings, bookings, payments, submissions, and saved items
- Cloud Storage-backed uploads
- Google Sheets mirroring for admin/reporting visibility only
- public routes, owner flows, and renter flows

Current workspace behavior to know while validating `npm run dev`:

- `/owner-profile/*` is the owner-side workspace family.
- `/renter-profile/*` is the renter-side workspace family.
- `/owner-profile/earnings` is the live owner earnings route.
- `/list-equipment` supports create mode and edit mode via `?listingId=<id>`.
- successful booking submissions redirect back into `/renter-profile`.
- owner listing edit buttons route into `/list-equipment?listingId=<id>`.
- support and report are separate public flows: `/support` for help requests and `/report` for issue escalation.

Useful commands:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run verify
```

Runtime logs captured with the helper scripts are stored under `logs/runtime/`.

## Firebase App Hosting

The root deployment contract lives in `apphosting.yaml`.

Required runtime configuration includes:

- Firebase web config (`NEXT_PUBLIC_FIREBASE_*`)
- Firebase Admin credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`)
- optional Sentry DSNs
- optional Google Maps key

## Alternate App Surface

`apps/production` remains in the repo as a fully maintained alternate app surface. It shares the same backend contract as the root app: Firebase Auth, Firestore, and Storage are the primary runtime systems, while Google Sheets is kept as a best-effort mirror for admin/reporting visibility only.

The root app is still the canonical live frontend for `https://www.kisankamai.com`.

## Backend Contract

- Firebase is the source of truth for authentication, profiles, listings, bookings, payments, submissions, saved items, and bug reports.
- Google Sheets is a secondary mirror for admin/reporting workflows only.
- Sheets writes are best-effort and must never replace Firebase writes or block successful user-facing operations.

## Repository Notes

- `main` is the only long-term branch target.
- Vendored repositories in `vendor/` are reference-only and are not runtime dependencies.
