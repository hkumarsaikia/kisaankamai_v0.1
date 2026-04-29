import { NextRequest, NextResponse } from "next/server";
import { clientBugEnvelopeSchema } from "@/lib/bug-reporting/types";
import { reportClientEnvelope, withLoggedRoute } from "@/lib/server/bug-reporting";
import { parseJsonBody } from "@/lib/server/http";
import { assertRateLimit, clientIpRateKey } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("bug-reports", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, clientBugEnvelopeSchema);
  await assertRateLimit(request, [
    {
      namespace: "bug-reports:ip",
      key: clientIpRateKey(request),
      limit: 20,
      windowMs: 10 * 60 * 1000,
    },
  ]);
  const result = await reportClientEnvelope(request, payload);
  return NextResponse.json({ ok: true, id: result.id, skipped: result.skipped });
});
