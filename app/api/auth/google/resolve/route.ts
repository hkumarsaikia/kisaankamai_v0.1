import { NextRequest, NextResponse } from "next/server";
import { createSessionFromIdToken } from "@/lib/server/local-auth";
import { getAdminAuth } from "@/lib/server/firebase-admin";
import { getExistingLocalSessionByUserId } from "@/lib/server/firebase-data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => null)) as { idToken?: string } | null;
    const idToken = payload?.idToken?.trim();
    if (!idToken) {
      return NextResponse.json({ ok: false, error: "Missing Google sign-in token." }, { status: 400 });
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken, true);
    const session = await getExistingLocalSessionByUserId(decoded.uid);
    if (!session) {
      return NextResponse.json({
        ok: true,
        status: "registration_required",
        email: decoded.email || "",
        emailVerified: Boolean(decoded.email_verified),
        name: decoded.name || "",
        photoUrl: decoded.picture || "",
      });
    }

    await createSessionFromIdToken(idToken, {
      workspacePreference: session.activeWorkspace,
    });

    return NextResponse.json({ ok: true, status: "signed_in", session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not resolve Google sign-in.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
