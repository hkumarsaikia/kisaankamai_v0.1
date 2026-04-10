"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, LocalizedText, pickLocalizedText } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  langText: {
    (enText: string, mrText?: string): string;
    (value: LocalizedText): string;
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("mr");

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem("kk_language") as Language;
    if (saved === "en" || saved === "mr") {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
  }, [language]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("kk_language", lang);
  };

  const langText: LanguageContextType["langText"] = (value: string | LocalizedText, mrText?: string) => {
    if (typeof value === "object") {
      return pickLocalizedText(value, language);
    }

    return language === "mr" ? mrText || value : value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, langText }}>
      {children}
      {/* Optional global body class toggle for specific css rules */}
      {language === "mr" && <style>{`body { font-family: var(--font-mukta), sans-serif; }`}</style>}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
