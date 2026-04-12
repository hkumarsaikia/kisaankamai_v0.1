import { NextRequest, NextResponse } from "next/server";
import { registerInputSchema } from "@/lib/validation/forms";
import {
  assertCollectionConfigured,
  getAdminDatabases,
  getAdminUsers,
  ID,
  SERVER_APPWRITE_CONFIG,
} from "@/lib/server/appwrite-admin";
import { assertMutationRequestAllowed, compactRecord, handleRouteError, parseJsonBody } from "@/lib/server/http";

export async function POST(request: NextRequest) {
  try {
    const payload = await parseJsonBody(request, registerInputSchema);
    assertMutationRequestAllowed();
    const email = payload.email || `${payload.phone}@kisankamai.com`;
    const userId = ID.unique();

    const user = await getAdminUsers().create(
      userId,
      email,
      `+91${payload.phone}`,
      payload.password,
      payload.fullName
    );

    if (payload.email) {
      await getAdminUsers().updateEmailVerification(user.$id, true);
    }

    if (payload.otpVerified) {
      await getAdminUsers().updatePhoneVerification(user.$id, true);
    }

    await getAdminDatabases().createDocument(
      SERVER_APPWRITE_CONFIG.databaseId!,
      assertCollectionConfigured(
        SERVER_APPWRITE_CONFIG.userCollectionId,
        "user profile collection"
      ),
      user.$id,
      compactRecord({
        fullName: payload.fullName,
        email,
        phone: payload.phone,
        address: payload.address,
        village: payload.village,
        pincode: payload.pincode,
        fieldArea: payload.fieldArea,
        role: payload.role,
        createdAt: new Date().toISOString(),
      })
    );

    return NextResponse.json({
      ok: true,
      userId: user.$id,
      email,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
