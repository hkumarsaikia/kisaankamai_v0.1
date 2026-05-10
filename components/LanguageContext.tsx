"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildTranslationFallbackCacheKey,
  GOOGLE_TRANSLATE_FALLBACK_PATH,
  normalizeSingleLanguageSource,
  type SingleLanguageTextOptions,
  type TranslationFallbackPayload,
} from "@/lib/i18n.fallback";
import {
  DEFAULT_LANGUAGE,
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
  text: (value: LocalizedText | string, options?: SingleLanguageTextOptions) => string;
  translateText: (value: string, options?: SingleLanguageTextOptions) => Promise<string>;
  langText: {
    (value: LocalizedText): string;
    (enText: string, mrText?: string): string;
  };
}

const STORAGE_KEY = "kk_language";
const LANGUAGE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
const translationFallbackCache = new Map<string, string>();
const translationFallbackRequests = new Map<string, Promise<string>>();
const DEVANAGARI_REGEX = /\p{Script=Devanagari}/u;
const LATIN_REGEX = /[A-Za-z]/;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function applyLanguageToDocument(language: Language) {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  document.documentElement.classList.toggle("lang-mr", language === "mr");
  document.documentElement.classList.toggle("lang-en", language === "en");
}

function persistLanguagePreference(language: Language) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Ignore storage access issues and keep the in-memory language.
  }

  document.cookie = `${STORAGE_KEY}=${language}; Path=/; Max-Age=${LANGUAGE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

function readInitialLanguage(initialLanguage?: Language): Language {
  if (initialLanguage === "en" || initialLanguage === "mr") {
    return initialLanguage;
  }

  if (typeof document !== "undefined") {
    const bootLanguage = document.documentElement.dataset.language;
    if (bootLanguage === "en" || bootLanguage === "mr") {
      return bootLanguage;
    }
  }

  if (typeof localStorage !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "mr") {
        return saved;
      }
    } catch {
      // Ignore storage access issues and keep the default language.
    }
  }

  return DEFAULT_LANGUAGE;
}

function containsDevanagari(value: string) {
  return DEVANAGARI_REGEX.test(value);
}

function containsLatin(value: string) {
  return LATIN_REGEX.test(value);
}

function inferSourceLanguage(text: string, explicitSourceLanguage?: Language): Language {
  const normalizedSourceLanguage = normalizeSingleLanguageSource(explicitSourceLanguage);
  if (explicitSourceLanguage) {
    return normalizedSourceLanguage;
  }

  const trimmedText = text.trim();
  if (!trimmedText) {
    return normalizedSourceLanguage;
  }

  if (containsDevanagari(trimmedText) && !containsLatin(trimmedText)) {
    return "mr";
  }

  return normalizedSourceLanguage;
}

function extractInlineLocalizedText(value: string): LocalizedText | null {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return null;
  }

  const delimiterCandidates = [" / ", " | ", "\n"];

  for (const delimiter of delimiterCandidates) {
    const segments = normalizedValue
      .split(delimiter)
      .map((segment) => segment.trim())
      .filter(Boolean);

    if (segments.length !== 2) {
      continue;
    }

    const [firstSegment, secondSegment] = segments;
    const firstHasDevanagari = containsDevanagari(firstSegment);
    const secondHasDevanagari = containsDevanagari(secondSegment);
    const firstHasLatin = containsLatin(firstSegment);
    const secondHasLatin = containsLatin(secondSegment);

    if (firstHasDevanagari && !secondHasDevanagari && secondHasLatin) {
      return { en: secondSegment, mr: firstSegment };
    }

    if (secondHasDevanagari && !firstHasDevanagari && firstHasLatin) {
      return { en: firstSegment, mr: secondSegment };
    }
  }

  return null;
}

function buildSingleLanguagePayload(
  text: string,
  targetLanguage: Language,
  options?: SingleLanguageTextOptions
): TranslationFallbackPayload {
  return {
    text,
    sourceLanguage: inferSourceLanguage(text, options?.sourceLanguage),
    targetLanguage,
    cacheKey: options?.cacheKey,
  };
}

function readCachedTranslation(payload: TranslationFallbackPayload) {
  return translationFallbackCache.get(buildTranslationFallbackCacheKey(payload));
}

async function requestTranslationFallback(payload: TranslationFallbackPayload) {
  if (!payload.text.trim() || payload.sourceLanguage === payload.targetLanguage) {
    return payload.text;
  }

  const cacheKey = buildTranslationFallbackCacheKey(payload);
  const cachedTranslation = translationFallbackCache.get(cacheKey);
  if (cachedTranslation) {
    return cachedTranslation;
  }

  const pendingRequest = translationFallbackRequests.get(cacheKey);
  if (pendingRequest) {
    return pendingRequest;
  }

  const requestPromise = fetch(GOOGLE_TRANSLATE_FALLBACK_PATH, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then(async (response) => {
      const result = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            translation?: string;
            error?: string;
          }
        | null;

      if (!response.ok) {
        throw new Error(result?.error || "Translation fallback request failed.");
      }

      const translation = result?.translation || payload.text;
      translationFallbackCache.set(cacheKey, translation);
      return translation;
    })
    .catch(() => payload.text)
    .finally(() => {
      translationFallbackRequests.delete(cacheKey);
    });

  translationFallbackRequests.set(cacheKey, requestPromise);
  return requestPromise;
}

export function LanguageProvider({ children, initialLanguage }: { children: React.ReactNode; initialLanguage?: Language }) {
  const [, setTranslationCacheVersion] = useState(0);
  const [language, setLanguage] = useState<Language>(() => readInitialLanguage(initialLanguage));

  useEffect(() => {
    applyLanguageToDocument(language);
    persistLanguagePreference(language);
  }, [language]);

  const handleSetLanguage = (nextLanguage: Language) => {
    applyLanguageToDocument(nextLanguage);
    persistLanguagePreference(nextLanguage);
    setLanguage(nextLanguage);
  };

  const ensureTranslation = (payload: TranslationFallbackPayload) => {
    if (!payload.text.trim() || payload.sourceLanguage === payload.targetLanguage) {
      return;
    }

    const cacheKey = buildTranslationFallbackCacheKey(payload);
    if (translationFallbackCache.has(cacheKey) || translationFallbackRequests.has(cacheKey)) {
      return;
    }

    requestTranslationFallback(payload).then((translatedValue) => {
      if (translatedValue !== payload.text) {
        setTranslationCacheVersion((current) => current + 1);
      }
    });
  };

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage: handleSetLanguage,
      t: (key, params) => translate(language, key, params),
      text: (value, options) => {
        if (typeof value === "object") {
          return pickLocalizedText(value, language);
        }

        const inlineLocalizedText = extractInlineLocalizedText(value);
        if (inlineLocalizedText) {
          return pickLocalizedText(inlineLocalizedText, language);
        }

        const payload = buildSingleLanguagePayload(value, language, options);
        const cachedTranslation = readCachedTranslation(payload);
        if (cachedTranslation) {
          return cachedTranslation;
        }

        ensureTranslation(payload);
        return value;
      },
      translateText: (value, options) => {
        const inlineLocalizedText = extractInlineLocalizedText(value);
        if (inlineLocalizedText) {
          return Promise.resolve(pickLocalizedText(inlineLocalizedText, language));
        }

        return requestTranslationFallback(buildSingleLanguagePayload(value, language, options));
      },
      langText: (valueOrEnText: LocalizedText | string, mrText?: string) => {
        if (typeof valueOrEnText === "object") {
          return pickLocalizedText(valueOrEnText, language);
        }

        if (typeof mrText === "string") {
          return language === "mr" ? mrText : valueOrEnText;
        }

        const inlineLocalizedText = extractInlineLocalizedText(valueOrEnText);
        if (inlineLocalizedText) {
          return pickLocalizedText(inlineLocalizedText, language);
        }

        const payload = buildSingleLanguagePayload(valueOrEnText, language);
        const cachedTranslation = readCachedTranslation(payload);
        if (cachedTranslation) {
          return cachedTranslation;
        }

        ensureTranslation(payload);
        return valueOrEnText;
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

export function useLocalizedString(
  value: LocalizedText | string,
  options?: SingleLanguageTextOptions
) {
  const { language, text, translateText } = useLanguage();
  const sourceLanguage = normalizeSingleLanguageSource(options?.sourceLanguage);
  const cacheKey = options?.cacheKey;
  const immediateValue = typeof value === "object" ? text(value) : text(value, { sourceLanguage, cacheKey });
  const [resolvedValue, setResolvedValue] = useState(immediateValue);

  useEffect(() => {
    setResolvedValue(immediateValue);

    if (typeof value !== "string" || !value.trim() || sourceLanguage === language) {
      return;
    }

    let cancelled = false;

    translateText(value, { sourceLanguage, cacheKey }).then((nextValue) => {
      if (!cancelled) {
        setResolvedValue(nextValue);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, immediateValue, language, sourceLanguage, translateText, value]);

  return resolvedValue;
}
