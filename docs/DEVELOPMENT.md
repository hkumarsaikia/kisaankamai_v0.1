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
npm run firebase:deploy
```

## Firebase Requirements

Local work that exercises the Firebase-backed root runtime may require:

- Firebase web config in `.env.local`
- Firebase Admin credentials in `.env.local`
- optional Sentry and Google Maps config

If Firebase Admin credentials are missing, some authenticated/data-backed runtime flows will not function outside mocked/static fallbacks.

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

## Sheets Operations

Operational workbook tooling is script-based and lives under `scripts/`.

```bash
npm run sheets:bootstrap
npm run sheets:verify
npm run sheets:backfill
```

Use `docs/OPERATIONS_GOOGLE_SHEETS.md` for the workbook model, backfill scope, and verification flow.

## Final Test Accounts

Seed the canonical owner and renter test accounts:

```bash
npm run seed:final-test-accounts -- --owner-password "<password>" --renter-password "<password>"
```

Cleanup:

```bash
npm run cleanup:final-test-accounts
```

The latest local summaries are written to `logs/runtime/final-test-accounts/`.

## Antigravity Handoff

When handing the project to Google Antigravity for browser/API/CLI completion work, use:

- `docs/GOOGLE_ANTIGRAVITY_EXECUTION_PROMPT.md`
- `agents/codex-antigravity-sync/docs/CONSUMER.md`

The root app is the only supported surface for that handoff.
