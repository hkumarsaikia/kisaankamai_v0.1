import { NextRequest, NextResponse } from "next/server";
import { partnerInquirySchema } from "@/lib/validation/forms";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import { createSubmissionRecord } from "@/lib/server/local-data";
import { parseJsonBody } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("forms-partner-inquiry", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, partnerInquirySchema);
  const session = await getCurrentSession();
  const submission = await createSubmissionRecord({
    type: "partner-inquiry",
    payload: {
      ...payload,
      sourcePath: "/partner",
    } as Record<string, unknown>,
    userId: session?.user.id,
  });

  return NextResponse.json({ ok: true, id: submission.id });
});
