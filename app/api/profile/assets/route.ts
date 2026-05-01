import { NextRequest, NextResponse } from "next/server";
import { withLoggedRoute } from "@/lib/server/bug-reporting";
import { getCurrentSession } from "@/lib/server/local-auth";
import { updateLocalProfile } from "@/lib/server/firebase-data";
import { getLocalSessionByUserId } from "@/lib/server/local-data";
import { uploadProfileAsset } from "@/lib/server/firebase-storage";
import { assertRateLimit, buildAuthRateLimitRules } from "@/lib/server/rate-limit";
import type { VerificationDocumentRecord } from "@/lib/local-data/types";

export const dynamic = "force-dynamic";

function fileFromFormData(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

async function uploadIdentityDocument(
  userId: string,
  kind: "front" | "back",
  file: File
): Promise<VerificationDocumentRecord> {
  const uploaded = await uploadProfileAsset(userId, "identity", file);
  return {
    kind,
    name: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
    storagePath: uploaded.objectPath,
    downloadUrl: uploaded.publicUrl,
    uploadedAt: new Date().toISOString(),
  };
}

export const POST = withLoggedRoute("profile-assets", async (request: NextRequest) => {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Login required." }, { status: 401 });
  }

  await assertRateLimit(request, buildAuthRateLimitRules(request, "profile-assets", session.user.id, 12));

  const formData = await request.formData();
  const assetType = String(formData.get("assetType") || "");

  if (assetType === "profile-photo") {
    const profilePhoto = fileFromFormData(formData, "profilePhoto");
    if (!profilePhoto) {
      return NextResponse.json({ ok: false, error: "Profile photo is required." }, { status: 400 });
    }

    const uploaded = await uploadProfileAsset(session.user.id, "photo", profilePhoto);
    await updateLocalProfile(session.user.id, {
      photoUrl: uploaded.publicUrl,
    });
    const updatedSession = await getLocalSessionByUserId(session.user.id);

    return NextResponse.json({
      ok: true,
      photoUrl: uploaded.publicUrl,
      storagePath: uploaded.objectPath,
      session: updatedSession,
    });
  }

  if (assetType === "identity-documents") {
    const frontDocument = fileFromFormData(formData, "frontDocument");
    const backDocument = fileFromFormData(formData, "backDocument");
    const documents: VerificationDocumentRecord[] = [];

    if (frontDocument) {
      documents.push(await uploadIdentityDocument(session.user.id, "front", frontDocument));
    }
    if (backDocument) {
      documents.push(await uploadIdentityDocument(session.user.id, "back", backDocument));
    }

    if (!documents.length) {
      return NextResponse.json({ ok: false, error: "Upload at least one identity document." }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      documents,
    });
  }

  return NextResponse.json({ ok: false, error: "Unsupported asset type." }, { status: 400 });
});
