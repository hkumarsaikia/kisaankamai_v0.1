import "server-only";

import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import {
  sanitizeEquipmentDescription,
  type EquipmentRecord,
} from "@/lib/equipment";
import type {
  BookingRecord,
  FormSubmissionRecord,
  ListingRecord,
  LocalSession,
  PaymentRecord,
  ProfileRecord,
  RolePreference,
  SavedItemRecord,
  SubmissionType,
  UserRecord,
  UserRole,
} from "@/lib/local-data/types";
import type { Transaction } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/lib/server/firebase-admin";
import { withFirestoreId } from "@/lib/server/firebase-local-helpers";
import { sendPushNotificationToUsers } from "@/lib/server/firebase-messaging";
import { captureServerException } from "@/lib/server/firebase-observability";
import { deleteStorageObject } from "@/lib/server/firebase-storage";
import { mirrorBookingAndPayment, mirrorListing, mirrorProfile, mirrorSubmission } from "@/lib/server/sheets-mirror";
import type { RegisterInput } from "@/lib/validation/forms";

const USERS_COLLECTION = "users";
const PROFILES_COLLECTION = "profiles";
const LISTINGS_COLLECTION = "listings";
const BOOKINGS_COLLECTION = "bookings";
const SAVED_ITEMS_COLLECTION = "saved-items";
const PAYMENTS_COLLECTION = "payments";
const SUBMISSIONS_COLLECTION = "form-submissions";
const AUTH_IDENTIFIERS_COLLECTION = "auth-identifiers";
const DUPLICATE_PHONE_MESSAGE = "Account already exists. Please login with your registered mobile number.";
const DUPLICATE_EMAIL_MESSAGE = "Account already exists. Please login with your registered phone number.";

function db() {
  return getAdminDb();
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeOptionalString(value?: string | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStringList(values?: string[] | null) {
  return Array.from(
    new Set(
      (values || [])
        .map((value) => normalizeOptionalString(value))
        .filter(Boolean)
    )
  );
}

function createId(prefix: string) {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

function normalizeIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  if (trimmed.includes("@")) {
    return trimmed.toLowerCase();
  }

  return trimmed.replace(/\D/g, "");
}

function normalizeEmail(input?: string | null) {
  return normalizeOptionalString(input).toLowerCase();
}

function normalizePhone(input?: string | null) {
  return (input || "").replace(/\D/g, "").slice(-10);
}

function toE164Phone(input?: string | null) {
  const digits = normalizePhone(input);
  if (!digits) {
    return undefined;
  }

  return digits.length === 10 ? `+91${digits}` : undefined;
}

function allUserRoles(): UserRole[] {
  return ["owner", "renter"];
}

export function normalizeRolePreference(rolePreference?: RolePreference | null): UserRole {
  return rolePreference === "owner" ? "owner" : "renter";
}

function usersCollection() {
  return db().collection(USERS_COLLECTION);
}

function profilesCollection() {
  return db().collection(PROFILES_COLLECTION);
}

function listingsCollection() {
  return db().collection(LISTINGS_COLLECTION);
}

function bookingsCollection() {
  return db().collection(BOOKINGS_COLLECTION);
}

function savedItemsCollection() {
  return db().collection(SAVED_ITEMS_COLLECTION);
}

function paymentsCollection() {
  return db().collection(PAYMENTS_COLLECTION);
}

function submissionsCollection() {
  return db().collection(SUBMISSIONS_COLLECTION);
}

function authIdentifiersCollection() {
  return db().collection(AUTH_IDENTIFIERS_COLLECTION);
}

type AuthIdentifierKind = "email" | "phone";

type PasswordLoginAuthUser = {
  uid?: string;
  email?: string | null;
  phoneNumber?: string | null;
};

export type PhonePasswordLoginFailureReason = "not-found" | "invalid-password";

export type PhonePasswordLoginResult =
  | { ok: true; idToken: string; session: LocalSession | null }
  | { ok: false; reason: PhonePasswordLoginFailureReason };

function normalizeAuthIdentifier(kind: AuthIdentifierKind, value?: string | null) {
  return kind === "email" ? normalizeEmail(value) : normalizePhone(value);
}

function authIdentifierDocId(kind: AuthIdentifierKind, value: string) {
  return `${kind}:${value}`;
}

function buildAuthIdentifierClaims(input: { email?: string | null; phone?: string | null }) {
  const claims: Array<{ kind: AuthIdentifierKind; value: string }> = [];
  const email = normalizeAuthIdentifier("email", input.email);
  const phone = normalizeAuthIdentifier("phone", input.phone);

  if (email && !isPlaceholderEmail(email)) {
    claims.push({ kind: "email", value: email });
  }

  if (phone) {
    claims.push({ kind: "phone", value: phone });
  }

  return claims;
}

export async function claimAuthIdentifier(
  transaction: Transaction,
  kind: AuthIdentifierKind,
  value: string,
  userId: string,
  timestamp = nowIso()
) {
  const ref = authIdentifiersCollection().doc(authIdentifierDocId(kind, value));
  const snapshot = await transaction.get(ref);
  const existingUserId = snapshot.exists ? (snapshot.data() as { userId?: string }).userId : "";

  if (existingUserId && existingUserId !== userId) {
    throw new Error(kind === "email" ? DUPLICATE_EMAIL_MESSAGE : DUPLICATE_PHONE_MESSAGE);
  }

  transaction.set(
    ref,
    {
      kind,
      value,
      userId,
      createdAt: snapshot.exists ? (snapshot.data() as { createdAt?: string }).createdAt || timestamp : timestamp,
      updatedAt: timestamp,
    },
    { merge: true }
  );
}

async function reserveAuthIdentifiersForUser(
  userId: string,
  input: { email?: string | null; phone?: string | null }
) {
  const claims = buildAuthIdentifierClaims(input);
  if (!claims.length) {
    return;
  }

  const timestamp = nowIso();
  await db().runTransaction(async (transaction) => {
    const snapshots = await Promise.all(
      claims.map((claim) =>
        transaction
          .get(authIdentifiersCollection().doc(authIdentifierDocId(claim.kind, claim.value)))
          .then((snapshot) => ({ claim, snapshot }))
      )
    );

    for (const { claim, snapshot } of snapshots) {
      const existingUserId = snapshot.exists ? (snapshot.data() as { userId?: string }).userId : "";
      if (existingUserId && existingUserId !== userId) {
        throw new Error(claim.kind === "email" ? DUPLICATE_EMAIL_MESSAGE : DUPLICATE_PHONE_MESSAGE);
      }
    }

    for (const claim of claims) {
      transaction.set(
        authIdentifiersCollection().doc(authIdentifierDocId(claim.kind, claim.value)),
        {
          kind: claim.kind,
          value: claim.value,
          userId,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        { merge: true }
      );
    }
  });
}

export async function releaseAuthIdentifier(kind: AuthIdentifierKind, value: string, userId: string) {
  const normalized = normalizeAuthIdentifier(kind, value);
  if (!normalized) {
    return;
  }

  const ref = authIdentifiersCollection().doc(authIdentifierDocId(kind, normalized));
  await db().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) {
      return;
    }

    const existingUserId = (snapshot.data() as { userId?: string }).userId;
    if (existingUserId === userId) {
      transaction.delete(ref);
    }
  });
}

async function hasAuthIdentifier(kind: AuthIdentifierKind, value: string) {
  const snapshot = await authIdentifiersCollection().doc(authIdentifierDocId(kind, value)).get();
  return snapshot.exists;
}

export async function assertRegistrationIdentifiersAvailable(input: {
  phone?: string | null;
  email?: string | null;
}) {
  const phone = normalizePhone(input.phone);
  const email = normalizeEmail(input.email);

  if (!phone) {
    throw new Error("Enter a valid 10-digit mobile number.");
  }

  const phoneInFirestore = await usersCollection().where("phone", "==", phone).limit(1).get();
  const phoneInAuthIdentifiers = await hasAuthIdentifier("phone", phone);
  const phoneInFirebaseAuth = await getAdminAuth()
    .getUserByPhoneNumber(`+91${phone}`)
    .then(() => true)
    .catch(() => false);

  if (!phoneInFirestore.empty || phoneInAuthIdentifiers || phoneInFirebaseAuth) {
    throw new Error(DUPLICATE_PHONE_MESSAGE);
  }

  if (!email || isPlaceholderEmail(email)) {
    return;
  }

  const emailInFirestore = await usersCollection().where("email", "==", email).limit(1).get();
  const emailInAuthIdentifiers = await hasAuthIdentifier("email", email);
  const emailInFirebaseAuth = await getAdminAuth()
    .getUserByEmail(email)
    .then(() => true)
    .catch(() => false);

  if (!emailInFirestore.empty || emailInAuthIdentifiers || emailInFirebaseAuth) {
    throw new Error(DUPLICATE_EMAIL_MESSAGE);
  }
}

function savedItemId(userId: string, listingId: string) {
  return `${userId}__${listingId}`;
}

function isPlaceholderEmail(email?: string | null) {
  return Boolean(email && email.endsWith("@kisankamai.local"));
}

function buildPasswordLoginEmail(phoneOrUserId: string) {
  const normalizedPhone = normalizePhone(phoneOrUserId);
  const safeIdentifier = (normalizedPhone || phoneOrUserId)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `phone.${safeIdentifier || randomUUID().slice(0, 8)}@kisankamai.local`;
}

export function resolvePasswordLoginEmail(user: Pick<UserRecord, "email" | "phone" | "passwordLoginEmail">) {
  const configuredEmail = normalizeEmail(user.passwordLoginEmail);
  if (configuredEmail) {
    return configuredEmail;
  }

  const phone = normalizePhone(user.phone);
  if (phone) {
    return buildPasswordLoginEmail(phone);
  }

  const accountEmail = normalizeEmail(user.email);
  if (accountEmail && (!isPlaceholderEmail(accountEmail) || accountEmail.startsWith("phone."))) {
    return accountEmail;
  }

  return "";
}

function getPasswordLoginEmailCandidates(
  user: Pick<UserRecord, "id" | "email" | "phone" | "passwordLoginEmail">,
  authUserByPhone?: PasswordLoginAuthUser | null
) {
  const normalizedPhone = normalizePhone(user.phone || authUserByPhone?.phoneNumber || "");
  const candidates = [
    normalizeEmail(user.passwordLoginEmail),
    normalizeEmail(authUserByPhone?.email),
    buildPasswordLoginEmail(normalizedPhone || user.id || authUserByPhone?.uid || ""),
  ];
  const accountEmail = normalizeEmail(user.email);
  if (accountEmail && !candidates.includes(accountEmail)) {
    candidates.push(accountEmail);
  }

  return Array.from(new Set(candidates.filter(Boolean)));
}

async function rememberPasswordLoginEmailForUser(userId: string, passwordLoginEmail: string) {
  const normalized = normalizeEmail(passwordLoginEmail);
  if (!normalized) {
    return;
  }

  await usersCollection().doc(userId).set(
    {
      passwordLoginEmail: normalized,
      updatedAt: nowIso(),
    },
    { merge: true }
  );
}

async function getAuthUserByPhone(phone: string): Promise<PasswordLoginAuthUser | null> {
  const e164Phone = toE164Phone(phone);
  if (!e164Phone) {
    return null;
  }

  return getAdminAuth()
    .getUserByPhoneNumber(e164Phone)
    .catch(() => null);
}

async function exchangeCustomToken(customToken: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY for Firebase session creation.");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    throw new Error(payload?.error?.message || "Could not exchange Firebase custom token.");
  }

  const payload = (await response.json()) as { idToken?: string };
  if (!payload.idToken) {
    throw new Error("Firebase custom-token exchange did not return an ID token.");
  }

  return payload.idToken;
}

function buildIdentityToolkitReferer() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kisankamai.com";
  try {
    return `${new URL(siteUrl).origin}/login`;
  } catch {
    return "https://www.kisankamai.com/login";
  }
}

async function exchangePasswordLogin(email: string, password: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY for Firebase password login.");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: buildIdentityToolkitReferer() },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    throw new Error(payload?.error?.message || "Could not sign in with Firebase.");
  }

  const payload = (await response.json()) as { idToken?: string };
  if (!payload.idToken) {
    throw new Error("Firebase password login did not return an ID token.");
  }

  return payload.idToken;
}

function mapListingFromFirestore(data: Partial<ListingRecord> & { id?: string }): ListingRecord {
  const name = normalizeOptionalString(data.name) || "Equipment";
  const category = normalizeOptionalString(data.category).toLowerCase() || "equipment";
  const location = normalizeOptionalString(data.location);
  const district = normalizeOptionalString(data.district);
  const state = normalizeOptionalString(data.state);
  const ownerName = normalizeOptionalString(data.ownerName);
  const coverImage = normalizeOptionalString(data.coverImage);
  const galleryImages = normalizeStringList(data.galleryImages);
  const imagePaths = normalizeStringList(data.imagePaths);
  const resolvedGalleryImages =
    galleryImages.length > 0 ? galleryImages : coverImage ? [coverImage] : [];
  const description = sanitizeEquipmentDescription(normalizeOptionalString(data.description));
  const categoryLabel =
    normalizeOptionalString(data.categoryLabel) ||
    [category.charAt(0).toUpperCase() + category.slice(1), name.split(" ")[0] || "Equipment"].join(" • ");
  const ownerLocation =
    normalizeOptionalString(data.ownerLocation) || [location, district].filter(Boolean).join(", ");

  return {
    id: data.id || createId("listing"),
    ownerUserId: data.ownerUserId || "",
    slug:
      data.slug ||
      `${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}-${randomUUID().slice(0, 6)}`,
    name,
    category,
    categoryLabel,
    location,
    district,
    state,
    description,
    pricePerHour: Number(data.pricePerHour || 0),
    unitLabel: data.unitLabel || "per hour",
    rating: Number(data.rating || 0),
    hp: normalizeOptionalString(data.hp),
    distanceKm: Number(data.distanceKm || 0),
    ownerName,
    ownerLocation,
    ownerVerified: Boolean(data.ownerVerified),
    coverImage,
    galleryImages: resolvedGalleryImages,
    imagePaths,
    tags: normalizeStringList(data.tags),
    workTypes: normalizeStringList(data.workTypes),
    operatorIncluded: Boolean(data.operatorIncluded),
    availableFrom: data.availableFrom || undefined,
    status: data.status === "paused" ? "paused" : "active",
    createdAt: data.createdAt || nowIso(),
    updatedAt: data.updatedAt || nowIso(),
  };
}

function isPublicListingReady(listing: ListingRecord) {
  return Boolean(
    listing.status === "active" &&
      normalizeOptionalString(listing.id) &&
      normalizeOptionalString(listing.name) &&
      normalizeOptionalString(listing.category) &&
      normalizeOptionalString(listing.location) &&
      normalizeOptionalString(listing.district) &&
      normalizeOptionalString(listing.ownerName) &&
      normalizeOptionalString(listing.coverImage) &&
      !listing.coverImage.includes("/assets/generated/") &&
      listing.galleryImages.length > 0 &&
      listing.imagePaths.length > 0 &&
      listing.workTypes.length > 0 &&
      Number.isFinite(listing.pricePerHour) &&
      listing.pricePerHour > 0
  );
}

function mapBookingFromFirestore(data: Partial<BookingRecord> & { id?: string }): BookingRecord {
  return {
    id: data.id || createId("BK"),
    listingId: data.listingId || "",
    ownerUserId: data.ownerUserId || "",
    renterUserId: data.renterUserId || "",
    status: data.status || "pending",
    startDate: data.startDate || nowIso().slice(0, 10),
    endDate: data.endDate || data.startDate || nowIso().slice(0, 10),
    amount: Number(data.amount || 0),
    createdAt: data.createdAt || nowIso(),
    updatedAt: data.updatedAt || nowIso(),
  };
}

const availabilityBlockingBookingStatuses = new Set<BookingRecord["status"]>([
  "pending",
  "upcoming",
  "active",
  "confirmed",
]);

function bookingBlocksAvailability(booking: BookingRecord) {
  return availabilityBlockingBookingStatuses.has(booking.status);
}

function normalizeBookingDate(value?: string | null) {
  const candidate = normalizeOptionalString(value);
  const parsedMs = Date.parse(`${candidate}T00:00:00.000Z`);

  if (candidate && Number.isFinite(parsedMs)) {
    return candidate.slice(0, 10);
  }

  return nowIso().slice(0, 10);
}

function dateRangeOverlaps(leftStart: string, leftEnd: string, rightStart: string, rightEnd: string) {
  const firstStartMs = Date.parse(`${leftStart}T00:00:00.000Z`);
  const firstEndMs = Date.parse(`${leftEnd}T00:00:00.000Z`);
  const secondStartMs = Date.parse(`${rightStart}T00:00:00.000Z`);
  const secondEndMs = Date.parse(`${rightEnd}T00:00:00.000Z`);

  return firstStartMs <= secondEndMs && secondStartMs <= firstEndMs;
}

function mapPaymentFromFirestore(data: Partial<PaymentRecord> & { id?: string }): PaymentRecord {
  return {
    id: data.id || createId("pay"),
    bookingId: data.bookingId || "",
    ownerUserId: data.ownerUserId || "",
    renterUserId: data.renterUserId || "",
    amount: Number(data.amount || 0),
    status: data.status || "processing",
    method: data.method || "Manual Confirmation",
    createdAt: data.createdAt || nowIso(),
  };
}

function mapProfileFromFirestore(userId: string, data?: Partial<ProfileRecord> | null): ProfileRecord {
  return {
    userId,
    fullName: data?.fullName || "Kisan Kamai User",
    village: data?.village || "",
    address: data?.address || "",
    pincode: data?.pincode || "",
    fieldArea: Number(data?.fieldArea || 0),
    farmingTypes: normalizeOptionalString(data?.farmingTypes) || undefined,
    rolePreference: normalizeRolePreference(data?.rolePreference),
    email: data?.email,
    phone: normalizePhone(data?.phone),
    photoUrl: normalizeOptionalString(data?.photoUrl) || undefined,
    district: normalizeOptionalString(data?.district) || undefined,
    verificationStatus: data?.verificationStatus || "not_submitted",
    verificationDocumentType: normalizeOptionalString(data?.verificationDocumentType) || undefined,
    verificationDocumentNumber: normalizeOptionalString(data?.verificationDocumentNumber) || undefined,
    verificationDocuments: Array.isArray(data?.verificationDocuments) ? data.verificationDocuments : [],
  };
}

function mapUserFromFirestore(
  uid: string,
  data?: Partial<UserRecord> | null,
  authUser?: { email?: string | null; phoneNumber?: string | null }
): UserRecord {
  return {
    id: uid,
    email: data?.email || authUser?.email || `${uid}@kisankamai.local`,
    passwordLoginEmail: data?.passwordLoginEmail || "",
    phone: normalizePhone(data?.phone || authUser?.phoneNumber || ""),
    photoUrl: normalizeOptionalString(data?.photoUrl) || undefined,
    passwordHash: data?.passwordHash || "",
    roles: data?.roles?.length ? data.roles : allUserRoles(),
    fcmTokens: data?.fcmTokens || [],
    createdAt: data?.createdAt || nowIso(),
    updatedAt: data?.updatedAt || nowIso(),
  };
}

async function readCollection<T>(collectionName: string) {
  noStore();
  const snapshot = await db().collection(collectionName).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
}

async function getUserRecordById(userId: string) {
  const [userSnapshot, authUser] = await Promise.all([
    usersCollection().doc(userId).get(),
    getAdminAuth().getUser(userId).catch(() => null),
  ]);

  if (!authUser && !userSnapshot.exists) {
    return null;
  }

  const mapped = mapUserFromFirestore(
    userId,
    userSnapshot.exists ? (userSnapshot.data() as UserRecord) : null,
    authUser ? { email: authUser.email, phoneNumber: authUser.phoneNumber } : undefined
  );

  if (!userSnapshot.exists) {
    await usersCollection().doc(userId).set(mapped, { merge: true });
  }

  return mapped;
}

async function getProfileRecordById(userId: string) {
  const snapshot = await profilesCollection().doc(userId).get();
  return snapshot.exists ? mapProfileFromFirestore(userId, snapshot.data() as ProfileRecord) : null;
}

async function getExistingUserRecordById(userId: string) {
  const snapshot = await usersCollection().doc(userId).get();
  return snapshot.exists ? mapUserFromFirestore(userId, snapshot.data() as UserRecord) : null;
}

async function listAllListings() {
  const snapshot = await listingsCollection().get();
  return snapshot.docs
    .map((doc) => mapListingFromFirestore(withFirestoreId(doc.id, doc.data() as ListingRecord)))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function buildPublicListingDedupeKey(listing: ListingRecord) {
  const normalizedSlug = normalizeOptionalString(listing.slug).toLowerCase();
  if (normalizedSlug) {
    return `slug:${normalizedSlug}`;
  }

  return [
    normalizeOptionalString(listing.name).toLowerCase(),
    normalizeOptionalString(listing.category).toLowerCase(),
    normalizeOptionalString(listing.location).toLowerCase(),
    normalizeOptionalString(listing.district).toLowerCase(),
    normalizeOptionalString(listing.ownerUserId).toLowerCase(),
    String(Number(listing.pricePerHour || 0)),
  ].join("|");
}

function dedupePublicListings(listings: ListingRecord[]) {
  const seen = new Set<string>();

  return listings.filter((listing) => {
    const dedupeKey = buildPublicListingDedupeKey(listing);
    if (seen.has(dedupeKey)) {
      return false;
    }

    seen.add(dedupeKey);
    return true;
  });
}

async function listAllProfiles() {
  const snapshot = await profilesCollection().get();
  return snapshot.docs.map((doc) => mapProfileFromFirestore(doc.id, doc.data() as ProfileRecord));
}

async function listSavedItemRecordsByUser(userId: string) {
  const snapshot = await savedItemsCollection().where("userId", "==", userId).get();
  return snapshot.docs.map((doc) => ({ ...(doc.data() as SavedItemRecord) }));
}

export async function findUserByIdentifier(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  const collection = usersCollection();

  if (normalized.includes("@")) {
    const snapshot = await collection.where("email", "==", normalized).limit(1).get();
    if (!snapshot.empty) {
      return mapUserFromFirestore(snapshot.docs[0].id, snapshot.docs[0].data() as UserRecord);
    }
  }

  const snapshot = await collection.where("phone", "==", normalized).limit(1).get();
  if (!snapshot.empty) {
    return mapUserFromFirestore(snapshot.docs[0].id, snapshot.docs[0].data() as UserRecord);
  }

  return null;
}

export async function findUserByPhone(phone: string) {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return null;
  }

  const snapshot = await usersCollection().where("phone", "==", normalized).limit(1).get();
  if (!snapshot.empty) {
    return mapUserFromFirestore(snapshot.docs[0].id, snapshot.docs[0].data() as UserRecord);
  }

  return null;
}

export async function getLocalSessionByUserId(userId: string): Promise<LocalSession | null> {
  const [authUser, userRecord, profileRecord] = await Promise.all([
    getAdminAuth().getUser(userId).catch(() => null),
    getUserRecordById(userId),
    getProfileRecordById(userId),
  ]);

  if (!authUser && !userRecord) {
    return null;
  }

  const user = mapUserFromFirestore(
    userId,
    userRecord,
    authUser ? { email: authUser.email, phoneNumber: authUser.phoneNumber } : undefined
  );
  const profile = mapProfileFromFirestore(userId, profileRecord);

  return {
    user: {
      id: userId,
      name: profile.fullName || authUser?.displayName || "Kisan Kamai User",
      email: profile.email || (isPlaceholderEmail(user.email) ? "" : user.email),
      phone: profile.phone || user.phone,
      photoUrl: profile.photoUrl || user.photoUrl || authUser?.photoURL || undefined,
      roles: user.roles,
    },
    profile,
    activeWorkspace: normalizeRolePreference(profile.rolePreference),
  };
}

export async function getExistingLocalSessionByUserId(userId: string): Promise<LocalSession | null> {
  const [authUser, userRecord, profileRecord] = await Promise.all([
    getAdminAuth().getUser(userId).catch(() => null),
    getExistingUserRecordById(userId),
    getProfileRecordById(userId),
  ]);

  if (!userRecord || !profileRecord) {
    return null;
  }

  return {
    user: {
      id: userId,
      name: profileRecord.fullName || authUser?.displayName || "Kisan Kamai User",
      email: profileRecord.email || (isPlaceholderEmail(userRecord.email) ? "" : userRecord.email),
      phone: profileRecord.phone || userRecord.phone,
      photoUrl: profileRecord.photoUrl || userRecord.photoUrl || authUser?.photoURL || undefined,
      roles: userRecord.roles,
    },
    profile: profileRecord,
    activeWorkspace: normalizeRolePreference(profileRecord.rolePreference),
  };
}

export async function loginWithIdentifier(identifier: string, password: string) {
  const user = await findUserByIdentifier(identifier);
  if (!user) {
    return null;
  }

  try {
    const passwordLoginEmail = resolvePasswordLoginEmail(user);
    if (!passwordLoginEmail) {
      return null;
    }

    const idToken = await exchangePasswordLogin(passwordLoginEmail, password);
    return { idToken, session: await getLocalSessionByUserId(user.id) };
  } catch {
    return null;
  }
}

export async function loginWithPhoneDetailed(phone: string, password: string): Promise<PhonePasswordLoginResult> {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return { ok: false, reason: "not-found" };
  }

  const [userByPhone, authUserByPhone] = await Promise.all([
    findUserByPhone(normalizedPhone),
    getAuthUserByPhone(normalizedPhone),
  ]);
  const user = userByPhone || (authUserByPhone?.uid ? await getUserRecordById(authUserByPhone.uid) : null);
  if (!user) {
    return { ok: false, reason: "not-found" };
  }

  for (const passwordLoginEmail of getPasswordLoginEmailCandidates(user, authUserByPhone)) {
    try {
      const idToken = await exchangePasswordLogin(passwordLoginEmail, password);
      await rememberPasswordLoginEmailForUser(user.id, passwordLoginEmail);
      return { ok: true, idToken, session: await getLocalSessionByUserId(user.id) };
    } catch {
      // Try the next known credential shape before returning the generic login error.
    }
  }

  return { ok: false, reason: "invalid-password" };
}

export async function loginWithPhone(phone: string, password: string) {
  const result = await loginWithPhoneDetailed(phone, password);
  if (!result.ok) {
    return null;
  }

  const { idToken, session } = result;
  if (!session) {
    return null;
  }

  return { idToken, session };
}

export async function registerLocalUser(input: RegisterInput) {
  const normalizedEmail = normalizeEmail(input.email);
  const normalizedPhone = normalizePhone(input.phone);
  const passwordLoginEmail = buildPasswordLoginEmail(normalizedPhone || input.phone || "");
  const rolePreference = normalizeRolePreference(input.role);

  await assertRegistrationIdentifiersAvailable({
    phone: normalizedPhone,
    email: normalizedEmail,
  });

  const timestamp = nowIso();
  const authUser = await getAdminAuth().createUser({
    displayName: input.fullName.trim(),
    email: passwordLoginEmail,
    phoneNumber: toE164Phone(normalizedPhone),
    password: input.password,
    emailVerified: false,
  });

  try {
    await reserveAuthIdentifiersForUser(authUser.uid, {
      email: normalizedEmail,
      phone: normalizedPhone,
    });
  } catch (error) {
    await getAdminAuth().deleteUser(authUser.uid).catch(() => undefined);
    throw error;
  }

  const userRecord: UserRecord = {
    id: authUser.uid,
    email: normalizedEmail || passwordLoginEmail,
    passwordLoginEmail,
    phone: normalizedPhone || normalizePhone(authUser.phoneNumber),
    photoUrl: undefined,
    passwordHash: "",
    roles: allUserRoles(),
    fcmTokens: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const profileRecord: ProfileRecord = {
    userId: authUser.uid,
    fullName: input.fullName.trim(),
    village: input.village.trim(),
    address: input.address.trim(),
    pincode: input.pincode.trim(),
    fieldArea: Number(input.fieldArea),
    farmingTypes: "",
    rolePreference,
    email: normalizedEmail || undefined,
    phone: normalizedPhone || undefined,
    photoUrl: undefined,
    district: normalizeOptionalString(input.district) || undefined,
  };

  await Promise.all([
    usersCollection().doc(authUser.uid).set(userRecord),
    profilesCollection().doc(authUser.uid).set(profileRecord),
  ]);

  await mirrorProfile({
    userId: authUser.uid,
    profile: profileRecord,
    source: "register",
  });

  const customToken = await getAdminAuth().createCustomToken(authUser.uid);
  const idToken = await exchangeCustomToken(customToken);

  return {
    idToken,
    session: await getLocalSessionByUserId(authUser.uid),
  };
}

export async function registerGoogleVerifiedUser(input: {
  userId: string;
  email: string;
  fullName?: string | null;
  photoUrl?: string | null;
  emailVerified?: boolean;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  if (!normalizedEmail) {
    throw new Error("Google account did not provide an email address.");
  }
  if (!input.emailVerified) {
    throw new Error("Verify your email address before creating the account.");
  }

  const existing = await getExistingLocalSessionByUserId(input.userId);
  if (existing) {
    return existing;
  }

  const authUser = await getAdminAuth().getUser(input.userId).catch(() => null);
  const timestamp = nowIso();
  const displayName =
    normalizeOptionalString(input.fullName) ||
    normalizeOptionalString(authUser?.displayName) ||
    normalizedEmail.split("@")[0] ||
    "Kisan Kamai User";
  const photoUrl =
    normalizeOptionalString(input.photoUrl) || normalizeOptionalString(authUser?.photoURL) || undefined;

  await reserveAuthIdentifiersForUser(input.userId, {
    email: normalizedEmail,
    phone: "",
  });

  const userRecord: UserRecord = {
    id: input.userId,
    email: normalizedEmail,
    passwordLoginEmail: "",
    phone: "",
    photoUrl,
    passwordHash: "",
    roles: allUserRoles(),
    fcmTokens: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const profileRecord: ProfileRecord = {
    userId: input.userId,
    fullName: displayName,
    village: "",
    address: "",
    pincode: "",
    fieldArea: 0,
    farmingTypes: "",
    rolePreference: "renter",
    email: normalizedEmail,
    phone: "",
    photoUrl,
    verificationStatus: "not_submitted",
    verificationDocuments: [],
  };

  await Promise.all([
    usersCollection().doc(input.userId).set(userRecord, { merge: true }),
    profilesCollection().doc(input.userId).set(profileRecord, { merge: true }),
    getAdminAuth().updateUser(input.userId, {
      displayName,
      email: normalizedEmail,
      emailVerified: true,
      photoURL: photoUrl || null,
    }).catch(() => undefined),
  ]);

  await mirrorProfile({
    userId: input.userId,
    profile: profileRecord,
    source: "google-register",
  });

  return getExistingLocalSessionByUserId(input.userId);
}

export async function createOrUpdatePasswordLoginCredential(
  userId: string,
  input: {
    email?: string | null;
    phone?: string | null;
    password: string;
  }
) {
  const password = normalizeOptionalString(input.password);
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const currentUser = await getUserRecordById(userId);
  const normalizedEmail = normalizeEmail(input.email);
  const normalizedPhone = normalizePhone(input.phone || currentUser?.phone || "");
  const passwordLoginEmail = buildPasswordLoginEmail(normalizedPhone || userId);
  const timestamp = nowIso();
  const visibleEmail =
    normalizedEmail ||
    (currentUser?.email && !isPlaceholderEmail(currentUser.email) ? currentUser.email : "");
  await reserveAuthIdentifiersForUser(userId, {
    email: visibleEmail,
    phone: normalizedPhone || currentUser?.phone || "",
  });

  const authUpdates: {
    email: string;
    password: string;
    emailVerified: boolean;
    phoneNumber?: string;
  } = {
    email: passwordLoginEmail,
    password,
    emailVerified: false,
  };

  const e164Phone = toE164Phone(normalizedPhone);
  if (e164Phone) {
    authUpdates.phoneNumber = e164Phone;
  }

  await getAdminAuth().updateUser(userId, authUpdates);
  await usersCollection().doc(userId).set(
    {
      id: userId,
      email: visibleEmail || passwordLoginEmail,
      passwordLoginEmail,
      phone: normalizedPhone || currentUser?.phone || "",
      photoUrl: currentUser?.photoUrl,
      roles: currentUser?.roles || allUserRoles(),
      fcmTokens: currentUser?.fcmTokens || [],
      passwordHash: "",
      createdAt: currentUser?.createdAt || timestamp,
      updatedAt: timestamp,
    } satisfies UserRecord,
    { merge: true }
  );

  if (currentUser?.email && currentUser.email !== visibleEmail && !isPlaceholderEmail(currentUser.email)) {
    await releaseAuthIdentifier("email", currentUser.email, userId);
  }
  if (currentUser?.phone && normalizePhone(currentUser.phone) !== normalizePhone(normalizedPhone)) {
    await releaseAuthIdentifier("phone", currentUser.phone, userId);
  }
}

export async function updateLocalProfile(
  userId: string,
  input: Partial<
    Pick<
      ProfileRecord,
      | "fullName"
      | "village"
      | "address"
      | "pincode"
      | "fieldArea"
      | "farmingTypes"
      | "rolePreference"
      | "email"
      | "phone"
      | "photoUrl"
      | "district"
      | "verificationStatus"
      | "verificationDocumentType"
      | "verificationDocumentNumber"
      | "verificationDocuments"
    >
  >
) {
  const currentProfile = (await getProfileRecordById(userId)) || mapProfileFromFirestore(userId, null);
  const currentUser = await getUserRecordById(userId);
  const timestamp = nowIso();

  const updatedProfile: ProfileRecord = {
    ...currentProfile,
    ...input,
    phone: input.phone === undefined ? currentProfile.phone : normalizePhone(input.phone),
    rolePreference:
      input.rolePreference === undefined
        ? currentProfile.rolePreference
        : normalizeRolePreference(input.rolePreference),
    fieldArea: input.fieldArea === undefined ? currentProfile.fieldArea : Number(input.fieldArea),
    farmingTypes:
      input.farmingTypes === undefined
        ? currentProfile.farmingTypes
        : normalizeOptionalString(input.farmingTypes) || undefined,
    district:
      input.district === undefined
        ? currentProfile.district
        : normalizeOptionalString(input.district) || undefined,
    verificationDocumentType:
      input.verificationDocumentType === undefined
        ? currentProfile.verificationDocumentType
        : normalizeOptionalString(input.verificationDocumentType) || undefined,
    verificationDocumentNumber:
      input.verificationDocumentNumber === undefined
        ? currentProfile.verificationDocumentNumber
        : normalizeOptionalString(input.verificationDocumentNumber) || undefined,
    verificationDocuments:
      input.verificationDocuments === undefined
        ? currentProfile.verificationDocuments || []
        : input.verificationDocuments,
    photoUrl:
      input.photoUrl === undefined
        ? currentProfile.photoUrl
        : normalizeOptionalString(input.photoUrl) || undefined,
  };

  const nextEmail =
    input.email === undefined ? currentUser?.email || updatedProfile.email : input.email || currentUser?.email;
  const nextPhone =
    input.phone === undefined ? currentUser?.phone || updatedProfile.phone : normalizePhone(input.phone);
  await reserveAuthIdentifiersForUser(userId, {
    email: nextEmail,
    phone: nextPhone,
  });

  await profilesCollection().doc(userId).set(updatedProfile, { merge: true });
  const nextPasswordLoginEmail =
    normalizeEmail(currentUser?.passwordLoginEmail) || buildPasswordLoginEmail(nextPhone || userId);

  await usersCollection().doc(userId).set(
    {
      id: userId,
      email: nextEmail || `${userId}@kisankamai.local`,
      passwordLoginEmail: nextPasswordLoginEmail || "",
      phone: nextPhone || "",
      photoUrl: updatedProfile.photoUrl || currentUser?.photoUrl,
      roles: currentUser?.roles || allUserRoles(),
      fcmTokens: currentUser?.fcmTokens || [],
      passwordHash: currentUser?.passwordHash || "",
      createdAt: currentUser?.createdAt || timestamp,
      updatedAt: timestamp,
    } satisfies UserRecord,
    { merge: true }
  );

  const authUpdates: { displayName?: string; email?: string; phoneNumber?: string | null; photoURL?: string | null } = {};
  if (input.fullName !== undefined) {
    authUpdates.displayName = updatedProfile.fullName;
  }
  if (input.phone !== undefined) {
    authUpdates.phoneNumber = toE164Phone(nextPhone) || null;
  }
  if (input.photoUrl !== undefined) {
    authUpdates.photoURL = updatedProfile.photoUrl || null;
  }
  if (Object.keys(authUpdates).length) {
    await getAdminAuth().updateUser(userId, authUpdates);
  }

  if (input.email !== undefined && currentUser?.email && currentUser.email !== nextEmail && !isPlaceholderEmail(currentUser.email)) {
    await releaseAuthIdentifier("email", currentUser.email, userId);
  }
  if (input.phone !== undefined && currentUser?.phone && normalizePhone(currentUser.phone) !== normalizePhone(nextPhone)) {
    await releaseAuthIdentifier("phone", currentUser.phone, userId);
  }

  await mirrorProfile({
    userId,
    profile: updatedProfile,
    source: "profile-update",
  });

  return getLocalSessionByUserId(userId);
}

export async function resetLocalPassword(identifier: string, password: string) {
  const user = await findUserByPhone(identifier);
  if (!user) {
    throw new Error("No account exists for this mobile number. Please create an account first.");
  }

  await createOrUpdatePasswordLoginCredential(user.id, {
    email: undefined,
    phone: user.phone,
    password,
  });
}

export function listingToEquipmentRecord(
  listing: ListingRecord,
  ownerProfile?: ProfileRecord | null,
  ownerUser?: UserRecord | null
): EquipmentRecord {
  const ownerPhotoUrl =
    normalizeOptionalString(ownerProfile?.photoUrl) ||
    normalizeOptionalString(ownerUser?.photoUrl) ||
    undefined;

  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    category: listing.category,
    categoryLabel: listing.categoryLabel,
    location: listing.location,
    district: listing.district,
    state: listing.state,
    description: sanitizeEquipmentDescription(listing.description),
    pricePerHour: listing.pricePerHour,
    unitLabel: listing.unitLabel,
    rating: listing.rating,
    hp: listing.hp,
    distanceKm: listing.distanceKm,
    ownerName: listing.ownerName,
    ownerLocation: listing.ownerLocation,
    ownerVerified: listing.ownerVerified,
    ownerPhotoUrl,
    coverImage: listing.coverImage,
    galleryImages: listing.galleryImages,
    tags: listing.tags,
    workTypes: listing.workTypes,
    operatorIncluded: listing.operatorIncluded,
  };
}

export async function getPublicEquipmentList() {
  noStore();
  try {
    const [allListings, profiles] = await Promise.all([
      listAllListings(),
      listAllProfiles(),
    ]);
    const profileByUserId = new Map(profiles.map((profile) => [profile.userId, profile]));
    const listings = dedupePublicListings(allListings.filter(isPublicListingReady));
    return listings.map((listing) =>
      listingToEquipmentRecord(listing, profileByUserId.get(listing.ownerUserId))
    );
  } catch (error) {
    captureServerException(error, { subsystem: "getPublicEquipmentList" });
    return [];
  }
}

export async function getPublicEquipmentById(id: string) {
  try {
    const listing = await getListingById(id);
    if (listing && isPublicListingReady(listing)) {
      const [ownerProfile, ownerUser] = await Promise.all([
        getProfileRecordById(listing.ownerUserId),
        getExistingUserRecordById(listing.ownerUserId),
      ]);
      return listingToEquipmentRecord(listing, ownerProfile, ownerUser);
    }
  } catch (error) {
    captureServerException(error, { subsystem: "getPublicEquipmentById", listingId: id });
  }

  return null;
}

export async function getListingById(listingId: string) {
  const snapshot = await listingsCollection().doc(listingId).get();
  if (!snapshot.exists) {
    return null;
  }

  return mapListingFromFirestore(withFirestoreId(snapshot.id, snapshot.data() as ListingRecord));
}

export async function getListingBySlug(slug: string) {
  const snapshot = await listingsCollection().where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return mapListingFromFirestore(withFirestoreId(doc.id, doc.data() as ListingRecord));
}

export async function getOwnerListings(ownerUserId: string) {
  const snapshot = await listingsCollection().where("ownerUserId", "==", ownerUserId).get();
  return snapshot.docs
    .map((doc) => mapListingFromFirestore(withFirestoreId(doc.id, doc.data() as ListingRecord)))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getOwnerBookings(ownerUserId: string) {
  const [bookingsSnapshot, listings, profiles] = await Promise.all([
    bookingsCollection().where("ownerUserId", "==", ownerUserId).get(),
    listAllListings(),
    listAllProfiles(),
  ]);

  return bookingsSnapshot.docs
    .map((doc) => mapBookingFromFirestore(withFirestoreId(doc.id, doc.data() as BookingRecord)))
    .map((booking) => ({
      ...booking,
      listing: listings.find((entry) => entry.id === booking.listingId) || null,
      renterProfile: profiles.find((entry) => entry.userId === booking.renterUserId) || null,
    }))
    .sort((left, right) => right.startDate.localeCompare(left.startDate));
}

export async function getRenterBookings(renterUserId: string) {
  const [bookingsSnapshot, listings, profiles] = await Promise.all([
    bookingsCollection().where("renterUserId", "==", renterUserId).get(),
    listAllListings(),
    listAllProfiles(),
  ]);

  return bookingsSnapshot.docs
    .map((doc) => mapBookingFromFirestore(withFirestoreId(doc.id, doc.data() as BookingRecord)))
    .map((booking) => ({
      ...booking,
      listing: listings.find((entry) => entry.id === booking.listingId) || null,
      ownerProfile: profiles.find((entry) => entry.userId === booking.ownerUserId) || null,
    }))
    .sort((left, right) => right.startDate.localeCompare(left.startDate));
}

export async function getRenterSavedListings(renterUserId: string) {
  const [savedItems, listings] = await Promise.all([
    listSavedItemRecordsByUser(renterUserId),
    listAllListings(),
  ]);

  return savedItems
    .map((entry) => listings.find((listing) => listing.id === entry.listingId))
    .filter((entry): entry is ListingRecord => Boolean(entry));
}

export async function getOwnerPayments(ownerUserId: string) {
  const snapshot = await paymentsCollection().where("ownerUserId", "==", ownerUserId).get();
  return snapshot.docs
    .map((doc) => mapPaymentFromFirestore(withFirestoreId(doc.id, doc.data() as PaymentRecord)))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getRenterPayments(renterUserId: string) {
  const snapshot = await paymentsCollection().where("renterUserId", "==", renterUserId).get();
  return snapshot.docs
    .map((doc) => mapPaymentFromFirestore(withFirestoreId(doc.id, doc.data() as PaymentRecord)))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createListingRecord(
  input: Omit<ListingRecord, "id" | "slug" | "createdAt" | "updatedAt"> & {
    listingId?: string;
  }
) {
  const timestamp = nowIso();
  const slugBase = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const listingId = input.listingId || createId("listing");
  const nextListing: ListingRecord = mapListingFromFirestore({
    ...input,
    id: listingId,
    slug: `${slugBase || "equipment"}-${randomUUID().slice(0, 6)}`,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  await listingsCollection().doc(nextListing.id).set(nextListing);
  await mirrorListing(nextListing, "create");
  return nextListing;
}

export async function updateListingRecord(
  listingId: string,
  ownerUserId: string,
  input: Partial<Omit<ListingRecord, "id" | "ownerUserId" | "slug" | "createdAt" | "updatedAt">>
) {
  const current = await getListingById(listingId);
  if (!current || current.ownerUserId !== ownerUserId) {
    throw new Error("Listing not found.");
  }

  const updated = mapListingFromFirestore({
    ...current,
    ...input,
    id: current.id,
    ownerUserId: current.ownerUserId,
    slug: current.slug,
    createdAt: current.createdAt,
    updatedAt: nowIso(),
  });

  await listingsCollection().doc(listingId).set(updated, { merge: true });
  await mirrorListing(updated, "update");
  return updated;
}

export async function notifyListingChanged(input: {
  listing: ListingRecord;
  action: "created" | "updated" | "paused" | "activated";
}) {
  const title =
    input.action === "created"
      ? "Listing published"
      : input.action === "paused"
        ? "Listing paused"
        : input.action === "activated"
          ? "Listing activated"
          : "Listing updated";

  await sendPushNotificationToUsers({
    userIds: [input.listing.ownerUserId],
    title,
    body: `${input.listing.name} is now ${input.listing.status}.`,
    link: "/owner-profile",
    data: {
      listingId: input.listing.id,
      status: input.listing.status,
      workspace: "owner",
    },
  });
}

export async function deleteListingRecord(listingId: string, ownerUserId: string) {
  const listing = await getListingById(listingId);
  if (!listing || listing.ownerUserId !== ownerUserId) {
    throw new Error("Listing not found.");
  }

  const [bookingsSnapshot, savedSnapshot, submissionsSnapshot] = await Promise.all([
    bookingsCollection().where("listingId", "==", listingId).get(),
    savedItemsCollection().where("listingId", "==", listingId).get(),
    submissionsCollection().where("listingId", "==", listingId).get(),
  ]);

  const bookingIds = bookingsSnapshot.docs.map((doc) => doc.id);
  const paymentSnapshots = bookingIds.length
    ? await Promise.all(bookingIds.map((bookingId) => paymentsCollection().where("bookingId", "==", bookingId).get()))
    : [];

  const batch = db().batch();
  batch.delete(listingsCollection().doc(listingId));

  for (const doc of bookingsSnapshot.docs) {
    batch.delete(doc.ref);
  }

  for (const doc of savedSnapshot.docs) {
    batch.delete(doc.ref);
  }

  for (const doc of submissionsSnapshot.docs) {
    batch.delete(doc.ref);
  }

  for (const snapshot of paymentSnapshots) {
    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
    }
  }

  await batch.commit();
}

export async function createBookingRecord(input: {
  listingId: string;
  renterUserId: string;
  startDate: string;
  endDate: string;
  status?: BookingRecord["status"];
  amount: number;
}) {
  const [listing, renterSession] = await Promise.all([
    getListingById(input.listingId),
    getLocalSessionByUserId(input.renterUserId),
  ]);

  if (!listing) {
    throw new Error("Listing not found.");
  }

  if (listing.ownerUserId === input.renterUserId) {
    throw new Error("You cannot book your own listings.");
  }

  const requestedStartDate = normalizeBookingDate(input.startDate);
  const requestedEndDate = normalizeBookingDate(input.endDate || requestedStartDate);

  if (Date.parse(`${requestedEndDate}T00:00:00.000Z`) < Date.parse(`${requestedStartDate}T00:00:00.000Z`)) {
    throw new Error("Choose an end date after the start date.");
  }

  const existingSnapshot = await bookingsCollection().where("listingId", "==", listing.id).get();
  const activeBookings = existingSnapshot.docs
    .map((doc) => mapBookingFromFirestore(withFirestoreId(doc.id, doc.data() as BookingRecord)))
    .filter(bookingBlocksAvailability);

  const duplicateBooking = activeBookings.find(
    (booking) =>
      booking.renterUserId === input.renterUserId &&
      booking.startDate === requestedStartDate &&
      booking.endDate === requestedEndDate
  );

  if (duplicateBooking) {
    return duplicateBooking;
  }

  const conflictingBooking = activeBookings.find((booking) =>
    dateRangeOverlaps(requestedStartDate, requestedEndDate, booking.startDate, booking.endDate)
  );

  if (conflictingBooking) {
    throw new Error("This equipment already has a booking request for the selected dates. Choose another date or contact support.");
  }

  const timestamp = nowIso();
  const nextBooking: BookingRecord = {
    id: createId("BK"),
    listingId: listing.id,
    ownerUserId: listing.ownerUserId,
    renterUserId: input.renterUserId,
    status: input.status || "pending",
    startDate: requestedStartDate,
    endDate: requestedEndDate,
    amount: input.amount,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const nextPayment: PaymentRecord = {
    id: createId("pay"),
    bookingId: nextBooking.id,
    ownerUserId: listing.ownerUserId,
    renterUserId: input.renterUserId,
    amount: input.amount,
    status: "processing",
    method: renterSession?.user.phone ? "Phone Confirmation" : "Manual Confirmation",
    createdAt: timestamp,
  };

  const batch = db().batch();
  batch.set(bookingsCollection().doc(nextBooking.id), nextBooking);
  batch.set(paymentsCollection().doc(nextPayment.id), nextPayment);
  await batch.commit();

  await mirrorBookingAndPayment(nextBooking, nextPayment);
  await notifyBookingCreated({
    booking: nextBooking,
    listingName: listing.name,
    renterName: renterSession?.profile.fullName || renterSession?.user.name || "A renter",
  });

  return nextBooking;
}

function paymentStatusForBookingStatus(status: BookingRecord["status"]): PaymentRecord["status"] {
  if (status === "completed") {
    return "paid";
  }

  if (status === "cancelled") {
    return "refunded";
  }

  return "processing";
}

function bookingStatusLabel(status: BookingRecord["status"]) {
  switch (status) {
    case "confirmed":
      return "confirmed";
    case "active":
      return "active";
    case "upcoming":
      return "scheduled";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    default:
      return "updated";
  }
}

async function notifyBookingCreated(input: {
  booking: BookingRecord;
  listingName: string;
  renterName: string;
}) {
  await sendPushNotificationToUsers({
    userIds: [input.booking.ownerUserId],
    title: "New booking request",
    body: `${input.renterName} requested ${input.listingName}.`,
    link: "/owner-profile/bookings",
    data: {
      bookingId: input.booking.id,
      listingId: input.booking.listingId,
      status: input.booking.status,
      workspace: "owner",
    },
  });

  await sendPushNotificationToUsers({
    userIds: [input.booking.renterUserId],
    title: "Booking request sent",
    body: `Your request for ${input.listingName} is pending confirmation.`,
    link: "/renter-profile/bookings",
    data: {
      bookingId: input.booking.id,
      listingId: input.booking.listingId,
      status: input.booking.status,
      workspace: "renter",
    },
  });
}

async function notifyBookingStatusChanged(input: {
  booking: BookingRecord;
  listingName: string;
  actorRole: "owner" | "renter";
}) {
  const statusLabel = bookingStatusLabel(input.booking.status);

  if (input.actorRole === "owner") {
    await sendPushNotificationToUsers({
      userIds: [input.booking.renterUserId],
      title: `Booking ${statusLabel}`,
      body: `Your booking for ${input.listingName} is now ${input.booking.status}.`,
      link: "/renter-profile/bookings",
      data: {
        bookingId: input.booking.id,
        listingId: input.booking.listingId,
        status: input.booking.status,
        workspace: "renter",
      },
    });
    return;
  }

  await sendPushNotificationToUsers({
    userIds: [input.booking.ownerUserId],
    title: "Booking cancelled",
    body: `A renter cancelled the booking for ${input.listingName}.`,
    link: "/owner-profile/bookings",
    data: {
      bookingId: input.booking.id,
      listingId: input.booking.listingId,
      status: input.booking.status,
      workspace: "owner",
    },
  });
}

export async function updateBookingStatus(
  bookingId: string,
  actorUserId: string,
  status: BookingRecord["status"]
) {
  const snapshot = await bookingsCollection().doc(bookingId).get();
  if (!snapshot.exists) {
    throw new Error("Booking not found.");
  }

  const booking = mapBookingFromFirestore(withFirestoreId(snapshot.id, snapshot.data() as BookingRecord));
  const ownerCanUpdate = booking.ownerUserId === actorUserId;
  const renterCanCancel = booking.renterUserId === actorUserId && status === "cancelled";

  if (!ownerCanUpdate && !renterCanCancel) {
    throw new Error("Booking not found.");
  }

  const updated = {
    ...booking,
    status,
    updatedAt: nowIso(),
  };

  await bookingsCollection().doc(bookingId).set(updated, { merge: true });

  const paymentSnapshot = await paymentsCollection().where("bookingId", "==", bookingId).get();
  await Promise.all(
    paymentSnapshot.docs.map((doc) =>
      doc.ref.set(
        {
          status: paymentStatusForBookingStatus(status),
        },
        { merge: true }
      )
    )
  );

  const refreshedPayment = paymentSnapshot.docs[0]?.data() as PaymentRecord | undefined;
  await mirrorBookingAndPayment(updated, refreshedPayment ? { ...refreshedPayment, status: paymentStatusForBookingStatus(status) } : undefined);
  const listing = await getListingById(updated.listingId);
  await notifyBookingStatusChanged({
    booking: updated,
    listingName: listing?.name || "your equipment",
    actorRole: ownerCanUpdate ? "owner" : "renter",
  });

  return updated;
}

export async function toggleSavedListing(userId: string, listingId: string) {
  const ref = savedItemsCollection().doc(savedItemId(userId, listingId));
  const snapshot = await ref.get();

  if (snapshot.exists) {
    await ref.delete();
    return false;
  }

  await ref.set({
    userId,
    listingId,
    createdAt: nowIso(),
  } satisfies SavedItemRecord);

  return true;
}

export async function isListingSavedByUser(userId: string, listingId: string) {
  const snapshot = await savedItemsCollection().doc(savedItemId(userId, listingId)).get();
  return snapshot.exists;
}

export async function createSubmissionRecord(input: {
  type: SubmissionType;
  payload: Record<string, unknown>;
  userId?: string;
  listingId?: string;
}) {
  const record: FormSubmissionRecord = {
    id: createId("submission"),
    type: input.type,
    payload: input.payload,
    userId: input.userId,
    listingId: input.listingId,
    createdAt: nowIso(),
  };

  await submissionsCollection().doc(record.id).set(record);
  try {
    await mirrorSubmission(record);
  } catch (error) {
    captureServerException(error, {
      subsystem: "formSubmissionSideEffects",
      submissionId: record.id,
      submissionType: record.type,
    });
  }
  return record;
}

async function listAllBookings() {
  const snapshot = await bookingsCollection().get();
  return snapshot.docs
    .map((doc) => mapBookingFromFirestore(withFirestoreId(doc.id, doc.data() as BookingRecord)))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

async function listAllPayments() {
  const snapshot = await paymentsCollection().get();
  return snapshot.docs
    .map((doc) => mapPaymentFromFirestore(withFirestoreId(doc.id, doc.data() as PaymentRecord)))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export const usersRepo = {
  list: async () => readCollection<UserRecord>(USERS_COLLECTION),
  findByIdentifier: findUserByIdentifier,
};

export const profilesRepo = {
  list: async () => readCollection<ProfileRecord>(PROFILES_COLLECTION),
  getByUserId: getProfileRecordById,
  update: updateLocalProfile,
};

export const listingsRepo = {
  list: listAllListings,
  getById: getListingById,
  getBySlug: getListingBySlug,
  getByOwner: getOwnerListings,
  create: createListingRecord,
  update: updateListingRecord,
  delete: deleteListingRecord,
};

export const bookingsRepo = {
  list: listAllBookings,
  getByOwner: getOwnerBookings,
  getByRenter: getRenterBookings,
  create: createBookingRecord,
  updateStatus: updateBookingStatus,
};

export const savedItemsRepo = {
  list: async () => readCollection<SavedItemRecord>(SAVED_ITEMS_COLLECTION),
  getByUser: getRenterSavedListings,
  toggle: toggleSavedListing,
  isSaved: isListingSavedByUser,
};

export const paymentsRepo = {
  list: listAllPayments,
  getByOwner: getOwnerPayments,
  getByRenter: getRenterPayments,
};

export const submissionsRepo = {
  list: async () => readCollection<FormSubmissionRecord>(SUBMISSIONS_COLLECTION),
  create: createSubmissionRecord,
};

export async function removeLocalUploadIfExists(filePath: string) {
  if (!filePath) {
    return;
  }

  if (filePath.startsWith("listings/")) {
    try {
      await deleteStorageObject(filePath);
    } catch (error) {
      captureServerException(error, {
        subsystem: "deleteStorageObject",
        filePath,
      });
    }
    return;
  }

  if (!filePath.startsWith("/uploads/")) {
    return;
  }

  const absolutePath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""));
  try {
    await unlink(absolutePath);
  } catch {
    // Ignore legacy local upload cleanup failures.
  }
}

export async function saveFcmToken(userId: string, token: string) {
  const collection = usersCollection();
  const userSnapshot = await collection.doc(userId).get();
  if (userSnapshot.exists) {
    const data = userSnapshot.data() as UserRecord;
    const tokens = new Set(data.fcmTokens || []);
    if (!tokens.has(token)) {
      tokens.add(token);
      await collection.doc(userId).set({ fcmTokens: Array.from(tokens) }, { merge: true });
    }
  }
}
