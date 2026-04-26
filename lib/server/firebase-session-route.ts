import "server-only";

import { z } from "zod";
import { createSessionFromIdToken } from "@/lib/server/local-auth";
import {
  createOrUpdatePasswordLoginCredential,
  normalizeRolePreference,
  updateLocalProfile,
} from "@/lib/server/firebase-data";

export const firebaseSessionRequestSchema = z.object({
  idToken: z.string().min(1),
  workspacePreference: z.enum(["owner", "renter"]).optional(),
  password: z.string().min(6).max(128).optional(),
  profile: z
    .object({
      fullName: z.string().min(2),
      phone: z.string().min(10),
      email: z.string().email().optional(),
      address: z.string().min(3),
      village: z.string().min(2),
      pincode: z.string().regex(/^\d{6}$/),
      fieldArea: z.number().nonnegative().default(0),
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
    })
    .optional(),
});

export type FirebaseSessionRequest = z.infer<typeof firebaseSessionRequestSchema>;

export async function createFirebaseBackedSession(payload: FirebaseSessionRequest) {
  const uid = await createSessionFromIdToken(payload.idToken, {
    workspacePreference: payload.workspacePreference,
  });

  if (payload.profile) {
    const profileUpdate = {
      fullName: payload.profile.fullName,
      phone: payload.profile.phone,
      email: payload.profile.email,
      address: payload.profile.address,
      village: payload.profile.village,
      pincode: payload.profile.pincode,
      fieldArea: payload.profile.fieldArea,
      district: payload.profile.district,
      verificationStatus: payload.profile.verificationStatus,
      verificationDocumentType: payload.profile.verificationDocumentType,
      verificationDocumentNumber: payload.profile.verificationDocumentNumber,
      verificationDocuments: payload.profile.verificationDocuments,
    } as Parameters<typeof updateLocalProfile>[1];

    if (payload.workspacePreference) {
      profileUpdate.rolePreference = normalizeRolePreference(payload.workspacePreference);
    }

    await updateLocalProfile(uid, profileUpdate);
  }

  if (payload.password) {
    await createOrUpdatePasswordLoginCredential(uid, {
      email: payload.profile?.email,
      phone: payload.profile?.phone,
      password: payload.password,
    });
  }

  return { uid };
}
