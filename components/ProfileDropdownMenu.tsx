"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  resolvePortalHref,
  resolveWorkspaceSettingsHref,
  resolveWorkspaceSupportHref,
} from "@/lib/workspace-routing.js";

type ProfileDropdownMenuProps = {
  className?: string;
  settingsHref?: string;
  showLabel?: boolean;
  fullWidth?: boolean;
  panelMode?: "popover" | "inline";
};

export function ProfileDropdownMenu({
  className = "",
  settingsHref,
  showLabel = true,
  fullWidth = false,
  panelMode = "popover",
}: ProfileDropdownMenuProps) {
  const pathname = usePathname();
  const { user, profile, activeWorkspace } = useAuth();
  const { t, langText } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const resolvedSettingsHref = useMemo(
    () =>
      resolveWorkspaceSettingsHref({
        pathname: pathname || "",
        activeWorkspace,
        settingsHref,
      }),
    [activeWorkspace, pathname, settingsHref]
  );
  const resolvedSupportHref = useMemo(
    () =>
      resolveWorkspaceSupportHref({
        pathname: pathname || "",
        activeWorkspace,
      }),
    [activeWorkspace, pathname]
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name || profile?.fullName || "Kisan Kamai User";
  const avatarAlt = langText(
    "User profile avatar",
    "वापरकर्ता प्रोफाइल अवतार"
  );
  const photoUrl = user?.photoUrl || profile?.photoUrl || "";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "KK";
  const triggerClassName = fullWidth
    ? "w-full justify-between"
    : "justify-between";
  const panelClassName =
    panelMode === "inline"
      ? "relative mt-3 w-full"
      : "absolute right-0 top-full mt-3 w-[18rem] max-w-[calc(100vw-1.5rem)]";

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? "w-full" : ""} ${className}`}
      data-settings-href={resolvedSettingsHref}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`kk-profile-trigger kk-depth-tile flex items-center gap-3 rounded-full border border-white/55 bg-white/75 px-2 py-2 pr-4 text-left shadow-[0_14px_36px_-22px_rgba(15,23,42,0.6)] backdrop-blur-xl transition hover:bg-white/95 dark:border-white/10 dark:bg-[rgba(24,28,34,0.78)] dark:shadow-[0_16px_38px_-22px_rgba(0,0,0,0.85)] ${triggerClassName}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("header.aria.my_profile")}
      >
        {photoUrl ? (
          <img
            alt={avatarAlt}
            className="h-10 w-10 rounded-full border-2 border-on-tertiary-container/30 object-cover shadow-sm"
            src={photoUrl}
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-on-tertiary-container/30 bg-primary-container text-sm font-black text-white shadow-sm">
            {initials}
          </span>
        )}
        {showLabel ? (
          <span className="hidden min-w-0 flex-1 sm:block">
            <span className="block truncate font-headline text-sm font-semibold leading-tight text-on-surface dark:text-slate-100">
              {displayName}
            </span>
          </span>
        ) : null}
        <span
          className={`material-symbols-outlined ml-2 text-lg text-on-surface-variant transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {open ? (
        <div
          className={`${panelClassName} overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-950`}
          role="menu"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/70">
            {photoUrl ? (
              <img
                alt={avatarAlt}
                className="h-11 w-11 rounded-full object-cover"
                src={photoUrl}
              />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-sm font-black text-white">
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-slate-900 dark:text-slate-100">
                {displayName}
              </p>
            </div>
          </div>

          <div className="px-3 py-2">
            <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {t("header.menu.profiles")}
            </h4>
            <div className="space-y-1">
              <Link
                href={resolvePortalHref("owner")}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <span className="material-symbols-outlined text-[19px]">agriculture</span>
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800 transition-colors group-hover:text-primary dark:text-slate-200">
                    {t("header.dropdown.owner_profile")}
                  </span>
                </span>
              </Link>

              <Link
                href={resolvePortalHref("renter")}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <span className="material-symbols-outlined text-[19px]">grid_view</span>
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800 transition-colors group-hover:text-primary dark:text-slate-200">
                    {t("header.dropdown.renter_profile")}
                  </span>
                </span>
              </Link>
            </div>
          </div>

          <div className="mx-3 h-px bg-slate-100 dark:bg-slate-800" />

          <div className="px-3 py-2">
            <h4 className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              {t("header.menu.account")}
            </h4>
            <div className="space-y-1">
              <Link
                href={resolvedSettingsHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <span className="material-symbols-outlined text-xl text-slate-500">settings</span>
                <span className="text-sm font-medium">{t("header.menu.settings")}</span>
              </Link>
              <Link
                href={resolvedSupportHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <span className="material-symbols-outlined text-xl text-slate-500">help_outline</span>
                <span className="text-sm font-medium">{t("header.menu.help_support")}</span>
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-900/70">
            <Link
              href="/logout"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-2 py-1 text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span className="text-sm font-medium">{t("header.menu.sign_out")}</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
