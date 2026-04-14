import { enMessages, mrMessages } from "@/lib/i18n.messages";

export type Language = "en" | "mr";

export interface LocalizedValue<T> {
  en: T;
  mr: T;
}

export type LocalizedText = LocalizedValue<string>;

export function localizedText(en: string, mr: string): LocalizedText {
  return { en, mr };
}

export function pickLocalizedValue<T>(value: LocalizedValue<T>, language: Language): T {
  return language === "mr" ? value.mr : value.en;
}

export function pickLocalizedText(value: LocalizedText, language: Language): string {
  return pickLocalizedValue(value, language);
}

export const messages = {
  en: enMessages,
  mr: mrMessages,
} as const;

export type TranslationKey = keyof typeof enMessages;
export type TranslationParams = Record<string, string | number>;

function interpolate(template: string, params?: TranslationParams) {
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce((result, [name, value]) => {
    return result.replaceAll(`{${name}}`, String(value));
  }, template);
}

export function translate(language: Language, key: TranslationKey, params?: TranslationParams) {
  return interpolate(messages[language][key], params);
}
