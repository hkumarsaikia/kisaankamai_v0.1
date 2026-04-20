# Repository Guide

The root Next.js app is the canonical public frontend for `https://www.kisankamai.com`. `apps/production` is a maintained alternate app surface for QA, browser checks, and parallel validation, but it is not the default public target.

## Root App Commands

```bash
npm install
npm run dev
npm run dev:logged
npm run dev:public
npm run tunnel:public
npm run start:logged
npm run lint
npm run typecheck
npm run build
npm run verify
```

- Use `npm run dev:logged` or `npm run start:logged` when you need captured runtime logs.
- Runtime logs from the helper scripts live under `logs/runtime/`.
- Start `npm run dev:public` before `npm run tunnel:public` when you need a shareable tunnel URL for the local app.
- Treat `npm run verify` as the default root-app validation pass.

## Alternate App Surface

```bash
cd apps/production
npm install
npm run dev
npm run typecheck
npm run build
```

## Cross-Agent Handoff

The manual shared-memory workflow lives under `agents/codex-antigravity-sync/`.

```bash
npm run cross-agent:install
npm run cross-agent:sync
npm run cross-agent:remove
```

- Nothing in the cross-agent workflow should auto-run.
- Read `agents/codex-antigravity-sync/docs/CONSUMER.md` before consuming a shared pack.

## Repo Notes

- `vendor/` is reference-only and should not be edited for product changes.
