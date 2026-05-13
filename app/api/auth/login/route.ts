import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { loginAndCreateSessionDetailed } from "@/lib/server/local-auth";
import { mirrorAuthEvent } from "@/lib/server/sheets-mirror";
import { notifyBackendActivity } from "@/lib/server/backend-activity";
import { parseJsonBody } from "@/lib/server/http";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";
import { loginInputSchema } from "@/lib/validation/forms";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("auth-login", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, loginInputSchema);
  await assertRateLimit(request, buildAuthRateLimitRules(request, "auth-login", payload.phone));

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
  await notifyBackendActivity({
    event: "auth.login",
    title: "User login",
    summary: "A registered user signed in with mobile number and password.",
    actor: {
      userId: session.user.id,
      name: session.profile.fullName || session.user.name,
      phone: session.profile.phone || session.user.phone || payload.phone,
      email: session.profile.email || session.user.email,
    },
    fields: [
      { name: "Active workspace", value: session.activeWorkspace, inline: true },
      { name: "Path", value: "/login", inline: true },
    ],
  });

  return NextResponse.json({
    ok: true,
    redirectTo: "/profile-selection",
  });
});
