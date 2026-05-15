"use client";

import { AppLink as Link } from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "./LanguageContext";
import { useAuth } from "./AuthContext";
import { ProfileDropdownMenu } from "./ProfileDropdownMenu";
import { HEADER_PRIMARY_LINKS } from "@/lib/site-navigation.js";
import { SharedIcon } from "./SharedIcon";
import { BrandLogo } from "./BrandLogo";

type HeaderLanguageControlProps = {
  className?: string;
  crawlerSafeLabels?: boolean;
};

export const HeaderLanguageControl = ({ className = "", crawlerSafeLabels = false }: HeaderLanguageControlProps) => {
  const { language, setLanguage, t } = useLanguage();
  const nextLanguage = language === "en" ? "mr" : "en";
  const buttonLabel =
    nextLanguage === "mr" && crawlerSafeLabels
      ? "Marathi"
      : nextLanguage === "mr"
        ? t("language.marathi")
        : t("language.english");
  const ariaLabel = nextLanguage === "mr" ? t("language.switch_to_marathi") : t("language.switch_to_english");
  const accessibleLabel = `${buttonLabel} - ${ariaLabel}`;

  return (
    <button
      type="button"
      onClick={() => setLanguage(nextLanguage)}
      aria-label={accessibleLabel}
      title={ariaLabel}
      className={`${className} inline-flex items-center gap-1.5 text-primary dark:text-primary-fixed px-3 py-2 hover:bg-emerald-50 dark:hover:bg-slate-900/50 rounded-lg transition-all font-mukta text-sm font-semibold`}
    >
      {buttonLabel}
    </button>
  );
};

export const Header = ({ crawlerSafeLabels = false }: { crawlerSafeLabels?: boolean }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, langText } = useLanguage();
  const { user } = useAuth();
  const mobileMenuLabel = mobileOpen
    ? langText("Close navigation menu", "नेव्हिगेशन मेनू बंद करा")
    : langText("Open navigation menu", "नेव्हिगेशन मेनू उघडा");

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className="fixed top-0 w-full z-[1000] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800/50 shadow-sm"
        style={{ viewTransitionName: "persistent-header" }}
      >
        <div className="flex h-20 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-4 lg:gap-8 lg:px-6 mx-auto">

          {/* Left: Logo + Nav */}
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-8">
            <Link
              href="/"
              className="group inline-flex min-w-0 shrink items-center rounded-2xl bg-white px-1.5 py-1 outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary/35 dark:bg-white sm:px-2"
              aria-label={t("common.brand")}
            >
              <BrandLogo
                markClassName="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14"
                showSubtitle={false}
                textClassName="[&>span:first-child]:text-[1.12rem] sm:[&>span:first-child]:text-[1.28rem] lg:[&>span:first-child]:text-[1.5rem]"
              />
            </Link>
            <div className="hidden lg:flex items-center gap-6 ml-4">
              {HEADER_PRIMARY_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <div key={link.href} className="py-6 -my-6">
                    <Link
                      href={link.href}
                      className={`text-sm tracking-wide transition-colors ${
                        isActive
                          ? "text-primary dark:text-primary-fixed font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-fixed font-medium"
                      }`}
                    >
                      {t(link.labelKey as never)}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:gap-3">
            <ThemeToggle />
            <HeaderLanguageControl className="hidden md:flex" crawlerSafeLabels={crawlerSafeLabels} />

            {/* Show Login + Register only if not logged in */}
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="bg-transparent border-2 border-primary dark:border-primary-fixed text-primary dark:text-primary-fixed px-5 py-2 rounded-xl font-bold hover:bg-primary/5 dark:hover:bg-primary-fixed/10 active:scale-95 transition-all hidden sm:block"
                >
                  {t("Header.login")}
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 hidden sm:block"
                >
                  {t("Header.register")}
                </Link>
              </>
            ) : null}

            {/* Logged-in: Avatar + Dropdown */}
            {user ? (
              <ProfileDropdownMenu />
            ) : null}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileMenuLabel}
              title={mobileMenuLabel}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg transition-all"
            >
              <SharedIcon
                name={mobileOpen ? "close" : "menu"}
                className="h-6 w-6"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
	          <button
	            type="button"
	            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
	            onClick={() => setMobileOpen(false)}
	            aria-label={langText("Close navigation menu", "नेव्हिगेशन मेनू बंद करा")}
	          />
          <div className="absolute top-20 left-0 right-0 bg-white dark:bg-slate-950 border-b border-emerald-100 dark:border-slate-800 shadow-xl p-6 space-y-2">
            {HEADER_PRIMARY_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive
                      ? "bg-primary-container/10 text-primary dark:text-primary-fixed font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-surface-container hover:text-primary"
                  }`}
                >
                  {t(link.labelKey as never)}
                </Link>
              );
            })}
            {user ? (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <ProfileDropdownMenu panelMode="inline" fullWidth />
              </div>
            ) : null}
            {!user ? (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl border-2 border-primary px-4 py-3 text-center font-bold text-primary transition-colors hover:bg-primary/5"
                >
                  {t("Header.login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl bg-primary px-4 py-3 text-center font-bold text-on-primary transition-opacity hover:opacity-90"
                >
                  {t("Header.register")}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};
