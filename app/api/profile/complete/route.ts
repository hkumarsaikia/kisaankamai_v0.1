import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession, setWorkspaceCookie } from "@/lib/server/local-auth";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { normalizeRolePreference, updateLocalProfile } from "@/lib/server/firebase-data";
import { getAdminDb } from "@/lib/server/firebase-admin";
import { parseJsonBody } from "@/lib/server/http";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";
import { completeProfileSchema } from "@/lib/validation/forms";

const completeProfileRequestSchema = completeProfileSchema.extend({
  jwt: z.string().optional(),
  fullName: z.string().trim().min(2).max(120).optional(),
  fieldArea: z.number().nonnegative().optional(),
  district: z.string().trim().min(2).max(120).optional(),
  verificationStatus: z.enum(["not_submitted", "submitted"]).optional(),
  verificationDocumentType: z.string().trim().max(120).optional(),
  verificationDocumentNumber: z.string().trim().max(120).optional(),
  verificationDocuments: z
    .array(
      z.object({
        kind: z.enum(["front", "back"]),
        name: z.string().min(1),
        contentType: z.string().min(1),
        size: z.number().nonnegative(),
        storagePath: z.string().min(1),
        downloadUrl: z.string().url(),
        uploadedAt: z.string().min(1),
      })
    )
    .max(2)
    .optional(),
});

export const dynamic = "force-dynamic";

export const GET = withLoggedRoute("profile-complete-get", async () => {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Login required." }, { status: 401 });
  }

  const snapshot = await getAdminDb().collection("profiles").doc(session.user.id).get();
  const rawProfile = snapshot.exists ? snapshot.data() : {};

  return NextResponse.json({
    ok: true,
    profile: {
      district: rawProfile?.district || "",
      verificationStatus: rawProfile?.verificationStatus || "not_submitted",
      verificationDocumentType: rawProfile?.verificationDocumentType || "",
      verificationDocumentNumber: rawProfile?.verificationDocumentNumber || "",
      verificationDocuments: Array.isArray(rawProfile?.verificationDocuments) ? rawProfile.verificationDocuments : [],
    },
  });
});

export const POST = withLoggedRoute("profile-complete", async (request: NextRequest) => {
  const payload = await parseJsonBody(request, completeProfileRequestSchema);
  await assertRateLimit(request, buildAuthRateLimitRules(request, "profile-complete", payload.phone, 10));

  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "Login required." }, { status: 401 });
  }

  const preferredWorkspace = normalizeRolePreference(payload.role);

  const profileUpdate = {
    fullName: payload.fullName || session.profile.fullName,
    phone: payload.phone,
    pincode: payload.pincode,
    village: payload.village || session.profile.village,
    address: payload.address || session.profile.address,
    fieldArea: payload.fieldArea ?? session.profile.fieldArea,
    rolePreference: preferredWorkspace,
    district: payload.district,
    verificationStatus: payload.verificationStatus,
    verificationDocumentType: payload.verificationDocumentType,
    verificationDocumentNumber: payload.verificationDocumentNumber,
    verificationDocuments: payload.verificationDocuments,
  } as Parameters<typeof updateLocalProfile>[1];

  await updateLocalProfile(session.user.id, profileUpdate);
  await setWorkspaceCookie(preferredWorkspace);

  return NextResponse.json({ ok: true, userId: session.user.id });
});
