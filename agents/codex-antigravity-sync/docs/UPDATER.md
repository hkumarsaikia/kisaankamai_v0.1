# Updater Workflow

This workflow is manual-only. Run it only after an explicit user request.

## Prompt-Level Invocation

Use the shared launcher name:

> `codex-antigravity-sync`

Variants:

- `codex-antigravity-sync full scan`
- `codex-antigravity-sync include: <reference>`
- `codex-antigravity-sync include: <ref1>, <ref2>`

## Repo-Level Runner

The launcher maps to the repo-local runner:

```bash
npm run cross-agent:sync
```

Use read-only preview modes when helpful:

```bash
npm run cross-agent:sync -- --status
npm run cross-agent:sync -- --dry-run --tool codex
```

## Update Rules

1. Always include the current live conversation first.
2. Include only explicitly referenced non-current conversations.
3. Do not recursively crawl linked or cited conversations.
4. Deduplicate current and explicit references by canonical identity.
5. Write only to `agents/codex-antigravity-sync/state/current/` and `state/archive/`.
6. Use `agents/codex-antigravity-sync/docs/REFERENCES.md` as the single reference-form contract.
7. Use `agents/codex-antigravity-sync/docs/README.md` as the authoritative explanation of launcher vs runner.

## Notes

- The removable local config lives at `agents/codex-antigravity-sync/config/local.json`.
- Use `docs/DEVELOPMENT.md` and `docs/SETUP.md` only as short entrypoint pointers, not as authoritative workflow specs.
