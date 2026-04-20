# Supported References

This is the single source of truth for every supported `codex-antigravity-sync` reference form.

## Current Live Conversation

The launcher always includes the current live conversation from the invoking host first.

- Codex: current thread context from the running Codex session
- Antigravity: current conversation context from the running Antigravity session

Persisted local session surfaces are enrichment, not the primary source of truth.

## Codex Reference Forms

Supported explicit `include:` references:

- thread id from `~/.codex/state_5.sqlite`
- exact thread title from `~/.codex/session_index.jsonl`
- direct rollout JSONL path under `~/.codex/sessions/...`
- exported transcript file path

Resolution order:

1. exact rollout JSONL path
2. exact thread id
3. exact thread title
4. exported transcript file path

Canonical identity:

- `conversationId` first
- else resolved rollout path
- else exact thread title

## Antigravity Reference Forms

Supported explicit `include:` references:

- conversation UUID
- direct `~/.gemini/antigravity/brain/<uuid>/` path
- direct `~/.gemini/antigravity/conversations/<uuid>.pb` path
- exported transcript file path

Resolution order:

1. direct `brain/<uuid>` path
2. direct `.pb` path
3. UUID
4. exported transcript file path

Canonical identity:

- UUID / `conversationId` first
- else resolved `brain/<uuid>` path
- else resolved `.pb` path
- else exported transcript path

## External Transcript Mode

If the runner is invoked without `--tool`, it falls back to the removable drop-folder config at:

- `agents/codex-antigravity-sync/config/local.json`

That mode imports the newest transcript file from the configured drop folder and treats it as the current external source.

## Deduplication Rules

- the current source always wins over an equivalent explicit reference
- repeated explicit references collapse to the first resolved source
- removed duplicates are recorded in `conversation-sources.json`, `status.md`, and `provenance.md`

## Warning and Error Policy

- malformed required inputs and invalid config are fatal
- malformed optional persisted enrichment data does not stop the run
- instead, the affected source is recorded with `partial` or `error` status and explicit warnings
