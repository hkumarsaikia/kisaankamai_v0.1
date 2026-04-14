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

## Internal Staging App

`apps/production` is retained as an internal staging/reference app.

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
