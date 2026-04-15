"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Language,
  LocalizedText,
  TranslationKey,
  TranslationParams,
  pickLocalizedText,
  translate,
} from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
  langText: {
    (value: LocalizedText): string;
    (enText: string, mrText?: string): string;
  };
}

const STORAGE_KEY = "kk_language";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function applyLanguageToDocument(language: Language) {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  document.documentElement.classList.toggle("lang-mr", language === "mr");
  document.documentElement.classList.toggle("lang-en", language === "en");
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof document !== "undefined") {
      const bootLanguage = document.documentElement.dataset.language;
      if (bootLanguage === "en" || bootLanguage === "mr") {
        return bootLanguage;
      }
    }

    return "mr";
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "mr") {
      setLanguage(saved);
      applyLanguageToDocument(saved);
      return;
    }

    applyLanguageToDocument(language);
  }, [language]);

  useEffect(() => {
    applyLanguageToDocument(language);
  }, [language]);

  const handleSetLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    localStorage.setItem(STORAGE_KEY, nextLanguage);
  };

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      t: (key, params) => translate(language, key, params),
      langText: (valueOrEnText: LocalizedText | string, mrText?: string) => {
        if (typeof valueOrEnText === "object") {
          return pickLocalizedText(valueOrEnText, language);
        }

        return language === "mr" ? mrText || valueOrEnText : valueOrEnText;
      },
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
