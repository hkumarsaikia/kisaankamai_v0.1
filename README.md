# Kisan Kamai

Kisan Kamai now uses the root Next.js app as the only public frontend for `https://www.kisankamai.com`.

- Live app: repo root, deployed with Firebase App Hosting
- Canonical domain: `https://www.kisankamai.com`
- Staging/reference app: `apps/production`

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

## Internal Staging App

`apps/production` remains in the repo as an internal staging/reference app. It is no longer the canonical live frontend and should not be treated as the public site.

## Repository Notes

- `main` is the only long-term branch target.
- Vendored repositories in `vendor/` are reference-only and are not runtime dependencies.
