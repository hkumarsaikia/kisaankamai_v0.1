import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { loginAndCreateSession } from "@/lib/server/local-auth";
import { mirrorAuthEvent } from "@/lib/server/sheets-mirror";
import { parseJsonBody } from "@/lib/server/http";
import { loginInputSchema } from "@/lib/validation/forms";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("auth-login", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, loginInputSchema);
  const session = await loginAndCreateSession(payload.phone, payload.password);

  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Invalid mobile number or password." },
      { status: 400 }
    );
  }

  await mirrorAuthEvent({
    eventType: "login",
    session,
    identifier: payload.phone,
    outcome: "success",
    path: "/login",
  });

  return NextResponse.json({
    ok: true,
    redirectTo:
      session.profile?.phone?.trim() && session.profile?.pincode?.trim()
        ? "/profile-selection"
        : "/complete-profile",
  });
});
