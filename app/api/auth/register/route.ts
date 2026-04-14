import { NextRequest, NextResponse } from "next/server";
import { registerAndCreateSession } from "@/lib/server/local-auth";
import { registerInputSchema } from "@/lib/validation/forms";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = registerInputSchema.parse(await request.json());
    const session = await registerAndCreateSession(payload);

    if (!session) {
      return NextResponse.json({ ok: false, error: "Registration failed." }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      userId: session.user.id,
      email: session.user.email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
