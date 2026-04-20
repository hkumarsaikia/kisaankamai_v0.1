# Safe Removal

This subsystem is designed to be removable in one bounded change.

## Remove The Dedicated Subtree

Delete:

- `agents/codex-antigravity-sync/`

## Remove Root Wiring

Delete or revert only the root-level exceptions that point into this subtree:

- `package.json` script aliases for `cross-agent:sync`, `cross-agent:install`, and `cross-agent:remove`
- `.gitignore` entry for `agents/codex-antigravity-sync/config/local.json`
- short pointer sections in `docs/DEVELOPMENT.md`
- short pointer sections in `docs/SETUP.md`

## Remove Local Installation

Run:

```bash
npm run cross-agent:remove
```

That removes:

- the Codex junction at `~/.agents/skills/codex-antigravity-sync`
- the Antigravity junction at `~/.gemini/antigravity/skills/codex-antigravity-sync`
- the Antigravity `skills.txt` entry for this skill

## Verify Cleanup

1. Search for `codex-antigravity-sync` and confirm only intentional history remains.
2. Confirm no root script or doc still points into `agents/codex-antigravity-sync/`.
3. Confirm the local junctions and `skills.txt` entry are gone.
