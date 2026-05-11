import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { HttpError, parseJsonBody } from "@/lib/server/http";
import { isPhoneAuthTestModeAllowed, normalizePhoneTestNumber } from "@/lib/server/phone-auth-test-mode";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";

const phoneTestModeSchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((value) => normalizePhoneTestNumber(value))
    .refine((value) => /^\+\d{10,15}$/.test(value), "Enter a valid mobile number."),
});

export const dynamic = "force-dynamic";

function noStoreJson(payload: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json(payload, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers || {}),
    },
  });
}

export const POST = withLoggedRoute("auth-phone-test-mode", async (request: NextRequest) => {
  try {
    const payload = await parseJsonBody(request, phoneTestModeSchema);
    await assertRateLimit(request, buildAuthRateLimitRules(request, "auth-phone-test-mode", payload.phone, 12));

    return noStoreJson({ ok: true, enabled: isPhoneAuthTestModeAllowed(request, payload.phone) });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    const message =
      error instanceof z.ZodError
        ? error.issues[0]?.message || "Could not validate phone auth test mode."
        : error instanceof Error
          ? error.message
          : "Could not validate phone auth test mode.";

    return noStoreJson({ ok: false, enabled: false, error: message }, { status: 400 });
  }
});
