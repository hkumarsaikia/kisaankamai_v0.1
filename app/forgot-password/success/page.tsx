"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { assetPath } from "@/lib/site";

export default function PasswordResetSuccessPage() {
  const { langText, text } = useLanguage();

  return (
    <div className="kk-auth-page flex flex-col bg-background font-body text-on-background">
      <main className="relative flex flex-grow items-center justify-center overflow-hidden px-6 py-28">
        <div className="absolute inset-0 z-0">
          <img
            alt="Farm equipment ready in a green field"
            className="h-full w-full object-cover"
            src={assetPath("/assets/generated/modern_farm_tech.webp")}
          />
          <div className="kk-dark-image-overlay" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/88 via-white/72 to-primary-container/20 backdrop-blur-[2px] dark:from-surface/88 dark:via-surface/78 dark:to-primary-container/25" />
        </div>

        <section className="relative z-10 w-full max-w-2xl space-y-8">
          <div className="kk-auth-card bg-white/86 p-8 text-center shadow-2xl backdrop-blur-2xl dark:bg-surface-container-lowest/88 md:p-12">
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-container/10 text-primary">
                <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            </div>
            <h1 className="mb-4 font-headline text-3xl font-extrabold tracking-tight text-primary">
              {langText("Password Reset Successful", "पासवर्ड यशस्वीरित्या बदलला")}
            </h1>
            <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-on-surface-variant">
              {langText(
                "Your password has been updated. You can now sign in with your new password.",
                "तुमचा पासवर्ड अपडेट करण्यात आला आहे. आता तुम्ही नवीन पासवर्ड वापरून साइन इन करू शकता."
              )}
            </p>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary-container px-8 py-4 font-extrabold text-white shadow-lg shadow-primary-container/20 transition-all hover:bg-primary active:scale-95 sm:w-auto"
            >
              {langText("Back to Login", "लॉगिनवर परत जा")}
            </Link>
          </div>

          <div className="kk-auth-card bg-white/76 p-8 text-center shadow-xl backdrop-blur-2xl dark:bg-surface-container-lowest/78 md:p-12">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/10 text-primary">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
            </div>
            <h2 className="mb-3 font-headline text-2xl font-bold tracking-normal text-primary">
              {langText("Your account is protected", "तुमचे खाते आता सुरक्षित आहे")}
            </h2>
            <p className="mx-auto max-w-md text-base leading-loose text-on-surface-variant">
              {text("Keep this password private and contact support immediately if you did not request this reset.", {
                cacheKey: "forgot-password.success.security-note",
              })}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
