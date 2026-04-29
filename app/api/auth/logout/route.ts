import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { ensureSameOrigin } from "@/lib/server/http";
import { clearSessionCookie } from "@/lib/server/local-auth";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("auth-logout", async (request: NextRequest) => {
  ensureSameOrigin(request);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
});
