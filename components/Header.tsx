"use client";

import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "./LanguageContext";
import { useAuth } from "./AuthContext";
import type { TranslationKey } from "@/lib/i18n";
import { assetPath } from "@/lib/site";

type HeaderDropdownItem = {
  href: string;
  labelKey: TranslationKey;
  icon: string;
  descKey: TranslationKey;
};

type HeaderNavLink = {
  href: string;
  labelKey: TranslationKey;
  featured?: {
    img: string;
    titleKey: TranslationKey;
    altKey: TranslationKey;
    url: string;
  };
  dropdown?: HeaderDropdownItem[];
};

const navLinks: HeaderNavLink[] = [
  {
    href: "/rent-equipment",
    labelKey: "header.nav.find_equipment",
    featured: {
      img: assetPath("/assets/generated/harvester_action.png"),
      titleKey: "header.featured.harvesting_season_ready",
      altKey: "header.alt.featured_harvesting",
      url: "/models",
    },
    dropdown: [
      { href: "/categories", labelKey: "header.dropdown.all_categories", icon: "category", descKey: "header.desc.browse_by_machine_type" },
      { href: "/models", labelKey: "header.dropdown.browse_models", icon: "agriculture", descKey: "header.desc.find_specific_tractors" },
      { href: "/locations", labelKey: "header.dropdown.locations", icon: "map", descKey: "header.desc.find_rentals_near_you" },
    ],
  },
  {
    href: "/list-equipment",
    labelKey: "header.nav.list_equipment",
    featured: {
      img: assetPath("/assets/generated/hero_tractor.png"),
      titleKey: "header.featured.earn_with_your_fleet",
      altKey: "header.alt.featured_fleet",
      url: "/owner-benefits",
    },
    dropdown: [
      { href: "/owner-registration", labelKey: "header.dropdown.register_equipment", icon: "add_circle", descKey: "header.desc.list_your_machine" },
      { href: "/owner-benefits", labelKey: "header.dropdown.owner_benefits", icon: "workspace_premium", descKey: "header.desc.why_host_with_us" },
      { href: "/owner-profile", labelKey: "header.dropdown.owner_profile", icon: "dashboard", descKey: "header.desc.manage_your_fleet" },
    ],
  },
  { href: "/support", labelKey: "header.nav.support" },
];

export const Header = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, profile, loading, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = (user?.name || profile?.fullName || "U").substring(0, 1).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800/50 shadow-sm">
        <div className="flex justify-between items-center w-full px-6 h-20 max-w-7xl mx-auto">

          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-emerald-900 dark:text-emerald-50 font-headline">
              {t("common.brand")}
            </Link>
            <div className="hidden lg:flex items-center gap-6 ml-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.dropdown && link.dropdown.some((d) => pathname === d.href));
                return (
                  <div key={link.href} className="relative group py-6 -my-6">
                    <Link
                      href={link.href}
                      className={`text-sm tracking-wide transition-colors flex items-center gap-1 ${
                        isActive
                          ? "text-primary dark:text-primary-fixed font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-fixed font-medium"
                      }`}
                    >
                      {t(link.labelKey)}
                      {link.dropdown && <span className="material-symbols-outlined text-[16px]">expand_more</span>}
                    </Link>
                    {link.dropdown && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[850px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-3xl shadow-[0_30px_60px_rgb(0,0,0,0.12)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 flex overflow-hidden">
                          <div className="flex-1 grid grid-cols-2 gap-2 p-8">
                            {link.dropdown.map((sublink) => {
                              if (sublink.href === "/owner-profile" && !user) return null;
                              const resolvedHref =
                                sublink.href === "/owner-registration" && !user
                                  ? "/profile-selection"
                                  : sublink.href;
                              return (
                                <Link
                                  key={`${sublink.href}-${resolvedHref}`}
                                  href={resolvedHref}
                                  className="group/item flex items-start gap-4 p-4 rounded-2xl hover:bg-surface-container-high dark:hover:bg-slate-800 transition-colors"
                                >
                                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary-container/10 dark:bg-primary-container/20 flex items-center justify-center text-primary dark:text-primary-fixed group-hover/item:bg-primary group-hover/item:text-on-primary transition-colors border border-primary/10 dark:border-primary-fixed/30">
                                    <span className="material-symbols-outlined text-[24px]">{sublink.icon}</span>
                                  </div>
                                  <div className="pt-0.5">
                                    <h4 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 group-hover/item:text-primary dark:group-hover/item:text-primary-fixed transition-colors">
                                      {t(sublink.labelKey)}
                                    </h4>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-snug">{t(sublink.descKey)}</p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                          {link.featured && (
                            <div className="w-[320px] bg-slate-50 dark:bg-slate-950/50 p-8 border-l border-emerald-100 dark:border-slate-800 flex flex-col pt-10">
                              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mb-4">{t("Header.what_s_new")}</h3>
                              <Link href={link.featured.url} className="group/card block relative rounded-2xl overflow-hidden shadow-md flex-grow">
                                <Image
                                  src={assetPath(link.featured.img)}
                                  alt={t(link.featured.altKey)}
                                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700 min-h-[160px]"
                                  width={320}
                                  height={220}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                                  <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-white text-[10px] font-bold uppercase tracking-wider mb-2 w-max shadow-sm">
                                    {t("Header.featured")}
                                  </span>
                                  <h4 className="text-white font-bold text-lg leading-tight group-hover/card:text-emerald-300 transition-colors">
                                    {t(link.featured.titleKey)}
                                  </h4>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setLanguage(language === "en" ? "mr" : "en")}
              className="hidden md:flex items-center gap-1.5 text-primary dark:text-primary-fixed px-3 py-2 hover:bg-emerald-50 dark:hover:bg-slate-900/50 rounded-lg transition-all font-mukta text-sm font-semibold"
            >
              {language === "en" ? t("language.marathi") : t("language.english")}
            </button>

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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shadow-sm"
                  title={t("header.aria.my_profile")}
                >
                  {/* Avatar */}
                  <div className="relative w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-emerald-500 shadow-sm flex-shrink-0">
                    <span className="text-white font-bold text-sm leading-none">{initials}</span>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <span className="hidden sm:block text-[13px] font-bold text-emerald-900 dark:text-emerald-100">
                    {t("Header.my_profile")}
                  </span>
                  <span className={`material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400 transition-transform hidden sm:block ${profileDropdownOpen ? "rotate-180" : ""}`}>
                    expand_more
                  </span>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User info header */}
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-950/30">
                      <p className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">{user.name || profile?.fullName || "Farmer"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.email}</p>
                    </div>

                    {/* Dashboard Links */}
                    <div className="py-2">
                      <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("header.menu.profiles")}</p>
                      <Link
                        href="/owner-profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[18px]">dashboard</span>
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("Header.owner_profile")}</p>
                          <p className="text-[10px] text-slate-500">{t("header.desc.manage_your_fleet")}</p>
                        </div>
                      </Link>
                      <Link
                        href="/renter-profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                          <span className="material-symbols-outlined text-[18px]">agriculture</span>
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{t("Header.renter_profile")}</p>
                          <p className="text-[10px] text-slate-500">{t("header.desc.your_bookings_and_equipment")}</p>
                        </div>
                      </Link>
                    </div>

                    {/* Account links */}
                    <div className="border-t border-slate-100 dark:border-slate-800 py-2">
                      <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("header.menu.account")}</p>
                      <Link
                        href="/owner-profile/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-slate-500">settings</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("header.menu.settings")}</span>
                      </Link>
                      <Link
                        href="/support"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px] text-slate-500">help</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t("header.menu.help_support")}</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-100 dark:border-slate-800 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                      >
                        <span className="material-symbols-outlined text-[20px] text-red-500">logout</span>
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">{t("header.menu.sign_out")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
            {navLinks.map((link) => {
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
                  {t(link.labelKey)}
                </Link>
              );
            })}
            {/* Mobile dashboard links if logged in */}
            {user && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <Link href="/owner-profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-primary font-bold">
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  {t("Header.owner_profile")}
                </Link>
                <Link href="/renter-profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 font-bold">
                  <span className="material-symbols-outlined text-[18px]">agriculture</span>
                  {t("Header.renter_profile")}
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 font-bold">
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  {t("header.menu.sign_out")}
                </button>
              </div>
            )}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <Link href="/partner" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 bg-secondary/10 text-secondary rounded-xl font-bold text-sm">
                {t("Header.partner_with_us")}
              </Link>
              <Link href="/legal" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm">
                {t("Header.legal")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
