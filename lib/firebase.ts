import { getFirebaseAuthClient, getFirebaseClientApp } from "@/lib/firebase-client";

export const app = getFirebaseClientApp();
export const auth = getFirebaseAuthClient();

export default app;
