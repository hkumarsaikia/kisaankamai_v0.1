import { Client, Databases, Users } from "node-appwrite";
import fs from "node:fs/promises";

// Extracted from browser subagent exploration
const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "69d918770025e8d680f6";
const APPWRITE_API_KEY = "standard_f8a7f4e1dd0512024f9c74b9c9b6fdc732ef2f53155841cc76c10b2a087e9a1f7c81166bcceaddb3dc764b859259610e182ae61f707291a680c702dc1124f3850fcd65f6cd8abea54e22e597091f2631d880af6298730703df719b45268fa70f3b1b1576e81bb9df3b52041105a79ecada6b7da041702dd6b790e712b7e39829";

async function run() {
  console.log("Starting Appwrite extraction...");

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  const users = new Users(client);
  const databases = new Databases(client);

  try {
    const usersList = await users.list();
    console.log(`Found ${usersList.total} Appwrite users.`);
    await fs.writeFile("appwrite-users.json", JSON.stringify(usersList.users, null, 2));

    try {
      const dbList = await databases.list();
      console.log(`Found ${dbList.total} databases.`);
      
      const collectionsMap = {};
      for (const db of dbList.databases) {
        const collections = await databases.listCollections(db.$id);
        console.log(`DB ${db.name} (${db.$id}) has ${collections.total} collections.`);
        
        collectionsMap[db.$id] = {};
        for (const col of collections.collections) {
          const documents = await databases.listDocuments(db.$id, col.$id);
          collectionsMap[db.$id][col.name] = documents.documents;
          console.log(`   - Extracted ${documents.total} document(s) from collection '${col.name}'.`);
        }
      }
      
      await fs.writeFile("appwrite-databases.json", JSON.stringify(collectionsMap, null, 2));
      console.log("Extraction complete!");

    } catch (dbErr) {
      console.warn("Could not extract databases (they might be disabled or no ID specified).", dbErr.message);
    }

  } catch (error) {
    console.error("Failed to extract:", error.message);
  }
}

run();
