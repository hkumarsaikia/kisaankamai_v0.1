"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { FormNotice } from "@/components/forms/FormKit";
import {
  clearPasswordResetStorage,
  getResetStorageItem,
  RESET_ID_TOKEN_KEY,
  RESET_IDENTIFIER_KEY,
  RESET_VERIFIED_KEY,
} from "@/components/auth/password-reset-storage";
import { getFirebaseAuthClient } from "@/lib/firebase-client";

type ResetCompleteResponse = {
  ok?: boolean;
  error?: string;
};

export default function NewPasswordPage() {
  const router = useRouter();
  const { langText } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedIdentifier = getResetStorageItem(RESET_IDENTIFIER_KEY);
    const verified = getResetStorageItem(RESET_VERIFIED_KEY);
    const idToken = getResetStorageItem(RESET_ID_TOKEN_KEY);

    if (!storedIdentifier) {
      router.replace("/forgot-password");
      return;
    }

    if (verified !== "true" || !idToken) {
      router.replace("/forgot-password/verify-otp");
      return;
    }

    setIdentifier(storedIdentifier);
  }, [router]);

  const checks = useMemo(
    () => [
      { label: langText("6+ Characters", "किमान ६ अक्षरे"), met: password.length >= 6 },
      { label: langText("Passwords Match", "पासवर्ड जुळतात"), met: Boolean(confirmPassword) && password === confirmPassword },
    ],
    [confirmPassword, langText, password]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const idToken = getResetStorageItem(RESET_ID_TOKEN_KEY);
    if (!idToken) {
      setError(langText("Verify the reset OTP again before changing your password.", "पासवर्ड बदलण्यापूर्वी रीसेट ओटीपी पुन्हा पडताळा."));
      router.replace("/forgot-password/verify-otp");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/password-reset/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          password,
          confirmPassword,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as ResetCompleteResponse;

      if (!response.ok || payload.ok === false) {
        throw new Error(payload.error || langText("Could not update password.", "पासवर्ड अपडेट करता आला नाही."));
      }

      try {
        await getFirebaseAuthClient().signOut();
      } catch {
        // Ignore client sign-out failures after a successful password update.
      }

      clearPasswordResetStorage();
      router.push("/forgot-password/success");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : langText("Could not update password.", "पासवर्ड अपडेट करता आला नाही.")
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface flex flex-col">
      <main className="relative flex min-h-[calc(100vh-6rem)] flex-grow items-center justify-center overflow-hidden px-6 py-28">
        <div className="absolute inset-0 bg-[radial-gradient(#143b2e_0.5px,transparent_0.5px)] bg-[length:24px_24px] opacity-[0.05]" />

        <section className="relative w-full max-w-lg">
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-xl md:p-12">
            <div className="mb-10 flex flex-col items-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/10">
                <span className="material-symbols-outlined text-4xl text-primary-container">lock_reset</span>
              </div>
              <h1 className="font-headline text-3xl font-extrabold text-primary">
                {langText("Create New Password", "नवीन पासवर्ड तयार करा")}
              </h1>
              <p className="mt-4 max-w-xs text-sm font-medium text-on-surface-variant">
                {langText(
                  "Your new password must be different from previous passwords and will apply to your linked Kisan Kamai credentials.",
                  "तुमचा नवीन पासवर्ड आधीच्या पासवर्डपेक्षा वेगळा असावा आणि तो तुमच्या Kisan Kamai खात्याच्या जोडलेल्या क्रेडेन्शियल्सवर लागू होईल."
                )}
              </p>
              {identifier ? (
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                  {identifier}
                </p>
              ) : null}
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="font-label text-sm font-bold text-on-surface" htmlFor="new-password">
                    {langText("New Password", "नवीन पासवर्ड")}
                  </label>
                  <span className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant">
                    {langText("Required", "आवश्यक")}
                  </span>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary">
                    lock
                  </span>
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface py-4 pl-12 pr-12 font-medium transition-all placeholder:text-outline-variant focus:border-transparent focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-primary"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={langText("Toggle password visibility", "पासवर्ड दृश्यमानता बदला")}
                  >
                    <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block px-1 font-label text-sm font-bold text-on-surface" htmlFor="confirm-password">
                  {langText("Confirm New Password", "पासवर्डची पुष्टी करा")}
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary">
                    verified_user
                  </span>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-xl border border-outline-variant bg-surface py-4 pl-12 pr-12 font-medium transition-all placeholder:text-outline-variant focus:border-transparent focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-primary"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={langText("Toggle confirm password visibility", "पासवर्ड पुष्टी दृश्यमानता बदला")}
                  >
                    <span className="material-symbols-outlined">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container p-4">
                {checks.map((check) => (
                  <div key={check.label} className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[18px] ${check.met ? "text-emerald-600" : "text-outline-variant"}`}>
                      {check.met ? "check_circle" : "radio_button_unchecked"}
                    </span>
                    <span className="text-[11px] font-bold text-on-surface-variant">{check.label}</span>
                  </div>
                ))}
              </div>

              {error ? <FormNotice tone="error">{error}</FormNotice> : null}

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !identifier}
                  className="flex w-full flex-col items-center rounded-xl bg-primary-container py-4 font-headline text-lg font-extrabold leading-tight text-white shadow-lg transition-all hover:bg-primary active:scale-[0.98] disabled:opacity-70"
                >
                  <span>{isSubmitting ? langText("Updating...", "अपडेट होत आहे...") : langText("Update Password", "पासवर्ड अपडेट करा")}</span>
                  <span className="text-xs font-medium opacity-80">{langText("Secure reset", "सुरक्षित रीसेट")}</span>
                </button>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm font-bold text-primary decoration-2 underline-offset-4 hover:underline"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  {langText("Back to Sign In", "साइन इनकडे परत")}
                </Link>
              </div>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span className="text-xs font-medium">{langText("Bank-grade Security", "उच्च दर्जाची सुरक्षा")}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-outline-variant" />
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">support_agent</span>
              <span className="text-xs font-medium">{langText("24/7 Support", "२४x७ मदत")}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
