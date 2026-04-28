import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { loginAndCreateSessionDetailed } from "@/lib/server/local-auth";
import { mirrorAuthEvent } from "@/lib/server/sheets-mirror";
import { parseJsonBody } from "@/lib/server/http";
import { loginInputSchema } from "@/lib/validation/forms";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("auth-login", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, loginInputSchema);
  const result = await loginAndCreateSessionDetailed(payload.phone, payload.password);

  if (!result.ok) {
    if (result.reason === "not-found") {
      return NextResponse.json(
        {
          ok: false,
          reason: "not-found",
          error: "This mobile number is not registered. Please register first.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        reason: "invalid-password",
        error: "Incorrect password. Please enter the correct password or reset it.",
      },
      { status: 400 }
    );
  }

  const { session } = result;
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
