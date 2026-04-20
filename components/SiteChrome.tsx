"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { shouldHideSiteChrome } from "@/lib/site-chrome-routes";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  if (shouldHideSiteChrome(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
