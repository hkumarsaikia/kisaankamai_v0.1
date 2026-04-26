import { parseArgs, printUsage, getBooleanOption, getStringOption } from "./lib/cli.mjs";
import { sendDiscordWebhookToChannels } from "./lib/discord.mjs";
import { loadRepoEnv, getRepoRoot, isSheetsConfigured } from "./lib/env.mjs";
import { ensureRemote, getLocalGitSummary, getRemoteHead, pushHeadToRemote } from "./lib/git.mjs";
import {
  appendAuditEntry,
  ensureWorkbookStructure,
  upsertWorkbookMetaEntries,
} from "./lib/google-sheets.mjs";

const options = parseArgs();

if (options.help) {
  printUsage([
    "Usage: node scripts/live-repo-sync.mjs --repo-url <git-url> [--branch <branch>] [--sheet-id <id>] [--webhook-url <url>]",
    "       node scripts/live-repo-sync.mjs --repo-url <git-url> [--branch <branch>] --push [--remote-name <name>]",
    "",
    "Compares the local workspace against a live repo URL, optionally configures a named remote,",
    "can push the current HEAD to that branch, writes sync metadata into the workbook when configured,",
    "and can send a Discord notification for the comparison result.",
  ]);
  process.exit(0);
}

loadRepoEnv();

const repoRoot = getRepoRoot();
const repoUrl = getStringOption(options, "repo-url", "");
const branch = getStringOption(options, "branch", "main");
const spreadsheetId = getStringOption(options, "sheet-id", "");
const webhookUrl = getStringOption(options, "webhook-url", process.env.DISCORD_WEBHOOK_URL || "");
const discordChannel = getStringOption(options, "discord-channel", "github");
const notify = getBooleanOption(options, "notify", false);
const push = getBooleanOption(options, "push", false);
const allowDirty = getBooleanOption(options, "allow-dirty", false);
const forceWithLease = getBooleanOption(options, "force-with-lease", false);
const remoteName = getStringOption(options, "remote-name", "live");
const overrides = spreadsheetId ? { spreadsheetId } : {};
const timestamp = new Date().toISOString();
const runId = `repo-sync-${Date.now()}`;

if (!repoUrl) {
  throw new Error("Missing required --repo-url argument.");
}

const localBefore = getLocalGitSummary(repoRoot);
const dirtyCount = localBefore.dirtyFiles.length;

if (push && dirtyCount > 0 && !allowDirty) {
  throw new Error(
    `Refusing to push to ${repoUrl} because the working tree is dirty (${dirtyCount} files). Commit or stash changes first, or pass --allow-dirty if you really want to push HEAD only.`
  );
}

let remoteAction = "compare-only";
if (push) {
  const ensured = ensureRemote(remoteName, repoUrl, repoRoot);
  remoteAction = ensured.action;
  pushHeadToRemote(remoteName, branch, repoRoot, { forceWithLease });
}

const local = getLocalGitSummary(repoRoot);
const remoteHead = getRemoteHead(repoUrl, branch, repoRoot);
const isInSync = local.head === remoteHead;
const status = isInSync && dirtyCount === 0 ? "success" : push && isInSync ? "success" : "warning";
const mode = push ? "push" : "compare";
const summary = push
  ? isInSync
    ? `Pushed local HEAD to ${branch} and verified remote head ${remoteHead.slice(0, 12)}.`
    : `Push completed but local HEAD ${local.head.slice(0, 12)} does not match remote ${remoteHead.slice(0, 12)}.`
  : isInSync
    ? `Local workspace matches ${branch} at ${remoteHead.slice(0, 12)}.`
    : `Local workspace differs from ${branch}. Local ${local.head.slice(0, 12)} vs remote ${remoteHead.slice(0, 12)}.`;

if (isSheetsConfigured(overrides)) {
  await ensureWorkbookStructure(overrides);
  await upsertWorkbookMetaEntries(
    [
      { section: "repo_sync", key: "repo_url", value: repoUrl, updated_at: timestamp },
      { section: "repo_sync", key: "branch", value: branch, updated_at: timestamp },
      { section: "repo_sync", key: "remote_name", value: remoteName, updated_at: timestamp },
      { section: "repo_sync", key: "mode", value: mode, updated_at: timestamp },
      { section: "repo_sync", key: "remote_action", value: remoteAction, updated_at: timestamp },
      { section: "repo_sync", key: "local_branch", value: local.branch, updated_at: timestamp },
      { section: "repo_sync", key: "local_head", value: local.head, updated_at: timestamp },
      { section: "repo_sync", key: "remote_head", value: remoteHead, updated_at: timestamp },
      { section: "repo_sync", key: "local_commit_subject", value: local.subject, updated_at: timestamp },
      { section: "repo_sync", key: "local_commit_at", value: local.committedAt, updated_at: timestamp },
      { section: "repo_sync", key: "dirty_file_count", value: String(dirtyCount), updated_at: timestamp },
      { section: "repo_sync", key: "in_sync", value: String(isInSync), updated_at: timestamp },
      { section: "repo_sync", key: "last_run_id", value: runId, updated_at: timestamp },
      { section: "repo_sync", key: "last_run_at", value: timestamp, updated_at: timestamp },
    ],
    overrides
  );
  await appendAuditEntry(
    {
      recorded_at: timestamp,
      run_id: runId,
      entity_type: "repo_sync",
      entity_id: branch,
      destination: "google-sheets",
      outcome: status === "success" ? "success" : "skipped",
      operation: push ? "push-live-repo" : "compare-live-repo",
      note: summary,
      details_json: JSON.stringify({
        repoUrl,
        branch,
        remoteName,
        mode,
        remoteAction,
        localHead: local.head,
        remoteHead,
        dirtyCount,
      }),
    },
    overrides
  );
}

if (webhookUrl && (notify || options["webhook-url"] !== undefined)) {
  await sendDiscordWebhookToChannels({
    channels: [discordChannel],
    webhookUrl,
    title: "Kisan Kamai Live Repo Sync",
    summary,
    status,
    fields: [
      { name: "Repo URL", value: repoUrl, inline: false },
      { name: "Branch", value: branch, inline: true },
      { name: "Mode", value: mode, inline: true },
      { name: "Remote", value: remoteName, inline: true },
      { name: "Dirty Files", value: String(dirtyCount), inline: true },
      { name: "Local Head", value: local.head, inline: false },
      { name: "Remote Head", value: remoteHead, inline: false },
    ],
  });
}

console.log(`Repo sync against ${repoUrl} (${branch})`);
console.log(`- mode: ${mode}`);
console.log(`- remote: ${remoteName}`);
console.log(`- remote action: ${remoteAction}`);
console.log(`- local head: ${local.head}`);
console.log(`- remote head: ${remoteHead}`);
console.log(`- in sync: ${isInSync}`);
console.log(`- dirty files: ${dirtyCount}`);
