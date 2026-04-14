"use client";

import { useState, useTransition } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { FormField, FormNotice, FormShell } from "@/components/forms/FormKit";
import { resetPasswordAction } from "@/lib/actions/firebase-data";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await resetPasswordAction({ identifier, password, confirmPassword });
      if (!result.ok) {
        setError(result.error || t("forgot-password.could_not_reset_password"));
        return;
      }

      setSuccess(t("forgot-password.password_updated_redirecting_to_login"));
      window.setTimeout(() => {
        window.location.href = result.redirectTo || "/login";
      }, 800);
    });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <FormShell
          eyebrow={t("forgot-password.reset_password")}
          title={t("forgot-password.reset_password")}
          description={t("forgot-password.otp_is_disabled_in_this_local_phase_reset_directly_using_your_registered_email_or_phone")}
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <FormField label={t("forgot-password.email_or_phone")}>
              <input className="kk-input" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
            </FormField>
            <FormField label={t("forgot-password.new_password")}>
              <input className="kk-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </FormField>
            <FormField label={t("forgot-password.confirm_password")}>
              <input className="kk-input" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </FormField>

            {error ? <FormNotice tone="error">{error}</FormNotice> : null}
            {success ? <FormNotice tone="success">{success}</FormNotice> : null}

            <button
              type="submit"
              disabled={isPending}
              className="kk-form-primary-button w-full"
            >
              {isPending ? t("forgot-password.updating") : t("forgot-password.reset_password")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link href="/login" className="font-black text-secondary hover:underline dark:text-amber-400">
              {t("forgot-password.back_to_login")}
            </Link>
          </p>
        </FormShell>
      </main>
      <Footer />
    </div>
  );
}


