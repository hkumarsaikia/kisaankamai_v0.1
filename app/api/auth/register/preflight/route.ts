import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { assertRegistrationIdentifiersAvailable } from "@/lib/server/firebase-data";

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

export async function POST(request: NextRequest) {
  try {
    const payload = preflightSchema.parse(await request.json());
    await assertRegistrationIdentifiersAvailable(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
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
}
