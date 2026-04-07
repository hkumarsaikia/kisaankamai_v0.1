"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "mr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  langText: (enText: string, mrText: string) => string;
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

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("kk_language", lang);
  };

  const langText = (enText: string, mrText: string) => {
    return language === "mr" ? mrText || enText : enText;
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
