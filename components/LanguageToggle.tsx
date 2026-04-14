"use client";

import { useLanguage } from "@/components/LanguageContext";

type LanguageToggleProps = {
  className?: string;
  compact?: boolean;
};

export function LanguageToggle({ className = "", compact = false }: LanguageToggleProps) {
  const { language, setLanguage, t } = useLanguage();
  const buttonPadding = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <div
      className={`inline-flex items-center rounded-full border border-outline-variant bg-surface-container-lowest p-1 text-on-surface shadow-sm backdrop-blur ${className}`}
      role="group"
      aria-label={t("header.menu.profiles")}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`${buttonPadding} rounded-full font-bold transition-colors ${
          language === "en"
            ? "bg-primary text-white dark:bg-emerald-600"
            : "text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-emerald-200"
        }`}
      >
        {t("language.english")}
      </button>
      <button
        type="button"
        onClick={() => setLanguage("mr")}
        className={`${buttonPadding} rounded-full font-bold transition-colors ${
          language === "mr"
            ? "bg-primary text-white dark:bg-emerald-600"
            : "text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-emerald-200"
        }`}
      >
        {t("language.marathi")}
      </button>
    </div>
  );
}
