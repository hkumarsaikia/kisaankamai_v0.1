"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useTransition } from "react";
import { selectWorkspaceAction } from "@/lib/actions/local-data";
import { useAuth } from "@/components/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageContext";
import { WEB_PUSH_ENABLED } from "@/lib/notifications";

export const OwnerTopBar = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const userName = user?.name || profile?.fullName || t("ownerTopBar.title");

  const initials = userName.substring(0, 1).toUpperCase();
  const handleSwitch = () => {
    startTransition(async () => {
      const result = await selectWorkspaceAction("renter");
      window.location.href = result.redirectTo || "/renter-profile";
    });
  };

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-4 md:px-8 z-40 shadow-sm transition-all">
      <div className="flex items-center gap-4 lg:ml-0 ml-12">
        <span className="text-lg font-black text-emerald-900 dark:text-emerald-50 font-headline uppercase tracking-tight hidden sm:block">
          {t("ownerTopBar.title")}
        </span>
        {/* Back to Home button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <span className="material-symbols-outlined text-[15px]">home</span>
          <span className="hidden sm:inline">{t("ownerTopBar.back_home")}</span>
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggle />
        <button
          type="button"
          disabled={isPending}
          onClick={handleSwitch}
          className="hidden md:flex px-4 py-1.5 rounded-full border border-secondary text-secondary text-xs font-bold hover:bg-secondary hover:text-white transition-all items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          {t("ownerTopBar.switch_to_renter")}
        </button>
        {WEB_PUSH_ENABLED ? (
          <div className="flex items-center gap-1 md:gap-2 text-slate-500">
            <span className="material-symbols-outlined p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full cursor-pointer transition-colors text-sm md:text-base">
              notifications
            </span>
          </div>
        ) : null}
        {/* Avatar with name */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-500 overflow-hidden shadow-sm">
            <span className="text-emerald-700 font-bold text-sm md:text-base uppercase">
              {initials}
            </span>
          </div>
          <span className="hidden md:block text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
};

