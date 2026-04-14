"use client";

import type { Locale } from "@/lib/types";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const next = locale === "en" ? "mr" : "en";

  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = `kk_prod_locale=${next}; path=/; max-age=31536000; samesite=lax`;
        window.location.reload();
      }}
      className="rounded-full border border-slate-300 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-brand-500 hover:text-brand-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-400 dark:hover:text-brand-300"
    >
      {locale === "en" ? "मराठी" : "English"}
    </button>
  );
}
