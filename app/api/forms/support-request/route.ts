import { NextRequest, NextResponse } from "next/server";
import { supportRequestSchema } from "@/lib/validation/forms";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/firebase-auth";
import { createSubmissionRecord } from "@/lib/server/firebase-data";
import { parseJsonBody } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("forms-support-request", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, supportRequestSchema);
  const session = await getCurrentSession();
  const submission = await createSubmissionRecord({
    type: "support-request",
    payload: payload as Record<string, unknown>,
    userId: session?.user.id,
  });

  return NextResponse.json({ ok: true, id: submission.id });
});
