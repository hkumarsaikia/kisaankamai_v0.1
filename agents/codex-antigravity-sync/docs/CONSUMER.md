# Consumer Workflow

Use this before implementation when the shared handoff pack is meant to provide context.

## Standard Prompt

> Before implementation, read `agents/codex-antigravity-sync/docs/CONSUMER.md` and then the files it lists.

## Read Order

1. `agents/codex-antigravity-sync/state/current/summary.md`
2. `agents/codex-antigravity-sync/state/current/task.md`
3. `agents/codex-antigravity-sync/state/current/decisions.md`
4. `agents/codex-antigravity-sync/state/current/files.md`
5. `agents/codex-antigravity-sync/state/current/status.md`
6. `agents/codex-antigravity-sync/state/current/conversation-sources.json`
7. `agents/codex-antigravity-sync/docs/REFERENCES.md` when you need to understand supported reference forms
8. `agents/codex-antigravity-sync/state/current/transcript.md` only when deeper context is needed

## Rules

- Treat the repo as the source of truth.
- Treat `state/current/` as the active handoff pack.
- Follow locked decisions in `state/current/decisions.md` unless the user explicitly changes them.
- Use `transcript.md` for deeper context, not as the first file to read.
- Use `conversation-sources.json` to understand which sessions were kept, deduplicated, or warned.
- Do not auto-run the updater.
