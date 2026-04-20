# Locked Decisions

- The system is manual only. Nothing auto-runs at conversation start.
- The repo is the source of truth for shared agent context.
- The active pack lives in `docs/cross-agent/current/`.
- Previous packs are stored in `docs/cross-agent/archive/<timestamp>-<slug>/`.
- A full transcript import is required for each pack refresh.
- Transcript input comes from a fixed external drop folder supplied by a removable local config file.
- Wrapper templates may be agent-specific in wording, but the pack format stays agent-neutral.
- Safe deletion depends on keeping repo-owned behavior concentrated in this docs folder, one utility, one local config example, and a small number of direct doc references.
