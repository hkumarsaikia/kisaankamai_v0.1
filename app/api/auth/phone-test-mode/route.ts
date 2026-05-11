import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import finalTestManifest from "@/data/final-test-accounts-manifest.json";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { HttpError, parseJsonBody } from "@/lib/server/http";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";

const TOKEN_HEADER = "x-kk-phone-auth-test-token";
const TOKEN_COOKIE = "kk_phone_auth_test_token";
const TOKEN_DERIVATION_CONTEXT = "kisan-kamai-phone-auth-test-mode-v1";

const phoneTestModeSchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((value) => normalizePhoneE164(value))
    .refine((value) => /^\+\d{10,15}$/.test(value), "Enter a valid mobile number."),
});

export const dynamic = "force-dynamic";

function normalizePhoneE164(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("+")) {
    return `+${trimmed.replace(/\D/g, "")}`;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  return `+${digits}`;
}

function configuredTestNumbers() {
  const fromEnv = (process.env.KK_PHONE_AUTH_TEST_NUMBERS || "")
    .split(",")
    .map((phone) => normalizePhoneE164(phone))
    .filter(Boolean);

  return new Set([
    normalizePhoneE164(finalTestManifest.owner.phone),
    normalizePhoneE164(finalTestManifest.renter.phone),
    ...fromEnv,
  ]);
}

function tokensMatch(actual: string, expected: string) {
  if (!actual || !expected) {
    return false;
  }

  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function normalizePrivateKey(value: string) {
  return value.trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");
}

function getExpectedToken() {
  const explicitToken = process.env.KK_PHONE_AUTH_TEST_MODE_TOKEN || "";
  if (explicitToken) {
    return explicitToken;
  }

  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY || "");
  if (!privateKey) {
    return "";
  }

  return createHmac("sha256", privateKey).update(TOKEN_DERIVATION_CONTEXT).digest("hex");
}

function getRequestToken(request: NextRequest) {
  return request.headers.get(TOKEN_HEADER) || request.cookies.get(TOKEN_COOKIE)?.value || "";
}

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

    const expectedToken = getExpectedToken();
    const allowed = configuredTestNumbers().has(payload.phone);
    const enabled = Boolean(allowed && tokensMatch(getRequestToken(request), expectedToken));

    return noStoreJson({ ok: true, enabled });
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
