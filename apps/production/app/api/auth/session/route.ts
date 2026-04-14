import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSessionFromIdToken, getCurrentSession } from "@/lib/server/auth";

const sessionRequestSchema = z.object({
  idToken: z.string().min(1),
  workspacePreference: z.enum(["owner", "renter"]).optional(),
  profile: z
    .object({
      fullName: z.string().min(2),
      phone: z.string().min(10),
      email: z.string().email().optional(),
      address: z.string().min(3),
      village: z.string().min(2),
      pincode: z.string().regex(/^\d{6}$/),
      fieldArea: z.number().positive(),
    })
    .optional(),
});

export async function GET() {
  const session = await getCurrentSession();
  return NextResponse.json({ ok: true, session });
}

export async function POST(request: NextRequest) {
  try {
    const payload = sessionRequestSchema.parse(await request.json());
    const uid = await createSessionFromIdToken(payload.idToken, {
      workspacePreference: payload.workspacePreference,
      profile: payload.profile,
    });
    return NextResponse.json({ ok: true, uid });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create session.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
