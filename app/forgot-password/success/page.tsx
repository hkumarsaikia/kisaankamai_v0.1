"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";

const tractorImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBD0_DGEYSFzGN8Nm_1mucPl_vqNMUQ_rhFe87O2_ovc7WqPZIt7nVMhzSsLFeQDwSHvbNl0k8QiWD1F5Pb_ll1X8Pr35auvPBCPVN6OaCPnAVRU2bFfz5oc2gby7cgRbQ0dajB_4YVyvZLtgSB1iPqBYvD9095M36O5L_yDz9iGZDp4SC9MMHB_otBKVdRGA0wC4J6bEElyvMGct3NdOByut9WbfLBNX78EC_Y-R61u3G3L3DXTeSWbcPiyXVp0KaJvomjVLghEX24";

export default function PasswordResetSuccessPage() {
  const { langText, text } = useLanguage();

  return (
    <div className="min-h-screen bg-background font-body text-on-background flex flex-col">
      <main className="relative flex flex-grow items-center justify-center overflow-hidden px-6 py-28">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary-container blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary-container blur-3xl" />
        </div>

        <section className="relative z-10 w-full max-w-2xl space-y-8">
          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-8 text-center shadow-xl md:p-12">
            <div className="mb-8 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-container/10 text-primary-container">
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

          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest/80 p-8 text-center shadow-lg backdrop-blur-sm md:p-12">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container/5 text-primary-container">
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

        <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-1/3 opacity-20 grayscale lg:block">
          <img alt="Authentic Indian agriculture" className="h-full w-full object-cover" src={tractorImage} />
        </div>
      </main>
    </div>
  );
}
