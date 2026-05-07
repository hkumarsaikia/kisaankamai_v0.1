import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import { markNotificationRead } from "@/lib/server/firebase-data";

export const dynamic = "force-dynamic";

type NotificationReadContext = {
  params: Promise<{ id: string }> | { id: string };
};

async function resolveNotificationId(context: NotificationReadContext) {
  const params = await context.params;
  return params.id;
}

export const POST = withLoggedRoute<NotificationReadContext>(
  "notifications-read-one",
  async (request: NextRequest, context) => {
    void request;
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: "Login required." }, { status: 401 });
    }

    const id = await resolveNotificationId(context);
    const notification = await markNotificationRead(session.user.id, id);
    if (!notification) {
      return NextResponse.json({ ok: false, error: "Notification not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  }
);
