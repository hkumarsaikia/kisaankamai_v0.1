"use client";

import { AppLink as Link } from "@/components/AppLink";
import { HeaderLanguageControl } from "@/components/Header";
import { useLanguage } from "@/components/LanguageContext";
import { ProfileDropdownMenu } from "@/components/ProfileDropdownMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocalizedText, localizedText } from "@/lib/i18n";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type WorkspaceFamily = "owner-profile" | "renter-profile";
type WorkspaceTab =
  | "dashboard"
  | "browse"
  | "bookings"
  | "earnings"
  | "saved"
  | "settings"
  | "feedback"
  | "support"
  | "add-listing";

type NavigationItem = {
  key: Exclude<WorkspaceTab, "add-listing">;
  href: string;
  label: LocalizedText | string;
  icon: string;
};

type LocalFooterLink = {
  label: LocalizedText | string;
};

type TextValue = LocalizedText | string;

type OwnerProfileWorkspaceShellProps = {
  family: WorkspaceFamily;
  activeTab: WorkspaceTab;
  title: TextValue;
  subtitle?: TextValue;
  footerText?: TextValue;
  footerLinks?: TextValue[];
  children: React.ReactNode;
};

const WORKSPACE_CONFIG = {
  "owner-profile": {
    portalLabel: localizedText("Owner Profile", "मालक प्रोफाइल"),
    navItems: [
      { key: "dashboard", href: "/owner-profile", label: localizedText("Dashboard", "डॅशबोर्ड"), icon: "dashboard" },
      { key: "browse", href: "/owner-profile/browse", label: localizedText("My Equipment", "माझी उपकरणे"), icon: "agriculture" },
      { key: "bookings", href: "/owner-profile/bookings", label: localizedText("Bookings", "बुकिंग"), icon: "event_note" },
      { key: "earnings", href: "/owner-profile/earnings", label: localizedText("Earnings", "कमाई"), icon: "payments" },
      { key: "settings", href: "/owner-profile/settings", label: localizedText("Settings", "सेटिंग्ज"), icon: "settings" },
      { key: "feedback", href: "/owner-profile/feedback", label: localizedText("Feedback", "अभिप्राय"), icon: "rate_review" },
    ] as NavigationItem[],
    supportHref: "/owner-profile/support",
    localFooterText: localizedText(
      "Kisan Kamai © 2026 Kisan Kamai. Rooted in Trust",
      "Kisan Kamai © 2026 Kisan Kamai. विश्वासावर आधारलेले"
    ),
    footerMode: "text-left",
    mobileItems: [
      { key: "dashboard", href: "/owner-profile", label: localizedText("Home", "मुख्यपृष्ठ"), icon: "dashboard" },
      { key: "bookings", href: "/owner-profile/bookings", label: localizedText("Bookings", "बुकिंग"), icon: "event_note" },
      { key: "earnings", href: "/owner-profile/earnings", label: localizedText("Earnings", "कमाई"), icon: "payments" },
      { key: "browse", href: "/owner-profile/browse", label: localizedText("Equipment", "उपकरणे"), icon: "agriculture" },
      { key: "settings", href: "/owner-profile/settings", label: localizedText("Settings", "सेटिंग्ज"), icon: "settings" },
    ] as NavigationItem[],
    addListingHref: "/list-equipment",
  },
  "renter-profile": {
    portalLabel: localizedText("Renter Profile", "भाडेकरू प्रोफाइल"),
    navItems: [
      { key: "dashboard", href: "/renter-profile", label: localizedText("Dashboard", "डॅशबोर्ड"), icon: "dashboard" },
      { key: "browse", href: "/renter-profile/browse", label: localizedText("Browse Equipment", "उपकरणे शोधा"), icon: "search" },
      { key: "bookings", href: "/renter-profile/bookings", label: localizedText("My Bookings", "माझी बुकिंग"), icon: "calendar_today" },
      { key: "saved", href: "/renter-profile/saved", label: localizedText("Saved Equipment", "जतन केलेली उपकरणे"), icon: "bookmark" },
      { key: "settings", href: "/renter-profile/settings", label: localizedText("Settings", "सेटिंग्ज"), icon: "settings" },
      { key: "feedback", href: "/renter-profile/feedback", label: localizedText("Feedback", "अभिप्राय"), icon: "rate_review" },
    ] as NavigationItem[],
    supportHref: "/renter-profile/support",
    localFooterText: localizedText(
      "Kisan Kamai © 2026 Kisan Kamai. Rooted in Trust",
      "Kisan Kamai © 2026 Kisan Kamai. विश्वासावर आधारलेले"
    ),
    footerMode: "text-left",
    mobileItems: [
      { key: "dashboard", href: "/renter-profile", label: localizedText("Home", "मुख्यपृष्ठ"), icon: "dashboard" },
      { key: "browse", href: "/renter-profile/browse", label: localizedText("Browse", "शोधा"), icon: "search" },
      { key: "bookings", href: "/renter-profile/bookings", label: localizedText("Bookings", "बुकिंग"), icon: "calendar_today" },
      { key: "saved", href: "/renter-profile/saved", label: localizedText("Saved", "जतन"), icon: "bookmark" },
      { key: "settings", href: "/renter-profile/settings", label: localizedText("Settings", "सेटिंग्ज"), icon: "settings" },
    ] as NavigationItem[],
    addListingHref: null,
  },
} as const;

const LEGAL_LINKS: LocalFooterLink[] = [
  { label: localizedText("Privacy Policy", "गोपनीयता धोरण") },
  { label: localizedText("Terms of Service", "सेवेच्या अटी") },
  { label: localizedText("Agreement", "करार") },
];

function LocalFooter({
  family,
  footerText,
  footerLinks,
}: {
  family: WorkspaceFamily;
  footerText?: TextValue;
  footerLinks?: TextValue[];
}) {
  const { text } = useLanguage();
  const config = WORKSPACE_CONFIG[family];
  const resolvedFooterText = text(footerText || config.localFooterText);
  const resolvedFooterLinks = (footerLinks?.map((label) => ({ label })) || LEGAL_LINKS).map((item) => ({
    label: text(item.label),
  }));

  return (
    <footer className="mt-16 border-t border-emerald-100 bg-white pb-8 pt-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-6 md:flex-row md:items-center md:justify-between">
        {config.footerMode === "text-left" ? (
          <>
            <p className="text-xs font-semibold text-on-surface-variant">{resolvedFooterText}</p>
            <div className="flex flex-wrap justify-end gap-6">
              {resolvedFooterLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="text-xs font-bold text-on-surface-variant transition-colors hover:text-primary"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-wrap justify-start gap-6">
              {resolvedFooterLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="text-xs font-bold text-on-surface-variant transition-colors hover:text-primary"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="md:text-right">
              <p className="text-xs font-semibold text-on-surface-variant">{resolvedFooterText}</p>
            </div>
          </>
        )}
      </div>
    </footer>
  );
}

function NavigationLinks({
  family,
  activeTab,
  onNavigate,
}: {
  family: WorkspaceFamily;
  activeTab: WorkspaceTab;
  onNavigate?: () => void;
}) {
  const { text } = useLanguage();
  const config = WORKSPACE_CONFIG[family];

  return (
    <nav className="flex-1 space-y-1 px-3">
      {config.navItems.map((item) => {
        const active = item.key === activeTab;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
              active
                ? "rounded-l-lg border-r-4 border-emerald-700 bg-emerald-50 font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                : "rounded-lg text-slate-500 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-manrope text-sm font-medium">{text(item.label)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBottomActions({
  family,
  onNavigate,
}: {
  family: WorkspaceFamily;
  onNavigate?: () => void;
}) {
  const { text } = useLanguage();
  const config = WORKSPACE_CONFIG[family];

  return (
    <div className="space-y-2 border-t border-surface-container-highest p-4 dark:border-slate-800">
      {config.addListingHref ? (
        <Link
          href={config.addListingHref}
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-4 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {text(localizedText("Add New Listing", "नवीन लिस्टिंग जोडा"))}
        </Link>
      ) : null}
      <div className="border-t border-black/5 pt-2 dark:border-white/10">
        <Link
          href={config.supportHref}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <span className="material-symbols-outlined">support_agent</span>
          <span className="font-manrope text-sm font-medium">
            {text(localizedText("Support", "मदत"))}
          </span>
        </Link>
        <Link
          href="/logout"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-manrope text-sm font-medium">
            {text(localizedText("Sign Out", "बाहेर पडा"))}
          </span>
        </Link>
      </div>
    </div>
  );
}

function Sidebar({
  family,
  activeTab,
  onNavigate,
}: {
  family: WorkspaceFamily;
  activeTab: WorkspaceTab;
  onNavigate?: () => void;
}) {
  const { text } = useLanguage();
  const config = WORKSPACE_CONFIG[family];

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-950">
      <div className="space-y-4 px-6 py-8">
        <div>
          <span className="text-xl font-bold text-primary">Kisan Kamai</span>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            {text(config.portalLabel)}
          </p>
        </div>
        <Link
          href="/"
          onClick={onNavigate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-surface-container-highest bg-surface-container-low px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-surface-container dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {text(localizedText("Back to Home", "मुख्यपृष्ठावर जा"))}
        </Link>
      </div>

      <NavigationLinks family={family} activeTab={activeTab} onNavigate={onNavigate} />
      <SidebarBottomActions family={family} onNavigate={onNavigate} />
    </div>
  );
}

function MobileBottomNav({
  family,
  activeTab,
}: {
  family: WorkspaceFamily;
  activeTab: WorkspaceTab;
}) {
  const { text } = useLanguage();
  const config = WORKSPACE_CONFIG[family];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-surface-container-highest bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
      {config.mobileItems.map(({ key, href, icon, label }) => {
        const active = key === activeTab;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center p-2 ${active ? "text-primary" : "text-slate-500 dark:text-slate-400"}`}
          >
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {icon}
            </span>
            <span className="mt-1 text-[10px] font-bold">{text(label)}</span>
          </Link>
        );
      })}
      {config.addListingHref ? (
        <Link
          href={config.addListingHref}
          className="-mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-white shadow-lg"
        >
          <span className="material-symbols-outlined">add</span>
        </Link>
      ) : null}
    </nav>
  );
}

export function OwnerProfileWorkspaceShell({
  family,
  activeTab,
  title,
  subtitle,
  footerText,
  footerLinks,
  children,
}: OwnerProfileWorkspaceShellProps) {
  const { text } = useLanguage();
  const pathname = usePathname();
  const config = WORKSPACE_CONFIG[family];
  const [mobileOpen, setMobileOpen] = useState(false);
  const resolvedTitle = text(title);
  const resolvedSubtitle = subtitle ? text(subtitle) : null;

  const mainContentPadding = useMemo(
    () => (config.addListingHref ? "pb-28 lg:pb-12" : "pb-24 lg:pb-12"),
    [config.addListingHref]
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="bg-background font-body text-on-background antialiased dark:bg-slate-950 dark:text-slate-100">
      {mobileOpen ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close workspace menu"
          />
          <div className="relative h-full w-64 max-w-[88vw] border-r border-surface-container-highest bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <Sidebar family={family} activeTab={activeTab} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-surface-container-highest bg-white lg:block dark:border-slate-800 dark:bg-slate-950">
        <Sidebar family={family} activeTab={activeTab} />
      </aside>

      <main className={`min-h-screen ${mainContentPadding} lg:ml-64`}>
        <header className="sticky top-0 z-30 border-b border-surface-container-highest bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <button
                className="mt-1 rounded-xl p-2 text-on-surface transition-colors hover:bg-surface-container dark:text-slate-100 dark:hover:bg-slate-900 lg:hidden"
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open workspace menu"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-on-surface-variant">
                  <span className="text-xs font-bold uppercase tracking-widest">{text(config.portalLabel)}</span>
                </div>
                <h1 className="truncate text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                  {resolvedTitle}
                </h1>
                {resolvedSubtitle ? (
                  <p className="mt-1 max-w-3xl text-sm text-on-surface-variant">{resolvedSubtitle}</p>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <div className="hidden sm:block">
                <HeaderLanguageControl />
              </div>
              <div className="hidden sm:block">
                <ProfileDropdownMenu />
              </div>
              <div className="sm:hidden">
                <ProfileDropdownMenu showLabel={false} />
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 pt-8">
          {children}
        </div>

        <div className="hidden lg:block">
          <LocalFooter family={family} footerText={footerText} footerLinks={footerLinks} />
        </div>
      </main>

      <div className="lg:hidden">
        <LocalFooter family={family} footerText={footerText} footerLinks={footerLinks} />
        <MobileBottomNav family={family} activeTab={activeTab} />
      </div>
    </div>
  );
}
