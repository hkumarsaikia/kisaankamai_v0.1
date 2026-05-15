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

const FORGOT_PASSWORD_FIELD_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBtrpKpOlqcEms0TuLR2Z7Adfex6Rwh8IaJ8xWBtdGG3YhePE9AVa-dtcDZ1bnpsPZBumNmwZizT2jgkh1LXEQmgn5qG6TAqPfJeLL11hJ_bqN_Wy6qqRs4ciq-TKSLiKt4OUH7SWZPwv3kRRUluVn5nzxOBtDMXpbToSjH5QtQbMovjt9qxzA0eARg25_qL_zVqKqAR-JPsjPU5xQP537hR3lELCbdQwXsbuuBLWU8WBCx9r3-6fweDb0GWrn79gLC82XDEfIgo1Mp";
const FORGOT_PASSWORD_FIELD_IMAGE_DESCRIPTION =
  "A cinematic, high-resolution photograph of a sun-drenched Indian agricultural field, likely sugarcane or tall wheat, glowing in the warm golden hour light. The mood is calm, trustworthy, and premium, reflecting a modern agritech brand identity.";

type PasswordResetLookupResponse = {
  ok?: boolean;
  error?: string;
  phoneE164?: string;
  maskedPhone?: string;
};

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { langText } = useLanguage();
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
              "We could not start reset for that registered mobile number.",
              "त्या नोंदणीकृत मोबाईल नंबरसाठी रीसेट सुरू करता आला नाही."
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
    <main className="kk-auth-page flex min-h-[calc(100svh-5rem)] flex-grow flex-col bg-background pt-20 text-on-background md:flex-row">
      <section className="relative hidden overflow-hidden bg-surface-container-highest md:flex md:w-1/2 lg:w-7/12">
        <div className="absolute inset-0 z-0">
          <img
            alt="Cinematic shot of a sun-drenched agricultural field."
            className="h-full w-full object-cover object-center"
            data-alt={FORGOT_PASSWORD_FIELD_IMAGE_DESCRIPTION}
            src={FORGOT_PASSWORD_FIELD_IMAGE_URL}
          />
          <div className="kk-dark-image-overlay bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 mt-auto p-12 text-white">
          <div className="mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              agriculture
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight">Kisan Kamai</h1>
          </div>
          <p className="max-w-md text-lg leading-relaxed opacity-90">
            {langText(
              "Rooted in Trust. Empowering rural agriculture with modern equipment access.",
              "विश्वासावर आधारित. आधुनिक उपकरणांसह शेतीला सक्षम करणे."
            )}
          </p>
        </div>
      </section>

      <section className="relative z-10 flex w-full items-center justify-center bg-background/50 p-6 sm:p-12 md:w-1/2 lg:w-5/12">
        <div className="kk-auth-card flex w-full max-w-md flex-col rounded-3xl border border-white/40 bg-white/70 backdrop-blur-md p-10 shadow-[0_8px_32px_0_rgba(0,37,26,0.08)] transition-[background-color,border-color,box-shadow,transform] duration-300 dark:border-slate-800 dark:bg-slate-900/80 sm:p-12">
          <Link
            className="mb-10 inline-flex min-h-9 w-max items-center rounded-full pr-2 text-xs font-label font-medium uppercase tracking-wider text-on-surface-variant/70 transition-[background-color,border-color,box-shadow,transform] duration-300 hover:text-primary"
            href="/login"
          >
            <span className="material-symbols-outlined mr-1.5 text-base opacity-70">arrow_back</span>
            {langText("Back to Sign In", "साइन इनकडे परत जा")}
          </Link>

          <div className="mb-8">
            <h2 className="mb-3 font-display text-4xl font-extrabold leading-none tracking-tight text-primary">
              {langText("Reset your password", "पासवर्ड रीसेट करा")}
            </h2>
            <h3 className="font-display text-lg font-medium text-secondary/80 mb-6 tracking-wide">
              {langText("Secure account recovery", "पासवर्ड रिसेट करा")}
            </h3>
            <p className="max-w-[90%] text-sm leading-relaxed text-on-surface-variant">
              {langText(
                "Enter your registered mobile number to continue the secure reset.",
                "सुरक्षित रीसेट सुरू ठेवण्यासाठी तुमचा नोंदणीकृत मोबाईल नंबर प्रविष्ट करा."
              )}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block space-y-2" htmlFor="contact-input">
              <span className="mb-1 block text-xs font-label font-bold uppercase tracking-widest text-on-surface/60">
                {langText("Mobile Number", "मोबाईल नंबर")}
              </span>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-outline-variant dark:text-emerald-200">phone_iphone</span>
                </div>
                <input
                  className="block w-full rounded-xl border border-outline-variant/40 bg-white/50 py-4 pl-10 pr-4 font-body text-on-surface shadow-sm transition-[background-color,border-color,box-shadow,transform] duration-300 placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:bg-slate-950 dark:text-white"
	                  id="contact-input"
	                  name="contact-input"
	                  autoComplete="tel"
	                  placeholder={langText("Registered mobile number", "नोंदणीकृत मोबाईल नंबर")}
                  type="tel"
                  value={identifier}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                    if (error) setError("");
                  }}
                />
              </div>
            </label>

            {error ? <FormNotice tone="error">{error}</FormNotice> : null}

            <button
              className="kk-flow-button mt-10 flex w-full items-center justify-center rounded-xl bg-primary px-6 py-4 text-base font-label font-semibold text-on-primary shadow-[0_4px_14px_0_rgba(0,37,26,0.3)] transition-[background-color,border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_0_rgba(0,37,26,0.4)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:translate-y-0"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
	              {isSubmitting ? langText("Checking account…", "खाते तपासत आहे…") : langText("Send Reset Code", "रीसेट कोड पाठवा")}
              <span className="material-symbols-outlined ml-3 text-sm">arrow_forward_ios</span>
            </button>
          </form>

          <div className="mt-12 border-t border-outline-variant/20 pt-8 text-center">
            <p className="text-sm text-on-surface-variant">
              {langText("Need help?", "मदत हवी आहे?")}{" "}
              <Link className="font-semibold text-primary underline decoration-primary/20 underline-offset-4 transition-colors hover:text-secondary" href="/support">
                {langText("Contact Support", "सपोर्टशी संपर्क साधा")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
