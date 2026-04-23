import type { Metadata } from "next";
import { Manrope, Inter, Mukta } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import { AuthProvider } from "@/components/AuthContext";
import { BackToTop } from "@/components/BackToTop";
import { NavigationTransitionProvider } from "@/components/NavigationTransitionProvider";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { SingleLanguageRuntime } from "@/components/SingleLanguageRuntime";
import { SiteChrome } from "@/components/SiteChrome";
import { getCurrentSession } from "@/lib/server/local-auth";
import { DEFAULT_SHARE_DESCRIPTION, getDefaultShareImageUrl, getMetadataBaseUrl, SITE_NAME } from "@/lib/site-metadata";
import { Suspense } from "react";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mukta = Mukta({ weight: ["200", "300", "400", "500", "600", "700", "800"], subsets: ["latin", "devanagari"], variable: "--font-mukta" });
const languageBootScript = `
(() => {
  try {
    const saved = window.localStorage.getItem("kk_language");
    const language = saved === "en" || saved === "mr" ? saved : "mr";
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

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: {
    default: "Kisan Kamai | Modernize Your Farm, Maximize Your Yield",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SHARE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
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
  const initialSession = await getCurrentSession();

  return (
    <html lang="mr" data-language="mr" className="lang-mr" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <Script id="kk-language-boot" strategy="beforeInteractive">
          {languageBootScript}
        </Script>
      </head>
      <body className={`${manrope.variable} ${inter.variable} ${mukta.variable} font-body bg-background text-on-surface antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <SingleLanguageRuntime />
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

