# Google Sheets Live Charts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add production-presentable, native Google Sheets charts that update automatically from live mirrored workbook data.

**Architecture:** Extend `scripts/google-sheets-decorate.mjs` so decoration creates a hidden formula-backed `Kisan Kamai Chart Data` sheet and embeds native Google Sheets charts on `Kisan Kamai HQ`. Charts reference live formulas instead of static snapshots, so new mirrored rows update the visual board automatically.

**Tech Stack:** Google Sheets API batchUpdate, native embedded charts, formula ranges, existing npm Sheets scripts, Node.js ESM.

---

### Task 1: Add Live Chart Data Source

**Files:**
- Modify: `scripts/google-sheets-decorate.mjs`

- [x] Add `Kisan Kamai Chart Data` as a hidden helper sheet.
- [x] Populate formula-backed ranges for operational row volume, booking status mix, listing status mix, public submission channels, notification email status, and equipment category mix.
- [x] Keep the helper sheet hidden and formatted as an internal data source.

### Task 2: Add Native Dashboard Charts

**Files:**
- Modify: `scripts/google-sheets-decorate.mjs`

- [x] Rebuild existing dashboard charts on each decoration run to avoid duplicate chart objects.
- [x] Add six native charts to `Kisan Kamai HQ`.
- [x] Anchor charts below the dashboard summary so operational sheet tables remain untouched.

### Task 3: Update Docs And Contracts

**Files:**
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `docs/ARCHITECTURE.md`
- Modify: `docs/OPERATIONS_GOOGLE_SHEETS.md`
- Modify: `tests/ops-integration-contracts.test.mjs`

- [x] Document the hidden chart-data sheet and live chart board.
- [x] Add a contract test that locks the chart-generation behavior.

### Task 4: Apply And Verify

**Files:**
- Test: live production workbook and repo checks

- [x] Run `node --check scripts/google-sheets-decorate.mjs`.
- [x] Run `npm run test:contracts`.
- [x] Run `npm run sheets:decorate`.
- [x] Run `npm run sheets:verify`.
- [x] Read back workbook chart metadata and formula rows.
- [x] Commit and push the scoped changes.

### Verification Evidence

- `node --check scripts/google-sheets-decorate.mjs`: pass.
- `npm run test:contracts`: pass, 228/228.
- `npm run sheets:decorate`: pass for workbook `1OWxACnAIgjwrO88NwiXTXge5e4PLYLmX1WrO5Z8sAzU`.
- `npm run sheets:verify`: pass for all manifest tabs and conditional rules.
- Google Sheets readback confirmed six embedded dashboard charts:
  - `Operational Row Volume`
  - `Booking Status Mix`
  - `Listing Inventory Status`
  - `Public Submission Channels`
  - `Notification Email Status`
  - `Equipment Category Mix`
- Google Sheets readback confirmed `Kisan Kamai Chart Data` is hidden and contains formula-backed source ranges.
- `npm run verify`: pass, including lint, typecheck, contracts, and production build.
