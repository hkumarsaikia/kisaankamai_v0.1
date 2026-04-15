import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLocale } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kisan Kamai",
  description: "Kisan Kamai marketplace for www.kisankamai.com",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, session] = await Promise.all([getLocale(), getCurrentSession()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <Providers>
          <SiteHeader locale={locale} session={session} />
          {children}
          <SiteFooter locale={locale} />
        </Providers>
      </body>
    </html>
  );
}
