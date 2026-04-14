# Development Guide

This repo now has two independently validated app surfaces.

## Surfaces

### Root app

- Role: legacy/demo surface
- Deployment: GitHub Pages
- Demo URL: `https://hkumarsaikia.github.io/kisaankamai_v0.1`
- Build mode: `BUILD_TARGET=pages`

### `apps/production`

- Role: canonical Firebase production app
- Deployment: Firebase App Hosting
- Target domain: `https://www.kisankamai.com`
- Redirect source: `https://kisankamai.com`

## Root App Commands

Run from the repo root:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
BUILD_TARGET=pages npm run build
```

Additional helpers:

```bash
npm run dev:logged
npm run start:logged
npm run dev:public
npm run tunnel:public
```

Notes:

- `npm run build` validates the normal server build of the root app.
- `BUILD_TARGET=pages npm run build` validates the GitHub Pages demo export.
- If you run the Pages export and then want to use `next start`, run `npm run build` again first so `.next` is restored to the server build output.
- Local runtime/debug logs belong in `logs/runtime/`.

## Production App Commands

Run from `apps/production`:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

The production workspace is intentionally independent. Root validation must not compile `apps/production`, and `apps/production` must validate from its own `tsconfig.json`.

## Environment Contracts

### Root demo app

Typical local `.env.local` values:

```env
NEXT_PUBLIC_DEMO_AUTH_MODE=true
NEXT_PUBLIC_DEMO_PHONE=8761085453
NEXT_PUBLIC_DEMO_EMAIL=test@example.com
NEXT_PUBLIC_DEMO_PASSWORD=Test@12345
```

These values are for the GitHub Pages demo and local review flows only. They are not production credentials.

### Production app

See:

- [`apps/production/.env.example`](../apps/production/.env.example)
- [`apps/production/apphosting.yaml`](../apps/production/apphosting.yaml)

Production expects Firebase-managed configuration for:

- Firebase web config
- Firebase Admin credentials
- canonical public app URL
- optional Sentry DSN

## Deployment Ownership

### GitHub Pages

- Workflow: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
- Scope: root app only
- Output: static export from `./out`
- This workflow is a demo deployment, not the production deployment

### Firebase App Hosting

- App root directory: `apps/production`
- Firebase project: `gokisaan`
- Canonical domain: `www.kisankamai.com`
- DNS should be managed from GoDaddy using only the records Firebase generates

## Verification Matrix

### Root app

Required before claiming stabilization:

```bash
npm run lint
npm run typecheck
npm run build
BUILD_TARGET=pages npm run build
```

### Production app

Required before claiming stabilization:

```bash
cd apps/production
npm run lint
npm run typecheck
npm run build
```

## Operational Boundaries

- Do not treat the root app as the market production runtime.
- Do not import production runtime code from `apps/production` into the root app.
- Do not make the GitHub Pages workflow responsible for `www.kisankamai.com`.
- Do not use root local JSON, local uploads, or demo auth as production infrastructure.
