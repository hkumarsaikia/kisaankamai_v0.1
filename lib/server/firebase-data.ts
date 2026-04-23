import "server-only";

import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import {
  getMockEquipmentById,
  getMockEquipmentList,
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

function db() {
  return getAdminDb();
}

function nowIso() {
  return new Date().toISOString();
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

function savedItemId(userId: string, listingId: string) {
  return `${userId}__${listingId}`;
}

function isPlaceholderEmail(email?: string | null) {
  return Boolean(email && email.endsWith("@kisankamai.local"));
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

async function exchangePasswordLogin(email: string, password: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_API_KEY for Firebase password login.");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  const name = data.name || "Equipment";
  const category = (data.category || "equipment").toLowerCase();
  const location = data.location || "Maharashtra";
  const district = data.district || "Maharashtra";
  const ownerName = data.ownerName || "Kisan Kamai Owner";
  const fallbackCover = "/assets/generated/hero_tractor.png";
  const coverImage = data.coverImage || fallbackCover;
  const galleryImages =
    data.galleryImages?.length ? data.galleryImages : data.coverImage ? [data.coverImage] : [coverImage];
  const imagePaths = data.imagePaths?.length ? data.imagePaths : [];

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
    categoryLabel:
      data.categoryLabel ||
      `${category.charAt(0).toUpperCase()}${category.slice(1)} • ${name.split(" ")[0] || "Kisan Kamai"}`,
    location,
    district,
    state: data.state || "Maharashtra",
    description: sanitizeEquipmentDescription(
      data.description || "Verified equipment listed on Kisan Kamai."
    ),
    pricePerHour: Number(data.pricePerHour || 0),
    unitLabel: data.unitLabel || "per hour",
    rating: Number(data.rating || 4.8),
    hp: data.hp || "N/A",
    distanceKm: Number(data.distanceKm || 0),
    ownerName,
    ownerLocation: data.ownerLocation || `${location}, ${district}`,
    ownerVerified: data.ownerVerified ?? true,
    coverImage,
    galleryImages,
    imagePaths,
    tags: data.tags?.length ? data.tags : ["Verified"],
    workTypes: data.workTypes?.length ? data.workTypes : [],
    operatorIncluded: Boolean(data.operatorIncluded),
    availableFrom: data.availableFrom || undefined,
    status: data.status === "paused" ? "paused" : "active",
    createdAt: data.createdAt || nowIso(),
    updatedAt: data.updatedAt || nowIso(),
  };
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

  const timestamp = nowIso();
  const nextBooking: BookingRecord = {
    id: createId("BK"),
    listingId: listing.id,
    ownerUserId: listing.ownerUserId,
    renterUserId: input.renterUserId,
    status: input.status || "pending",
    startDate: input.startDate,
    endDate: input.endDate,
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
  await mirrorSubmission(record);
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
