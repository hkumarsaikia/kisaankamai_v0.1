import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/local-auth";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { IS_PAGES_BUILD, PAGES_BUILD_DYNAMIC, pagesDemoJson } from "@/lib/server/pages-export";

export const dynamic = PAGES_BUILD_DYNAMIC;

export const GET = IS_PAGES_BUILD
  ? async () => pagesDemoJson({ session: null })
  : withLoggedRoute("auth-session", async () => {
      const session = await getCurrentSession();
      return NextResponse.json({ session });
    });
