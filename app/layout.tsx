import type { Metadata } from "next";
import { Manrope, Inter, Mukta } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import { AuthProvider } from "@/components/AuthContext";
import { BackToTop } from "@/components/BackToTop";
import { DepthMotion } from "@/components/DepthMotion";
import { NavigationTransitionProvider } from "@/components/NavigationTransitionProvider";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { SingleLanguageRuntime } from "@/components/SingleLanguageRuntime";
import { SiteChrome } from "@/components/SiteChrome";
import { DEFAULT_LANGUAGE, type Language } from "@/lib/i18n";
import type { LocalSession } from "@/lib/local-data/types";
import { DEFAULT_SHARE_DESCRIPTION, getDefaultShareImageUrl, getMetadataBaseUrl, SITE_NAME } from "@/lib/site-metadata";
import { Suspense } from "react";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false });
const mukta = Mukta({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "devanagari"],
  variable: "--font-mukta",
  display: "swap",
});
const LANGUAGE_COOKIE_NAME = "kk_language";
const SESSION_COOKIE_NAME = "kisan_kamai_session";
const materialSymbolIconNames = [
  "account_balance",
  "account_balance_wallet",
  "account_circle",
  "add",
  "add_a_photo",
  "add_circle",
  "add_photo_alternate",
  "agriculture",
  "arrow_back",
  "arrow_forward",
  "arrow_forward_ios",
  "arrow_right",
  "arrow_upward",
  "assignment_turned_in",
  "badge",
  "block",
  "bolt",
  "bookmark",
  "build",
  "business",
  "calendar_month",
  "calendar_today",
  "call",
  "chat",
  "check",
  "check_circle",
  "chevron_left",
  "chevron_right",
  "close",
  "contact_phone",
  "contact_support",
  "currency_rupee",
  "dark_mode",
  "dashboard",
  "delete",
  "description",
  "directions_car",
  "distance",
  "done",
  "done_all",
  "eco",
  "edit",
  "edit_calendar",
  "edit_document",
  "engineering",
  "error",
  "event",
  "event_available",
  "event_note",
  "expand_less",
  "expand_more",
  "explore",
  "fact_check",
  "favorite",
  "favorite_border",
  "filter_list",
  "forum",
  "foundation",
  "gavel",
  "gpp_maybe",
  "grid_view",
  "groups",
  "handshake",
  "help_center",
  "history",
  "home",
  "image",
  "imagesmode",
  "info",
  "integration_instructions",
  "inventory",
  "inventory_2",
  "language",
  "light_mode",
  "lightbulb",
  "local_shipping",
  "location",
  "location_on",
  "lock",
  "lock_reset",
  "login",
  "logout",
  "mail",
  "map",
  "menu",
  "mist",
  "near_me",
  "notifications",
  "open_in_new",
  "paid",
  "payment",
  "payments",
  "person",
  "person_off",
  "person_pin",
  "person_search",
  "phone",
  "phone_iphone",
  "photo_camera",
  "pin_drop",
  "play_circle",
  "plus",
  "precision_manufacturing",
  "priority_high",
  "psychiatry",
  "rate_review",
  "request_quote",
  "save",
  "schedule",
  "search",
  "search_off",
  "security",
  "sell",
  "send",
  "settings",
  "settings_input_component",
  "shield",
  "shield_with_heart",
  "shopping_cart",
  "smartphone",
  "sort",
  "star",
  "support",
  "support_agent",
  "swap_horiz",
  "task_alt",
  "trending_up",
  "trophy",
  "tune",
  "upload",
  "upload_file",
  "verified",
  "verified_user",
  "vibration",
  "visibility",
  "voice_over_off",
  "warning",
  "water_drop",
  "workspace_premium",
  "wrong_location",
  "youtube",
] as const;
const materialSymbolsStylesheetHref =
  `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&icon_names=${materialSymbolIconNames.join(",")}&display=swap`;

function normalizeLanguage(value: string | undefined): Language {
  return value === "en" || value === "mr" ? value : DEFAULT_LANGUAGE;
}

const languageBootScript = `
(() => {
  try {
    const cookieMatch = document.cookie.match(/(?:^|; )kk_language=(en|mr)(?:;|$)/);
    const cookieLanguage = cookieMatch ? cookieMatch[1] : null;
    const saved = window.localStorage.getItem("kk_language");
    const savedLanguage = saved === "en" || saved === "mr" ? saved : null;

    if (!cookieLanguage && savedLanguage && window.sessionStorage.getItem("kk_language_cookie_migrated") !== "1") {
      window.sessionStorage.setItem("kk_language_cookie_migrated", "1");
      document.cookie = "kk_language=" + savedLanguage + "; Path=/; Max-Age=31536000; SameSite=Lax";
      window.location.replace(window.location.href);
      return;
    }

    const language = cookieLanguage || "mr";
    if (savedLanguage !== language) {
      window.localStorage.setItem("kk_language", language);
    }
    const root = document.documentElement;
    root.lang = language;
    root.dataset.language = language;
    root.classList.toggle("lang-mr", language === "mr");
    root.classList.toggle("lang-en", language === "en");
  } catch (_error) {
    // Ignore language boot errors and let hydration recover.
  }
})();
`;
const themeBootScript = `
(() => {
  try {
    const root = document.documentElement;
    const saved = window.localStorage.getItem("theme");
    if (saved === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      return;
    }

    if (saved === "system") {
      window.localStorage.setItem("theme", "light");
    }

    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
  } catch (_error) {
    // Ignore theme boot errors and let hydration recover.
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: {
    default: "Kisan Kamai | Modernize Your Farm, Maximize Your Yield",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SHARE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/svg+xml",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    title: "Kisan Kamai | Modernize Your Farm, Maximize Your Yield",
    description: DEFAULT_SHARE_DESCRIPTION,
    images: [
      {
        url: getDefaultShareImageUrl(),
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kisan Kamai | Modernize Your Farm, Maximize Your Yield",
    description: DEFAULT_SHARE_DESCRIPTION,
    images: [getDefaultShareImageUrl()],
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLanguage = normalizeLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  let initialSession: LocalSession | null = null;

  if (sessionCookie && sessionCookie.trim() && sessionCookie !== "undefined" && sessionCookie !== "null") {
    const { getCurrentSession } = await import("@/lib/server/local-auth");
    initialSession = await getCurrentSession();
  }

  return (
    <html lang={initialLanguage} data-language={initialLanguage} className={`lang-${initialLanguage}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link data-kk-material-symbols="true" href={materialSymbolsStylesheetHref} rel="stylesheet" />
        <Script id="kk-language-boot" strategy="beforeInteractive">
          {languageBootScript}
        </Script>
        <Script id="kk-theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
      </head>
      <body className={`${manrope.variable} ${inter.variable} ${mukta.variable} font-body bg-background text-on-surface antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <LanguageProvider initialLanguage={initialLanguage}>
            <SingleLanguageRuntime />
            <DepthMotion />
            <AuthProvider initialSession={initialSession}>
              <NavigationTransitionProvider>
                <SiteChrome>
                  {children}
                </SiteChrome>
              </NavigationTransitionProvider>
              <Suspense fallback={null}>
                <PerformanceMonitor />
              </Suspense>
            </AuthProvider>
            <BackToTop />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
