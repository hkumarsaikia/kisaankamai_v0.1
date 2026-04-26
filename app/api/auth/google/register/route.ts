import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/server/firebase-admin";
import { registerGoogleVerifiedUser } from "@/lib/server/firebase-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => null)) as { idToken?: string } | null;
    const idToken = payload?.idToken?.trim();
    if (!idToken) {
      return NextResponse.json({ ok: false, error: "Missing Google registration token." }, { status: 400 });
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken, true);
    const session = await registerGoogleVerifiedUser({
      userId: decoded.uid,
      email: decoded.email || "",
      fullName: decoded.name || "",
      photoUrl: decoded.picture || "",
      emailVerified: Boolean(decoded.email_verified),
    });

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create Google account.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
