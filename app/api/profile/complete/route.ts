import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession, setWorkspaceCookie } from "@/lib/server/local-auth";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { normalizeRolePreference, updateLocalProfile } from "@/lib/server/firebase-data";
import { parseJsonBody } from "@/lib/server/http";
import { completeProfileSchema } from "@/lib/validation/forms";

const completeProfileRequestSchema = completeProfileSchema.extend({
  jwt: z.string().optional(),
});

export const dynamic = "force-dynamic";

export const POST = withLoggedRoute("profile-complete", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, completeProfileRequestSchema);
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Login required." }, { status: 401 });
  }

  const preferredWorkspace = normalizeRolePreference(payload.role);

  await updateLocalProfile(session.user.id, {
    phone: payload.phone,
    pincode: payload.pincode,
    village: payload.village || session.profile.village,
    address: payload.address || session.profile.address,
    rolePreference: preferredWorkspace,
  });
  await setWorkspaceCookie(preferredWorkspace);

  return NextResponse.json({ ok: true, userId: session.user.id });
});
