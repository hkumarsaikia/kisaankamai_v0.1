import { NextResponse } from "next/server";
import { clearSession, getCurrentSession } from "@/lib/server/auth";
import { mirrorAuthEvent } from "@/lib/server/sheets-mirror";

export async function POST() {
  const session = await getCurrentSession().catch(() => null);
  await clearSession();
  await mirrorAuthEvent({
    eventType: "logout",
    session,
    outcome: "success",
  });
  return NextResponse.json({ ok: true });
}
