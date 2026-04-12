import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client, Databases, Users, Permission, Query, Role } from "node-appwrite";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..");

const loadEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const contents = fs.readFileSync(filePath, "utf8");

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if (!key || Object.prototype.hasOwnProperty.call(process.env, key)) {
      continue;
    }

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
};

loadEnvFile(path.join(ROOT_DIR, ".env.local"));
loadEnvFile(path.join(ROOT_DIR, ".env"));

const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "69d918770025e8d680f6";
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "kisan-kamai-db";
const USER_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || "users";

const SHARED_USER_ID = "team-test-shared";
const SHARED_PHONE = (process.env.NEXT_PUBLIC_TEAM_TEST_PHONE || "8761085453").trim();
const SHARED_EMAIL = (process.env.NEXT_PUBLIC_TEAM_TEST_EMAIL || "test@example.com").trim().toLowerCase();
const SHARED_PASSWORD = process.env.NEXT_PUBLIC_TEAM_TEST_PASSWORD || "Test@12345";
const SHARED_AUTH_PHONE = `+91${SHARED_PHONE}`;

const BASE_PROFILE = {
  fullName: "Kisan Kamai Team Test",
  address: "Demo Farm Road, Sangli",
  village: "Sangli Demo Hub",
  pincode: "416416",
  fieldArea: 12.5,
  role: "both"
};

if (!APPWRITE_API_KEY) {
  console.error("Missing APPWRITE_API_KEY. Set it in .env.local or your shell before running bootstrap:test-user.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT)
  .setKey(APPWRITE_API_KEY);

const users = new Users(client);
const databases = new Databases(client);

const profilePermissions = (userId) => [
  Permission.read(Role.user(userId)),
  Permission.update(Role.user(userId)),
  Permission.delete(Role.user(userId))
];

const isNotFoundError = (error) => error?.code === 404;

async function findUserByQuery(query) {
  const response = await users.list({ queries: [query] });
  return response.users[0] || null;
}

async function findSharedUserCandidates() {
  const candidates = new Map();

  try {
    const byId = await users.get(SHARED_USER_ID);
    candidates.set(byId.$id, byId);
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }
  }

  const byEmail = await findUserByQuery(Query.equal("email", SHARED_EMAIL));
  if (byEmail) {
    candidates.set(byEmail.$id, byEmail);
  }

  const byPhone = await findUserByQuery(Query.equal("phone", SHARED_AUTH_PHONE));
  if (byPhone) {
    candidates.set(byPhone.$id, byPhone);
  }

  return [...candidates.values()];
}

async function ensureSharedAuthUser() {
  const candidates = await findSharedUserCandidates();

  if (candidates.length > 1) {
    throw new Error(
      `Conflicting Appwrite users already exist for ${SHARED_EMAIL} / ${SHARED_AUTH_PHONE}. Remove the duplicates and rerun npm run bootstrap:test-user.`
    );
  }

  let user = candidates[0] || null;

  if (!user) {
    user = await users.create({
      userId: SHARED_USER_ID,
      email: SHARED_EMAIL,
      phone: SHARED_AUTH_PHONE,
      password: SHARED_PASSWORD,
      name: BASE_PROFILE.fullName
    });
  }

  if (user.email !== SHARED_EMAIL) {
    await users.updateEmail(user.$id, SHARED_EMAIL);
  }

  if (user.phone !== SHARED_AUTH_PHONE) {
    await users.updatePhone(user.$id, SHARED_AUTH_PHONE);
  }

  if (user.name !== BASE_PROFILE.fullName) {
    await users.updateName(user.$id, BASE_PROFILE.fullName);
  }

  await users.updatePassword(user.$id, SHARED_PASSWORD);
  await users.updateEmailVerification(user.$id, true);
  await users.updatePhoneVerification(user.$id, true);

  return users.get(user.$id);
}

async function upsertProfileDocument(userId, data) {
  try {
    await databases.getDocument(DATABASE_ID, USER_COLLECTION_ID, userId);
    return databases.updateDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      userId,
      data,
      profilePermissions(userId)
    );
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error;
    }

    return databases.createDocument(
      DATABASE_ID,
      USER_COLLECTION_ID,
      userId,
      data,
      profilePermissions(userId)
    );
  }
}

async function ensureSharedProfile(userId) {
  return upsertProfileDocument(userId, {
    ...BASE_PROFILE,
    email: SHARED_EMAIL,
    phone: SHARED_PHONE
  });
}

async function main() {
  console.log("Bootstrapping the shared team review user...");

  const user = await ensureSharedAuthUser();
  const profile = await ensureSharedProfile(user.$id);

  console.log("Shared team review user is ready:");
  console.log(`- Email login: ${SHARED_EMAIL}`);
  console.log(`- Phone login: ${SHARED_PHONE}`);
  console.log(`- User ID: ${user.$id}`);
  console.log(`- Profile phone: ${profile.phone}`);
  console.log(`- Password: ${SHARED_PASSWORD}`);
}

main().catch((error) => {
  console.error("Failed to bootstrap the shared team review user.");
  console.error(error?.message || error);
  process.exit(1);
});
