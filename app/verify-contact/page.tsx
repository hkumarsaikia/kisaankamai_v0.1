"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";

export default function VerifyContactPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="kk-glass w-full max-w-2xl p-8 lg:p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <span className="material-symbols-outlined text-4xl">verified</span>
          </div>
          <h1 className="text-3xl font-black text-primary dark:text-emerald-50">
            {t("verify-contact.verification_disabled_for_local_testing")}
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">
            {t("verify-contact.otp_phone_verification_and_email_verification_are_bypassed_in_this_local_data_phase")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/profile-selection" className="rounded-2xl bg-primary px-6 py-4 font-black text-white dark:bg-emerald-700">
              {t("verify-contact.go_to_profile_selection")}
            </Link>
            <Link href="/complete-profile" className="rounded-2xl border border-outline-variant px-6 py-4 font-black text-primary dark:text-emerald-300">
              {t("verify-contact.edit_profile")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

