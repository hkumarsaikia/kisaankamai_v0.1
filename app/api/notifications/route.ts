import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getUnreadNotificationsForUser } from "@/lib/server/firebase-data";

export const dynamic = "force-dynamic";

export const GET = withLoggedRoute("notifications-list", async (request: NextRequest) => {
  void request;
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Login required.", notifications: [] }, { status: 401 });
  }

  const notifications = await getUnreadNotificationsForUser(session.user.id, 8);
  return NextResponse.json({
    ok: true,
    notifications,
    unreadCount: notifications.length,
  });
});
