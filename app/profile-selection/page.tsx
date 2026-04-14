"use client";

import Image from "next/image";
import { useEffect, useTransition } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { selectWorkspaceAction } from "@/lib/actions/firebase-data";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageContext";
import { useAuth } from "@/components/AuthContext";
import { assetPath } from "@/lib/site";

export default function ProfileSelectionPage() {
  const { t } = useLanguage();
  const { user, logout, loading, activeWorkspace } = useAuth();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading, user]);

  if (loading || !user) {
    return null;
  }

  const handleWorkspaceSelect = (workspace: "owner" | "renter") => {
    startTransition(async () => {
      const result = await selectWorkspaceAction(workspace);
      if (!result.ok) {
        window.location.href = result.redirectTo || "/login";
        return;
      }

      window.location.href =
        result.redirectTo || (workspace === "owner" ? "/owner-profile" : "/renter-profile");
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-surface text-on-surface">
      <div className="fixed inset-0 z-0">
        <Image
          className="object-cover opacity-10 dark:opacity-20"
          src={assetPath("/assets/generated/modern_farm_tech.png")}
          alt="Farm fields"
          fill
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface/50 via-surface/80 to-surface dark:from-slate-950/60 dark:via-slate-950/85 dark:to-slate-950" />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/80">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" className="text-xl font-black tracking-tighter text-primary dark:text-emerald-400">
            Kisan Kamai
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle compact />
            <button
              type="button"
              onClick={async () => {
                await logout();
                window.location.href = "/";
              }}
              className="hidden text-sm font-semibold tracking-tight text-slate-600 transition-colors hover:text-secondary dark:text-slate-400 dark:hover:text-amber-500 sm:inline"
            >
              {t("profile-selection.sign_out")}
            </button>
          </div>
        </nav>
      </header>

      <main className="relative z-10 container mx-auto flex-grow px-6 pb-20 pt-32 lg:px-12">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-primary dark:text-emerald-400 md:text-5xl">
            {t("profile-selection.choose_your_workspace")}
          </h1>
          <p className="text-lg font-medium text-on-surface-variant">
            {t("profile-selection.open_the_owner_or_renter_profile_attached_to_this_local_account")}
          </p>
        </div>

        <div className="mx-auto mb-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <div className="group relative rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-xl shadow-surface-container-high/50 dark:bg-slate-900/40 dark:shadow-black/20">
            <div className="flex h-full flex-col">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/10 dark:bg-emerald-500/10">
                <span className="material-symbols-outlined text-4xl text-primary-container dark:text-emerald-400">agriculture</span>
              </div>
              <div className="mb-8">
                <h2 className="mb-3 text-2xl font-bold font-headline text-primary-container dark:text-emerald-400">
                  {t("profile-selection.owner_profile")}
                </h2>
                <p className="leading-relaxed text-on-surface-variant">
                  {t("profile-selection.manage_listings_bookings_and_local_earnings_data")}
                </p>
              </div>
              <div className="mt-auto space-y-3">
                {activeWorkspace === "owner" ? (
                  <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/80 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                    {t("profile-selection.last_used_workspace")}
                  </div>
                ) : null}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleWorkspaceSelect("owner")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-4 font-bold tracking-tight text-white disabled:opacity-60"
                >
                  {t("profile-selection.open_owner_profile")}
                </button>
              </div>
            </div>
          </div>

          <div className="group relative rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-xl shadow-surface-container-high/50 dark:bg-slate-900/40 dark:shadow-black/20">
            <div className="flex h-full flex-col">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 dark:bg-amber-500/10">
                <span className="material-symbols-outlined text-4xl text-secondary dark:text-amber-500">handshake</span>
              </div>
              <div className="mb-8">
                <h2 className="mb-3 text-2xl font-bold font-headline text-secondary dark:text-amber-500">
                  {t("profile-selection.renter_profile")}
                </h2>
                <p className="leading-relaxed text-on-surface-variant">
                  {t("profile-selection.browse_equipment_save_listings_and_manage_bookings")}
                </p>
              </div>
              <div className="mt-auto space-y-3">
                {activeWorkspace === "renter" ? (
                  <div className="rounded-xl border border-amber-200/70 bg-amber-50/80 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                    {t("profile-selection.last_used_workspace")}
                  </div>
                ) : null}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleWorkspaceSelect("renter")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-4 font-bold tracking-tight text-white disabled:opacity-60 dark:bg-amber-500"
                >
                  {t("profile-selection.open_renter_profile")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


