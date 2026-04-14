# Kisan Kamai

Kisan Kamai now runs as a dual-surface repo:

- Demo / legacy surface: the root Next.js app, exported to GitHub Pages at `https://hkumarsaikia.github.io/kisaankamai_v0.1`
- Production surface: the Firebase-only app in `apps/production`, intended for `https://www.kisankamai.com`

The repo stays single-repo. The distinction is deployment ownership, not separate code hosting.

## Deployment Model

### Root app

- Purpose: public demo / legacy surface
- Build mode: `BUILD_TARGET=pages`
- Deployment: GitHub Pages
- Base path: `/kisaankamai_v0.1`
- Runtime contract: static export with demo-safe auth and mutation shims

### `apps/production`

- Purpose: canonical Firebase production app
- Deployment: Firebase App Hosting
- Canonical domain: `https://www.kisankamai.com`
- Apex redirect source: `https://kisankamai.com`
- Backend target: Firebase Auth, Firestore, Cloud Storage, Firebase-managed runtime logs, optional Sentry

## Local Development

### Root demo app

```bash
npm install
npm run dev
```

Useful root commands:

```bash
npm run lint
npm run typecheck
npm run build
BUILD_TARGET=pages npm run build
```

If you want captured server logs in the repo-managed log folder:

```bash
npm run dev:logged
npm run start:logged
```

Generated runtime logs belong in `logs/runtime/`.

### Firebase production app

```bash
cd apps/production
npm install
npm run dev
```

Useful production commands:

```bash
npm run lint
npm run typecheck
npm run build
```

## Current Stack

### Root demo app

- Next.js 14 App Router
- Tailwind CSS
- Framer Motion
- Leaflet / optional Google Maps path
- Local JSON and demo/browser-local auth only for non-production flows

### Firebase production app

- Next.js 14 App Router
- Firebase App Hosting
- Firebase Auth
- Cloud Firestore
- Cloud Storage
- Optional Sentry

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): current dual-surface architecture
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md): commands, validation, and deployment ownership
- [docs/ROADMAP.md](docs/ROADMAP.md): product roadmap
- [docs/VENDORED-REPOS.md](docs/VENDORED-REPOS.md): how `openform`, `superpowers`, and `rn-interface-kit` are used
- [docs/IMPLEMENTATION-REPORT.md](docs/IMPLEMENTATION-REPORT.md): recent implementation notes

## Important Boundaries

- The root app is not the market production runtime.
- `apps/production` is the only production target for `www.kisankamai.com`.
- GitHub Pages remains a demo surface only.
- Vendored repos under `vendor/` are reference material, not runtime dependencies.
