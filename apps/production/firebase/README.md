# Firebase Production Setup

This directory contains the production Firebase security artifacts for the standalone app in `apps/production`.

## Apply these with the Firebase CLI

From the repo root, target the `gokisaan` project and deploy:

- `apps/production/firebase/firestore.rules`
- `apps/production/firebase/firestore.indexes.json`
- `apps/production/firebase/storage.rules`

Recommended flow:

1. Enable Authentication, Firestore, and Storage in `gokisaan`
2. Configure App Hosting with app root directory `apps/production`
3. Set App Hosting env vars/secrets from `apps/production/.env.example`
4. Apply rules and indexes
5. Connect `www.kisankamai.com` and `kisankamai.com`

## Notes

- The production app uses server-side Firebase Admin for Firestore and Storage operations.
- These rules still matter as a defense layer and for any future direct client access.
- The current root app remains separate and is not the public production target.
