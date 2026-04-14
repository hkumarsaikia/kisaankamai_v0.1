import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLocalSessionFromFirebase,
  normalizeFirebaseRolePreference,
  withFirestoreId,
} from "../lib/server/firebase-local-helpers.js";

test("normalizeFirebaseRolePreference prefers owner and defaults renter otherwise", () => {
  assert.equal(normalizeFirebaseRolePreference("owner"), "owner");
  assert.equal(normalizeFirebaseRolePreference("renter"), "renter");
  assert.equal(normalizeFirebaseRolePreference("both"), "renter");
  assert.equal(normalizeFirebaseRolePreference(undefined), "renter");
});

test("buildLocalSessionFromFirebase prefers explicit workspace cookie over profile preference", () => {
  const session = buildLocalSessionFromFirebase({
    decoded: {
      uid: "user_1",
      name: "Savita Patil",
      email: "savita@example.com",
      phone_number: "+919876543210",
    },
    profile: {
      userId: "user_1",
      fullName: "Savita Patil",
      village: "Satara",
      address: "Shivaji Nagar",
      pincode: "415001",
      fieldArea: 6,
      rolePreference: "renter",
      email: "savita@example.com",
      phone: "9876543210",
    },
    userRecord: {
      id: "user_1",
      email: "savita@example.com",
      phone: "9876543210",
      passwordHash: "",
      roles: ["owner", "renter"],
      createdAt: "2026-04-14T00:00:00.000Z",
      updatedAt: "2026-04-14T00:00:00.000Z",
    },
    workspaceCookie: "owner",
  });

  assert.equal(session.activeWorkspace, "owner");
  assert.equal(session.user.name, "Savita Patil");
  assert.equal(session.profile.rolePreference, "renter");
});

test("buildLocalSessionFromFirebase creates a usable placeholder profile when firestore profile is missing", () => {
  const session = buildLocalSessionFromFirebase({
    decoded: {
      uid: "user_2",
      name: "Rohan Jadhav",
      email: "rohan@example.com",
      phone_number: "+919999888877",
    },
    profile: null,
    userRecord: {
      id: "user_2",
      email: "rohan@example.com",
      phone: "9999888877",
      passwordHash: "",
      roles: ["owner", "renter"],
      createdAt: "2026-04-14T00:00:00.000Z",
      updatedAt: "2026-04-14T00:00:00.000Z",
    },
    workspaceCookie: null,
  });

  assert.equal(session.profile.userId, "user_2");
  assert.equal(session.profile.fullName, "Rohan Jadhav");
  assert.equal(session.profile.phone, "9999888877");
  assert.equal(session.activeWorkspace, "renter");
});

test("withFirestoreId prefers the Firestore document id over any embedded record id", () => {
  const source = {
    id: "stale-id",
    name: "Rotavator",
    ownerUserId: "owner_1",
  };

  const record = withFirestoreId("doc-id", source);

  assert.deepEqual(record, {
    id: "doc-id",
    name: "Rotavator",
    ownerUserId: "owner_1",
  });
  assert.equal(source.id, "stale-id");
});
