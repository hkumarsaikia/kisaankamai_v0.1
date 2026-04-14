import "server-only";

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import type { EquipmentRecord } from "@/lib/equipment";
import type {
  BookingRecord,
  FormSubmissionRecord,
  ListingRecord,
  LocalDataTables,
  LocalSession,
  PaymentRecord,
  ProfileRecord,
  RolePreference,
  SavedItemRecord,
  SubmissionType,
  UserRecord,
  UserRole,
} from "@/lib/local-data/types";
import type { RegisterInput } from "@/lib/validation/forms";

type TableName = keyof LocalDataTables;

const DATA_DIR = path.join(process.cwd(), "data");
let bootstrapPromise: Promise<void> | null = null;

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

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

function allUserRoles(): UserRole[] {
  return ["owner", "renter"];
}

export function normalizeRolePreference(rolePreference?: RolePreference | null): UserRole {
  return rolePreference === "owner" ? "owner" : "renter";
}

async function readJsonFile<T>(table: TableName): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, table);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function writeJsonFile<T>(table: TableName, payload: T) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, table);
  const tempPath = `${filePath}.${process.pid}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await rename(tempPath, filePath);
}

async function ensureLocalDataBootstrap() {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    const [users, profiles] = await Promise.all([
      readJsonFile<UserRecord[]>("users.json"),
      readJsonFile<ProfileRecord[]>("profiles.json"),
    ]);

    const timestamp = nowIso();
    let usersChanged = false;
    let profilesChanged = false;

    const nextUsers = users.map((user) => {
      const hasDualAccess =
        user.roles.length === 2 &&
        user.roles.includes("owner") &&
        user.roles.includes("renter");

      if (hasDualAccess) {
        return user;
      }

      usersChanged = true;
      return {
        ...user,
        roles: allUserRoles(),
        updatedAt: timestamp,
      };
    });

    const nextProfiles = profiles.map((profile) => {
      const normalizedPreference = normalizeRolePreference(profile.rolePreference);
      if (profile.rolePreference === normalizedPreference) {
        return profile;
      }

      profilesChanged = true;
      return {
        ...profile,
        rolePreference: normalizedPreference,
      };
    });

    await Promise.all([
      usersChanged ? writeJsonFile("users.json", nextUsers) : Promise.resolve(),
      profilesChanged ? writeJsonFile("profiles.json", nextProfiles) : Promise.resolve(),
    ]);
  })().catch((error) => {
    bootstrapPromise = null;
    throw error;
  });

  return bootstrapPromise;
}

async function readTable<T>(table: TableName): Promise<T> {
  noStore();
  await ensureLocalDataBootstrap();
  return readJsonFile<T>(table);
}

async function writeTable<T>(table: TableName, payload: T) {
  await ensureLocalDataBootstrap();
  await writeJsonFile(table, payload);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, encodedHash: string) {
  const [scheme, salt, digest] = encodedHash.split("$");
  if (scheme !== "scrypt" || !salt || !digest) {
    return false;
  }

  const candidate = scryptSync(password, salt, 64);
  const target = Buffer.from(digest, "hex");

  if (candidate.length !== target.length) {
    return false;
  }

  return timingSafeEqual(candidate, target);
}

async function readUsers() {
  return readTable<UserRecord[]>("users.json");
}

async function readProfiles() {
  return readTable<ProfileRecord[]>("profiles.json");
}

async function readListings() {
  return readTable<ListingRecord[]>("listings.json");
}

async function readBookings() {
  return readTable<BookingRecord[]>("bookings.json");
}

async function readSavedItems() {
  return readTable<SavedItemRecord[]>("saved-items.json");
}

async function readPayments() {
  return readTable<PaymentRecord[]>("payments.json");
}

async function readSubmissions() {
  return readTable<FormSubmissionRecord[]>("form-submissions.json");
}

export async function findUserByIdentifier(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  const users = await readUsers();
  return (
    users.find((user) => user.email.toLowerCase() === normalized) ||
    users.find((user) => user.phone === normalized) ||
    null
  );
}

export async function getLocalSessionByUserId(userId: string): Promise<LocalSession | null> {
  const [users, profiles] = await Promise.all([readUsers(), readProfiles()]);
  const user = users.find((entry) => entry.id === userId);
  const profile = profiles.find((entry) => entry.userId === userId);

  if (!user || !profile) {
    return null;
  }

  return {
    user: {
      id: user.id,
      name: profile.fullName,
      email: user.email,
      phone: user.phone,
      roles: allUserRoles(),
    },
    profile,
    activeWorkspace: normalizeRolePreference(profile.rolePreference),
  };
}

export async function loginWithIdentifier(identifier: string, password: string) {
  const user = await findUserByIdentifier(identifier);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return getLocalSessionByUserId(user.id);
}

export async function registerLocalUser(input: RegisterInput) {
  const [users, profiles] = await Promise.all([readUsers(), readProfiles()]);
  const normalizedEmail = input.email?.trim().toLowerCase() || "";
  const normalizedPhone = input.phone?.trim() || "";

  if (normalizedEmail && users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  if (normalizedPhone && users.some((user) => user.phone === normalizedPhone)) {
    throw new Error("An account with this phone number already exists.");
  }

  const rolePreference = normalizeRolePreference(input.role);
  const userId = createId("user");
  const timestamp = nowIso();

  const nextUser: UserRecord = {
    id: userId,
    email: normalizedEmail || `${userId}@kisankamai.local`,
    phone: normalizedPhone || "",
    passwordHash: hashPassword(input.password),
    roles: allUserRoles(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const nextProfile: ProfileRecord = {
    userId,
    fullName: input.fullName,
    village: input.village,
    address: input.address,
    pincode: input.pincode,
    fieldArea: Number(input.fieldArea),
    rolePreference,
    email: normalizedEmail || undefined,
    phone: normalizedPhone || undefined,
  };

  await Promise.all([
    writeTable("users.json", [...users, nextUser]),
    writeTable("profiles.json", [...profiles, nextProfile]),
  ]);

  return getLocalSessionByUserId(userId);
}

export async function updateLocalProfile(
  userId: string,
  input: Partial<Pick<ProfileRecord, "fullName" | "village" | "address" | "pincode" | "fieldArea" | "rolePreference" | "email" | "phone">>
) {
  const profiles = await readProfiles();
  const index = profiles.findIndex((entry) => entry.userId === userId);

  if (index === -1) {
    throw new Error("Profile not found.");
  }

  const current = profiles[index];
  const nextRolePreference =
    input.rolePreference === undefined
      ? current.rolePreference
      : normalizeRolePreference(input.rolePreference);
  const updated: ProfileRecord = {
    ...current,
    ...input,
    rolePreference: nextRolePreference,
    fieldArea:
      input.fieldArea === undefined ? current.fieldArea : Number(input.fieldArea),
  };

  profiles[index] = updated;
  await writeTable("profiles.json", profiles);

  const users = await readUsers();
  const userIndex = users.findIndex((entry) => entry.id === userId);
  if (userIndex >= 0) {
    users[userIndex] = {
      ...users[userIndex],
      email: updated.email || users[userIndex].email,
      phone: updated.phone || users[userIndex].phone,
      updatedAt: nowIso(),
      roles: allUserRoles(),
    };
    await writeTable("users.json", users);
  }

  return getLocalSessionByUserId(userId);
}

export async function resetLocalPassword(identifier: string, password: string) {
  const users = await readUsers();
  const userIndex = users.findIndex((entry) => {
    const normalized = normalizeIdentifier(identifier);
    return entry.email.toLowerCase() === normalized || entry.phone === normalized;
  });

  if (userIndex === -1) {
    throw new Error("No account found for this email or phone.");
  }

  users[userIndex] = {
    ...users[userIndex],
    passwordHash: hashPassword(password),
    updatedAt: nowIso(),
  };

  await writeTable("users.json", users);
}

export function listingToEquipmentRecord(listing: ListingRecord): EquipmentRecord {
  return {
    id: listing.id,
    slug: listing.slug,
    name: listing.name,
    category: listing.category,
    categoryLabel: listing.categoryLabel,
    location: listing.location,
    district: listing.district,
    state: listing.state,
    description: listing.description,
    pricePerHour: listing.pricePerHour,
    unitLabel: listing.unitLabel,
    rating: listing.rating,
    hp: listing.hp,
    distanceKm: listing.distanceKm,
    ownerName: listing.ownerName,
    ownerLocation: listing.ownerLocation,
    ownerVerified: listing.ownerVerified,
    coverImage: listing.coverImage,
    galleryImages: listing.galleryImages,
    tags: listing.tags,
    workTypes: listing.workTypes,
    operatorIncluded: listing.operatorIncluded,
  };
}

export async function getPublicEquipmentList() {
  const listings = await readListings();
  return listings.filter((listing) => listing.status === "active").map(listingToEquipmentRecord);
}

export async function getPublicEquipmentById(id: string) {
  const listings = await readListings();
  const listing = listings.find((entry) => entry.id === id && entry.status === "active");
  return listing ? listingToEquipmentRecord(listing) : null;
}

export async function getListingById(listingId: string) {
  const listings = await readListings();
  return listings.find((entry) => entry.id === listingId) || null;
}

export async function getListingBySlug(slug: string) {
  const listings = await readListings();
  return listings.find((entry) => entry.slug === slug) || null;
}

export async function getOwnerListings(ownerUserId: string) {
  const listings = await readListings();
  return listings.filter((entry) => entry.ownerUserId === ownerUserId);
}

export async function getOwnerBookings(ownerUserId: string) {
  const [bookings, listings, profiles] = await Promise.all([
    readBookings(),
    readListings(),
    readProfiles(),
  ]);

  return bookings
    .filter((entry) => entry.ownerUserId === ownerUserId)
    .map((booking) => ({
      ...booking,
      listing: listings.find((entry) => entry.id === booking.listingId) || null,
      renterProfile: profiles.find((entry) => entry.userId === booking.renterUserId) || null,
    }))
    .sort((left, right) => right.startDate.localeCompare(left.startDate));
}

export async function getRenterBookings(renterUserId: string) {
  const [bookings, listings, profiles] = await Promise.all([
    readBookings(),
    readListings(),
    readProfiles(),
  ]);

  return bookings
    .filter((entry) => entry.renterUserId === renterUserId)
    .map((booking) => ({
      ...booking,
      listing: listings.find((entry) => entry.id === booking.listingId) || null,
      ownerProfile: profiles.find((entry) => entry.userId === booking.ownerUserId) || null,
    }))
    .sort((left, right) => right.startDate.localeCompare(left.startDate));
}

export async function getRenterSavedListings(renterUserId: string) {
  const [savedItems, listings] = await Promise.all([readSavedItems(), readListings()]);
  return savedItems
    .filter((entry) => entry.userId === renterUserId)
    .map((entry) => listings.find((listing) => listing.id === entry.listingId))
    .filter((entry): entry is ListingRecord => Boolean(entry));
}

export async function getOwnerPayments(ownerUserId: string) {
  const payments = await readPayments();
  return payments
    .filter((entry) => entry.ownerUserId === ownerUserId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function getRenterPayments(renterUserId: string) {
  const payments = await readPayments();
  return payments
    .filter((entry) => entry.renterUserId === renterUserId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createListingRecord(
  input: Omit<ListingRecord, "id" | "slug" | "createdAt" | "updatedAt">
) {
  const listings = await readListings();
  const timestamp = nowIso();
  const slugBase = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const nextListing: ListingRecord = {
    ...input,
    id: createId("listing"),
    slug: `${slugBase || "equipment"}-${randomUUID().slice(0, 6)}`,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await writeTable("listings.json", [...listings, nextListing]);
  return nextListing;
}

export async function updateListingRecord(
  listingId: string,
  ownerUserId: string,
  input: Partial<Omit<ListingRecord, "id" | "ownerUserId" | "slug" | "createdAt" | "updatedAt">>
) {
  const listings = await readListings();
  const index = listings.findIndex(
    (entry) => entry.id === listingId && entry.ownerUserId === ownerUserId
  );

  if (index === -1) {
    throw new Error("Listing not found.");
  }

  const current = listings[index];
  listings[index] = {
    ...current,
    ...input,
    updatedAt: nowIso(),
  };

  await writeTable("listings.json", listings);
  return listings[index];
}

export async function deleteListingRecord(listingId: string, ownerUserId: string) {
  const listings = await readListings();
  const filteredListings = listings.filter(
    (entry) => !(entry.id === listingId && entry.ownerUserId === ownerUserId)
  );

  if (filteredListings.length === listings.length) {
    throw new Error("Listing not found.");
  }

  await writeTable("listings.json", filteredListings);

  const [bookings, savedItems] = await Promise.all([readBookings(), readSavedItems()]);
  await Promise.all([
    writeTable(
      "bookings.json",
      bookings.filter((entry) => entry.listingId !== listingId)
    ),
    writeTable(
      "saved-items.json",
      savedItems.filter((entry) => entry.listingId !== listingId)
    ),
  ]);
}

export async function createBookingRecord(input: {
  listingId: string;
  renterUserId: string;
  startDate: string;
  endDate: string;
  status?: BookingRecord["status"];
  amount: number;
}) {
  const [bookings, listings, payments] = await Promise.all([
    readBookings(),
    readListings(),
    readPayments(),
  ]);
  const listing = listings.find((entry) => entry.id === input.listingId);

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
    method: "Local Test Payment",
    createdAt: timestamp,
  };

  await Promise.all([
    writeTable("bookings.json", [...bookings, nextBooking]),
    writeTable("payments.json", [...payments, nextPayment]),
  ]);

  return nextBooking;
}

export async function updateBookingStatus(
  bookingId: string,
  ownerUserId: string,
  status: BookingRecord["status"]
) {
  const bookings = await readBookings();
  const index = bookings.findIndex(
    (entry) => entry.id === bookingId && entry.ownerUserId === ownerUserId
  );

  if (index === -1) {
    throw new Error("Booking not found.");
  }

  bookings[index] = {
    ...bookings[index],
    status,
    updatedAt: nowIso(),
  };

  await writeTable("bookings.json", bookings);
  return bookings[index];
}

export async function toggleSavedListing(userId: string, listingId: string) {
  const savedItems = await readSavedItems();
  const existingIndex = savedItems.findIndex(
    (entry) => entry.userId === userId && entry.listingId === listingId
  );

  if (existingIndex >= 0) {
    savedItems.splice(existingIndex, 1);
    await writeTable("saved-items.json", savedItems);
    return false;
  }

  savedItems.push({
    userId,
    listingId,
    createdAt: nowIso(),
  });
  await writeTable("saved-items.json", savedItems);
  return true;
}

export async function isListingSavedByUser(userId: string, listingId: string) {
  const savedItems = await readSavedItems();
  return savedItems.some((entry) => entry.userId === userId && entry.listingId === listingId);
}

export async function createSubmissionRecord(input: {
  type: SubmissionType;
  payload: Record<string, unknown>;
  userId?: string;
  listingId?: string;
}) {
  const submissions = await readSubmissions();
  const nextSubmission: FormSubmissionRecord = {
    id: createId("submission"),
    type: input.type,
    payload: input.payload,
    userId: input.userId,
    listingId: input.listingId,
    createdAt: nowIso(),
  };

  await writeTable("form-submissions.json", [...submissions, nextSubmission]);
  return nextSubmission;
}

export const usersRepo = {
  list: readUsers,
  findByIdentifier: findUserByIdentifier,
};

export const profilesRepo = {
  list: readProfiles,
  getByUserId: async (userId: string) =>
    (await readProfiles()).find((entry) => entry.userId === userId) || null,
  update: updateLocalProfile,
};

export const listingsRepo = {
  list: readListings,
  getById: getListingById,
  getBySlug: getListingBySlug,
  getByOwner: getOwnerListings,
  create: createListingRecord,
  update: updateListingRecord,
  delete: deleteListingRecord,
};

export const bookingsRepo = {
  list: readBookings,
  getByOwner: getOwnerBookings,
  getByRenter: getRenterBookings,
  create: createBookingRecord,
  updateStatus: updateBookingStatus,
};

export const savedItemsRepo = {
  list: readSavedItems,
  getByUser: getRenterSavedListings,
  toggle: toggleSavedListing,
  isSaved: isListingSavedByUser,
};

export const paymentsRepo = {
  list: readPayments,
  getByOwner: getOwnerPayments,
  getByRenter: getRenterPayments,
};

export const submissionsRepo = {
  list: readSubmissions,
  create: createSubmissionRecord,
};

export async function removeLocalUploadIfExists(filePath: string) {
  if (!filePath.startsWith("/uploads/")) {
    return;
  }

  const absolutePath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""));
  try {
    await unlink(absolutePath);
  } catch {}
}
