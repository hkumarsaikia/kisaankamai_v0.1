import "server-only";

import { Account, Client, Databases, ID, Query, Users } from "node-appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/lib/appwrite";

function requiredEnv(name: string) {
  return process.env[name]?.trim();
}

export const SERVER_APPWRITE_CONFIG = {
  endpoint: requiredEnv("APPWRITE_ENDPOINT") || APPWRITE_ENDPOINT,
  projectId: requiredEnv("APPWRITE_PROJECT_ID") || APPWRITE_PROJECT_ID,
  apiKey: requiredEnv("APPWRITE_API_KEY"),
  databaseId: requiredEnv("APPWRITE_DATABASE_ID"),
  equipmentCollectionId: requiredEnv("APPWRITE_EQUIPMENT_COLLECTION_ID"),
  partnerInquiryCollectionId: requiredEnv("APPWRITE_PARTNER_INQUIRY_COLLECTION_ID"),
  callbackCollectionId: requiredEnv("APPWRITE_CALLBACK_COLLECTION_ID"),
  feedbackCollectionId: requiredEnv("APPWRITE_FEEDBACK_COLLECTION_ID"),
  ownerApplicationCollectionId: requiredEnv("APPWRITE_OWNER_APPLICATION_COLLECTION_ID"),
  supportRequestCollectionId: requiredEnv("APPWRITE_SUPPORT_REQUEST_COLLECTION_ID"),
  bookingRequestCollectionId: requiredEnv("APPWRITE_BOOKING_REQUEST_COLLECTION_ID"),
  userCollectionId: requiredEnv("NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID") || "users",
};

function createAdminClient() {
  if (!SERVER_APPWRITE_CONFIG.apiKey) {
    throw new Error("APPWRITE_API_KEY is required for server Appwrite mutations.");
  }

  return new Client()
    .setEndpoint(SERVER_APPWRITE_CONFIG.endpoint)
    .setProject(SERVER_APPWRITE_CONFIG.projectId)
    .setKey(SERVER_APPWRITE_CONFIG.apiKey);
}

function createJwtClient(jwt: string) {
  return new Client()
    .setEndpoint(SERVER_APPWRITE_CONFIG.endpoint)
    .setProject(SERVER_APPWRITE_CONFIG.projectId)
    .setJWT(jwt);
}

export function canUseServerAppwrite() {
  return Boolean(
    SERVER_APPWRITE_CONFIG.apiKey &&
      SERVER_APPWRITE_CONFIG.databaseId
  );
}

export function canUseServerEquipment() {
  return canUseServerAppwrite() && Boolean(SERVER_APPWRITE_CONFIG.equipmentCollectionId);
}

export function assertServerMutationsEnabled() {
  if (!canUseServerAppwrite()) {
    throw new Error("Server Appwrite configuration is missing. Add APPWRITE_API_KEY and APPWRITE_DATABASE_ID.");
  }
}

export function assertCollectionConfigured(collectionId?: string, label = "collection") {
  if (!collectionId) {
    throw new Error(`Server Appwrite ${label} configuration is missing.`);
  }

  return collectionId;
}

export function getAdminDatabases() {
  return new Databases(createAdminClient());
}

export function getAdminUsers() {
  return new Users(createAdminClient());
}

export function getAccountFromJwt(jwt: string) {
  return new Account(createJwtClient(jwt));
}

export { ID, Query };
