import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { HttpError, parseJsonBody } from "@/lib/server/http";
import {
  createFirebaseBackedSession,
  firebaseSessionRequestSchema,
} from "@/lib/server/firebase-session-route";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("auth-register", async (request: NextRequest) => {
  try {
    const payload = await parseJsonBody(request, firebaseSessionRequestSchema);
    await assertRateLimit(
      request,
      [
        ...buildAuthRateLimitRules(request, "auth-register-phone", payload.profile?.phone, 5),
        ...buildAuthRateLimitRules(request, "auth-register-email", payload.profile?.email, 5),
      ]
    );
    const result = await createFirebaseBackedSession(payload);

    return NextResponse.json({
      ok: true,
      uid: result.uid,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
});
