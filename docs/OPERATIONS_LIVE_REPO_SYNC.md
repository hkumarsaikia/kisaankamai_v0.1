# Live Repo Sync And Discord

## Purpose

Once a live repo URL exists, use the repo sync script to compare the current workspace against that remote branch, optionally push the current `HEAD` into a named `live` remote, and record the result into the operational workbook and Discord.

## Repo Sync

```bash
npm run repo:sync-live -- --repo-url "<git-url>" --branch main
```

Optional overrides:

- `--sheet-id <id>` to target a specific workbook
- `--webhook-url <url>` to send the result to Discord
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
2. Run `npm run repo:sync-live -- --repo-url "<git-url>" --branch main --push`.
3. Verify the deployed/live runtime health.
4. Send the Discord live-update notification.

## Discord Helper

Generic Discord webhook sender:

```bash
npm run discord:notify -- --webhook-url "<url>" --title "Kisan Kamai" --summary "Backfill completed" --status success
```

Repeated fields:

```bash
npm run discord:notify -- \
  --webhook-url "<url>" \
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

Fallback env var:

- `DISCORD_WEBHOOK_URL`
