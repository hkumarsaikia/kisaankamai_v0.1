"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { getFirebaseAuthError, getOptionalFirebaseAuthClient } from "@/components/auth/firebase-auth-client";
import { useEffect, useMemo, useState } from "react";

type PendingGoogleRegistration = {
  email?: string;
  emailVerified?: boolean;
  name?: string;
  photoUrl?: string;
  createdAt?: string;
};

function readPendingGoogleRegistration() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem("kk_google_registration");
    return raw ? (JSON.parse(raw) as PendingGoogleRegistration) : null;
  } catch {
    return null;
  }
}

export default function GoogleEmailRegistrationPage() {
  const { langText } = useLanguage();
  const [pending, setPending] = useState<PendingGoogleRegistration | null>(null);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const auth = useMemo(() => getOptionalFirebaseAuthClient(), []);

  useEffect(() => {
    setPending(readPendingGoogleRegistration());
  }, []);

  const handleChangeEmail = async () => {
    await auth?.signOut().catch(() => undefined);
    window.localStorage.removeItem("kk_google_registration");
    window.location.href = "/register";
  };

  const handleVerify = async () => {
    setError("");
    setState("submitting");

    try {
      const currentUser = auth?.currentUser;
      if (!currentUser) {
        throw new Error(langText("Start Google registration again.", "Google नोंदणी पुन्हा सुरू करा."));
      }

      await currentUser.reload();
      const idToken = await currentUser.getIdToken(true);
      const response = await fetch("/api/auth/google/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || langText("Could not create your account.", "तुमचे खाते तयार करता आले नाही."));
      }

      setState("success");
      window.localStorage.removeItem("kk_google_registration");
      await auth.signOut().catch(() => undefined);
      window.setTimeout(() => {
        window.location.href = "/login?pleaseLogin=1";
      }, 650);
    } catch (registrationError) {
      setState("error");
      setError(getFirebaseAuthError(registrationError, langText("Google registration failed.", "Google नोंदणी अयशस्वी झाली.")));
    }
  };

  return (
    <div className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-surface text-on-surface">
      <img
        alt="Green agricultural field"
        className="absolute inset-0 h-full w-full object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxQOjwxd1GOcMalqWnNbjRE_PdmUfc0-NmR6Q4TuQErXFd_qzDuGiC_WdF1g7ttCtoM0UiVMbVLaVQm0WLKWYov6lMhQOFyseyikTrMes5EQXOe_I4a_6cw2Ae-j6WIH5Gaez5ZmPfqiySohcSrnOyQ_NlH63cuQmtxASSLmjDCc3vYWLKGGxXawj6rqyL0fVwYXIhDuPqyurvIFiseFluZhvpkLiRugKXITVBrfbosLWRWCYExgO7RrH5oe0TEtMmGSkIJsYbgPtE"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary-container/45 to-surface/80 dark:from-slate-950/90 dark:via-primary-container/70 dark:to-slate-950/80" />
      <main className="relative z-10 flex min-h-[calc(100svh-5rem)] items-center justify-center px-4 pb-12 pt-28">
        <section className="w-full max-w-xl rounded-[2.5rem] border border-outline-variant bg-surface-container-lowest/95 p-8 text-center shadow-2xl backdrop-blur-xl md:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-fixed text-primary-container">
            <span className="material-symbols-outlined text-4xl">mark_email_read</span>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-primary">
            {langText("Verify and create your account", "पडताळणी करून खाते तयार करा")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-on-surface-variant">
            {pending?.email
              ? langText(
                  `We will create your Kisan Kamai account for ${pending.email}.`,
                  `${pending.email} साठी तुमचे किसान कमाई खाते तयार केले जाईल.`
                )
              : langText(
                  "Continue with the Google account you selected.",
                  "तुम्ही निवडलेल्या Google खात्यासह पुढे जा."
                )}
          </p>

          {pending?.photoUrl ? (
            <img
              alt={langText("Google profile", "Google प्रोफाइल")}
              className="mx-auto mt-6 h-16 w-16 rounded-full border border-outline-variant object-cover"
              src={pending.photoUrl}
            />
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm font-semibold text-error">
              {error}
            </div>
          ) : null}

          {state === "success" ? (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary-fixed/30 px-4 py-3 text-sm font-semibold text-primary">
              {langText("Account created. Please login.", "खाते तयार झाले. कृपया लॉगिन करा.")}
            </div>
          ) : null}

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={state === "submitting" || state === "success"}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-container px-6 py-4 text-base font-bold text-white shadow-xl transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {state === "submitting"
                ? langText("Verifying...", "पडताळणी होत आहे...")
                : langText("Verify and Continue", "पडताळणी करून पुढे जा")}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={handleChangeEmail}
              className="w-full rounded-2xl border border-outline-variant px-6 py-4 text-sm font-bold text-primary transition hover:bg-surface-container-low"
            >
              {langText("Change email address", "ईमेल पत्ता बदला")}
            </button>
            <Link href="/login" className="block text-sm font-semibold text-on-surface-variant hover:text-primary">
              {langText("Back to login", "लॉगिनवर परत जा")}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
