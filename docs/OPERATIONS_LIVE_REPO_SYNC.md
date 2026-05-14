# Live Repo Sync And Discord

## Purpose

Use the repo sync script only when there is a confirmed secondary GitHub repo that must mirror the canonical source repo. The active Firebase App Hosting backend is connected to `hkumarsaikia/kisaankamai_v0.1`, so the normal release path pushes `origin/main` and deploys that commit.

## Repo Sync

```bash
npm run repo:sync-live -- --repo-url "<git-url>" --branch main
```

Optional overrides:

- `--sheet-id <id>` to target a specific workbook
- `--webhook-url <url>` to send the result to Discord, or use channel env vars
- `--discord-channel <channel>` to choose a channel mapping for repo sync notifications (default `github`)
- `--notify` to force Discord notification when a webhook URL is present
- `--remote-name <name>` to choose the git remote name used for push mode (default `live`)

Push mode:

```bash
npm run repo:sync-live -- --repo-url "<git-url>" --branch main --push
```

Behavior in push mode:

- adds the remote when it does not exist
- updates the remote URL when it points somewhere else
- pushes `HEAD` to `refs/heads/<branch>`
- re-checks the remote head after push
- refuses to push from a dirty working tree unless you pass `--allow-dirty`
- supports `--force-with-lease` if you explicitly need that behavior

What it records:

- repo URL
- branch
- remote name
- compare vs push mode
- remote add/update/unchanged action
- local branch
- local HEAD
- remote HEAD
- local commit subject/date
- dirty file count
- whether local and remote heads match

When Sheets is configured, that data is written into `workbook_meta` and a repo sync audit row is appended to `sync_audit`.

Recommended publish order:

1. Commit and push the working repo.
2. Create the Firebase App Hosting rollout from the pushed `origin/main` commit.
3. Verify the deployed/live runtime health.
4. Send the Discord live-update notification.

Recommended pre-push quality gate for bug-fix releases:

```bash
node --test tests/offline-settlement-notifications-contracts.test.mjs tests/profile-listing-availability-contracts.test.mjs tests/ops-integration-contracts.test.mjs
npm run verify
git diff --check
coderabbit review --agent -t uncommitted -c AGENTS.md
npm audit --omit=dev --audit-level=high
```

If the change has a timestamped evidence bundle, link
`docs/bug-fixes/<timestamp>-<slug>/README.md` in the release note or Discord
summary.

Current Kisan Kamai targets:

```bash
git push origin main
firebase apphosting:rollouts:create kisankamai-web-backend \
  --git-commit "<commit-sha>" \
  --project gokisaan \
  --force
```

Only run the rollout command after `npm run verify` and the launch gate checks pass locally. If the Firebase rollout fails, do not send a success Discord message; send a warning with the failed command and output summary. Do not add an unverified secondary mirror to the release path.

## Discord Helper

Generic Discord webhook sender:

```bash
npm run discord:notify -- --title "Kisan Kamai" --summary "Backfill completed" --status success
```

The CLI defaults to the `github` channel, which is the correct target for
developer updates, release notes, repository updates, and deployment summaries
unless a more specific non-backend channel has been configured.

Named channels must use channel-specific webhook environment variables. The
helper intentionally does not fall back from `--channel release`, `--channel
deploy`, `--channel ops`, or `--channel github` to the generic
`DISCORD_WEBHOOK_URL`, because that can post release/deploy/ops messages into
one unrelated Discord channel.

Repeated fields:

```bash
npm run discord:notify -- \
  --channel deploy \
  --channel github \
  --title "Workbook Sync" \
  --summary "Repo drift detected" \
  --status warning \
  --field Branch=main \
  --field DirtyFiles=3
```

You can also send a prebuilt payload JSON file:

```bash
npm run discord:notify -- --webhook-url "<url>" --payload-file payload.json
```

Use `--webhook-url` only for a one-off direct send when you already know that
the target webhook points to the right channel or thread. Do not combine a
generic webhook URL with multiple named `--channel` values for release work.

If Discord should post into a channel thread, store the thread-specific webhook
URL for that channel, including Discord's `thread_id` query parameter when
needed. The helper treats the URL as opaque and will preserve the thread target.

Previously posted webhook messages cannot be moved to another channel or thread
by this helper. Discord webhooks can only edit/delete messages when their
message IDs were captured at send time; this repo does not store those IDs. For
misrouted historical posts, manually delete the old posts in Discord or repost a
short corrective summary into the correct channel once the channel webhook is
configured.

Channel env vars:

- `DISCORD_WEBHOOK_OPS_URL`
- `DISCORD_WEBHOOK_DEPLOY_URL`
- `DISCORD_WEBHOOK_RELEASE_URL`
- `DISCORD_WEBHOOK_GITHUB_URL`
- `DISCORD_WEBHOOK_SECURITY_URL`
- `DISCORD_WEBHOOK_SENTRY_URL`
- `DISCORD_WEBHOOK_BACKEND_URL`

Backend activity notifications:

- Runtime code uses `DISCORD_WEBHOOK_BACKEND_URL` for user registration,
  login/session, profile updates, listing changes, booking changes, and public
  form submissions.
- Do not use `--channel backend` for developer updates, release notes, deploy
  notes, or repo-sync messages. The CLI blocks manual backend-channel sends
  unless `--allow-backend-channel` is passed for an intentional backend webhook
  test.
- Keep the backend webhook as an App Hosting secret or local-only environment
  variable. Do not commit real webhook URLs to the repository.
- In App Hosting, keep `DISCORD_WEBHOOK_BACKEND_URL` runtime-only. The backend
  runtime service account needs `roles/secretmanager.secretAccessor` for the
  backing Secret Manager secret.

Legacy direct-only env var:

- `DISCORD_WEBHOOK_URL` is not used for named channel routing. Prefer
  `--webhook-url` for one-off direct sends and the channel env vars above for
  normal release notifications.
