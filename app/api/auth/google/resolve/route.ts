import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { ensureSameOrigin } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("auth-google-resolve", async (request: NextRequest) => {
  ensureSameOrigin(request);
  return NextResponse.json(
    {
      ok: false,
      error: "Google sign-in is disabled. Please login with your registered mobile number.",
    },
    { status: 410 }
  );
});
