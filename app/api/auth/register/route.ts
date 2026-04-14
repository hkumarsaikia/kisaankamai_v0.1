import { NextRequest, NextResponse } from "next/server";
import { registerAndCreateSession } from "@/lib/server/local-auth";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { parseJsonBody } from "@/lib/server/http";
import {
  IS_PAGES_BUILD,
  PAGES_BUILD_DYNAMIC,
  PAGES_DEMO_ROUTE_ERROR,
  pagesDemoJson,
} from "@/lib/server/pages-export";
import { registerInputSchema } from "@/lib/validation/forms";

export const dynamic = PAGES_BUILD_DYNAMIC;

export const POST = IS_PAGES_BUILD
  ? async () => pagesDemoJson({ ok: false, error: PAGES_DEMO_ROUTE_ERROR }, { status: 400 })
  : withLoggedRoute("auth-register", async (request: NextRequest) => {
      const payload = await parseJsonBody(request, registerInputSchema);
      const session = await registerAndCreateSession(payload);

      if (!session) {
        return NextResponse.json({ ok: false, error: "Registration failed." }, { status: 400 });
      }

      return NextResponse.json({
        ok: true,
        userId: session.user.id,
        email: session.user.email,
      });
    });
