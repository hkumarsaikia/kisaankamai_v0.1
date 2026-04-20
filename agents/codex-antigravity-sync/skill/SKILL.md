---
name: codex-antigravity-sync
description: Use when synchronizing shared context between Codex and Antigravity, refreshing the handoff pack from the current live conversation, or importing explicitly referenced sessions for cross-agent handoff.
---

# Codex Antigravity Sync

This skill is manual-only. It must never auto-run at conversation start.

When invoked, treat `agents/codex-antigravity-sync/` as the repo-owned source of truth.

The launcher is the prompt-level entrypoint.
The actual work is performed by the repo-local runner in `agents/codex-antigravity-sync/runtime/`.

Refresh the handoff pack from:

- the current live host conversation
- any explicitly referenced conversations
- persisted local Codex or Antigravity session surfaces when they can enrich those conversations

## Supported Manual Workflow

When the host supports Superpowers and subagents, this launcher may be executed through:

- `using-superpowers`
- `subagent-driven-development`

These are manual workflow aids, not hidden automatic prerequisites.

## Invocation shapes

- `codex-antigravity-sync`
- `codex-antigravity-sync full scan`
- `codex-antigravity-sync include: <reference>`
- `codex-antigravity-sync include: <ref1>, <ref2>`

## Operating rules

- First run per tool performs a full scan.
- Later runs default to incremental refresh.
- `full scan` forces a full rescan.
- Always include the current live conversation.
- Only include non-current conversations that are explicitly referenced.
- Do not recursively crawl linked or cited conversations.
- Antigravity raw `.pb` files are opaque artifacts unless a schema is added later.

## Host references

- Read `codex.md` for Codex-specific usage.
- Read `antigravity.md` for Antigravity-specific usage.
- Read `../docs/REFERENCES.md` for the authoritative reference matrix.
