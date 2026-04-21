import { getOptionalFirebaseClientConfig } from "@/lib/firebase-client";

function parsePublicBooleanEnv(name: string, defaultValue: boolean) {
  const raw = process.env[name]?.trim().toLowerCase();
  if (!raw) {
    return defaultValue;
  }

  if (["1", "true", "yes", "on"].includes(raw)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(raw)) {
    return false;
  }

  return defaultValue;
}

export const FIREBASE_CLIENT_AUTH_CONFIGURED = Boolean(getOptionalFirebaseClientConfig());
export const PHONE_RESET_OTP_ENABLED =
  FIREBASE_CLIENT_AUTH_CONFIGURED &&
  parsePublicBooleanEnv("NEXT_PUBLIC_PHONE_RESET_OTP_ENABLED", true);
export const PHONE_AUTH_TEST_MODE =
  FIREBASE_CLIENT_AUTH_CONFIGURED &&
  parsePublicBooleanEnv("NEXT_PUBLIC_PHONE_AUTH_TEST_MODE", false);
