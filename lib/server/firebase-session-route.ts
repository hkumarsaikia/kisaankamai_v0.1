import "server-only";

import { z } from "zod";
import { createSessionFromIdToken } from "@/lib/server/local-auth";
import { normalizeRolePreference, updateLocalProfile } from "@/lib/server/firebase-data";

export const firebaseSessionRequestSchema = z.object({
  idToken: z.string().min(1),
  workspacePreference: z.enum(["owner", "renter"]).optional(),
  profile: z
    .object({
      fullName: z.string().min(2),
      phone: z.string().min(10),
      email: z.string().email().optional(),
      address: z.string().min(3),
      village: z.string().min(2),
      pincode: z.string().regex(/^\d{6}$/),
      fieldArea: z.number().nonnegative().default(0),
    })
    .optional(),
});

export type FirebaseSessionRequest = z.infer<typeof firebaseSessionRequestSchema>;

export async function createFirebaseBackedSession(payload: FirebaseSessionRequest) {
  const uid = await createSessionFromIdToken(payload.idToken, {
    workspacePreference: payload.workspacePreference,
  });

  if (payload.profile) {
    await updateLocalProfile(uid, {
      fullName: payload.profile.fullName,
      phone: payload.profile.phone,
      email: payload.profile.email,
      address: payload.profile.address,
      village: payload.profile.village,
      pincode: payload.profile.pincode,
      fieldArea: payload.profile.fieldArea,
      rolePreference: normalizeRolePreference(payload.workspacePreference),
    });
  }

  return { uid };
}
