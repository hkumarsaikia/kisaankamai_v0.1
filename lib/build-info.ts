export function getBuildRevision() {
  return (
    process.env.NEXT_PUBLIC_APP_VERSION ||
    process.env.NEXT_PUBLIC_SHARE_CACHE_VERSION ||
    process.env.K_REVISION ||
    process.env.GOOGLE_CLOUD_BUILD_ID ||
    process.env.GITHUB_SHA ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    "local-dev"
  );
}

export function getBuildInfo() {
  return {
    revision: getBuildRevision(),
    environment: process.env.NODE_ENV || "development",
    generatedAt: new Date().toISOString(),
  };
}
