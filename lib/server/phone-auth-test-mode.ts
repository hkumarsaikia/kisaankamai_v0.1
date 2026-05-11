import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
import finalTestManifest from "@/data/final-test-accounts-manifest.json";

const TOKEN_HEADER = "x-kk-phone-auth-test-token";
const TOKEN_COOKIE = "kk_phone_auth_test_token";
const TOKEN_DERIVATION_CONTEXT = "kisan-kamai-phone-auth-test-mode-v1";

export function normalizePhoneTestNumber(input: string) {
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

function tokensMatch(actual: string, expected: string) {
  if (!actual || !expected) {
    return false;
  }

  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export function configuredPhoneAuthTestNumbers() {
  const fromEnv = (process.env.KK_PHONE_AUTH_TEST_NUMBERS || "")
    .split(",")
    .map((phone) => normalizePhoneTestNumber(phone))
    .filter(Boolean);

  return new Set([
    normalizePhoneTestNumber(finalTestManifest.owner.phone),
    normalizePhoneTestNumber(finalTestManifest.renter.phone),
    ...fromEnv,
  ]);
}

export function isPhoneAuthTestModeAllowed(request: NextRequest, phone: string) {
  const expectedToken = getExpectedToken();
  const allowedPhone = configuredPhoneAuthTestNumbers().has(normalizePhoneTestNumber(phone));
  return Boolean(allowedPhone && tokensMatch(getRequestToken(request), expectedToken));
}
