import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { HttpError, parseJsonBody } from "@/lib/server/http";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";
import { completePasswordResetFromIdToken } from "@/lib/server/password-reset";

const completeSchema = z.object({
  idToken: z.string().min(1, "Reset session is missing."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Confirm password is required."),
});

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("auth-password-reset-complete", async (request: NextRequest) => {
  try {
    const payload = await parseJsonBody(request, completeSchema);
    await assertRateLimit(
      request,
      buildAuthRateLimitRules(request, "auth-password-reset-complete", payload.idToken, 8)
    );
    const result = await completePasswordResetFromIdToken(payload);

    return NextResponse.json({
      ok: true,
      uid: result.uid,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Could not complete password reset.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
});
