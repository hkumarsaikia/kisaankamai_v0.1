import { NextRequest, NextResponse } from "next/server";
import { newsletterSubscriptionSchema } from "@/lib/validation/forms";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import { createSubmissionRecord } from "@/lib/server/firebase-data";
import { parseJsonBody } from "@/lib/server/http";
import {
  assertRateLimit,
  buildPublicFormRateLimitRules,
} from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("forms-newsletter-subscription", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, newsletterSubscriptionSchema);
  const session = await getCurrentSession();
  await assertRateLimit(request, buildPublicFormRateLimitRules(request, "forms-newsletter-subscription", payload, {
    authenticatedUserId: session?.user.id,
  }));

  const submission = await createSubmissionRecord({
    type: "newsletter-subscription",
    payload: payload as Record<string, unknown>,
    userId: session?.user.id,
  });

  return NextResponse.json({ ok: true, id: submission.id });
});
