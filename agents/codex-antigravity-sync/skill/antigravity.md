# Antigravity Host Notes

Use `codex-antigravity-sync` when you want Antigravity to refresh the shared pack from the current live Antigravity conversation and optional referenced sessions.

Standard invocations:

- `codex-antigravity-sync`
- `codex-antigravity-sync full scan`
- `codex-antigravity-sync include: <reference>`

Antigravity references may be:

- conversation UUID
- direct `brain/<uuid>` path
- direct `.pb` path
- exported transcript path

The authoritative reference matrix lives in `agents/codex-antigravity-sync/docs/REFERENCES.md`.

The repo-local runner is:

```text
npm run cross-agent:sync -- --tool antigravity
```
