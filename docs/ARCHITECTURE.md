# Architecture

## Production Runtime

The root app is the only public runtime.

- Hosting: Firebase App Hosting
- Auth: Firebase Auth with Admin-verified session cookies
- Data: Firestore
- Uploads: Firebase Cloud Storage
- Reporting mirror: Google Sheets (best-effort only, not the database of record)
- Diagnostics: local runtime logging for development, Firebase/Sentry-oriented hooks for hosted environments

`apps/production` remains in-repo as a maintained alternate surface that shares the same backend contract and design language, but it is not the canonical public domain target.

## Data Contract

- Firebase is the primary runtime backend and the source of truth for auth, profiles, listings, bookings, payments, saved items, submissions, and bug reports.
- Google Sheets mirroring is intentional. It runs after Firebase persistence for admin/reporting visibility and must remain best-effort.
- A Google Sheets outage or misconfiguration must not block a successful Firebase-backed write path.

## Root App Boundaries

- `lib/server/local-auth.ts` is the server auth facade used by the root app.
- `lib/server/local-data.ts` is the root data facade and currently re-exports the Firebase-backed implementation.
- Root API routes and server actions now assume the server runtime only.

## Deployment Shape

- Live site: `https://www.kisankamai.com`
- Apex redirect target: `https://www.kisankamai.com`
- Root App Hosting config: `apphosting.yaml`
