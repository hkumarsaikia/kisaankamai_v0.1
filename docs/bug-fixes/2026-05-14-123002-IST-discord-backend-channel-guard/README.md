# Discord Backend Channel Guard

## Problem

A developer/release notification was manually sent to the `backend-notification`
Discord channel. That channel is intended only for live website backend activity
such as auth, profile, listing, booking, and form events.

## Fix

- `scripts/discord-webhook-notify.mjs` now defaults to the `github` channel when
  no `--channel` is supplied. This matches the developer/release update channel
  configured in the local environment.
- Manual CLI sends to `--channel backend` are blocked unless
  `--allow-backend-channel` or `--backend-activity` is passed.
- Runtime live-site backend notifications are unchanged; they still use
  `DISCORD_WEBHOOK_BACKEND_URL` through `lib/server/backend-activity.ts`.
- The operations doc now states that backend is reserved for live-site events and
  developer updates must use `github`, `release`, `deploy`, or `ops`.

## Cleanup

The misrouted Discord message `1504300695430496306` was deleted through the
backend webhook API. Discord returned HTTP `204`.

## Verification

Run before release:

```bash
node --test tests/ops-integration-contracts.test.mjs
npm run test:contracts
npm run lint
npm run typecheck
npm run build
npm run verify
```
