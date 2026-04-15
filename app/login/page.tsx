"use client";

import { useState, useTransition } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { FormField, FormNotice } from "@/components/forms/FormKit";
import { loginAction } from "@/lib/actions/local-data";
import { assetPath } from "@/lib/site";

const collageTiles = [
  assetPath("/assets/generated/hero_tractor.png"),
  assetPath("/assets/generated/modern_farm_tech.png"),
  assetPath("/assets/generated/farm_yard.png"),
  assetPath("/assets/generated/modern_farm_tech.png"),
  assetPath("/assets/generated/hero_tractor.png"),
  assetPath("/assets/generated/farm_yard.png"),
];

export default function LoginPage() {
  const { t, langText } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await loginAction({ identifier, password });
      if (!result.ok) {
        setError(result.error || t("login.login_failed"));
        return;
      }

      window.location.href = result.redirectTo || "/profile-selection";
    });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      <main className="relative overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="grid h-full grid-cols-2 md:grid-cols-3">
            {collageTiles.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="min-h-[220px] bg-cover bg-center brightness-[0.58] saturate-[0.9] transition-transform duration-500 hover:scale-[1.02]"
                style={{ backgroundImage: `url('${image}')` }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,37,26,0.12),_rgba(0,37,26,0.82))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/35 to-background dark:from-slate-950/30 dark:via-slate-950/20 dark:to-slate-950/80" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center justify-center px-6 py-12">
          <div className="w-full max-w-[560px] overflow-hidden rounded-[2.5rem] border border-white/35 bg-white/80 p-8 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.45)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/85 md:p-12">
            <div className="space-y-10">
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.8rem] border border-primary/10 bg-primary-container/10 shadow-sm">
                  <span className="material-symbols-outlined text-5xl text-primary">agriculture</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tight text-primary dark:text-emerald-50">
                    {langText("Welcome to Kisan Kamai", "किसान कमाई मध्ये स्वागत आहे")}
                  </h1>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                    {langText("Sign in to continue to your workspace", "तुमच्या वर्कस्पेससाठी साइन इन करा")}
                  </p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <FormField
                  label={langText("Mobile number, email, or Aadhaar-linked login", "मोबाइल नंबर, ईमेल किंवा आधार-जोडलेला लॉगिन")}
                  htmlFor="identifier"
                  required
                >
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
                      fingerprint
                    </span>
                    <input
                      id="identifier"
                      className="kk-input pl-14"
                      placeholder={langText("Enter mobile number or email", "मोबाइल नंबर किंवा ईमेल लिहा")}
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                    />
                  </div>
                </FormField>

                <FormField label={langText("Password", "पासवर्ड")} htmlFor="password" required>
                  <div className="mb-2 flex items-center justify-end">
                    <Link href="/forgot-password" className="text-[11px] font-black uppercase tracking-[0.16em] text-secondary hover:underline">
                      {t("login.forgot_password")}
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
                      lock
                    </span>
                    <input
                      id="password"
                      type="password"
                      className="kk-input pl-14 pr-12"
                      placeholder="••••••••"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-xl text-on-surface-variant">
                      visibility
                    </span>
                  </div>
                </FormField>

                {error ? <FormNotice tone="error">{error}</FormNotice> : null}

                <button type="submit" disabled={isPending} className="kk-form-primary-button w-full rounded-2xl text-base shadow-[0_14px_28px_-12px_rgba(20,59,46,0.55)]">
                  <span className="inline-flex items-center gap-2">
                    {isPending ? t("login.signing_in") : langText("Login to Kisan Kamai", "किसान कमाई मध्ये लॉगिन")}
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </span>
                </button>
              </form>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [
                    langText("Fast login", "जलद लॉगिन"),
                    langText("Use the same registered credentials every time.", "नेहमी तेच नोंदणीकृत तपशील वापरा."),
                  ],
                  [
                    langText("Profile ready", "प्रोफाइल तयार"),
                    langText("Switch owner or renter workspace after sign-in.", "साइन इननंतर मालक किंवा भाडेकरी वर्कस्पेस निवडा."),
                  ],
                  [
                    langText("Readable at night", "रात्रीही स्पष्ट"),
                    langText("High-contrast cards and inputs in dark mode.", "डार्क मोडमध्ये स्पष्ट कार्ड आणि इनपुट."),
                  ],
                ].map(([title, copy]) => (
                  <div key={title as string} className="rounded-[1.35rem] border border-outline-variant bg-surface-container-lowest/90 p-4 shadow-sm">
                    <h2 className="text-sm font-black text-primary">{title as string}</h2>
                    <p className="mt-1 text-xs font-medium leading-5 text-on-surface-variant">{copy as string}</p>
                  </div>
                ))}
              </div>

              <p className="text-center text-sm font-semibold text-on-surface-variant">
                {t("login.new_to_kisan_kamai")}{" "}
                <Link href="/register" className="font-black text-primary hover:underline dark:text-emerald-300">
                  {langText("Create account", "खाते तयार करा")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
