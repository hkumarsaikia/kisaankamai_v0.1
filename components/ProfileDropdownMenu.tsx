"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { resolvePortalHref } from "@/lib/workspace-routing.js";

type ProfileDropdownMenuProps = {
  className?: string;
  settingsHref?: string;
  showLabel?: boolean;
  fullWidth?: boolean;
  panelMode?: "popover" | "inline";
};

export function ProfileDropdownMenu({
  className = "",
  showLabel = true,
  fullWidth = false,
  panelMode = "popover",
}: ProfileDropdownMenuProps) {
  const pathname = usePathname();
  const { user, profile, activeWorkspace } = useAuth();
  const { t, langText } = useLanguage();
  const [open, setOpen] = useState(false);
  const [notificationsCleared, setNotificationsCleared] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setNotificationsLoading(true);
    const timeout = window.setTimeout(() => setNotificationsLoading(false), 300);
    return () => window.clearTimeout(timeout);
  }, [open]);

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
      : "absolute right-0 top-full mt-3 w-80 max-w-[calc(100vw-1.5rem)]";
  const notifications = notificationsCleared
    ? []
    : [
        {
          title: langText("Booking Confirmed", "बुकिंगची पुष्टी झाली"),
          body: langText("Booking Confirmed: John Deere 5050D for Oct 24", "बुकिंग पुष्टी: २४ ऑक्टोबरसाठी John Deere 5050D"),
          time: langText("2 mins ago", "२ मिनिटांपूर्वी"),
          icon: "check_circle",
          tone: "bg-green-50/50 border-green-100/50 hover:bg-green-50",
          iconTone: "bg-green-100 text-green-600",
        },
        {
          title: langText("New Request", "नवीन विनंती"),
          body: langText("New Request: Mahindra 575 DI from Namdev P.", "नवीन विनंती: नामदेव पी. कडून Mahindra 575 DI"),
          time: langText("1 hour ago", "१ तासापूर्वी"),
          icon: "pending_actions",
          tone: "bg-orange-50/50 border-orange-100/50 hover:bg-orange-50",
          iconTone: "bg-orange-100 text-[#ec5b13]",
        },
        {
          title: langText("Booking Cancelled", "बुकिंग रद्द केले"),
          body: langText("Booking Cancelled by Renter: John Deere 5050D", "भाडेकरूने बुकिंग रद्द केले: John Deere 5050D"),
          time: langText("3 hours ago", "३ तासांपूर्वी"),
          icon: "cancel",
          tone: "bg-red-50/50 border-red-100/50 hover:bg-red-50",
          iconTone: "bg-red-100 text-red-600",
        },
        {
          title: langText("Booking Cancelled", "बुकिंग रद्द केले"),
          body: langText("Booking Cancelled by Owner: Mahindra 575 DI", "मालकाने बुकिंग रद्द केले: Mahindra 575 DI"),
          time: langText("5 hours ago", "५ तासांपूर्वी"),
          icon: "cancel",
          tone: "bg-red-50/50 border-red-100/50 hover:bg-red-50",
          iconTone: "bg-red-100 text-red-600",
        },
      ];

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? "w-full" : ""} ${className}`}
      data-active-workspace={activeWorkspace || undefined}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`kk-profile-trigger kk-depth-tile flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-2 pr-4 text-left shadow-[0_14px_36px_-22px_rgba(15,23,42,0.6)] transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_18px_44px_-28px_rgba(0,0,0,0.72)] ${triggerClassName}`}
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
          className={`${panelClassName} flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white font-display shadow-2xl dark:border-slate-800 dark:bg-slate-950`}
          data-opaque-profile-menu
          role="menu"
        >
          <div className="flex items-center gap-4 border-b border-slate-100 p-5 dark:border-slate-800">
            {photoUrl ? (
              <img
                alt={avatarAlt}
                className="h-12 w-12 shrink-0 rounded-full bg-slate-200 object-cover"
                src={photoUrl}
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-black text-slate-700">
                {initials}
              </span>
            )}
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-lg font-bold leading-tight text-slate-900 dark:text-slate-100">
                {displayName}
              </p>
            </div>
          </div>

          <div className="py-2">
            <h4 className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              {t("header.menu.profiles")}
            </h4>
            <div className="px-3">
              <Link
                href={resolvePortalHref("owner")}
                onClick={() => setOpen(false)}
                className="group flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ec5b13]/10 text-[#ec5b13] transition-colors group-hover:bg-[#ec5b13] group-hover:text-white">
                  <span className="material-symbols-outlined">grid_view</span>
                </span>
                <span className="flex flex-col">
                  <span className="text-base font-semibold leading-tight text-slate-800 transition-colors group-hover:text-[#ec5b13] dark:text-slate-200">
                    {t("header.dropdown.owner_profile")}
                  </span>
                </span>
              </Link>

              <Link
                href={resolvePortalHref("renter")}
                onClick={() => setOpen(false)}
                className="group mt-1 flex w-full items-center gap-4 rounded-xl p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ec5b13]/10 text-[#ec5b13] transition-colors group-hover:bg-[#ec5b13] group-hover:text-white">
                  <span className="material-symbols-outlined">agriculture</span>
                </span>
                <span className="flex flex-col">
                  <span className="text-base font-semibold leading-tight text-slate-800 transition-colors group-hover:text-[#ec5b13] dark:text-slate-200">
                    {t("header.dropdown.renter_profile")}
                  </span>
                </span>
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 py-2 dark:border-slate-800">
            <div className="flex items-center justify-between px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>{langText("NOTIFICATIONS", "सूचना")}</span>
              {notificationsLoading ? (
                <span className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-[#ec5b13] animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={() => setNotificationsCleared(true)}
                  disabled={!notifications.length}
                  className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    notifications.length
                      ? "text-slate-800 hover:text-[#ec5b13] dark:text-slate-200"
                      : "cursor-not-allowed text-slate-300"
                  }`}
                >
                  {langText("Clear All", "सर्व पुसून टाका")}
                </button>
              )}
            </div>

            {notificationsLoading ? (
              <div className="flex flex-col gap-2 px-3 pb-3">
                {[0, 1].map((index) => (
                  <div key={index} className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-3 animate-pulse dark:border-slate-800 dark:bg-slate-900/60">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="flex flex-1 flex-col gap-2 py-1">
                      <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-2.5 w-full rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="mt-1 h-2 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length ? (
              <div className="flex flex-col gap-2 px-3 pb-3">
                {notifications.map((notification, index) => (
                  <div
                    key={`${notification.title}-${index}`}
                    className={`group flex cursor-pointer gap-4 rounded-xl border p-3 transition-colors ${notification.tone}`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.iconTone}`}>
                      <span className="material-symbols-outlined text-xl">{notification.icon}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{notification.title}</span>
                      <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{notification.body}</p>
                      <span className="mt-1 text-[10px] text-slate-400">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-3 py-6 pb-3 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-900">
                  <span className="material-symbols-outlined text-2xl">done_all</span>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {langText("All caught up!", "सर्व काही पाहिले!")}
                </span>
                <p className="mt-1 text-xs text-slate-500">
                  {langText("No new notifications at the moment.", "सध्या नवीन सूचना नाहीत.")}
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100/50 px-3 pb-3 pt-3 dark:border-slate-800">
            <Link
              href="/logout"
              onClick={() => setOpen(false)}
              className="group flex w-full items-center gap-4 rounded-xl p-3 text-left text-red-600 transition-colors hover:bg-red-50/50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white dark:bg-red-950/40 dark:text-red-300">
                <span className="material-symbols-outlined text-xl">logout</span>
              </span>
              <span className="text-sm font-bold">{t("header.menu.sign_out")}</span>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
