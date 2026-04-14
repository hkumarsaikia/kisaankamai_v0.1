import { NextRequest, NextResponse } from "next/server";
import { clientBugEnvelopeSchema } from "@/lib/bug-reporting/types";
import { reportClientEnvelope } from "@/lib/server/bug-reporting";
import { ensureSameOrigin } from "@/lib/server/http";
import { IS_PAGES_BUILD, PAGES_BUILD_DYNAMIC, pagesDemoJson } from "@/lib/server/pages-export";

export const dynamic = PAGES_BUILD_DYNAMIC;

export async function POST(request: NextRequest) {
  if (IS_PAGES_BUILD) {
    return pagesDemoJson({ ok: true, skipped: true, id: "pages-demo-bug-report" });
  }

  try {
    ensureSameOrigin(request);
    const payload = clientBugEnvelopeSchema.parse(await request.json());
    const result = await reportClientEnvelope(request, payload);
    return NextResponse.json({ ok: true, id: result.id, skipped: result.skipped });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not store bug report.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
