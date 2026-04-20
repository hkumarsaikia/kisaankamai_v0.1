"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";

export default function VerifyContactPage() {
  const { langText } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="kk-glass w-full max-w-2xl p-8 lg:p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <span className="material-symbols-outlined text-4xl">verified</span>
          </div>
          <h1 className="text-3xl font-black text-primary dark:text-emerald-50">
            {langText("Contact details ready", "संपर्क तपशील तयार आहेत")}
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">
            {langText(
              "Your account can continue now. Optional identity verification can be completed later from your profile once the backend flow is enabled.",
              "तुमचे खाते आता पुढे जाऊ शकते. बॅकएंड पडताळणी सुरू झाल्यावर प्रोफाइलमधून ऐच्छिक ओळख पडताळणी नंतर पूर्ण करता येईल."
            )}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/profile-selection" className="rounded-2xl bg-primary px-6 py-4 font-black text-white dark:bg-emerald-700">
              {langText("Go to profile selection", "प्रोफाइल निवडीकडे जा")}
            </Link>
            <Link href="/complete-profile" className="rounded-2xl border border-outline-variant px-6 py-4 font-black text-primary dark:text-emerald-300">
              {langText("Edit profile", "प्रोफाइल संपादित करा")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
