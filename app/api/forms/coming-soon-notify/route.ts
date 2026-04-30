import { NextRequest, NextResponse } from "next/server";
import { comingSoonNotifySchema } from "@/lib/validation/forms";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import { createSubmissionRecord } from "@/lib/server/firebase-data";
import { parseJsonBody } from "@/lib/server/http";
import {
  assertRateLimit,
  buildPublicFormRateLimitRules,
} from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("forms-coming-soon-notify", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, comingSoonNotifySchema);
  const session = await getCurrentSession();
  await assertRateLimit(request, buildPublicFormRateLimitRules(request, "forms-coming-soon-notify", payload, {
    authenticatedUserId: session?.user.id,
  }));

  const submission = await createSubmissionRecord({
    type: "coming-soon-notify",
    payload: payload as Record<string, unknown>,
    userId: session?.user.id,
  });

  return NextResponse.json({ ok: true, id: submission.id });
});
