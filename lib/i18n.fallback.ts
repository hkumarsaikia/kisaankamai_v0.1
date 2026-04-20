import type { Language } from "@/lib/i18n";

export const GOOGLE_TRANSLATE_FALLBACK_PATH = "/api/i18n/fallback";
export const DEFAULT_SINGLE_LANGUAGE_SOURCE: Language = "en";

export interface SingleLanguageTextOptions {
  sourceLanguage?: Language;
  cacheKey?: string;
}

export interface TranslationFallbackPayload {
  text: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  cacheKey?: string;
}

export interface TranslationFallbackResult {
  ok: boolean;
  translation: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  provider: "google-cloud-translate" | "disabled";
  skipped?: boolean;
  reason?: "same-language" | "missing-api-key" | "empty-text";
}

export function normalizeSingleLanguageSource(sourceLanguage?: Language): Language {
  return sourceLanguage || DEFAULT_SINGLE_LANGUAGE_SOURCE;
}

export function buildTranslationFallbackCacheKey({
  text,
  sourceLanguage,
  targetLanguage,
  cacheKey,
}: TranslationFallbackPayload) {
  return cacheKey
    ? `${sourceLanguage}:${targetLanguage}:${cacheKey}`
    : `${sourceLanguage}:${targetLanguage}:${text}`;
}
