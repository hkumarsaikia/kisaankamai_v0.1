import "server-only";

import { randomUUID } from "node:crypto";
import { getAdminStorage } from "@/lib/server/firebase-admin";

export async function uploadListingImage(ownerUid: string, listingId: string, file: File) {
  const bucket = getAdminStorage().bucket();
  const extension = file.name.split(".").pop() || "jpg";
  const objectPath = `listings/${ownerUid}/${listingId}/${randomUUID()}.${extension}`;
  const token = randomUUID();
  const buffer = Buffer.from(await file.arrayBuffer());

  const object = bucket.file(objectPath);
  await object.save(buffer, {
    metadata: {
      contentType: file.type || "application/octet-stream",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  const encodedPath = encodeURIComponent(objectPath);
  const bucketName = bucket.name;
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media&token=${token}`;

  return {
    objectPath,
    publicUrl,
  };
}
