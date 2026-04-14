import { cookies } from "next/headers";
import type { Locale } from "@/lib/types";

export const LOCALE_COOKIE = "kk_prod_locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(LOCALE_COOKIE)?.value === "mr" ? "mr" : "en";
}
