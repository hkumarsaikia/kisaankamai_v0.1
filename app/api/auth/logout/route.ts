import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/server/local-auth";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { IS_PAGES_BUILD, PAGES_BUILD_DYNAMIC, pagesDemoJson } from "@/lib/server/pages-export";

export const dynamic = PAGES_BUILD_DYNAMIC;

export const POST = IS_PAGES_BUILD
  ? async () => pagesDemoJson({ ok: true, skipped: true })
  : withLoggedRoute("auth-logout", async () => {
      await clearSessionCookie();
      return NextResponse.json({ ok: true });
    });
