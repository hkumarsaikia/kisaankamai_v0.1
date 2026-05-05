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
npm run discord:notify -- --channel ops --title "Kisan Kamai" --summary "Backfill completed" --status success
```

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

Channel env vars:

- `DISCORD_WEBHOOK_URL`
- `DISCORD_WEBHOOK_OPS_URL`
- `DISCORD_WEBHOOK_DEPLOY_URL`
- `DISCORD_WEBHOOK_RELEASE_URL`
- `DISCORD_WEBHOOK_GITHUB_URL`
- `DISCORD_WEBHOOK_SECURITY_URL`
- `DISCORD_WEBHOOK_SENTRY_URL`
