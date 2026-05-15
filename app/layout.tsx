import type { Metadata } from "next";
import { Manrope, Inter, Mukta } from "next/font/google";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import { AuthProvider } from "@/components/AuthContext";
import { BackToTop } from "@/components/BackToTop";
import { BuildFreshnessMonitor } from "@/components/BuildFreshnessMonitor";
import { DeferredPerformanceMonitor } from "@/components/DeferredPerformanceMonitor";
import { DepthMotion } from "@/components/DepthMotion";
import { NavigationTransitionProvider } from "@/components/NavigationTransitionProvider";
import { SingleLanguageRuntime } from "@/components/SingleLanguageRuntime";
import { SiteChrome } from "@/components/SiteChrome";
import { DEFAULT_LANGUAGE, type Language } from "@/lib/i18n";
import { getBuildRevision } from "@/lib/build-info";
import type { LocalSession } from "@/lib/local-data/types";
import { DEFAULT_SHARE_DESCRIPTION, getDefaultShareImageUrl, getMetadataBaseUrl, SITE_DOMAIN, SITE_NAME } from "@/lib/site-metadata";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false });
const mukta = Mukta({
  weight: ["400", "600", "700"],
  subsets: ["latin", "devanagari"],
  variable: "--font-mukta",
  display: "swap",
  preload: false,
});
const LANGUAGE_COOKIE_NAME = "kk_language";
const SESSION_COOKIE_NAME = "kisan_kamai_session";
const CRAWLER_HEADER_NAME = "x-kisan-kamai-crawler";
function normalizeLanguage(value: string | undefined): Language {
  return value === "en" || value === "mr" ? value : DEFAULT_LANGUAGE;
}

function isCrawlerUserAgent(userAgent: string | null) {
  return /\b(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|facebot|twitterbot|linkedinbot|telegrambot|whatsapp|discordbot|slackbot|applebot|pinterestbot)\b/i.test(
    userAgent || ""
  );
}

function buildLanguageBootScript(fallbackLanguage: Language) {
  return `
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

    const language = cookieLanguage || "${fallbackLanguage}";
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
}
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
    default: "Kisan Kamai | Rent and List Farm Equipment in Maharashtra",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SHARE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  icons: {
    shortcut: "/favicon.ico",
    icon: [
      {
        url: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
        rel: "icon",
      },
      {
        url: "/brand/kisan-kamai-tractor-48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        url: "/brand/kisan-kamai-tractor-96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/brand/kisan-kamai-tractor.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/brand/kisan-kamai-tractor-192.png",
        sizes: "192x192",
        type: "image/png",
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
    title: "Kisan Kamai | Rent and List Farm Equipment in Maharashtra",
    description: DEFAULT_SHARE_DESCRIPTION,
    locale: "en_IN",
    images: [
      {
        url: getDefaultShareImageUrl(),
        secureUrl: getDefaultShareImageUrl(),
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kisan Kamai | Rent and List Farm Equipment in Maharashtra",
    description: DEFAULT_SHARE_DESCRIPTION,
    images: [
      {
        url: getDefaultShareImageUrl(),
        alt: SITE_NAME,
      },
    ],
  },
};

const siteStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_DOMAIN}/#website`,
      name: SITE_NAME,
      url: SITE_DOMAIN,
      description: DEFAULT_SHARE_DESCRIPTION,
      inLanguage: ["en-IN", "mr-IN"],
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_DOMAIN}/rent-equipment?query={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_DOMAIN}/#organization`,
      name: SITE_NAME,
      url: SITE_DOMAIN,
    },
  ],
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const languageCookie = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;
  const hasBrowserLanguageHeader = Boolean(headerStore.get("accept-language")?.trim());
  const crawlerRequest =
    headerStore.get(CRAWLER_HEADER_NAME) === "1" || isCrawlerUserAgent(headerStore.get("user-agent"));
  const crawlerSafeEnglishChrome = crawlerRequest || !hasBrowserLanguageHeader;
  const initialLanguage = languageCookie
    ? normalizeLanguage(languageCookie)
    : crawlerSafeEnglishChrome
      ? "en"
      : DEFAULT_LANGUAGE;
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  let initialSession: LocalSession | null = null;
  const buildRevision = getBuildRevision();
  const languageBootScript = buildLanguageBootScript(initialLanguage);

  if (sessionCookie && sessionCookie.trim() && sessionCookie !== "undefined" && sessionCookie !== "null") {
    const { getCurrentSession } = await import("@/lib/server/local-auth");
    initialSession = await getCurrentSession();
  }

  return (
    <html
      lang={initialLanguage}
      data-language={initialLanguage}
      data-scroll-behavior="smooth"
      className={`lang-${initialLanguage}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="image_src" href={getDefaultShareImageUrl()} />
        <meta name="robots" content="index,follow,max-image-preview:none" />
        <meta name="google" content="notranslate" />
        <meta name="thumbnail" content={getDefaultShareImageUrl()} />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:image:url" content={getDefaultShareImageUrl()} />
        <link
          as="font"
          crossOrigin="anonymous"
          href="/fonts/material-symbols-outlined.woff2"
          rel="preload"
          type="font/woff2"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteStructuredData) }}
        />
        <meta name="kisan-kamai-build-revision" content={buildRevision} />
        <Script id="kk-language-boot" strategy="beforeInteractive">
          {languageBootScript}
        </Script>
        <Script id="kk-theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
      </head>
      <body className={`${manrope.variable} ${inter.variable} ${mukta.variable} font-body bg-background text-on-surface antialiased min-h-screen flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[2000] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-black focus:text-white focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-fixed"
        >
          {initialLanguage === "mr" ? "मुख्य मजकुरावर जा" : "Skip to main content"}
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <LanguageProvider initialLanguage={initialLanguage}>
            <SingleLanguageRuntime />
            <BuildFreshnessMonitor initialRevision={buildRevision} />
            <DepthMotion />
            <AuthProvider initialSession={initialSession}>
              <NavigationTransitionProvider>
                <SiteChrome crawlerSafeLabels={crawlerSafeEnglishChrome}>
                  {children}
                </SiteChrome>
              </NavigationTransitionProvider>
              <DeferredPerformanceMonitor />
            </AuthProvider>
            <BackToTop />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
