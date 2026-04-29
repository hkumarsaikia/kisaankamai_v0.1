import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { HttpError, parseJsonBody } from "@/lib/server/http";
import { clearSessionCookie, getCurrentSession } from "@/lib/server/local-auth";
import {
  createFirebaseBackedSession,
  firebaseSessionRequestSchema,
} from "@/lib/server/firebase-session-route";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentSession();
  return NextResponse.json({ ok: true, session });
}

export const POST = withLoggedRoute("auth-session", async (request: NextRequest) => {
  try {
    const payload = await parseJsonBody(request, firebaseSessionRequestSchema);
    await assertRateLimit(
      request,
      [
        ...buildAuthRateLimitRules(request, "auth-session-phone", payload.profile?.phone || payload.idToken, 8),
        ...buildAuthRateLimitRules(request, "auth-session-email", payload.profile?.email, 8),
      ]
    );
    const result = await createFirebaseBackedSession(payload);

    return NextResponse.json({ ok: true, uid: result.uid });
  } catch (error) {
    await clearSessionCookie().catch(() => undefined);
    if (error instanceof HttpError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Could not create session.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
});
