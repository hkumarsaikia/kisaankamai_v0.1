import { NextResponse } from "next/server";
import { getBuildInfo } from "@/lib/build-info";

export const dynamic = "force-dynamic";

const FRESHNESS_HEADERS = {
  "Cache-Control": "private, no-cache, no-store, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
};

export async function GET() {
  const buildInfo = getBuildInfo();

  return NextResponse.json(buildInfo, {
    headers: {
      ...FRESHNESS_HEADERS,
      "X-Kisan-Kamai-Revision": buildInfo.revision,
    },
  });
}
