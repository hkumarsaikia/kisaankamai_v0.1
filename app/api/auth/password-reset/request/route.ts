import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { HttpError, parseJsonBody } from "@/lib/server/http";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";
import { resolvePasswordResetTarget } from "@/lib/server/password-reset";

const requestSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your registered email or mobile number."),
});

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("auth-password-reset-request", async (request: NextRequest) => {
  try {
    const payload = await parseJsonBody(request, requestSchema);
    await assertRateLimit(
      request,
      buildAuthRateLimitRules(request, "auth-password-reset-request", payload.identifier, 5)
    );
    const target = await resolvePasswordResetTarget(payload.identifier);

    return NextResponse.json({
      ok: true,
      phoneE164: target.phoneE164,
      maskedPhone: target.maskedPhone,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Could not start password reset.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
});
