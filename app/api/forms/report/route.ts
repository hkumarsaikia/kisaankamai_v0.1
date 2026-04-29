import { NextRequest, NextResponse } from "next/server";
import { reportSubmissionSchema } from "@/lib/validation/forms";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import { createSubmissionRecord } from "@/lib/server/firebase-data";
import { parseJsonBody } from "@/lib/server/http";
import {
  assertRateLimit,
  buildPublicFormRateLimitRules,
} from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("forms-report", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, reportSubmissionSchema);
  await assertRateLimit(request, buildPublicFormRateLimitRules(request, "forms-report", payload));

  const session = await getCurrentSession();
  const submission = await createSubmissionRecord({
    type: "report",
    payload: payload as Record<string, unknown>,
    userId: session?.user.id,
  });

  return NextResponse.json({ ok: true, id: submission.id });
});
