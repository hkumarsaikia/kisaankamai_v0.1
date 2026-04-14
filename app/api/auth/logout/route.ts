import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/server/firebase-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
