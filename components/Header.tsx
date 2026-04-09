"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "./LanguageContext";

const navLinks = [
  { 
    href: "/rent-equipment", label: "Find Equipment", labelMr: "उपकरणे शोधा",
    dropdown: [
      { href: "/categories", label: "All Categories", labelMr: "सर्व वर्गवारी", icon: "category", desc: "Browse by machine type" },
      { href: "/models", label: "Browse Models", labelMr: "मॉडेल्स पहा", icon: "agriculture", desc: "Find specific tractors" },
      { href: "/locations", label: "Locations", labelMr: "स्थाने", icon: "map", desc: "Find rentals near you" }
    ]
  },
  { 
    href: "/list-equipment", label: "List Equipment", labelMr: "उपकरणे सूचीबद्ध करा",
    dropdown: [
      { href: "/owner-registration", label: "Register Equipment", labelMr: "उपकरणे नोंदणी करा", icon: "add_circle", desc: "List your machine" },
      { href: "/owner-benefits", label: "Owner Benefits", labelMr: "मालकांचे फायदे", icon: "workspace_premium", desc: "Why host with us" },
      { href: "/owner-dashboard", label: "Owner Dashboard", labelMr: "मालक डॅशबोर्ड", icon: "dashboard", desc: "Manage your fleet" }
    ]
  },
  { 
    href: "/about", label: "About Us", labelMr: "आमच्याबद्दल",
    dropdown: [
      { href: "/partner", label: "Partner with Us", labelMr: "आमच्यासोबत भागीदारी", icon: "handshake", desc: "Join our network" },
      { href: "/trust-safety", label: "Trust & Safety", labelMr: "विश्वास आणि सुरक्षा", icon: "verified_user", desc: "Our guarantee" },
      { href: "/legal", label: "Legal & Policies", labelMr: "कायदेशीर आणि धोरणे", icon: "gavel", desc: "Terms of service" }
    ]
  },
  { href: "/faq", label: "FAQ", labelMr: "वारंवार विचारले जाणारे प्रश्न" },
  { href: "/support", label: "Support", labelMr: "मदत" },
];

export const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const { language, setLanguage, langText } = useLanguage();

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800/50 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 h-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-emerald-900 dark:text-emerald-50 font-headline">
              Kisan Kamai
            </Link>
            <div className="hidden lg:flex items-center gap-6 ml-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.dropdown && link.dropdown.some(d => pathname === d.href));
                return (
                  <div key={link.href} className="relative group py-6 -my-6">
                    <Link
                      href={link.href}
                      className={`text-sm tracking-wide transition-colors flex items-center gap-1 ${
                        isActive
                          ? "text-emerald-700 dark:text-emerald-400 font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium"
                      }`}
                    >
                      {langText(link.label, link.labelMr)}
                      {link.dropdown && <span className="material-symbols-outlined text-[16px]">expand_more</span>}
                    </Link>
                    {link.dropdown && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[320px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 flex flex-col p-2">
                          {link.dropdown.map((sublink) => (
                            <Link
                              key={sublink.href}
                              href={sublink.href}
                              className="group/item flex items-start gap-4 p-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-colors border border-emerald-100 dark:border-emerald-800/30">
                                <span className="material-symbols-outlined text-[24px]">{sublink.icon}</span>
                              </div>
                              <div className="pt-0.5">
                                <h4 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-400 transition-colors">
                                  {langText(sublink.label, sublink.labelMr)}
                                </h4>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{sublink.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setLanguage(language === "en" ? "mr" : "en")}
              className="hidden md:flex items-center gap-1.5 text-slate-600 dark:text-slate-400 px-3 py-2 hover:bg-emerald-50 dark:hover:bg-slate-900/50 rounded-lg transition-all font-mukta text-sm font-semibold"
            >
              {language === "en" ? "मराठी" : "English"}
            </button>
            <button className="bg-transparent border-2 border-primary text-primary px-5 py-2 rounded-xl font-bold hover:bg-primary/5 active:scale-95 transition-all hidden sm:block">
              {langText("Sign In", "लॉगिन करा")}
            </button>
            <button className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20">
              {langText("Register", "नोंदणी करा")}
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg transition-all"
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
          <div className="absolute top-20 left-0 right-0 bg-white dark:bg-slate-950 border-b border-emerald-100 dark:border-slate-800 shadow-xl p-6 space-y-2">
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
                      : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-900/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <Link href="/partner" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 bg-secondary/10 text-secondary rounded-xl font-bold text-sm">
                Partner With Us
              </Link>
              <Link href="/legal" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm">
                Legal
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
