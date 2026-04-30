"use client";

import { useLanguage } from "@/components/LanguageContext";

export function LocalizedText({ en, mr }: { en: string; mr: string }) {
  const { langText } = useLanguage();
  return <>{langText(en, mr)}</>;
}
