import "server-only";

import {
  buildTranslationFallbackCacheKey,
  type TranslationFallbackPayload,
  type TranslationFallbackResult,
} from "@/lib/i18n.fallback";

const GOOGLE_TRANSLATE_ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

const translationFallbackGlobals = globalThis as typeof globalThis & {
  __kkGoogleTranslationCache?: Map<string, string>;
};

if (!translationFallbackGlobals.__kkGoogleTranslationCache) {
  translationFallbackGlobals.__kkGoogleTranslationCache = new Map();
}

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'");
}

function getGoogleTranslateApiKey() {
  return (
    process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY ||
    process.env.GOOGLE_TRANSLATE_API_KEY ||
    process.env.GOOGLE_CLOUD_API_KEY ||
    ""
  ).trim();
}

export function isGoogleTranslateFallbackConfigured() {
  return Boolean(getGoogleTranslateApiKey());
}

export async function translateWithGoogleFallback(
  request: TranslationFallbackPayload
): Promise<TranslationFallbackResult> {
  const text = request.text.trim();
  if (!text) {
    return {
      ok: true,
      translation: request.text,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      provider: "disabled",
      skipped: true,
      reason: "empty-text",
    };
  }

  if (request.sourceLanguage === request.targetLanguage) {
    return {
      ok: true,
      translation: text,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      provider: "disabled",
      skipped: true,
      reason: "same-language",
    };
  }

  const cacheKey = buildTranslationFallbackCacheKey({
    ...request,
    text,
  });
  const cachedTranslation = translationFallbackGlobals.__kkGoogleTranslationCache?.get(cacheKey);
  if (cachedTranslation) {
    return {
      ok: true,
      translation: cachedTranslation,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      provider: "google-cloud-translate",
    };
  }

  const apiKey = getGoogleTranslateApiKey();
  if (!apiKey) {
    return {
      ok: true,
      translation: text,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      provider: "disabled",
      skipped: true,
      reason: "missing-api-key",
    };
  }

  const response = await fetch(`${GOOGLE_TRANSLATE_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      source: request.sourceLanguage,
      target: request.targetLanguage,
      format: "text",
    }),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        data?: {
          translations?: Array<{
            translatedText?: string;
          }>;
        };
        error?: {
          message?: string;
        };
      }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Google Cloud Translate request failed.");
  }

  const translatedText = payload?.data?.translations?.[0]?.translatedText;
  if (!translatedText) {
    throw new Error("Google Cloud Translate returned an empty translation.");
  }

  const translation = decodeHtmlEntities(translatedText);
  translationFallbackGlobals.__kkGoogleTranslationCache?.set(cacheKey, translation);

  return {
    ok: true,
    translation,
    sourceLanguage: request.sourceLanguage,
    targetLanguage: request.targetLanguage,
    provider: "google-cloud-translate",
  };
}
