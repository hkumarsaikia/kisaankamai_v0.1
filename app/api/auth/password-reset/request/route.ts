import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolvePasswordResetPhoneInput } from "@/lib/server/password-reset";

const requestSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your registered mobile number."),
});

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = requestSchema.parse(await request.json());
    const target = await resolvePasswordResetPhoneInput(payload.identifier);

    return NextResponse.json({
      ok: true,
      phoneE164: target.phoneE164,
      maskedPhone: target.maskedPhone,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start password reset.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
