"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { FormField, FormNotice, FormShell } from "@/components/forms/FormKit";
import { loginAction } from "@/lib/actions/local-data";
import { assetPath } from "@/lib/site";

export default function LoginPage() {
  const { t } = useLanguage();
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
      <main className="relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image
            src={assetPath("/assets/generated/farm_yard.png")}
            alt="Farm yard"
            className="object-cover opacity-10 dark:opacity-15"
            fill
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background dark:from-slate-950/80 dark:via-slate-950/95 dark:to-slate-950" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-12rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-secondary backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-amber-400">
              <span className="material-symbols-outlined text-base">verified_user</span>
              {t("login.local_secure_access")}
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-primary dark:text-emerald-50 md:text-6xl">
              {t("login.welcome_back_to_kisan_kamai")}
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium text-slate-600 dark:text-slate-400">
              {t("login.sign_in_with_your_local_test_account_using_email_or_phone_and_password")}
            </p>
          </section>

          <FormShell
            eyebrow={t("login.login")}
            title={t("login.access_your_account")}
            description={t("login.use_your_registered_email_address_or_mobile_number")}
            aside={
              <div className="space-y-4">
                <h3 className="text-lg font-black text-primary dark:text-emerald-50">{t("login.local_secure_access")}</h3>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {t("login.sign_in_with_your_local_test_account_using_email_or_phone_and_password")}
                </p>
                <Link href="/register" className="kk-button-outline w-full">
                  {t("login.create_an_account")}
                </Link>
              </div>
            }
          >
            <form className="space-y-5" onSubmit={handleSubmit}>
              <FormField label={t("login.mobile_or_email")} htmlFor="identifier">
                <input
                  id="identifier"
                  className="kk-input"
                  placeholder={t("login.enter_phone_or_email")}
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                />
              </FormField>

              <FormField label={t("login.password")} htmlFor="password">
                <div className="mb-2 flex items-center justify-end">
                  <Link href="/forgot-password" className="text-xs font-bold text-secondary hover:underline dark:text-amber-400">
                    {t("login.forgot_password")}
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className="kk-input"
                  placeholder={t("login.enter_password")}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FormField>

              {error ? <FormNotice tone="error">{error}</FormNotice> : null}

              <button
                type="submit"
                disabled={isPending}
                className="kk-form-primary-button w-full"
              >
                {isPending ? t("login.signing_in") : t("login.login_to_kisan_kamai")}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              {t("login.new_to_kisan_kamai")}{" "}
              <Link href="/register" className="font-black text-secondary hover:underline dark:text-amber-400">
                {t("login.create_an_account")}
              </Link>
            </p>
          </FormShell>
        </div>
      </main>
      <Footer />
    </div>
  );
}
