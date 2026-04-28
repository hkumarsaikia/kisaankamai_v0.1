import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: "Google sign-in is disabled. Please register with your mobile number.",
    },
    { status: 410 }
  );
}
