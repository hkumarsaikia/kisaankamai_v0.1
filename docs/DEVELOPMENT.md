# Development

## Root App

The root app is the active development and production frontend.

```bash
npm install
npm run dev
```

Validation:

```bash
npm run lint
npm run typecheck
npm run build
npm run verify
```

## Firebase Requirements

Local work that exercises the Firebase-backed root runtime may require:

- Firebase web config in `.env.local`
- Firebase Admin credentials in `.env.local`
- optional Sentry and Google Maps config

If Firebase Admin credentials are missing, some authenticated/data-backed runtime flows will not function outside mocked/static fallbacks.

## Alternate App Surface

`apps/production` is retained as a fully maintained alternate app surface for QA, browser checks, and parallel product validation. It is not the canonical public domain target, but it should stay aligned with the root app's Firebase-only runtime, redesign, and operational behavior.

```bash
cd apps/production
npm install
npm run dev
npm run typecheck
npm run build
```

## Logs

Use the logged helper scripts when you want captured runtime logs:

```bash
npm run dev:logged
npm run start:logged
```

Generated logs belong in `logs/runtime/`.
