# Codex Host Notes

Use `codex-antigravity-sync` when you want Codex to refresh the shared pack from the current live Codex conversation and optional referenced sessions.

Standard invocations:

- `codex-antigravity-sync`
- `codex-antigravity-sync full scan`
- `codex-antigravity-sync include: <reference>`

Codex references may be:

- thread id
- exact thread title
- direct rollout JSONL path
- exported transcript path

The updater backend is `npm run cross-agent:sync`.
The authoritative reference matrix lives in `agents/codex-antigravity-sync/docs/REFERENCES.md`.

The repo-local runner is:

```text
npm run cross-agent:sync -- --tool codex
```
