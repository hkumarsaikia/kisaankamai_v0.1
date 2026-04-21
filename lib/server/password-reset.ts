import "server-only";

import { z } from "zod";
import { findUserByIdentifier } from "@/lib/server/firebase-data";
import { getAdminAuth } from "@/lib/server/firebase-admin";

function normalizePhoneDigits(input?: string | null) {
  return (input || "").replace(/\D/g, "").slice(-10);
}

function toE164(input?: string | null) {
  const digits = normalizePhoneDigits(input);
  return digits.length === 10 ? `+91${digits}` : null;
}

function maskPhoneNumber(input?: string | null) {
  const digits = normalizePhoneDigits(input);
  if (digits.length !== 10) {
    return "your registered mobile number";
  }

  return `+91 ${digits.slice(0, 2)}******${digits.slice(-2)}`;
}

const newPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Confirm password is required."),
});

export async function resolvePasswordResetTarget(identifier: string) {
  const user = await findUserByIdentifier(identifier);
  if (!user) {
    throw new Error("No account found for this email or phone.");
  }

  const phoneE164 = toE164(user.phone);
  if (!phoneE164) {
    throw new Error("This account does not have a verified mobile number for reset.");
  }

  return {
    userId: user.id,
    phoneE164,
    maskedPhone: maskPhoneNumber(user.phone),
    email: user.email,
  };
}

export async function completePasswordResetFromIdToken(input: {
  idToken: string;
  password: string;
  confirmPassword: string;
}) {
  const parsed = newPasswordSchema.parse(input);
  if (parsed.password !== parsed.confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(input.idToken, true);
  if (!decoded.uid) {
    throw new Error("Could not verify the reset session.");
  }

  const authUser = await auth.getUser(decoded.uid);
  if (!authUser.phoneNumber) {
    throw new Error("Phone verification is required before resetting the password.");
  }

  await auth.updateUser(decoded.uid, {
    password: parsed.password,
  });

  return { uid: decoded.uid };
}
