"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { shouldHideSiteChrome } from "@/lib/site-chrome-routes";

export function SiteChrome({
  children,
  crawlerSafeLabels = false,
}: {
  children: React.ReactNode;
  crawlerSafeLabels?: boolean;
}) {
  const pathname = usePathname() || "";
  const compactContentMain = pathname.startsWith("/rent-equipment");

  if (shouldHideSiteChrome(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Header crawlerSafeLabels={crawlerSafeLabels} />
      <main id="main-content" className={compactContentMain ? "" : "flex-grow"}>
        {children}
      </main>
      <Footer />
    </>
  );
}
