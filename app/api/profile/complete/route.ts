import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { completeProfileSchema } from "@/lib/validation/forms";
import {
  assertCollectionConfigured,
  getAccountFromJwt,
  getAdminDatabases,
  SERVER_APPWRITE_CONFIG,
} from "@/lib/server/appwrite-admin";
import { assertMutationRequestAllowed, compactRecord, handleRouteError, parseJsonBody } from "@/lib/server/http";

const completeProfileRequestSchema = completeProfileSchema.extend({
  jwt: z.string().min(10, "Session token is required."),
});

export async function POST(request: NextRequest) {
  try {
    const payload = await parseJsonBody(request, completeProfileRequestSchema);
    assertMutationRequestAllowed();
    const account = getAccountFromJwt(payload.jwt);
    const user = await account.get();
    const collectionId = assertCollectionConfigured(
      SERVER_APPWRITE_CONFIG.userCollectionId,
      "user profile collection"
    );
    const data = compactRecord({
      phone: payload.phone,
      pincode: payload.pincode,
      village: payload.village,
      address: payload.address || payload.village,
      role: payload.role,
      email: user.email || "",
      fullName: user.name || "User",
      updatedAt: new Date().toISOString(),
    });

    try {
      await getAdminDatabases().updateDocument(
        SERVER_APPWRITE_CONFIG.databaseId!,
        collectionId,
        user.$id,
        data
      );
    } catch {
      await getAdminDatabases().createDocument(
        SERVER_APPWRITE_CONFIG.databaseId!,
        collectionId,
        user.$id,
        data
      );
    }

    return NextResponse.json({ ok: true, userId: user.$id });
  } catch (error) {
    return handleRouteError(error);
  }
}
