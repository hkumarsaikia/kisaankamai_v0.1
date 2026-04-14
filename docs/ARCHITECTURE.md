# Architecture

## Production Runtime

The root app is the only public runtime.

- Hosting: Firebase App Hosting
- Auth: Firebase Auth with Admin-verified session cookies
- Data: Firestore
- Uploads: Firebase Cloud Storage
- Diagnostics: local runtime logging for development, Firebase/Sentry-oriented hooks for hosted environments

`apps/production` remains in-repo only as a staging/reference surface.

## Root App Boundaries

- `lib/server/local-auth.ts` is the server auth facade used by the root app.
- `lib/server/local-data.ts` is the root data facade and currently re-exports the Firebase-backed implementation.
- Root API routes and server actions now assume the server runtime only.

## Deployment Shape

- Live site: `https://www.kisankamai.com`
- Apex redirect target: `https://www.kisankamai.com`
- Root App Hosting config: `apphosting.yaml`
