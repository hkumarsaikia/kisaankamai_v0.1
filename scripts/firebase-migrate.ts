import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error("Missing FIREBASE_PROJECT_ID in .env.local");
}
if (!process.env.FIREBASE_CLIENT_EMAIL) {
  throw new Error("Missing FIREBASE_CLIENT_EMAIL in .env.local");
}
if (!process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error("Missing FIREBASE_PRIVATE_KEY in .env.local");
}

console.log(`Initializing Firebase Admin SDK for project ${process.env.FIREBASE_PROJECT_ID}`);

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();
const auth = getAuth();

async function readJson(filename: string) {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", filename), "utf8");
    return JSON.parse(raw);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    console.warn(`Could not read ${filename}: ${e.message}`);
    return [];
  }
}

async function migrateCollection(collectionName, dataArray) {
  if (!dataArray || dataArray.length === 0) {
    console.log(`No data for ${collectionName}, skipping.`);
    return;
  }
  
  console.log(`Migrating ${dataArray.length} items to Firestore collection '${collectionName}'...`);
  const batchLimit = 500;
  
  let batchCounter = 0;
  
  for (let i = 0; i < dataArray.length; i += batchLimit) {
    const batch = db.batch();
    const chunk = dataArray.slice(i, i + batchLimit);
    
    for (const item of chunk) {
      if (!item.id) continue;
      const ref = db.collection(collectionName).doc(String(item.id));
      batch.set(ref, item, { merge: true });
    }
    
    await batch.commit();
    batchCounter++;
    console.log(`   - Committed batch ${batchCounter} to ${collectionName}`);
  }
  
  console.log(`Finished migrating ${collectionName}.`);
}

async function migrateUsers(usersArray) {
  if (!usersArray || usersArray.length === 0) return;
  
  console.log(`Migrating ${usersArray.length} users to Firebase Auth + Firestore...`);
  for (const u of usersArray) {
    try {
      // 1. Check if user exists in Firebase Auth to prevent duplicates
      let authUser;
      try {
        authUser = await auth.getUserByEmail(u.email);
      } catch (err) {
        if (err.code === "auth/user-not-found") {
           // Create in Auth
           authUser = await auth.createUser({
             uid: u.id,
             email: u.email,
             phoneNumber: u.phone ? `+91${u.phone}`.replace("++", "+") : undefined,
             password: "Password123!", // Dummy password for mock accounts
           });
           console.log(`Created Auth user: ${u.email}`);
        } else {
           throw err;
        }
      }

      // 2. Add to users collection
      const ref = db.collection("users").doc(u.id);
      await ref.set(u, { merge: true });
    } catch (e) {
      console.warn(`Failed to migrate user ${u.email}: ${e.message}`);
    }
  }
}

async function run() {
  try {
    const users = await readJson("users.json");
    await migrateUsers(users);

    const profiles = await readJson("profiles.json");
    await migrateCollection("profiles", profiles);

    const listings = await readJson("listings.json");
    await migrateCollection("listings", listings);

    const bookings = await readJson("bookings.json");
    await migrateCollection("bookings", bookings);

    const payments = await readJson("payments.json");
    await migrateCollection("payments", payments);

    const forms = await readJson("form-submissions.json");
    await migrateCollection("form_submissions", forms);

    const saved = await readJson("saved-items.json");
    await migrateCollection("saved_items", saved);

    console.log("Migration sequence completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration fatal error:", err);
    process.exit(1);
  }
}

run();
