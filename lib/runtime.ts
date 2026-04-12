const rawBuildTarget =
  process.env.NEXT_PUBLIC_BUILD_TARGET || process.env.BUILD_TARGET || "server";

export const BUILD_TARGET = rawBuildTarget === "pages" ? "pages" : "server";

export const IS_PAGES_BUILD = BUILD_TARGET === "pages";
export const IS_SERVER_BUILD = BUILD_TARGET === "server";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL?.replace(/^/, "https://") ||
    "http://localhost:3000"
  );
}
