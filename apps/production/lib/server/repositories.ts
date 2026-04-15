import "server-only";

import { randomUUID } from "node:crypto";
import { getAdminDb } from "@/lib/server/firebase-admin";
import { listingSchema } from "@/lib/server/forms";
import { captureServerException } from "@/lib/server/observability";
import { mirrorBookingAndPayment, mirrorListing, mirrorProfile, mirrorSavedItem, mirrorSubmission } from "@/lib/server/sheets-mirror";
import { uploadListingImage } from "@/lib/server/storage";
import type {
  BookingInput,
  BookingRecord,
  ListingFormInput,
  ListingRecord,
  PaymentRecord,
  SavedItemRecord,
  SubmissionRecord,
  UserRecord,
  UserProfile,
  Workspace,
} from "@/lib/types";

function nowIso() {
  return new Date().toISOString();
}

function usersCollection() {
  return getAdminDb().collection("users");
}

function profilesCollection() {
  return getAdminDb().collection("profiles");
}

function listingsCollection() {
  return getAdminDb().collection("listings");
}

function bookingsCollection() {
  return getAdminDb().collection("bookings");
}

function paymentsCollection() {
  return getAdminDb().collection("payments");
}

function submissionsCollection() {
  return getAdminDb().collection("form-submissions");
}

function savedItemsCollection() {
  return getAdminDb().collection("saved-items");
}

function savedItemId(uid: string, listingId: string) {
  return `${uid}__${listingId}`;
}

function cleanNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function fallbackListings(): ListingRecord[] {
  const timestamp = nowIso();
  return [
    {
      id: "seed-sangli-tractor",
      ownerUid: "seed-owner",
      name: "Mahindra 575 DI",
      category: "Tractor",
      description: "Reliable multi-use tractor for tilling, hauling, and sowing support.",
      district: "Sangli",
      location: "Miraj",
      pricePerHour: 850,
      operatorIncluded: true,
      status: "active",
      coverImage: "/assets/generated/hero_tractor.png",
      imagePaths: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "seed-satara-harvester",
      ownerUid: "seed-owner",
      name: "John Deere Harvester",
      category: "Harvester",
      description: "Season-ready harvester with local operator support and on-field setup.",
      district: "Satara",
      location: "Karad",
      pricePerHour: 2500,
      operatorIncluded: true,
      status: "active",
      coverImage: "/assets/generated/harvester_action.png",
      imagePaths: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await profilesCollection().doc(uid).get();
  return snapshot.exists ? (snapshot.data() as UserProfile) : null;
}

export async function getUserRecord(uid: string): Promise<UserRecord | null> {
  const snapshot = await usersCollection().doc(uid).get();
  return snapshot.exists ? (snapshot.data() as UserRecord) : null;
}

export async function upsertUserRecord(
  uid: string,
  input: {
    fullName?: string;
    phone?: string;
    email?: string;
    workspacePreference: Workspace;
    lastLoginAt?: string;
  }
) {
  const existing = await getUserRecord(uid);
  const timestamp = nowIso();
  const payload: UserRecord = {
    uid,
    fullName: input.fullName?.trim() || existing?.fullName,
    phone: input.phone?.trim() || existing?.phone,
    email: input.email?.trim().toLowerCase() || existing?.email,
    workspacePreference: input.workspacePreference,
    createdAt: existing?.createdAt || timestamp,
    updatedAt: timestamp,
    lastLoginAt: input.lastLoginAt || timestamp,
  };

  await usersCollection().doc(uid).set(payload, { merge: true });
  return payload;
}

export async function upsertUserProfile(
  uid: string,
  input: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    village: string;
    pincode: string;
    fieldArea: number;
    workspacePreference: Workspace;
  }
) {
  const existing = await getUserProfile(uid);
  const timestamp = nowIso();
  const payload: UserProfile = {
    uid,
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim().toLowerCase() || existing?.email,
    address: input.address.trim(),
    village: input.village.trim(),
    pincode: input.pincode.trim(),
    fieldArea: input.fieldArea,
    workspacePreference: input.workspacePreference,
    createdAt: existing?.createdAt || timestamp,
    updatedAt: timestamp,
  };

  await profilesCollection().doc(uid).set(payload, { merge: true });
  await upsertUserRecord(uid, {
    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    workspacePreference: payload.workspacePreference,
    lastLoginAt: timestamp,
  });
  await mirrorProfile(payload, "profile-upsert");
  return payload;
}

export async function updateWorkspacePreference(uid: string, workspacePreference: Workspace) {
  const timestamp = nowIso();
  await Promise.all([
    usersCollection().doc(uid).set({ workspacePreference, updatedAt: timestamp }, { merge: true }),
    profilesCollection().doc(uid).set({ workspacePreference, updatedAt: timestamp }, { merge: true }),
  ]);
}

export async function listPublicListings() {
  try {
    const snapshot = await listingsCollection().where("status", "==", "active").orderBy("createdAt", "desc").get();
    const listings = snapshot.docs.map((doc) => doc.data() as ListingRecord);
    return listings.length ? listings : fallbackListings();
  } catch (error) {
    captureServerException(error, { subsystem: "listPublicListings" });
    return fallbackListings();
  }
}

export async function getListingById(listingId: string) {
  const snapshot = await listingsCollection().doc(listingId).get();
  return snapshot.exists ? (snapshot.data() as ListingRecord) : null;
}

export async function listOwnerListings(uid: string) {
  const snapshot = await listingsCollection().where("ownerUid", "==", uid).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as ListingRecord);
}

export async function createListing(ownerUid: string, input: ListingFormInput, files: File[]) {
  const listingId = `listing_${randomUUID().slice(0, 10)}`;
  const timestamp = nowIso();
  const uploads = await Promise.all(
    files.filter((file) => file.size > 0).map((file) => uploadListingImage(ownerUid, listingId, file))
  );

  const payload: ListingRecord = {
    id: listingId,
    ownerUid,
    name: input.name.trim(),
    category: input.category.trim(),
    description: input.description.trim(),
    district: input.district.trim(),
    location: input.location.trim(),
    pricePerHour: input.pricePerHour,
    operatorIncluded: input.operatorIncluded,
    status: "active",
    coverImage: uploads[0]?.publicUrl,
    imagePaths: uploads.map((upload) => upload.objectPath),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await listingsCollection().doc(listingId).set(payload);
  await mirrorListing(payload, "create");
  return payload;
}

export async function createListingFromFormData(ownerUid: string, formData: FormData) {
  const files = formData.getAll("images").filter((entry): entry is File => entry instanceof File);
  const parsed = listingSchema.parse({
    name: String(formData.get("name") || ""),
    category: String(formData.get("category") || ""),
    description: String(formData.get("description") || ""),
    district: String(formData.get("district") || ""),
    location: String(formData.get("location") || ""),
    pricePerHour: cleanNumber(formData.get("pricePerHour")),
    operatorIncluded: String(formData.get("operatorIncluded") || "") === "on",
  });

  return createListing(ownerUid, parsed, files);
}

export async function updateListing(
  listingId: string,
  ownerUid: string,
  input: Partial<
    Pick<ListingRecord, "name" | "category" | "description" | "district" | "location" | "pricePerHour" | "operatorIncluded" | "status" | "coverImage" | "imagePaths">
  >
) {
  const current = await getListingById(listingId);
  if (!current || current.ownerUid !== ownerUid) {
    throw new Error("Listing not found.");
  }

  const payload: ListingRecord = {
    ...current,
    ...input,
    updatedAt: nowIso(),
  };

  await listingsCollection().doc(listingId).set(payload, { merge: true });
  await mirrorListing(payload, "update");
  return payload;
}

export async function createBooking(renterUid: string, renterName: string, input: BookingInput) {
  const bookingId = `booking_${randomUUID().slice(0, 10)}`;
  const paymentId = `payment_${randomUUID().slice(0, 10)}`;
  const timestamp = nowIso();
  const amount = Math.max(1, Math.round((input.approxHours || 1) * 800));

  const booking: BookingRecord = {
    id: bookingId,
    listingId: input.listingId,
    listingName: input.listingName,
    ownerUid: input.ownerUid,
    renterUid,
    renterName,
    fieldLocation: input.fieldLocation.trim(),
    workType: input.workType.trim(),
    approxHours: input.approxHours,
    startDate: input.startDate,
    status: "pending",
    amount,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const payment: PaymentRecord = {
    id: paymentId,
    bookingId,
    ownerUid: input.ownerUid,
    renterUid,
    amount,
    status: "pending",
    method: "manual-confirmation",
    createdAt: timestamp,
  };

  const batch = getAdminDb().batch();
  batch.set(bookingsCollection().doc(bookingId), booking);
  batch.set(paymentsCollection().doc(paymentId), payment);
  await batch.commit();
  await mirrorBookingAndPayment(booking, payment);

  return booking;
}

export async function listOwnerBookings(uid: string) {
  const snapshot = await bookingsCollection().where("ownerUid", "==", uid).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as BookingRecord);
}

export async function listRenterBookings(uid: string) {
  const snapshot = await bookingsCollection().where("renterUid", "==", uid).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as BookingRecord);
}

export async function listOwnerPayments(uid: string) {
  const snapshot = await paymentsCollection().where("ownerUid", "==", uid).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as PaymentRecord);
}

export async function listRenterPayments(uid: string) {
  const snapshot = await paymentsCollection().where("renterUid", "==", uid).orderBy("createdAt", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as PaymentRecord);
}

export async function isListingSaved(uid: string, listingId: string) {
  const snapshot = await savedItemsCollection().doc(savedItemId(uid, listingId)).get();
  return snapshot.exists;
}

export async function toggleSavedListing(uid: string, listingId: string) {
  const ref = savedItemsCollection().doc(savedItemId(uid, listingId));
  const snapshot = await ref.get();
  if (snapshot.exists) {
    await ref.delete();
    await mirrorSavedItem({ id: ref.id, userUid: uid, listingId, createdAt: nowIso() }, "unsaved");
    return false;
  }

  const record: SavedItemRecord = {
    id: ref.id,
    userUid: uid,
    listingId,
    createdAt: nowIso(),
  };
  await ref.set(record);
  await mirrorSavedItem(record, "saved");
  return true;
}

export async function listSavedListings(uid: string) {
  const savedSnapshot = await savedItemsCollection().where("userUid", "==", uid).get();
  const ids = savedSnapshot.docs.map((doc) => (doc.data() as SavedItemRecord).listingId);
  if (!ids.length) {
    return [] as ListingRecord[];
  }

  const listings = await Promise.all(ids.map((id) => getListingById(id)));
  return listings.filter((listing): listing is ListingRecord => Boolean(listing));
}

export async function createSubmission(type: SubmissionRecord["type"], payload: Record<string, unknown>, userUid?: string) {
  const record: SubmissionRecord = {
    id: `submission_${randomUUID().slice(0, 10)}`,
    type,
    payload,
    userUid,
    createdAt: nowIso(),
  };

  await submissionsCollection().doc(record.id).set(record);
  await mirrorSubmission(record);
  return record;
}
