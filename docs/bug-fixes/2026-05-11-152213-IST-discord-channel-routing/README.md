# Discord Channel Routing Fix

## Problem

Release notifications requested for multiple logical channels were appearing in
the same Discord destination. The helper accepted `--channel` values, but the
CLI passed `DISCORD_WEBHOOK_URL` as an explicit webhook URL before channel
resolution. That made the channel names informational only whenever the generic
webhook was present.

## Fix

- Named Discord channels now resolve only through their channel-specific env
  vars, such as `DISCORD_WEBHOOK_RELEASE_URL`,
  `DISCORD_WEBHOOK_DEPLOY_URL`, `DISCORD_WEBHOOK_OPS_URL`, and
  `DISCORD_WEBHOOK_GITHUB_URL`.
- Unknown channel names now fail fast instead of falling through to a generic
  URL.
- `npm run discord:notify` and `scripts/live-repo-sync.mjs` no longer convert
  `DISCORD_WEBHOOK_URL` into a named-channel explicit URL.
- `--webhook-url` remains available for a one-off direct send when the operator
  intentionally targets a specific webhook URL.

## Historical Discord Messages

Existing webhook messages cannot be moved to another channel or thread from the
repo. Discord webhooks can edit or delete prior messages only when the message
ID was captured at send time, and this helper did not store those IDs.

Safe cleanup options:

1. Manually delete misrouted messages in Discord if they are noisy.
2. Configure the correct channel or thread webhook env vars.
3. Repost a short corrective release/deploy/ops summary into the correct
   destination.

## Verification

Run:

```bash
node --test tests/ops-integration-contracts.test.mjs
npm run test:contracts
npm run lint
npm run typecheck
npm run verify
```
