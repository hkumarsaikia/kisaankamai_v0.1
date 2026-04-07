import type { Metadata } from "next";
import { Manrope, Inter, Mukta } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/components/LanguageContext";
import { BackToTop } from "@/components/BackToTop";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mukta = Mukta({ weight: ["200", "300", "400", "500", "600", "700", "800"], subsets: ["latin", "devanagari"], variable: "--font-mukta" });

export const metadata: Metadata = {
  title: "Kisan Kamai | Modernize Your Farm, Maximize Your Yield",
  description: "India's premier agritech marketplace. Rent high-quality agricultural equipment from trusted local owners. Smarter farming, powered by technology, rooted in trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} ${inter.variable} ${mukta.variable} font-body bg-background text-on-surface antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            {children}
            <BackToTop />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
