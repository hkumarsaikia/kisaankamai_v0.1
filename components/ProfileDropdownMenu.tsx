"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import type { NotificationRecord, NotificationTone } from "@/lib/local-data/types";
import { resolvePortalHref } from "@/lib/workspace-routing.js";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type ProfileDropdownMenuProps = {
  className?: string;
  settingsHref?: string;
  showLabel?: boolean;
  fullWidth?: boolean;
  panelMode?: "popover" | "inline";
};

type NotificationApiResponse = {
  ok?: boolean;
  notifications?: NotificationRecord[];
  error?: string;
};

const PROFILE_DROPDOWN_EXIT_MS = 170;

const notificationToneClass: Record<NotificationTone, { row: string; icon: string }> = {
  success: {
    row: "border-emerald-100 bg-emerald-50/80 hover:border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/45 dark:bg-emerald-950/35 dark:hover:bg-emerald-950/55",
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200",
  },
  warning: {
    row: "border-orange-100 bg-orange-50/80 hover:border-orange-200 hover:bg-orange-50 dark:border-orange-900/45 dark:bg-orange-950/30 dark:hover:bg-orange-950/50",
    icon: "bg-orange-100 text-[#ec5b13] dark:bg-orange-900/70 dark:text-orange-200",
  },
  danger: {
    row: "border-red-100 bg-red-50/80 hover:border-red-200 hover:bg-red-50 dark:border-red-900/45 dark:bg-red-950/30 dark:hover:bg-red-950/50",
    icon: "bg-red-100 text-red-700 dark:bg-red-900/70 dark:text-red-200",
  },
  info: {
    row: "border-sky-100 bg-sky-50/80 hover:border-sky-200 hover:bg-sky-50 dark:border-sky-900/45 dark:bg-sky-950/30 dark:hover:bg-sky-950/50",
    icon: "bg-sky-100 text-sky-700 dark:bg-sky-900/70 dark:text-sky-200",
  },
  neutral: {
    row: "border-slate-100 bg-slate-50/90 hover:border-slate-200 hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-900",
    icon: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200",
  },
};

function formatNotificationTime(createdAt: string, langText: (english: string, marathi: string) => string) {
  const timestamp = Date.parse(createdAt);
  if (!Number.isFinite(timestamp)) {
    return langText("Just now", "आत्ताच");
  }

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (elapsedSeconds < 60) {
    return langText("Just now", "आत्ताच");
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  if (elapsedMinutes < 60) {
    return langText(`${elapsedMinutes} min ago`, `${elapsedMinutes} मिनिटांपूर्वी`);
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return langText(`${elapsedHours} hr ago`, `${elapsedHours} तासांपूर्वी`);
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  return langText(`${elapsedDays} day${elapsedDays === 1 ? "" : "s"} ago`, `${elapsedDays} दिवसांपूर्वी`);
}

function notificationClasses(tone?: NotificationTone) {
  return notificationToneClass[tone || "neutral"] || notificationToneClass.neutral;
}

export function ProfileDropdownMenu({
  className = "",
  showLabel = true,
  fullWidth = false,
  panelMode = "popover",
}: ProfileDropdownMenuProps) {
  const pathname = usePathname();
  const { user, profile, activeWorkspace } = useAuth();
  const { t, langText } = useLanguage();
  const [panelMounted, setPanelMounted] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(false);
  const [notificationsClearing, setNotificationsClearing] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const openFrameRef = useRef<number | null>(null);
  const panelOpen = panelMounted && panelVisible;

  const clearTimers = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openFrameRef.current !== null) {
      window.cancelAnimationFrame(openFrameRef.current);
      openFrameRef.current = null;
    }
  }, []);

  const openMenu = useCallback(() => {
    clearTimers();
    setPanelMounted(true);
    openFrameRef.current = window.requestAnimationFrame(() => {
      setPanelVisible(true);
      openFrameRef.current = null;
    });
  }, [clearTimers]);

  const closeMenu = useCallback(() => {
    clearTimers();
    setPanelVisible(false);
    closeTimerRef.current = window.setTimeout(() => {
      setPanelMounted(false);
      closeTimerRef.current = null;
    }, PROFILE_DROPDOWN_EXIT_MS);
  }, [clearTimers]);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    setNotificationsLoading(true);
    setNotificationsError(false);
    try {
      const response = await fetch("/api/notifications", {
        credentials: "include",
        cache: "no-store",
      });

      if (response.status === 401) {
        setNotifications([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load notifications.");
      }

      const payload = (await response.json()) as NotificationApiResponse;
      setNotifications(Array.isArray(payload.notifications) ? payload.notifications : []);
    } catch {
      setNotificationsError(true);
    } finally {
      setNotificationsLoading(false);
    }
  }, [user]);

  const clearAllNotifications = useCallback(async () => {
    if (!notifications.length || notificationsClearing) {
      return;
    }

    setNotificationsClearing(true);
    setNotificationsError(false);
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Could not clear notifications.");
      }

      setNotifications([]);
    } catch {
      setNotificationsError(true);
    } finally {
      setNotificationsClearing(false);
    }
  }, [notifications.length, notificationsClearing]);

  const markNotificationRead = useCallback(async (notificationId: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== notificationId));
    await fetch(`/api/notifications/${encodeURIComponent(notificationId)}/read`, {
      method: "POST",
      credentials: "include",
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (!panelMounted || !panelVisible) {
      return;
    }

    void loadNotifications();
  }, [panelMounted, panelVisible, loadNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeMenu]);

  const displayName = user?.name || profile?.fullName || "Kisan Kamai User";
  const avatarAlt = langText("User profile avatar", "वापरकर्ता प्रोफाइल अवतार");
  const photoUrl = user?.photoUrl || profile?.photoUrl || "";
  const showPhoto = Boolean(photoUrl && !avatarError);
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "KK";
  const triggerClassName = fullWidth ? "w-full justify-between" : "justify-between";
  const panelClassName =
    panelMode === "inline"
      ? "relative mt-3 w-full"
      : "absolute right-0 top-full mt-3 w-80 max-w-[calc(100vw-1.5rem)]";

  useEffect(() => {
    setAvatarError(false);
  }, [photoUrl]);

  return (
    <div
      ref={containerRef}
      className={`relative ${fullWidth ? "w-full" : ""} ${className}`}
      data-active-workspace={activeWorkspace || undefined}
    >
      <button
        type="button"
        onClick={() => (panelOpen ? closeMenu() : openMenu())}
        className={`kk-profile-trigger kk-depth-tile flex items-center gap-3 rounded-full border border-emerald-900/10 bg-white px-2 py-2 pr-4 text-left shadow-[0_16px_42px_-26px_rgba(15,23,42,0.72)] transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-[0_20px_52px_-34px_rgba(0,0,0,0.8)] ${triggerClassName}`}
        aria-expanded={panelOpen}
        aria-haspopup="menu"
        aria-label={t("header.aria.my_profile")}
      >
        {showPhoto ? (
          <img
            alt={avatarAlt}
            className="h-10 w-10 rounded-full border-2 border-on-tertiary-container/30 object-cover shadow-sm"
            onError={() => setAvatarError(true)}
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
          className={`material-symbols-outlined ml-2 text-lg text-on-surface-variant transition-transform duration-300 ${
            panelOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {panelMounted ? (
        <div
          className={`kk-profile-dropdown-panel ${panelClassName} flex flex-col overflow-hidden rounded-2xl border border-emerald-900/10 bg-white font-display shadow-[0_28px_80px_-34px_rgba(15,23,42,0.55)] dark:border-slate-800 dark:bg-slate-950`}
          data-opaque-profile-menu
          data-panel-mode={panelMode}
          data-state={panelVisible ? "open" : "closed"}
          role="menu"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 p-4 dark:border-slate-800">
            {showPhoto ? (
              <img
                alt={avatarAlt}
                className="h-12 w-12 shrink-0 rounded-full bg-slate-200 object-cover ring-2 ring-emerald-100 dark:ring-emerald-900/40"
                onError={() => setAvatarError(true)}
                src={photoUrl}
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                {initials}
              </span>
            )}
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-base font-bold leading-tight text-slate-900 dark:text-slate-100">
                {displayName}
              </p>
            </div>
          </div>

          <div className="py-2">
            <h4 className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t("header.menu.profiles")}
            </h4>
            <div className="px-2">
              <Link
                href={resolvePortalHref("owner")}
                onClick={closeMenu}
                className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ec5b13]/10 text-[#ec5b13] transition-colors group-hover:bg-[#ec5b13] group-hover:text-white">
                  <span className="material-symbols-outlined">grid_view</span>
                </span>
                <span className="text-sm font-semibold leading-tight text-slate-800 transition-colors group-hover:text-[#ec5b13] dark:text-slate-200">
                  {t("header.dropdown.owner_profile")}
                </span>
              </Link>

              <Link
                href={resolvePortalHref("renter")}
                onClick={closeMenu}
                className="group mt-1 flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ec5b13]/10 text-[#ec5b13] transition-colors group-hover:bg-[#ec5b13] group-hover:text-white">
                  <span className="material-symbols-outlined">agriculture</span>
                </span>
                <span className="text-sm font-semibold leading-tight text-slate-800 transition-colors group-hover:text-[#ec5b13] dark:text-slate-200">
                  {t("header.dropdown.renter_profile")}
                </span>
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 py-2 dark:border-slate-800">
            <div className="flex items-center justify-between px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>{langText("NOTIFICATIONS", "सूचना")}</span>
              {notificationsLoading || notificationsClearing ? (
                <span className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-[#ec5b13] animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={() => void clearAllNotifications()}
                  disabled={!notifications.length}
                  className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    notifications.length
                      ? "text-slate-800 hover:text-[#ec5b13] dark:text-slate-200"
                      : "cursor-not-allowed text-slate-300 dark:text-slate-700"
                  }`}
                >
                  {langText("Clear All", "सर्व पुसून टाका")}
                </button>
              )}
            </div>

            <div aria-live="polite">
              {notificationsLoading ? (
                <div className="flex flex-col gap-2 px-3 pb-3">
                  {[0, 1].map((index) => (
                    <div key={index} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 animate-pulse dark:border-slate-800 dark:bg-slate-900/60">
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
                <div className="flex max-h-[22rem] flex-col gap-2 overflow-y-auto px-3 pb-3">
                  {notifications.map((notification) => {
                    const classes = notificationClasses(notification.tone);
                    const content = (
                      <>
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${classes.icon}`}>
                          <span className="material-symbols-outlined text-xl">{notification.icon || "notifications"}</span>
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <span className="block truncate text-sm font-bold text-slate-800 dark:text-slate-100">
                            {notification.title}
                          </span>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                            {notification.body}
                          </p>
                          <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            {formatNotificationTime(notification.createdAt, langText)}
                          </span>
                        </div>
                      </>
                    );

                    return notification.href ? (
                      <Link
                        key={notification.id}
                        href={notification.href}
                        onClick={() => {
                          void markNotificationRead(notification.id);
                          closeMenu();
                        }}
                        className={`kk-profile-notification-row group flex gap-3 rounded-xl border p-3 ${classes.row}`}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => void markNotificationRead(notification.id)}
                        className={`kk-profile-notification-row group flex w-full gap-3 rounded-xl border p-3 ${classes.row}`}
                      >
                        {content}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-4 pb-4 pt-5 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-900">
                    <span className="material-symbols-outlined text-2xl">done_all</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {langText("All caught up!", "सर्व काही पाहिले!")}
                  </span>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {notificationsError
                      ? langText("Could not refresh notifications. Try again soon.", "सूचना रीफ्रेश करता आल्या नाहीत. थोड्या वेळाने पुन्हा प्रयत्न करा.")
                      : langText("No new notifications at the moment.", "सध्या नवीन सूचना नाहीत.")}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100/80 px-3 pb-3 pt-3 dark:border-slate-800">
            <Link
              href="/logout"
              onClick={closeMenu}
              className="group flex w-full items-center gap-3 rounded-xl p-3 text-left text-red-600 transition-colors hover:bg-red-50/80 dark:text-red-400 dark:hover:bg-red-950/30"
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
