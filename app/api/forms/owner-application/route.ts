import { NextRequest, NextResponse } from "next/server";
import { ownerApplicationSchema } from "@/lib/validation/forms";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import { createSubmissionRecord } from "@/lib/server/local-data";
import { parseJsonBody } from "@/lib/server/http";
import {
  IS_PAGES_BUILD,
  PAGES_BUILD_DYNAMIC,
  PAGES_DEMO_ROUTE_ERROR,
  pagesDemoJson,
} from "@/lib/server/pages-export";

export const dynamic = PAGES_BUILD_DYNAMIC;

export const POST = IS_PAGES_BUILD
  ? async () => pagesDemoJson({ ok: false, error: PAGES_DEMO_ROUTE_ERROR }, { status: 400 })
  : withLoggedRoute("forms-owner-application", async (request: NextRequest) => {
      const payload = await parseJsonBody(request, ownerApplicationSchema);
      const session = await getCurrentSession();
      const submission = await createSubmissionRecord({
        type: "owner-application",
        payload: {
          ...payload,
          sourcePath: "/owner-registration",
        } as Record<string, unknown>,
        userId: session?.user.id,
      });

      return NextResponse.json({ ok: true, id: submission.id });
    });
