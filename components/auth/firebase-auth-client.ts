"use client";

import type { Auth, UserCredential } from "firebase/auth";
import {
  EmailAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  inMemoryPersistence,
  linkWithCredential,
  setPersistence,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import { PHONE_AUTH_TEST_MODE } from "@/lib/auth-capabilities";
import { getFirebaseAuthClient, getFirebaseAuthClientOrNull } from "@/lib/firebase-client";
import type { LocalSession } from "@/lib/local-data/types";

type SessionResponse = {
  ok?: boolean;
  error?: string;
  session?: LocalSession | null;
};

type SessionProfilePayload = {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  village: string;
  pincode: string;
  fieldArea: number;
};

type SessionPayload = {
  workspacePreference?: "owner" | "renter";
  profile?: SessionProfilePayload;
};

type WindowWithRecaptchaStore = typeof window & {
  __kkRecaptchaStore?: Record<string, RecaptchaVerifier>;
};

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/cancelled-popup-request": "Google sign-in was cancelled. Please try again when you are ready.",
  "auth/credential-already-in-use": "These login details are already linked to another account.",
  "auth/invalid-app-credential": "Firebase could not validate this request. Refresh the page and try again.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/invalid-phone-number": "Enter a valid mobile number with country code if needed.",
  "auth/invalid-verification-code": "Enter the 6-digit OTP exactly as received.",
  "auth/missing-verification-code": "Enter the OTP that was sent to your registered mobile number.",
  "auth/network-request-failed": "Firebase could not be reached. Check your connection and try again.",
  "auth/operation-not-allowed": "This Firebase sign-in method is not enabled for the current project.",
  "auth/popup-blocked": "Your browser blocked the Google sign-in popup. Allow popups and try again.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled. Please try again when you are ready.",
  "auth/requires-recent-login": "Verify your mobile number again before changing the password.",
  "auth/too-many-requests": "Too many attempts were made. Wait a moment and try again.",
  "auth/unauthorized-domain": "This domain is not authorized for Firebase sign-in.",
  "auth/user-disabled": "This account has been disabled. Contact support for help.",
  "auth/user-not-found": "No account was found for these credentials.",
  "auth/wrong-password": "Incorrect password. Please try again.",
};

function getRecaptchaStore() {
  const win = window as WindowWithRecaptchaStore;
  if (!win.__kkRecaptchaStore) {
    win.__kkRecaptchaStore = {};
  }

  return win.__kkRecaptchaStore;
}

export function normalizeIndianPhoneNumber(input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (trimmed.startsWith("+")) {
    return `+${trimmed.replace(/\D/g, "")}`;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  return trimmed;
}

export function getFirebaseAuthError(error: unknown, fallback: string) {
  const code =
    typeof error === "object" && error && "code" in error && typeof error.code === "string"
      ? error.code
      : "";
  const message =
    typeof error === "object" && error && "message" in error && typeof error.message === "string"
      ? error.message
      : "";

  if (code && FIREBASE_ERROR_MESSAGES[code]) {
    return FIREBASE_ERROR_MESSAGES[code];
  }

  if (message.includes("Missing required Firebase public env")) {
    return "Firebase client configuration is missing for this deployment.";
  }

  return message || fallback;
}

export function getOptionalFirebaseAuthClient() {
  return getFirebaseAuthClientOrNull();
}

export async function prepareEphemeralFirebaseAuth(auth: Auth) {
  await setPersistence(auth, inMemoryPersistence);
  return auth;
}

export function ensureInvisibleRecaptcha(auth: Auth, containerId: string, storeKey: string) {
  const store = getRecaptchaStore();
  const existing = store[storeKey];
  if (existing) {
    return existing;
  }

  auth.settings.appVerificationDisabledForTesting = PHONE_AUTH_TEST_MODE;

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
  store[storeKey] = verifier;
  return verifier;
}

export function clearRecaptchaVerifier(storeKey: string) {
  const store = getRecaptchaStore();
  const verifier = store[storeKey];
  if (!verifier) {
    return;
  }

  verifier.clear();
  delete store[storeKey];
}

export async function startPhoneVerification(input: {
  auth?: Auth;
  phoneNumber: string;
  containerId: string;
  storeKey: string;
}) {
  const auth = input.auth || getFirebaseAuthClient();
  await prepareEphemeralFirebaseAuth(auth);
  const verifier = ensureInvisibleRecaptcha(auth, input.containerId, input.storeKey);
  const confirmation = await signInWithPhoneNumber(auth, normalizeIndianPhoneNumber(input.phoneNumber), verifier);
  return confirmation.verificationId;
}

export async function verifyPhoneOtp(input: {
  auth?: Auth;
  verificationId: string;
  otp: string;
}) {
  const auth = input.auth || getFirebaseAuthClient();
  const credential = PhoneAuthProvider.credential(input.verificationId, input.otp);
  return signInWithCredential(auth, credential);
}

export async function signInWithEmailPassword(input: {
  auth?: Auth;
  email: string;
  password: string;
}) {
  const auth = input.auth || getFirebaseAuthClient();
  await prepareEphemeralFirebaseAuth(auth);
  return signInWithEmailAndPassword(auth, input.email.trim(), input.password);
}

export async function linkEmailPasswordCredential(input: {
  auth?: Auth;
  email: string;
  password: string;
}) {
  const auth = input.auth || getFirebaseAuthClient();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No Firebase user is available to link credentials.");
  }

  const credential = EmailAuthProvider.credential(input.email.trim(), input.password);
  return linkWithCredential(currentUser, credential);
}

export async function createServerSessionFromCurrentUser(input: {
  auth?: Auth;
  payload?: SessionPayload;
}) {
  const auth = input.auth || getFirebaseAuthClient();
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No Firebase user is available.");
  }

  const idToken = await currentUser.getIdToken(true);
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      idToken,
      ...(input.payload || {}),
    }),
  });
  const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error || "Could not create your Kisan Kamai session.");
  }

  return payload;
}

export async function fetchCurrentSession() {
  const response = await fetch("/api/auth/session", {
    credentials: "include",
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as SessionResponse;

  if (!response.ok || !payload.session) {
    throw new Error(payload.error || "Could not load your session.");
  }

  return payload.session;
}

export async function finishFirebaseAuthSession(input?: {
  auth?: Auth;
  payload?: SessionPayload;
  shouldFetchSession?: boolean;
}) {
  const auth = input?.auth || getFirebaseAuthClient();
  await createServerSessionFromCurrentUser({
    auth,
    payload: input?.payload,
  });

  const session = input?.shouldFetchSession ? await fetchCurrentSession() : null;
  await auth.signOut();
  return session;
}

export async function getCurrentResetIdToken(auth?: Auth) {
  const resolvedAuth = auth || getFirebaseAuthClientOrNull();
  if (!resolvedAuth?.currentUser) {
    return null;
  }

  return resolvedAuth.currentUser.getIdToken(true);
}

export type { SessionPayload, SessionProfilePayload, SessionResponse, UserCredential };
