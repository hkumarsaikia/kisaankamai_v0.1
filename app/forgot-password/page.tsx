"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { FormNotice } from "@/components/forms/FormKit";
import { PHONE_RESET_OTP_ENABLED } from "@/lib/auth-capabilities";
import {
  clearPasswordResetStorage,
  RESET_IDENTIFIER_KEY,
  RESET_MASKED_PHONE_KEY,
  RESET_PHONE_E164_KEY,
  setResetStorageItem,
} from "@/components/auth/password-reset-storage";

const fieldImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD_KwzX0B_B6HuECBqVqnkY_--Z7oQ05aWN_4YWcakLnSg3H9G_SNmYEpfzo6Dn5oZoZsOuHGNXVjHQbSXhRZo77C2GB40pdUdHfGPhXRbPxrvi26ZcUOUjyO_aBaetrsZCE-2umNTP-E9PE_k_m6jVj3eGcmw6ic2FjUA1RJpU8qVnhyD4uFk3fdQCiwWQA6j_-sV6gU3v8D999U3P0MXhEXIuPz8jed9mTgYtyxux0p_bmtjgOQe3RGinttMll9cOxI3MTlw92uI";

type PasswordResetLookupResponse = {
  ok?: boolean;
  error?: string;
  phoneE164?: string;
  maskedPhone?: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { langText, text } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resetUnavailableMessage = langText(
    "Password reset by OTP is unavailable in this deployment because Firebase phone authentication is not configured.",
    "या डिप्लॉयमेंटमध्ये Firebase फोन प्रमाणीकरण कॉन्फिगर नसल्यामुळे OTP द्वारे पासवर्ड रीसेट उपलब्ध नाही."
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setError(langText("Enter your registered mobile number.", "तुमचा नोंदणीकृत मोबाईल नंबर टाका."));
      return;
    }

    if (!PHONE_RESET_OTP_ENABLED) {
      setError(resetUnavailableMessage);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: trimmedIdentifier,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as PasswordResetLookupResponse;

      if (!response.ok || payload.ok === false || !payload.phoneE164 || !payload.maskedPhone) {
        throw new Error(
          payload.error ||
            langText(
              "We could not start reset for that mobile number.",
              "त्या मोबाईल नंबरसाठी रीसेट सुरू करता आला नाही."
            )
        );
      }

      clearPasswordResetStorage();

      const writesSucceeded = [
        setResetStorageItem(RESET_IDENTIFIER_KEY, trimmedIdentifier),
        setResetStorageItem(RESET_PHONE_E164_KEY, payload.phoneE164),
        setResetStorageItem(RESET_MASKED_PHONE_KEY, payload.maskedPhone),
      ];

      if (writesSucceeded.includes(false)) {
        throw new Error(
          langText(
            "Your browser blocked temporary reset storage. Please allow site storage and try again.",
            "तुमच्या ब्राउझरने तात्पुरते रीसेट स्टोरेज ब्लॉक केले. साइट स्टोरेज परवानगी द्या आणि पुन्हा प्रयत्न करा."
          )
        );
      }

      router.push("/forgot-password/verify-otp");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : langText("Could not start password reset.", "पासवर्ड रीसेट सुरू करता आला नाही.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="kk-auth-page flex flex-1 pt-24">
      <section className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-surface-container-high md:flex">
        <div
          className="absolute inset-0 hidden bg-cover bg-center md:block"
          style={{
            backgroundImage: `url("${fieldImage}")`,
          }}
        >
          <div className="kk-dark-image-overlay" />
        </div>
        <div className="kk-auth-card relative z-10 mx-6 max-w-md bg-white/82 p-10 text-center shadow-2xl backdrop-blur-2xl dark:bg-surface-container-lowest/82">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-container/20 text-primary">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock_reset
            </span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-primary">
            {text("Secure Access", { cacheKey: "forgot-password.hero-title" })}
          </h2>
          <p className="mt-3 leading-relaxed text-on-surface-variant">
            {text("Reset access through the registered mobile number linked to your Kisan Kamai account.", {
              cacheKey: "forgot-password.hero-body",
            })}
          </p>
        </div>
      </section>

      <section className="relative flex w-full items-center justify-center overflow-hidden bg-surface-container-low px-6 py-12 md:w-1/2">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm md:hidden"
          style={{
            backgroundImage: `url("${fieldImage}")`,
          }}
        />
        <div className="kk-auth-card relative z-10 w-full max-w-md bg-white/86 p-8 shadow-2xl backdrop-blur-2xl dark:bg-surface-container-lowest/86 md:p-12">
          <div className="mb-10 text-center">
            <div className="mb-6 flex justify-center md:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg">
                <span className="material-symbols-outlined text-2xl text-on-primary">agriculture</span>
              </div>
            </div>
            <h1 className="font-headline text-3xl font-extrabold leading-tight text-on-surface">
              {langText("Forgot Password", "पासवर्ड विसरलात")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
              {PHONE_RESET_OTP_ENABLED
                ? langText(
                    "Enter your registered mobile number. We will send the reset OTP to that number before allowing a password change.",
                    "तुमचा नोंदणीकृत मोबाईल नंबर टाका. पासवर्ड बदलण्यापूर्वी त्या नंबरवर रीसेट ओटीपी पाठवला जाईल."
                  )
                : resetUnavailableMessage}
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block px-1 text-sm font-semibold text-on-surface">
                {langText("Mobile Number", "मोबाईल नंबर")}
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-outline transition-colors group-focus-within:text-primary">
                    contact_mail
                  </span>
                </div>
                <input
                  className="kk-auth-input block pl-12"
                  name="contact"
                  placeholder={langText("e.g. +91 90000 00000", "उदा. +९१ ९०००० ०००००")}
                  type="tel"
                  value={identifier}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                    setError("");
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {error ? <FormNotice tone="error">{error}</FormNotice> : null}
            {!PHONE_RESET_OTP_ENABLED && !error ? <FormNotice tone="error">{resetUnavailableMessage}</FormNotice> : null}

            <button
              className="kk-flow-button flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-br from-primary to-primary-container py-4 text-lg font-bold text-on-primary shadow-xl shadow-primary/10 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isSubmitting || !PHONE_RESET_OTP_ENABLED}
              data-loading={isSubmitting ? "true" : "false"}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
              <span>{isSubmitting ? langText("Checking account...", "खाते तपासत आहे...") : langText("Continue", "पुढे जा")}</span>
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </form>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-on-surface-variant">
              <span>{langText("Remember your password?", "तुमचा पासवर्ड आठवतोय?")}</span>
              <Link className="font-bold text-primary transition-all hover:underline" href="/login">
                {langText("Sign In", "साइन इन करा")}
              </Link>
            </div>
          </div>

          <div className="mt-16 border-t border-outline-variant/20 pt-8">
            <div className="flex items-center justify-center gap-1.5 rounded-full border border-secondary-container/20 bg-secondary-container/10 px-3 py-1">
              <span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">
                {langText("Reset uses your registered account contact", "रीसेट नोंदणीकृत खात्याच्या संपर्कावर आधारित आहे")}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
