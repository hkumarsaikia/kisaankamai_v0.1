# Docs Workspace Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the canonical workspace docs and clean safe local artifacts without rewriting historical evidence files or unrelated tool state.

**Architecture:** Keep README/AGENTS/requirements as the entrypoints, update operational docs for current pSEO and Sheets workflows, and leave timestamped bug-fix bundles immutable. Clean only generated/editor artifacts that are clearly not source, credentials, or user-authored work.

**Tech Stack:** Markdown docs, npm scripts, Google Sheets operational tooling, Git.

---

### Task 1: Update Canonical Entrypoints

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `requirements.txt`

- [x] Add current `sheets:decorate` workflow to root commands.
- [x] Add current programmatic SEO category route contract.
- [x] Clarify cleanup policy for generated files, local skills, and historical docs.

### Task 2: Update Operational Docs

**Files:**
- Modify: `docs/DEVELOPMENT.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/SEO.md`
- Modify: `docs/ROADMAP.md`
- Modify: `docs/site-map/README.md`

- [x] Add Google Sheets decoration workflow where Sheets operations are documented.
- [x] Add current `/catalog/[slug]` pSEO architecture and verification.
- [x] Refresh roadmap priorities to match current live maintenance work.

### Task 3: Clean Safe Local Artifacts

**Files:**
- Delete: `.codex.file.backup-20260516T114041`

- [x] Remove only the empty generated backup file.
- [x] Do not delete or revert unrelated `.agents/skills/*`, `.gemini/`, `GEMINI.md`, or `skills-lock.json` changes in this pass.

### Task 4: Verify, Commit, Push

**Files:**
- Test: docs and scripts touched in this refresh

- [x] Run `npm run sheets:verify`.
- [x] Run `npm run lint`.
- [x] Run `git diff --check` on the scoped docs/cleanup changes.
- [x] Commit only the scoped docs/cleanup files.
- [x] Push `origin/main`.

### Task 5: Productionize Google Sheets Decoration

**Files:**
- Modify: `scripts/google-sheets-decorate.mjs`
- Modify: `docs/OPERATIONS_GOOGLE_SHEETS.md`

- [x] Replace prototype-style dashboard wording, emoji labels, and mascot/toy language with production operations copy.
- [x] Use stable spreadsheet typography and clear operational codes for sheet-map rows.
- [x] Run `npm run sheets:decorate` and re-run workbook verification.
