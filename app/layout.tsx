import type { Metadata } from "next";
import { Manrope, Inter, Mukta } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import { AuthProvider } from "@/components/AuthContext";
import { BackToTop } from "@/components/BackToTop";
import { NavigationTransitionProvider } from "@/components/NavigationTransitionProvider";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { getCurrentSession } from "@/lib/server/local-auth";
import { IS_PAGES_BUILD, PAGES_BUILD_DYNAMIC } from "@/lib/server/pages-export";
import { Suspense } from "react";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mukta = Mukta({ weight: ["200", "300", "400", "500", "600", "700", "800"], subsets: ["latin", "devanagari"], variable: "--font-mukta" });

export const metadata: Metadata = {
  title: "Kisan Kamai | Modernize Your Farm, Maximize Your Yield",
  description: "India's premier agritech marketplace. Rent high-quality agricultural equipment from trusted local owners. Smarter farming, powered by technology, rooted in trust.",
};

export const dynamic = PAGES_BUILD_DYNAMIC;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSession = IS_PAGES_BUILD ? null : await getCurrentSession();

  return (
    <html lang="mr" data-language="mr" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} ${inter.variable} ${mukta.variable} font-body bg-background text-on-surface antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider initialSession={initialSession}>
              <NavigationTransitionProvider>{children}</NavigationTransitionProvider>
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

