"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "./LanguageContext";

const navLinks = [
  { href: "/rent-equipment", label: "Find Equipment", labelMr: "उपकरणे शोधा" },
  { href: "/list-equipment", label: "List Equipment", labelMr: "उपकरणे सूचीबद्ध करा" },
  { href: "/about", label: "About Us", labelMr: "आमच्याबद्दल" },
  { href: "/faq", label: "FAQ", labelMr: "वारंवार विचारले जाणारे प्रश्न" },
  { href: "/support", label: "Support", labelMr: "मदत" },
];

export const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, langText } = useLanguage();

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-emerald-950/95 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-800/50 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 h-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-emerald-900 dark:text-emerald-50 font-headline">
              Kisan Kamai
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={
                      isActive
                        ? "text-emerald-700 dark:text-emerald-400 font-bold border-b-2 border-emerald-700 dark:border-emerald-400 pb-1 transition-colors"
                        : "text-slate-600 dark:text-slate-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
                    }
                  >
                    {langText(link.label, link.labelMr)}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setLanguage(language === "en" ? "mr" : "en")}
              className="hidden md:flex items-center gap-1.5 text-slate-600 dark:text-slate-400 px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-all font-mukta text-sm font-semibold"
            >
              {language === "en" ? "मराठी" : "English"}
            </button>
            <button className="bg-primary-container text-on-primary px-6 py-2.5 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary-container/10">
              {langText("Sign In", "लॉगिन करा")}
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-emerald-900/30 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">{mobileOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-20 left-0 right-0 bg-white dark:bg-emerald-950 border-b border-emerald-100 dark:border-emerald-800 shadow-xl p-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive
                      ? "bg-primary-container/10 text-emerald-700 dark:text-emerald-400 font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-slate-100 dark:border-emerald-800 flex gap-3">
              <Link href="/partner" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 bg-secondary/10 text-secondary rounded-xl font-bold text-sm">
                Partner With Us
              </Link>
              <Link href="/legal" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 bg-slate-100 dark:bg-emerald-900/30 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm">
                Legal
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
