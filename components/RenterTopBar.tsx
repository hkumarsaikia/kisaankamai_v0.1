"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useTransition } from "react";
import { selectWorkspaceAction } from "@/lib/actions/local-data";
import { useAuth } from "@/components/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageContext";

export const RenterTopBar = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const userName = user?.name || profile?.fullName || t("renterSidebar.default_name");
  const handleSwitch = () => {
    startTransition(async () => {
      const result = await selectWorkspaceAction("owner");
      window.location.href = result.redirectTo || "/owner-profile";
    });
  };

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center px-4 md:px-8 z-40 shadow-sm transition-all">
      <div className="flex items-center gap-4 lg:ml-0 ml-12">
        <h1 className="text-lg font-bold text-emerald-900 dark:text-emerald-50 tracking-tight">
          {t("renterTopBar.greeting", { name: userName })}
        </h1>
        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <span className="material-symbols-outlined text-[15px]">home</span>
          <span className="hidden sm:inline">{t("renterTopBar.home")}</span>
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
          {t("renterTopBar.switch_to_owner")}
        </button>
        {/* Notification bell */}
        <div className="relative">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            notifications
          </span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
        </div>
        {/* Quick Action */}
        <Link
          href="/rent-equipment"
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-sm">agriculture</span>
          {t("renterTopBar.rent_equipment")}
        </Link>
      </div>
    </header>
  );
};

