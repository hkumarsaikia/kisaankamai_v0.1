"use client";

import { useMemo, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { emitAuthSyncEvent } from "@/lib/client/auth-sync";
import { resolvePortalHref } from "@/lib/workspace-routing.js";

export default function LogoutPage() {
  const { user, activeWorkspace } = useAuth();
  const { langText } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cancelHref = useMemo(() => {
    if (activeWorkspace === "owner") {
      return resolvePortalHref("owner");
    }

    if (activeWorkspace === "renter") {
      return resolvePortalHref("renter");
    }

    return user ? "/profile-selection" : "/";
  }, [activeWorkspace, user]);

  const handleConfirm = async () => {
    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Sign out failed. Please try again.");
      }

      emitAuthSyncEvent("logout");
      window.location.href = "/";
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Sign out failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-12rem)] flex-1 items-center justify-center overflow-hidden px-4 pb-12 pt-28 sm:px-8">
      <div className="absolute inset-0 z-0">
        <img
          alt="Maharashtra sugarcane field at sunset"
          className="h-full w-full object-cover object-center"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA96MhiPIm-b-42WF50ls3QBlo6Yh018TWaVteeyNmaCAWlG1OVKFGuNUjtdlc84BjefdIgr2EtOlhvPIh4BRCR92VxLpx5AaG-SN5UlDUMGDlyys7ZnQ-kbMsMXeZPaqsCvbECgycmfRdzsLu0nBsXztGXuUfCH2dQ_kKXivjUnVFSuPt-kVYO8LGEcJ9NOyjY-rged1bLMLVGeO-rs7BtmJtnfvyKqoSAf6wq4tkQCp4klVwx2z2YJZEpM2CWaEJWiFlj4PAfd3iK"
        />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <section className="relative z-10 w-full max-w-lg">
        <div className="rounded-[1.5rem] border border-white/30 bg-white/85 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-slate-900/85">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-100 bg-red-50 shadow-sm dark:border-red-900/30 dark:bg-red-900/20">
            <span className="material-symbols-outlined text-3xl text-red-600">logout</span>
          </div>

          <h1 className="font-headline text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            {langText("Sign out of Kisan Kamai?", "किसान कमाईमधून साइन आउट करा?")}
          </h1>
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300 sm:text-base">
            {langText(
              "You will need to sign back in to access your dashboard, bookings, or listings.",
              "तुमच्या डॅशबोर्ड, बुकिंग किंवा सूचीमध्ये प्रवेश करण्यासाठी तुम्हाला पुन्हा साइन इन करावे लागेल."
            )}
          </p>
          {user ? (
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              {langText("Signed in as", "साइन इन केलेले खाते")}: {user.name || user.email || langText("your account", "तुमचे खाते")}.
            </p>
          ) : null}

          {error ? (
            <p className="mt-6 rounded-2xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error">
              {error}
            </p>
          ) : null}

          <div className="mt-8 space-y-4">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-semibold text-white shadow-sm transition-all hover:bg-red-700"
              disabled={loading}
              onClick={handleConfirm}
              type="button"
            >
              <span>{loading ? langText("Signing out...", "साइन आउट करत आहे...") : langText("Confirm Sign Out", "साइन आउट निश्चित करा")}</span>
            </button>

            <Link
              href={cancelHref}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-outline-variant bg-white px-6 py-3.5 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <span>{langText("Back", "मागे जा")}</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
