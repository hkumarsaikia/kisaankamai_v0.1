import { spawnSync } from "node:child_process";

function runGit(args, options = {}) {
  const result = spawnSync("git", args, {
    cwd: options.cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "Git command failed.").trim());
  }

  return result.stdout.trim();
}

export function getLocalGitSummary(cwd) {
  const dirtyOutput = runGit(["status", "--porcelain"], { cwd });
  return {
    branch: runGit(["branch", "--show-current"], { cwd }),
    head: runGit(["rev-parse", "HEAD"], { cwd }),
    subject: runGit(["log", "-1", "--pretty=%s"], { cwd }),
    committedAt: runGit(["log", "-1", "--date=iso-strict", "--pretty=%cd"], { cwd }),
    dirtyFiles: dirtyOutput ? dirtyOutput.split(/\r?\n/).filter(Boolean) : [],
  };
}

export function getRemoteHead(repoUrl, branch, cwd) {
  const output = runGit(["ls-remote", "--heads", repoUrl, `refs/heads/${branch}`], { cwd });
  if (!output) {
    throw new Error(`Could not resolve remote branch refs/heads/${branch} from ${repoUrl}`);
  }

  const [head] = output.split(/\s+/);
  return head;
}

export function getRemoteUrl(remoteName, cwd) {
  try {
    return runGit(["remote", "get-url", remoteName], { cwd });
  } catch {
    return "";
  }
}

export function ensureRemote(remoteName, repoUrl, cwd) {
  const currentUrl = getRemoteUrl(remoteName, cwd);
  if (!currentUrl) {
    runGit(["remote", "add", remoteName, repoUrl], { cwd });
    return { action: "added", remoteName, repoUrl };
  }

  if (currentUrl !== repoUrl) {
    runGit(["remote", "set-url", remoteName, repoUrl], { cwd });
    return { action: "updated", remoteName, repoUrl, previousUrl: currentUrl };
  }

  return { action: "unchanged", remoteName, repoUrl };
}

export function pushHeadToRemote(remoteName, branch, cwd, options = {}) {
  const args = ["push", remoteName, `HEAD:refs/heads/${branch}`];
  if (options.forceWithLease) {
    args.splice(1, 0, "--force-with-lease");
  }
  return runGit(args, { cwd });
}
