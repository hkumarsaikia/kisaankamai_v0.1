# Firebase Security Setup For apps/production

This directory contains the Firebase security artifacts used by the maintained `apps/production` surface.

## Apply these with the Firebase CLI

From the repo root, target the `gokisaan` project and deploy:

- `apps/production/firebase/firestore.rules`
- `apps/production/firebase/firestore.indexes.json`
- `apps/production/firebase/storage.rules`

Recommended flow:

1. Enable Authentication, Firestore, and Storage in `gokisaan`
2. Keep the repo root as the canonical public App Hosting target unless deployment policy changes
3. Configure `apps/production` only when validating this alternate app surface directly
4. Set App Hosting env vars/secrets from `apps/production/.env.example`
5. Apply rules and indexes

## Notes

- The production app uses server-side Firebase Admin for Firestore and Storage operations.
- These rules still matter as a defense layer and for any future direct client access.
- The repo root app remains the canonical public production target.
- `apps/production` stays aligned with the same Firebase-only backend model for parallel validation and alternate-surface QA.
