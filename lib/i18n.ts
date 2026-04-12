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
  return language === "mr" ? value.mr || value.en : value.en;
}
