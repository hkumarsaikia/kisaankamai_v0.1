import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/server/local-auth";
import {
  createFirebaseBackedSession,
  firebaseSessionRequestSchema,
} from "@/lib/server/firebase-session-route";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentSession();
  return NextResponse.json({ ok: true, session });
}

export async function POST(request: NextRequest) {
  try {
    const payload = firebaseSessionRequestSchema.parse(await request.json());
    const result = await createFirebaseBackedSession(payload);

    return NextResponse.json({ ok: true, uid: result.uid });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create session.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
