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
- public routes, owner flows, and renter flows

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

`apps/production` remains in the repo as a fully maintained alternate app surface. It shares the Firebase-only backend story, receives the same redesign and QA work, and is kept aligned with the root app for verification and operational parity.

The root app is still the canonical live frontend for `https://www.kisankamai.com`.

## Repository Notes

- `main` is the only long-term branch target.
- Vendored repositories in `vendor/` are reference-only and are not runtime dependencies.
