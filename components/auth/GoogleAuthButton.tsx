"use client";

import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  type Auth,
} from "firebase/auth";
import { useAuth } from "@/components/AuthContext";
import {
  getFirebaseAuthError,
  getOptionalFirebaseAuthClient,
} from "@/components/auth/firebase-auth-client";
import { FormNotice } from "@/components/forms/FormKit";
import type { LocalSession } from "@/lib/local-data/types";

interface GoogleAuthButtonProps {
  label: string;
  className?: string;
}

function getFirebaseAuthCode(error: unknown) {
  return typeof error === "object" && error && "code" in error && typeof error.code === "string"
    ? error.code
    : "";
}

function getGoogleAuthError(error: unknown) {
  if (getFirebaseAuthCode(error) === "auth/internal-error") {
    return "Google sign-in could not start. Refresh the page and try again.";
  }

  return getFirebaseAuthError(error, "Google sign-in failed. Please try again.");
}

type GoogleResolveResponse = {
  ok?: boolean;
  status?: "signed_in" | "registration_required";
  session?: LocalSession;
  email?: string;
  emailVerified?: boolean;
  name?: string;
  photoUrl?: string;
  error?: string;
};

function isProfileComplete(session: LocalSession) {
  return Boolean(session.profile?.phone?.trim() && session.profile?.pincode?.trim());
}

function persistPendingGoogleRegistration(payload: GoogleResolveResponse) {
  window.localStorage.setItem(
    "kk_google_registration",
    JSON.stringify({
      email: payload.email || "",
      emailVerified: Boolean(payload.emailVerified),
      name: payload.name || "",
      photoUrl: payload.photoUrl || "",
      createdAt: new Date().toISOString(),
    })
  );
}

async function resolveGoogleAccount(auth: Auth) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Google sign-in did not return an account.");
  }

  const idToken = await user.getIdToken(true);
  const response = await fetch("/api/auth/google/resolve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ idToken }),
  });
  const payload = (await response.json().catch(() => null)) as GoogleResolveResponse | null;

  if (!response.ok || !payload?.ok) {
    throw new Error(payload?.error || "Could not resolve Google sign-in.");
  }

  if (payload.status === "registration_required") {
    persistPendingGoogleRegistration(payload);
    window.location.href = "/register/google-email";
    return null;
  }

  if (!payload.session) {
    throw new Error("Google sign-in did not return a session.");
  }

  await auth.signOut().catch(() => undefined);
  return payload.session;
}

function shouldFallbackToRedirect(error: unknown) {
  const code = getFirebaseAuthCode(error);

  return code === "auth/popup-blocked" || code === "auth/cancelled-popup-request" || code === "auth/internal-error";
}

async function signInWithGoogleAndCreateSession() {
  const auth = getOptionalFirebaseAuthClient();
  if (!auth) {
    throw new Error("Firebase sign-in is unavailable in this deployment.");
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    if (shouldFallbackToRedirect(error)) {
      await signInWithRedirect(auth, provider);
      return null;
    }

    throw error;
  }

  return resolveGoogleAccount(auth);
}

export function GoogleAuthButton({ label, className = "" }: GoogleAuthButtonProps) {
  const { setSession } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const auth = getOptionalFirebaseAuthClient();
    if (!auth) {
      return;
    }

    let isActive = true;
    getRedirectResult(auth)
      .then(async (result) => {
        if (!isActive || !result?.user) {
          return;
        }

        setIsLoading(true);
        const session = await resolveGoogleAccount(auth);
        if (!isActive) {
          return;
        }
        if (!session) {
          return;
        }

        setSession(session);
        window.location.href = isProfileComplete(session) ? "/profile-selection" : "/complete-profile";
      })
      .catch((authError) => {
        if (!isActive) {
          return;
        }

        setError(getGoogleAuthError(authError));
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [setSession]);

  const handleGoogleAuth = async () => {
    if (isLoading) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const session = await signInWithGoogleAndCreateSession();
      if (!session) {
        return;
      }
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
        className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest px-5 py-4 text-sm font-extrabold text-on-surface shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md disabled:translate-y-0 disabled:opacity-70"
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
