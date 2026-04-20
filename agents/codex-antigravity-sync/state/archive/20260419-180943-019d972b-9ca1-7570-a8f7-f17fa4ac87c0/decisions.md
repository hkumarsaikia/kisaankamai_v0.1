# Decisions

- The shared launcher name is `codex-antigravity-sync`.
- The repo-local source of truth lives under `agents/codex-antigravity-sync/`.
- The launcher is manual-only and wraps a repo-local runner; it is not a background daemon.
- Current live conversation context wins over equivalent explicit references.
- Explicit non-current references are opt-in only and are deduplicated by canonical identity.
- Antigravity raw `.pb` files are recorded as opaque binary artifacts unless a schema is added later.
