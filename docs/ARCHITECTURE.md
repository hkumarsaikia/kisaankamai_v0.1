# Project Architecture

Kisan Kamai is now organized as a single repo with two application surfaces.

## Surface Split

### 1. Root app

- Location: repo root
- Framework: Next.js 14 App Router
- Role: legacy/demo surface
- Deployment target: GitHub Pages
- Public demo URL: `https://hkumarsaikia.github.io/kisaankamai_v0.1`

The root app keeps the broad marketing, discovery, and legacy dashboard surface alive for review and demo purposes. For the Pages build, it uses static-export-safe behavior:

- demo-safe auth/session fallbacks
- demo mutation shims
- static API compatibility responses where needed
- base-path aware routing for the GitHub Pages repo path

### 2. Production app

- Location: `apps/production`
- Framework: Next.js 14 App Router
- Role: canonical production runtime
- Deployment target: Firebase App Hosting
- Canonical domain: `https://www.kisankamai.com`

This app is the path to market. It is intentionally isolated from the root runtime and is expected to own:

- Firebase Auth
- Firestore-backed business data
- Cloud Storage-backed media
- Firebase / Google Cloud operational runtime
- optional Sentry instrumentation

## Current Data and Auth Boundaries

### Root demo app

The root app still contains development-era local systems:

- local JSON persistence
- local/server cookie session handling
- GitHub Pages demo/browser-local auth shims
- local debug/reporting utilities

Those systems are valid for development and demo use only. They are not the market deployment architecture.

### Production app

`apps/production` is where the Firebase-only runtime is being built. The intended production contracts are:

- Firebase Auth identity
- server-verified Firebase session cookies
- Firestore collections for users, listings, bookings, payments, saved items, and submissions
- Cloud Storage for listing media

## Deployment Ownership

### GitHub Pages

- Workflow: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
- Scope: root app only
- Output mode: static export
- Purpose: demo/legacy surface only

### Firebase App Hosting

- Config entrypoint: [`apps/production/apphosting.yaml`](../apps/production/apphosting.yaml)
- Repo layout: monorepo-style deployment with `apps/production` as app root
- Custom domains:
  - `www.kisankamai.com` as canonical
  - `kisankamai.com` as redirect-only

## Validation Boundaries

Validation is intentionally split:

- Root app:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`
  - `BUILD_TARGET=pages npm run build`
- Production app:
  - `cd apps/production`
  - `npm run lint`
  - `npm run typecheck`
  - `npm run build`

The root TypeScript configuration must not compile `apps/production`, and the production app must keep its own alias and workspace boundaries.

## Shared Platform Principles

- One GitHub repo
- Two deployment surfaces
- No runtime imports from `vendor/`
- No production dependency on the root app’s local JSON or demo auth
- No GitHub Pages responsibility for `www.kisankamai.com`
