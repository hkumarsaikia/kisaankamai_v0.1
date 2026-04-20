"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "@/components/AuthContext";
import { FormNotice } from "@/components/forms/FormKit";
import { getFirebaseAuthClient } from "@/lib/firebase-client";
import type { LocalSession } from "@/lib/local-data/types";

type SessionResponse = {
  ok?: boolean;
  error?: string;
  session?: LocalSession | null;
};

interface GoogleAuthButtonProps {
  label: string;
  className?: string;
}

function getGoogleAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("auth/popup-closed-by-user") || message.includes("auth/cancelled-popup-request")) {
    return "Google sign-in was cancelled. Please try again when you are ready.";
  }

  if (message.includes("auth/operation-not-allowed")) {
    return "Google sign-in is not enabled for this Firebase project. Enable the Google provider in Firebase Authentication.";
  }

  if (message.includes("auth/unauthorized-domain")) {
    return "This domain is not authorized for Google sign-in in Firebase. Add it to the Firebase authorized domains list.";
  }

  if (message.includes("auth/network-request-failed")) {
    return "Google sign-in could not reach Firebase. Please check your connection and try again.";
  }

  if (message.includes("Missing required Firebase public env")) {
    return message;
  }

  return message || "Google sign-in failed. Please try again.";
}

function isProfileComplete(session: LocalSession) {
  return Boolean(session.profile?.phone?.trim() && session.profile?.pincode?.trim());
}

async function fetchCurrentSession() {
  const response = await fetch("/api/auth/session", {
    credentials: "include",
    cache: "no-store",
  });
  const payload = (await response.json().catch(() => ({}))) as SessionResponse;

  if (!response.ok || !payload.session) {
    throw new Error(payload.error || "Could not load your session after Google sign-in.");
  }

  return payload.session;
}

async function signInWithGoogleAndCreateSession() {
  const auth = getFirebaseAuthClient();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  const credential = await signInWithPopup(auth, provider);
  const idToken = await credential.user.getIdToken();

  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });
  const payload = (await response.json().catch(() => ({}))) as SessionResponse;

  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error || "Could not create your Kisan Kamai session.");
  }

  return fetchCurrentSession();
}

export function GoogleAuthButton({ label, className = "" }: GoogleAuthButtonProps) {
  const { setSession } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = async () => {
    if (isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const session = await signInWithGoogleAndCreateSession();
      setSession(session);
      window.location.href = isProfileComplete(session) ? "/profile-selection" : "/complete-profile";
    } catch (authError) {
      setError(getGoogleAuthError(authError));
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={isLoading}
        className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-sm font-extrabold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-container hover:shadow-md disabled:translate-y-0 disabled:opacity-70"
      >
        <span className="flex items-center justify-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.69-2.3 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.14c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.12H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.88l3.66-2.74z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.12l3.66 2.74c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>{isLoading ? "Connecting to Google..." : label}</span>
        </span>
      </button>
      {error ? <FormNotice tone="error">{error}</FormNotice> : null}
    </div>
  );
}
