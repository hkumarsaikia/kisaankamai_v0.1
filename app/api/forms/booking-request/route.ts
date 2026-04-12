import { NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/validation/forms";
import {
  assertCollectionConfigured,
  getAdminDatabases,
  ID,
  SERVER_APPWRITE_CONFIG,
} from "@/lib/server/appwrite-admin";
import { assertMutationRequestAllowed, compactRecord, handleRouteError, parseJsonBody } from "@/lib/server/http";

export async function POST(request: Request) {
  try {
    const payload = await parseJsonBody(request as any, bookingRequestSchema);
    assertMutationRequestAllowed();

    const document = await getAdminDatabases().createDocument(
      SERVER_APPWRITE_CONFIG.databaseId!,
      assertCollectionConfigured(
        SERVER_APPWRITE_CONFIG.bookingRequestCollectionId,
        "booking request collection"
      ),
      ID.unique(),
      compactRecord({
        ...payload,
        submittedAt: new Date().toISOString(),
      })
    );

    return NextResponse.json({ ok: true, id: document.$id });
  } catch (error) {
    return handleRouteError(error);
  }
}
