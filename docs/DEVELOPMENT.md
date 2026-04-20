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

## Cross-Agent Handoff

Use `agents/codex-antigravity-sync/` as the manual shared-memory subtree when you want Codex and Antigravity to hand work off through the repo.

- Launcher name: `codex-antigravity-sync`
- Install: `npm run cross-agent:install`
- Runner: `npm run cross-agent:sync`
- Consumer entrypoint: `agents/codex-antigravity-sync/docs/CONSUMER.md`
- Reference contract: `agents/codex-antigravity-sync/docs/REFERENCES.md`

Nothing in this workflow should auto-run.
