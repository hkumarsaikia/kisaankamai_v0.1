import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { assertRegistrationIdentifiersAvailable } from "@/lib/server/firebase-data";
import { HttpError, parseJsonBody } from "@/lib/server/http";
import { isPhoneAuthTestModeAllowed } from "@/lib/server/phone-auth-test-mode";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";

const DUPLICATE_PHONE_MESSAGE = "Account already exists. Please login with your registered mobile number.";
const DUPLICATE_EMAIL_MESSAGE = "Account already exists. Please login with your registered phone number.";

const preflightSchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, "").slice(-10))
    .refine((value) => /^\d{10}$/.test(value), "Enter a valid 10-digit mobile number."),
  email: z
    .union([z.literal(""), z.string().trim().email("Enter a valid email address.")])
    .optional()
    .transform((value) => value || undefined),
});

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("auth-register-preflight", async (request: NextRequest) => {
  try {
    const payload = await parseJsonBody(request, preflightSchema);
    await assertRateLimit(
      request,
      [
        ...buildAuthRateLimitRules(request, "auth-register-preflight-phone", payload.phone, 5),
        ...buildAuthRateLimitRules(request, "auth-register-preflight-email", payload.email, 5),
      ]
    );
    if (isPhoneAuthTestModeAllowed(request, payload.phone)) {
      return NextResponse.json({ ok: true, testMode: true });
    }
    await assertRegistrationIdentifiersAvailable(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    const message =
      error instanceof z.ZodError
        ? error.issues[0]?.message || "Could not validate registration details."
        : error instanceof Error
          ? error.message
          : "Could not validate registration details.";
    const status =
      message === DUPLICATE_PHONE_MESSAGE || message === DUPLICATE_EMAIL_MESSAGE ? 409 : 400;

    return NextResponse.json({ ok: false, error: message }, { status });
  }
});
