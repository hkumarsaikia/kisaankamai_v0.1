# Google Antigravity Execution Prompt

Use the exact prompt below in a fresh Google Antigravity conversation after all required accounts are already signed in there.

## Conversation startup

Send these messages in order:

1.

```text
codex-antigravity-sync full scan
```

2.

```text
Before implementation, read agents/codex-antigravity-sync/docs/CONSUMER.md and then the files it lists.
```

3. Paste the full prompt below.

## Full prompt

```text
You are continuing Kisan Kamai from the current repository state and the shared Codex handoff pack.

Work from this repo only:
C:\Users\hkuma\OneDrive\Desktop\Work\kisan_kamai_v1

Critical repo contract:
- The root Next.js app is the only canonical public frontend.
- Firebase App Hosting is the runtime and serving layer.
- Firebase is the source of truth for auth, Firestore, Storage, and notifications.
- Google Sheets is a best-effort operational mirror only and must never block Firebase writes.
- apps/production has already been removed from the repo and must not be recreated.

Before doing anything else:
1. Run codex-antigravity-sync full scan.
2. Read agents/codex-antigravity-sync/docs/CONSUMER.md and the files it lists.
3. Read these repo files directly:
   - README.md
   - AGENTS.md
   - docs/ARCHITECTURE.md
   - docs/DEVELOPMENT.md
   - docs/SETUP.md
   - docs/OPERATIONS_FINAL_TEST_ACCOUNTS.md
   - docs/OPERATIONS_GOOGLE_SHEETS.md
   - docs/OPERATIONS_LIVE_REPO_SYNC.md
   - docs/RUNBOOK_GODADDY_FIREBASE_DOMAIN_MIGRATION.md
   - apphosting.yaml
   - firebase.json
   - .firebaserc
   - firebase/firestore.rules
   - firebase/firestore.indexes.json
   - firebase/storage.rules
   - scripts/live-repo-sync.mjs
   - scripts/lib/env.mjs
   - scripts/google-sheets-bootstrap.mjs
   - scripts/google-sheets-verify.mjs
   - scripts/google-sheets-backfill.mjs
   - scripts/final-test-accounts-seed.mjs
   - scripts/final-test-accounts-cleanup.mjs
   - data/final-test-accounts-manifest.json
   - data/operational-sheets-workbook.json
4. Treat the root app only as the implementation target. Do not reintroduce apps/production.

Current known repo state you must respect:
- Firebase project: gokisaan
- Firebase App Hosting config is at repo root via apphosting.yaml
- Working repo currently pushes to:
  https://github.com/hkumarsaikia/kisaankamai_v0.1.git
- The live repo that should exist and become the publish target is expected to be:
  https://github.com/kisaankamai/kisankamai
- The current root Firebase deploy layer already exists:
  - firebase.json
  - .firebaserc
  - firebase/firestore.rules
  - firebase/firestore.indexes.json
  - firebase/storage.rules
- The root app already has Firebase-backed auth/session routes, password-reset routes, Google Sheets tooling, final test account seeding, and live repo sync tooling.
- The last verified working-repo baseline already pushed from Codex before this pass was based on commit 98ec60a, and you should now work from the current checked-out repo state rather than trying to reconstruct that commit manually.

Current final test accounts that must remain valid and deletable:
- Owner:
  - email: final.owner.test@example.com
  - phone: +91 90000 00101
  - password: KisanOwner!2026
  - Firebase test OTP code: 111111
- Renter:
  - email: final.renter.test@example.com
  - phone: +91 90000 00102
  - password: KisanRenter!2026
  - Firebase test OTP code: 222222

Current verified operational expectations:
- npm run verify is the main root-app release gate.
- npm run sheets:bootstrap, npm run sheets:verify, and npm run sheets:backfill are the operational Google Sheets entrypoints.
- npm run seed:final-test-accounts and npm run cleanup:final-test-accounts are the final seeded account lifecycle entrypoints.
- npm run repo:sync-live is the live repo sync entrypoint.
- npm run discord:notify is the Discord notification entrypoint.
- The Google Sheet workbook should default to GOOGLE_SHEET_ID from apphosting.yaml unless explicitly overridden.

You must complete all of the following using browser, CLI, API, Cloud Shell, and repo edits as needed. Prefer CLI/API first. Use browser automation only when CLI/API is insufficient.

Part 1: Repo cleanup and documentation
1. Verify apps/production is absent from the repo and do not recreate it.
2. Remove every tracked reference that still treats apps/production as a maintained alternate app surface.
3. Update root docs so they describe only the root app as the maintained frontend.
4. Keep the Firebase-first and Sheets-mirror architecture wording intact.
5. Keep the cross-agent handoff docs intact, but do not treat runtime transcript files as product documentation.

Part 2: Firebase Auth test phone numbers
1. Keep the existing seeded owner/renter accounts.
2. Add Firebase Auth fictional phone test numbers for:
   - +91 90000 00101 -> 111111
   - +91 90000 00102 -> 222222
3. Use browser automation in Firebase Console if needed.
4. If an API path is available through Google Identity Platform config, you may use it instead.
5. Verify that OTP login works in the root app for both test accounts after setup.

Part 3: Web push / FCM
1. Check whether NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY is already present anywhere in the actual runtime config.
2. If missing, create or import the Firebase Cloud Messaging Web Push credentials using the actual Firebase console flow for the gokisaan project.
3. Put the public key into the correct runtime/config secret path used by the root app.
4. Verify:
   - notification permission prompt
   - token acquisition
   - token persistence
   - service worker path
   - at least one notification flow if enough server-side config exists
5. Do not fake a completed notification setup. Report any remaining provider limitation honestly.

Part 4: Google Sheets
1. Use the workbook identified by GOOGLE_SHEET_ID from apphosting.yaml unless a better production workbook is clearly discovered and justified.
2. Verify the workbook structure matches data/operational-sheets-workbook.json.
3. Run or repeat:
   - npm run sheets:bootstrap
   - npm run sheets:verify
   - npm run sheets:backfill
4. Make the workbook operational and readable:
   - tabs present
   - headers correct
   - formatting/conditional rules present
   - replace-mode tabs refreshed
   - append-only tabs preserved appropriately
5. Keep Firebase as source of truth and Sheets as mirror only.

Part 5: Live GitHub repo split
1. Verify whether https://github.com/kisaankamai/kisankamai already exists.
2. If it does not exist, create it using browser, GitHub CLI, or GitHub API, whichever works from the signed-in environment.
3. Wire the repo as the live remote.
4. Use the repo-sync flow so the working repo remains:
   - https://github.com/hkumarsaikia/kisaankamai_v0.1.git
5. Sync the canonical code to:
   - https://github.com/kisaankamai/kisankamai
6. Verify the live repo has the correct content after the sync.
7. If App Hosting repo linkage can be updated safely from the available tools, do that. If it still requires a console-only step, perform it in the browser if possible and document exactly what changed.

Part 6: Discord notification
1. Find or create the correct Discord webhook in the already-signed-in environment.
2. Wire DISCORD_WEBHOOK_URL into the real runtime/env path used by the repo tools.
3. Send the notification only after:
   - live repo sync is complete
   - runtime verification is green enough to justify the message
4. The message must clearly state that the main live repo under kisaankamai has been updated.

Part 7: GoDaddy preparation
1. Do not perform final domain cutover unless the required GoDaddy access and DNS authority are actually available.
2. If GoDaddy is available:
   - confirm the account controls kisankamai.com and www
   - capture the current DNS state
   - determine how to preserve the current showpiece site as old
   - determine whether DNS-only automation is enough or whether file/site backup is also needed
3. If GoDaddy API credentials exist, use API where appropriate.
4. If DNS changes still require the browser panel, use it only after you have a complete Firebase custom-domain record set.
5. Do not guess Firebase custom-domain records. Use the real values generated for the current project.
6. If final cutover is still deferred, leave an exact verified runbook state and list what remains.

Part 8: Local workspace noise
1. Clean non-product local noise from the worktree where appropriate:
   - agents/codex-antigravity-sync/state/current/*
   - scratch numeric files if they are junk
   - untracked local-only runtime leftovers
2. Keep vendor/superpowers intact unless there is a clear repo-tracked reason to touch it.
3. Decide whether vendor/openform and vendor/rn-interface-kit are intentional local references or junk; if they are not needed, remove them safely.
4. Do not remove useful vendored references blindly.

Validation requirements:
- Run npm run verify against the root app.
- Re-run sheets verification.
- Verify login/register/verify-contact/forgot-password surfaces in browser.
- Verify owner and renter test accounts with both email/password and OTP where configured.
- Verify that the root app serves, not apps/production.
- Verify the live repo sync status after syncing.
- Verify any Discord notification actually sent.
- Verify whether GoDaddy work is fully done or still deferred.

Reporting requirements:
Your final response must include:
1. What you changed in the repo
2. What you changed in Firebase
3. What you changed in GitHub
4. What you changed in Discord
5. What you changed in GoDaddy, or a clear statement that GoDaddy remains deferred
6. What you verified, with concrete command/browser evidence
7. Every blocker or missing permission still remaining
8. The final state of:
   - working repo
   - live repo
   - Firebase Auth test phone numbers
   - Web push/VAPID key
   - Sheets workbook
   - final test accounts
   - GoDaddy/domain readiness

Do not leave the implementer to decide anything. If a choice is needed, pick the path that matches the repo’s current Firebase-first root-app architecture and document it explicitly.
```
