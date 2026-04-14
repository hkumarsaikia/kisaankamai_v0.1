import { NextResponse } from "next/server";

export const IS_PAGES_BUILD = process.env.NEXT_PUBLIC_BUILD_TARGET === "pages";
export const PAGES_BUILD_DYNAMIC = IS_PAGES_BUILD ? "force-static" : "force-dynamic";
export const PAGES_DEMO_ROUTE_ERROR =
  "This endpoint is disabled on the GitHub Pages demo. Use the Firebase deployment or local dev server for live mutations.";

export function pagesDemoJson(payload: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json(
    {
      demo: true,
      ...payload,
    },
    init
  );
}
