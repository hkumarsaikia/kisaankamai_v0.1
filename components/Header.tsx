"use client";

import { AppLink as Link } from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "./LanguageContext";
import { useAuth } from "./AuthContext";
import { ProfileDropdownMenu } from "./ProfileDropdownMenu";
import { HEADER_PRIMARY_LINKS } from "@/lib/site-navigation.js";

type HeaderLanguageControlProps = {
  className?: string;
};

export const HeaderLanguageControl = ({ className = "" }: HeaderLanguageControlProps) => {
  const { language, setLanguage, t } = useLanguage();
  const nextLanguage = language === "en" ? "mr" : "en";
  const buttonLabel = nextLanguage === "mr" ? t("language.marathi") : t("language.english");
  const ariaLabel = nextLanguage === "mr" ? t("language.switch_to_marathi") : t("language.switch_to_english");

  return (
    <button
      type="button"
      onClick={() => setLanguage(nextLanguage)}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`${className} inline-flex items-center gap-1.5 text-primary dark:text-primary-fixed px-3 py-2 hover:bg-emerald-50 dark:hover:bg-slate-900/50 rounded-lg transition-all font-mukta text-sm font-semibold`}
    >
      {buttonLabel}
    </button>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 w-full z-[1000] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800/50 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 h-20 max-w-7xl mx-auto">

          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-emerald-900 dark:text-emerald-50 font-headline">
              {t("common.brand")}
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
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <HeaderLanguageControl className="hidden md:flex" />

            {/* Show Login + Register only if not logged in */}
            {!loading && !user && (
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
            )}

            {/* Logged-in: Avatar + Dropdown */}
            {!loading && user && (
              <ProfileDropdownMenu />
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
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
            {!loading && user ? (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <ProfileDropdownMenu panelMode="inline" fullWidth />
              </div>
            ) : null}
            {!loading && !user ? (
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
