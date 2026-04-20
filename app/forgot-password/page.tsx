"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { FormNotice } from "@/components/forms/FormKit";
import { PHONE_RESET_OTP_ENABLED } from "@/lib/auth-capabilities";
import {
  removeResetStorageItem,
  RESET_IDENTIFIER_KEY,
  RESET_VERIFIED_KEY,
  setResetStorageItem,
} from "@/components/auth/password-reset-storage";

const fieldImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD_KwzX0B_B6HuECBqVqnkY_--Z7oQ05aWN_4YWcakLnSg3H9G_SNmYEpfzo6Dn5oZoZsOuHGNXVjHQbSXhRZo77C2GB40pdUdHfGPhXRbPxrvi26ZcUOUjyO_aBaetrsZCE-2umNTP-E9PE_k_m6jVj3eGcmw6ic2FjUA1RJpU8qVnhyD4uFk3fdQCiwWQA6j_-sV6gU3v8D999U3P0MXhEXIuPz8jed9mTgYtyxux0p_bmtjgOQe3RGinttMll9cOxI3MTlw92uI";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { langText, text } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      setError(langText("Enter your registered mobile number or email.", "तुमचा नोंदणीकृत मोबाईल नंबर किंवा ईमेल टाका."));
      return;
    }

    if (!setResetStorageItem(RESET_IDENTIFIER_KEY, trimmedIdentifier)) {
      setError(
        langText(
          "Your browser is blocking temporary reset storage. Please allow site storage and try again.",
          "तुमचा ब्राउझर तात्पुरते रीसेट स्टोरेज ब्लॉक करत आहे. साइट स्टोरेज परवानगी द्या आणि पुन्हा प्रयत्न करा."
        )
      );
      return;
    }

    removeResetStorageItem(RESET_VERIFIED_KEY);
    router.push("/forgot-password/verify-otp");
  };

  return (
    <main className="flex min-h-[calc(100vh-12rem)] flex-1 pt-24">
      <section className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-surface-container-high md:flex">
        <div
          className="absolute inset-0 hidden bg-cover bg-center md:block"
          style={{
            backgroundImage: `url("${fieldImage}")`,
          }}
        >
          <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px]" />
        </div>
        <div className="relative z-10 mx-6 max-w-md rounded-3xl border border-white/50 bg-white/70 p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-container/20 text-primary">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock_reset
            </span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-primary">
            {text("Secure Access", { cacheKey: "forgot-password.hero-title" })}
          </h2>
          <p className="mt-3 leading-relaxed text-on-surface-variant">
            {text("Protecting your agricultural data with secure reset verification. Your trust is our greatest harvest.", {
              cacheKey: "forgot-password.hero-body",
            })}
          </p>
        </div>
      </section>

      <section className="flex w-full items-center justify-center bg-surface-container-low px-6 py-12 md:w-1/2">
        <div className="w-full max-w-md rounded-[2rem] bg-surface-container-lowest p-8 shadow-sm md:p-12">
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
                    "Enter your mobile number or email to continue the secure reset flow.",
                    "सुरक्षित रीसेट प्रक्रियेसाठी तुमचा मोबाईल नंबर किंवा ईमेल टाका."
                  )
                : langText(
                    "Enter your mobile number or email to review the secure reset steps.",
                    "सुरक्षित रीसेट प्रक्रियेच्या पुढील टप्प्यांसाठी तुमचा मोबाईल नंबर किंवा ईमेल टाका."
                  )}
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block px-1 text-sm font-semibold text-on-surface">
                {langText("Mobile Number or Email", "मोबाईल नंबर किंवा ईमेल")}
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="material-symbols-outlined text-outline transition-colors group-focus-within:text-primary">
                    contact_mail
                  </span>
                </div>
                <input
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 pl-12 text-on-surface shadow-sm transition-all placeholder:text-outline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  name="contact"
                  placeholder={langText("e.g. +91 90000 00000", "उदा. +९१ ९०००० ०००००")}
                  type="text"
                  value={identifier}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                    setError("");
                  }}
                />
              </div>
            </div>

            {error ? <FormNotice tone="error">{error}</FormNotice> : null}

            <button
              className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-br from-primary to-primary-container py-4 text-lg font-bold text-on-primary shadow-xl shadow-primary/10 transition-all hover:shadow-primary/20 active:scale-[0.98]"
              type="submit"
            >
              <span>{langText("Continue", "पुढे जा")}</span>
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
                {langText("Trusted by 50K+ Farmers", "५० हजारहून अधिक शेतकऱ्यांचा विश्वास")}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
