import "server-only";

import { z } from "zod";
import { createSessionFromIdToken } from "@/lib/server/local-auth";
import {
  createOrUpdatePasswordLoginCredential,
  getExistingLocalSessionByUserId,
  normalizeRolePreference,
  updateLocalProfile,
} from "@/lib/server/firebase-data";
import { notifyBackendActivity } from "@/lib/server/backend-activity";

export const firebaseSessionRequestSchema = z.object({
  idToken: z.string().min(1),
  workspacePreference: z.enum(["owner", "renter"]).optional(),
  password: z.string().min(6).max(128).optional(),
  profile: z
    .object({
      fullName: z.string().min(2),
      phone: z.string().min(10),
      email: z.string().email().optional(),
      photoUrl: z.string().url().optional(),
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
  const existingSession = await getExistingLocalSessionByUserId(uid);

  if (!existingSession && !payload.profile && !payload.password) {
    throw new Error("Complete registration before signing in.");
  }

  if (payload.profile) {
    const profileUpdate = {
      fullName: payload.profile.fullName,
      phone: payload.profile.phone,
      email: payload.profile.email,
      photoUrl: payload.profile.photoUrl,
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

  if (!existingSession && payload.profile) {
    await notifyBackendActivity({
      event: "auth.registered",
      title: "New user registered",
      summary: "A new mobile-verified Kisan Kamai account was created.",
      actor: {
        userId: uid,
        name: payload.profile.fullName,
        phone: payload.profile.phone,
        email: payload.profile.email,
      },
      fields: [
        { name: "Village", value: payload.profile.village, inline: true },
        { name: "District", value: payload.profile.district, inline: true },
        { name: "Pincode", value: payload.profile.pincode, inline: true },
        { name: "Workspace", value: payload.workspacePreference || "renter", inline: true },
      ],
    });
  } else if (existingSession && !payload.profile) {
    await notifyBackendActivity({
      event: "auth.session_created",
      title: "User session created",
      summary: "A user signed in and a website session was created.",
      actor: {
        userId: uid,
        name: existingSession.profile.fullName,
        phone: existingSession.profile.phone || existingSession.user.phone,
        email: existingSession.profile.email || existingSession.user.email,
      },
      fields: [
        { name: "Active workspace", value: existingSession.activeWorkspace, inline: true },
      ],
    });
  }

  return { uid };
}
