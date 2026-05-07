import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import { markAllNotificationsRead } from "@/lib/server/firebase-data";

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("notifications-read-all", async (request: NextRequest) => {
  void request;
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Login required." }, { status: 401 });
  }

  const updated = await markAllNotificationsRead(session.user.id);
  return NextResponse.json({ ok: true, updated });
});
