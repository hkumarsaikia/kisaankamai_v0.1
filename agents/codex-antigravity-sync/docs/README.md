# Codex Antigravity Sync

`agents/codex-antigravity-sync/` is the repo-owned shared memory and runner for synchronizing context between Codex and Antigravity.

This system has two layers:

- the prompt-level launcher named `codex-antigravity-sync`
- the repo-local runner CLI in `agents/codex-antigravity-sync/runtime/`

The launcher is manual-only. Nothing in this system should auto-run at conversation start.

## Canonical Structure

```text
agents/codex-antigravity-sync/
  config/
    local.example.json
    local.json                # ignored, removable
  docs/
    README.md
    REFERENCES.md
    UPDATER.md
    CONSUMER.md
    REMOVE.md
  runtime/
    sync.mjs
    install.mjs
    remove.mjs
    paths.mjs
  skill/
    SKILL.md
    codex.md
    antigravity.md
  state/
    current/
    archive/
  templates/
  tests/
```

Root-level exceptions are intentionally limited to:

- `package.json` script aliases
- `.gitignore` for the ignored local config path
- short pointer sections in `docs/SETUP.md` and `docs/DEVELOPMENT.md`

## Standard Manual Prompts

Refresh the pack by name alone:

> `codex-antigravity-sync`

Variants:

- `codex-antigravity-sync full scan`
- `codex-antigravity-sync include: <reference>`
- `codex-antigravity-sync include: <ref1>, <ref2>`

Consume the pack before implementation:

> Before implementation, read `agents/codex-antigravity-sync/docs/CONSUMER.md` and then the files it lists.

## Runner CLI

The repo-local runner is invoked through the root aliases:

```bash
npm run cross-agent:sync
npm run cross-agent:install
npm run cross-agent:remove
```

The sync runner supports:

- `--tool codex|antigravity`
- `--full-scan`
- repeatable `--include`
- `--conversation-id`
- `--thread-title`
- `--current-transcript-file`
- `--status`
- `--dry-run`

## State Pack

- `state/current/` is the live handoff pack.
- `state/archive/<timestamp>-<slug>/` stores prior snapshots.
- `conversation-sources.json` is the normalized machine-readable source log.
- `automation-state.json` tracks first-run vs incremental behavior per tool.

## Reference Forms

See `agents/codex-antigravity-sync/docs/REFERENCES.md` for the authoritative reference matrix, canonical identity rules, and deduplication behavior.
