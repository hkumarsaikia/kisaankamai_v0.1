import finalTestManifest from "../../data/final-test-accounts-manifest.json" with { type: "json" };
import sourceListings from "../../data/listings.json" with { type: "json" };
import sourceBookings from "../../data/bookings.json" with { type: "json" };
import sourcePayments from "../../data/payments.json" with { type: "json" };
import sourceSavedItems from "../../data/saved-items.json" with { type: "json" };

const USERS_COLLECTION = "users";
const PROFILES_COLLECTION = "profiles";
const LISTINGS_COLLECTION = "listings";
const BOOKINGS_COLLECTION = "bookings";
const PAYMENTS_COLLECTION = "payments";
const SAVED_ITEMS_COLLECTION = "saved-items";

function nowIso() {
  return new Date().toISOString();
}

function toE164Phone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(-10);
  return digits ? `+91${digits}` : undefined;
}

function listingDocId(sourceId) {
  return `${finalTestManifest.naming.listingPrefix}-${String(sourceId).replace(/[^a-zA-Z0-9-]/g, "-")}`;
}

function bookingDocId(sourceId) {
  return `${finalTestManifest.naming.bookingPrefix}-${String(sourceId).replace(/[^a-zA-Z0-9-]/g, "-")}`;
}

function paymentDocId(sourceId) {
  return `${finalTestManifest.naming.paymentPrefix}-${String(sourceId).replace(/[^a-zA-Z0-9-]/g, "-")}`;
}

export function getFinalTestManifest() {
  return finalTestManifest;
}

export function buildFinalTestSeedData(options = {}) {
  const timestamp = options.timestamp || nowIso();
  const owner = finalTestManifest.owner;
  const renter = finalTestManifest.renter;
  const listingIdMap = new Map(sourceListings.map((listing) => [listing.id, listingDocId(listing.id)]));
  const bookingIdMap = new Map(sourceBookings.map((booking) => [booking.id, bookingDocId(booking.id)]));

  const ownerUser = {
    id: owner.uid,
    email: owner.email,
    phone: owner.phone,
    passwordHash: "",
    roles: ["owner", "renter"],
    fcmTokens: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const renterUser = {
    id: renter.uid,
    email: renter.email,
    phone: renter.phone,
    passwordHash: "",
    roles: ["owner", "renter"],
    fcmTokens: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const ownerProfile = {
    userId: owner.uid,
    ...owner.profile,
  };

  const renterProfile = {
    userId: renter.uid,
    ...renter.profile,
  };

  const listings = sourceListings.map((listing) => ({
    ...listing,
    id: listingIdMap.get(listing.id),
    ownerUserId: owner.uid,
    ownerName: owner.profile.fullName,
    ownerLocation: owner.profile.village,
    status: "paused",
    createdAt: listing.createdAt || timestamp,
    updatedAt: listing.updatedAt || timestamp,
  }));

  const bookings = sourceBookings
    .filter((booking) => listingIdMap.has(booking.listingId))
    .map((booking) => ({
      ...booking,
      id: bookingIdMap.get(booking.id),
      listingId: listingIdMap.get(booking.listingId),
      ownerUserId: owner.uid,
      renterUserId: renter.uid,
      createdAt: booking.createdAt || timestamp,
      updatedAt: booking.updatedAt || timestamp,
    }));

  const validBookingIds = new Set(bookings.map((booking) => booking.id));
  const skippedPayments = [];
  const payments = [];

  for (const payment of sourcePayments) {
    const mappedBookingId = bookingIdMap.get(payment.bookingId);
    if (!mappedBookingId || !validBookingIds.has(mappedBookingId)) {
      skippedPayments.push({
        paymentId: payment.id,
        bookingId: payment.bookingId,
        reason: "Missing source booking in import set.",
      });
      continue;
    }

    payments.push({
      ...payment,
      id: paymentDocId(payment.id),
      bookingId: mappedBookingId,
      ownerUserId: owner.uid,
      renterUserId: renter.uid,
      createdAt: payment.createdAt || timestamp,
    });
  }

  const savedItems = sourceSavedItems
    .filter((savedItem) => listingIdMap.has(savedItem.listingId))
    .map((savedItem) => ({
      userId: renter.uid,
      listingId: listingIdMap.get(savedItem.listingId),
      createdAt: savedItem.createdAt || timestamp,
    }));

  return {
    owner,
    renter,
    ownerUser,
    renterUser,
    ownerProfile,
    renterProfile,
    listings,
    bookings,
    payments,
    savedItems,
    skippedPayments,
    summary: {
      users: 2,
      profiles: 2,
      listings: listings.length,
      bookings: bookings.length,
      payments: payments.length,
      savedItems: savedItems.length,
      skippedPayments: skippedPayments.length,
    },
  };
}

async function commitSetOperations(db, operations) {
  let batch = db.batch();
  let pending = 0;

  for (const operation of operations) {
    batch.set(operation.ref, operation.data, { merge: operation.merge !== false });
    pending += 1;

    if (pending >= 400) {
      await batch.commit();
      batch = db.batch();
      pending = 0;
    }
  }

  if (pending) {
    await batch.commit();
  }
}

async function commitDeleteOperations(db, refs) {
  let batch = db.batch();
  let pending = 0;

  for (const ref of refs) {
    batch.delete(ref);
    pending += 1;

    if (pending >= 400) {
      await batch.commit();
      batch = db.batch();
      pending = 0;
    }
  }

  if (pending) {
    await batch.commit();
  }
}

export async function cleanupFinalTestAccounts({ db, auth, dryRun = false } = {}) {
  const seedData = buildFinalTestSeedData();
  const listingIds = seedData.listings.map((listing) => listing.id);
  const bookingIds = seedData.bookings.map((booking) => booking.id);
  const paymentIds = seedData.payments.map((payment) => payment.id);
  const savedItemIds = seedData.savedItems.map((savedItem) => `${seedData.renter.uid}__${savedItem.listingId}`);

  const refs = [
    ...listingIds.map((id) => db.collection(LISTINGS_COLLECTION).doc(id)),
    ...bookingIds.map((id) => db.collection(BOOKINGS_COLLECTION).doc(id)),
    ...paymentIds.map((id) => db.collection(PAYMENTS_COLLECTION).doc(id)),
    ...savedItemIds.map((id) => db.collection(SAVED_ITEMS_COLLECTION).doc(id)),
    db.collection(USERS_COLLECTION).doc(seedData.owner.uid),
    db.collection(USERS_COLLECTION).doc(seedData.renter.uid),
    db.collection(PROFILES_COLLECTION).doc(seedData.owner.uid),
    db.collection(PROFILES_COLLECTION).doc(seedData.renter.uid),
  ];

  if (!dryRun) {
    await commitDeleteOperations(db, refs);
  }

  const authResults = [];
  for (const uid of [seedData.owner.uid, seedData.renter.uid]) {
    try {
      if (!dryRun) {
        await auth.deleteUser(uid);
      }
      authResults.push({ uid, deleted: !dryRun, planned: dryRun });
    } catch (error) {
      if (error?.code === "auth/user-not-found") {
        authResults.push({ uid, deleted: false, reason: "not-found" });
        continue;
      }

      throw error;
    }
  }

  return {
    deleted: {
      listings: listingIds.length,
      bookings: bookingIds.length,
      payments: paymentIds.length,
      savedItems: savedItemIds.length,
      users: 2,
      profiles: 2,
      authUsers: dryRun ? 2 : authResults.filter((entry) => entry.deleted).length,
    },
    authResults,
  };
}

export async function seedFinalTestAccounts({
  db,
  auth,
  ownerPassword,
  renterPassword,
  dryRun = false,
} = {}) {
  if (!ownerPassword || !renterPassword) {
    throw new Error("Both owner and renter passwords are required to seed the final test accounts.");
  }

  const seedData = buildFinalTestSeedData();

  if (dryRun) {
    return {
      ...seedData.summary,
      skippedPayments: seedData.skippedPayments,
    };
  }

  await cleanupFinalTestAccounts({ db, auth, dryRun: false });

  const authUsers = [
    { account: seedData.owner, password: ownerPassword },
    { account: seedData.renter, password: renterPassword },
  ];

  for (const entry of authUsers) {
    const createPayload = {
      uid: entry.account.uid,
      email: entry.account.email,
      phoneNumber: toE164Phone(entry.account.phone),
      displayName: entry.account.displayName,
      password: entry.password,
      emailVerified: true,
      disabled: false,
    };
    const updatePayload = {
      email: entry.account.email,
      phoneNumber: toE164Phone(entry.account.phone),
      displayName: entry.account.displayName,
      password: entry.password,
      emailVerified: true,
      disabled: false,
    };

    try {
      await auth.getUser(entry.account.uid);
      await auth.updateUser(entry.account.uid, updatePayload);
    } catch (error) {
      if (error?.code !== "auth/user-not-found") {
        throw error;
      }
      await auth.createUser(createPayload);
    }
  }

  const operations = [
    { ref: db.collection(USERS_COLLECTION).doc(seedData.owner.uid), data: seedData.ownerUser },
    { ref: db.collection(USERS_COLLECTION).doc(seedData.renter.uid), data: seedData.renterUser },
    { ref: db.collection(PROFILES_COLLECTION).doc(seedData.owner.uid), data: seedData.ownerProfile },
    { ref: db.collection(PROFILES_COLLECTION).doc(seedData.renter.uid), data: seedData.renterProfile },
    ...seedData.listings.map((listing) => ({
      ref: db.collection(LISTINGS_COLLECTION).doc(listing.id),
      data: listing,
    })),
    ...seedData.bookings.map((booking) => ({
      ref: db.collection(BOOKINGS_COLLECTION).doc(booking.id),
      data: booking,
    })),
    ...seedData.payments.map((payment) => ({
      ref: db.collection(PAYMENTS_COLLECTION).doc(payment.id),
      data: payment,
    })),
    ...seedData.savedItems.map((savedItem) => ({
      ref: db.collection(SAVED_ITEMS_COLLECTION).doc(`${seedData.renter.uid}__${savedItem.listingId}`),
      data: savedItem,
    })),
  ];

  await commitSetOperations(db, operations);

  return {
    ...seedData.summary,
    skippedPayments: seedData.skippedPayments,
  };
}
