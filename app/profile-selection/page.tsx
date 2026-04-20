"use client";


import { useEffect, useTransition } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { selectWorkspaceAction } from "@/lib/actions/local-data";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/components/LanguageContext";
import { useAuth } from "@/components/AuthContext";
import { resolvePortalHref } from "@/lib/workspace-routing.js";

export default function ProfileSelectionPage() {
  const { t, langText } = useLanguage();
  const { user, loading, activeWorkspace } = useAuth();
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
        result.redirectTo || resolvePortalHref(workspace);
    });
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Editorial Background Composition */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-secondary-container/10 z-10"></div>
        <img
          alt="Agriculture background"
          className="w-full h-full object-cover grayscale-[20%] brightness-[85%]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxQOjwxd1GOcMalqWnNbjRE_PdmUfc0-NmR6Q4TuQErXFd_qzDuGiC_WdF1g7ttCtoM0UiVMbVLaVQm0WLKWYov6lMhQOFyseyikTrMes5EQXOe_I4a_6cw2Ae-j6WIH5Gaez5ZmPfqiySohcSrnOyQ_NlH63cuQmtxASSLmjDCc3vYWLKGGxXawj6rqyL0fVwYXIhDuPqyurvIFiseFluZhvpkLiRugKXITVBrfbosLWRWCYExgO7RrH5oe0TEtMmGSkIJsYbgPtE"
        />
      </div>

      <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/10 backdrop-blur-md">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-12">
          <Link href="/" className="text-xl font-black tracking-tighter text-on-surface">
            Kisan Kamai
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LanguageToggle compact />
            <Link
              href="/logout"
              className="px-4 py-2 rounded-xl bg-white/20 text-on-surface font-bold text-sm tracking-wide hover:bg-white/30 transition-all"
            >
              {t("profile-selection.sign_out")}
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 flex-grow pt-32 pb-20 px-6 flex flex-col items-center justify-center">
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold font-headline mb-4 tracking-tight text-white drop-shadow-lg">
            {langText("Welcome back, ", "स्वागत आहे, ")}
            <span className="text-primary-fixed">{user.name || user.phone}</span>
          </h1>
          <p className="text-xl text-white/90 font-medium drop-shadow-md">
            {langText("Choose your workspace to get started", "प्रारंभ करण्यासाठी आपले वर्कस्पेस निवडा")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Owner Profile Tile */}
          <button
            onClick={() => handleWorkspaceSelect("owner")}
            disabled={isPending}
            className={`group relative overflow-hidden bg-white/85 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-10 text-left transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:bg-white disabled:opacity-70 ${
              activeWorkspace === "owner" ? "ring-4 ring-primary-container/30" : ""
            }`}
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-20 h-20 rounded-3xl bg-primary-container flex items-center justify-center mb-8 shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform">
                <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  agriculture
                </span>
              </div>
              <h2 className="text-3xl font-black font-headline text-primary mb-3">
                {langText("I am an Owner", "मी मालक आहे")}
              </h2>
              <p className="text-on-surface-variant font-medium leading-relaxed mb-8 text-lg">
                {langText("Manage listings, check bookings, and track your farming earnings.", "सूची व्यवस्थापित करा, बुकिंग तपासा आणि तुमची शेतीची कमाई ट्रॅक करा.")}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-primary font-black text-lg tracking-tight group-hover:gap-4 transition-all">
                  {langText("Open Owner Profile", "मालक प्रोफाइल उघडा")}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
                {activeWorkspace === "owner" && (
                  <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/20">
                    {langText("Last Used", "शेवटचे वापरलेले")}
                  </span>
                )}
              </div>
            </div>
            {/* Background Decorative Element */}
            <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <span className="material-symbols-outlined text-[15rem]">agriculture</span>
            </div>
          </button>

          {/* Renter Profile Tile */}
          <button
            onClick={() => handleWorkspaceSelect("renter")}
            disabled={isPending}
            className={`group relative overflow-hidden bg-white/85 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-10 text-left transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:bg-white disabled:opacity-70 ${
              activeWorkspace === "renter" ? "ring-4 ring-secondary/30" : ""
            }`}
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-8 shadow-xl shadow-secondary/20 group-hover:-rotate-6 transition-transform">
                <span className="material-symbols-outlined text-4xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person_search
                </span>
              </div>
              <h2 className="text-3xl font-black font-headline text-secondary mb-3">
                {langText("I am a Renter", "मी भाडेकरी आहे")}
              </h2>
              <p className="text-on-surface-variant font-medium leading-relaxed mb-8 text-lg">
                {langText("Browse equipment, save listings, and manage your tractor bookings.", "उपकरणे ब्राउझ करा, सूची जतन करा आणि तुमचे ट्रॅक्टर बुकिंग व्यवस्थापित करा.")}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-secondary font-black text-lg tracking-tight group-hover:gap-4 transition-all">
                  {langText("Open Renter Profile", "भाडेकरी प्रोफाइल उघडा")}
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
                {activeWorkspace === "renter" && (
                  <span className="bg-secondary/10 text-secondary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-secondary/20">
                    {langText("Last Used", "शेवटचे वापरलेले")}
                  </span>
                )}
              </div>
            </div>
            {/* Background Decorative Element */}
            <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <span className="material-symbols-outlined text-[15rem]">person_search</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}


