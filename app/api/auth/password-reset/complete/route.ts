import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { completePasswordResetFromIdToken } from "@/lib/server/password-reset";

const completeSchema = z.object({
  idToken: z.string().min(1, "Reset session is missing."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Confirm password is required."),
});

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = completeSchema.parse(await request.json());
    const result = await completePasswordResetFromIdToken(payload);

    return NextResponse.json({
      ok: true,
      uid: result.uid,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not complete password reset.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
