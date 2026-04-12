import { Client, Account, Databases, Storage, ID } from 'appwrite';
export { ID };

const client = new Client();

export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69d918770025e8d680f6';

client
    .setEndpoint(APPWRITE_ENDPOINT) 
    .setProject(APPWRITE_PROJECT_ID); 


export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Note: You must replace these with the actual IDs from your Appwrite console once created
export const APPWRITE_CONFIG = {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'kisan-kamai-db',
    userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || 'users',
    performanceStorageBucketId: 'performance_traces',
    performanceInsightsCollectionId: 'performance_insights',
    liveLogsCollectionId: 'live_performance_logs',
};

export default client;
