import { getOptionalFirebaseClientConfig } from "@/lib/firebase-client";

export const WEB_PUSH_PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY?.trim() || "";
export const WEB_PUSH_ENABLED = Boolean(getOptionalFirebaseClientConfig() && WEB_PUSH_PUBLIC_KEY);

export function getFirebaseMessagingServiceWorkerUrl() {
  const config = getOptionalFirebaseClientConfig();
  if (!config || !WEB_PUSH_PUBLIC_KEY) {
    return null;
  }

  const search = new URLSearchParams({
    apiKey: config.apiKey || "",
    authDomain: config.authDomain || "",
    projectId: config.projectId || "",
    storageBucket: config.storageBucket || "",
    messagingSenderId: config.messagingSenderId || "",
    appId: config.appId || "",
  });

  if (config.measurementId) {
    search.set("measurementId", config.measurementId);
  }

  return `/firebase-messaging-sw.js?${search.toString()}`;
}

export function getWebPushDisabledReason() {
  if (!getOptionalFirebaseClientConfig()) {
    return "Firebase public configuration is missing for this environment.";
  }

  if (!WEB_PUSH_PUBLIC_KEY) {
    return "Web push is not configured for this environment yet.";
  }

  return "";
}
