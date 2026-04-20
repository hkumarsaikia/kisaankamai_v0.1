"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { supportContact } from "@/lib/support-contact";
import { PHONE_RESET_OTP_ENABLED } from "@/lib/auth-capabilities";
import {
  getResetStorageItem,
  maskResetIdentifier,
  RESET_IDENTIFIER_KEY,
  RESET_VERIFIED_KEY,
  setResetStorageItem,
} from "@/components/auth/password-reset-storage";

const tractorBackdrop =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAV0-MxLuHs8OSUPnH54Falhov6x8BfedXlBEmENI0wLBPe6EVlktzQ0z2w1nE4PioD0L8F8jUy8ZJ-pQK41gpB3AkOJNaXtc-81oZ1t8ZxpgBJHHRjkOAO3XWl4XVwGpYYIET90NtSxBVyHHcrs3JGchhwRoROyJMerYL58P43R_DBmRLu7kCk3mU-HWJ2KCm7AmBKeHl_KTX1RxIUhI67svCJP4yzWF3IV4HKvz0LlVlZnuYaa6iR3ZWAjfMOicJ_gTPCNjzJhsD1";
const soilBackdrop =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAP3FEFoz-OjxXibOfuhZu67-WdPubyWKjSsKZCuNYdgtpNugYWYPYPafs9Rld1oowCEIAakNZv7UDA-z6RCNS1cmW11xm4mYwvQFsQUwDAyOM1c2hxgZ6827qIXs5W9AKZ0dBkR9T1V6GT8kagkLKFRBQSO5Ovlm-Y0m3NEDqJIDUDQXHoSZHT-auS8UiHzf-Bb_UwzZbSPuOTtYKhooahn0SHJf1MuicT22XK2n27wx0Z-TTJ7X9IiR32cS97Lh2v0YRqXKm_gUmP";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { langText, text } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: 6 }, () => ""));
  const [error, setError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const storedIdentifier = getResetStorageItem(RESET_IDENTIFIER_KEY);
    if (!storedIdentifier) {
      router.replace("/forgot-password");
      return;
    }

    setIdentifier(storedIdentifier);
  }, [router]);

  const updateDigit = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    setOtpDigits((current) => {
      const next = [...current];
      next[index] = nextValue;
      return next;
    });
    setError("");

    if (nextValue && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!PHONE_RESET_OTP_ENABLED) {
      setError(
        langText(
          "Secure reset verification is not active yet. Please contact support to reset your password safely.",
          "सुरक्षित पासवर्ड रीसेट पडताळणी अजून सुरू नाही. सुरक्षित रीसेटसाठी कृपया सपोर्टशी संपर्क साधा."
        )
      );
      return;
    }

    const otp = otpDigits.join("");
    if (!/^\d{6}$/.test(otp)) {
      setError(langText("Enter a valid 6-digit code.", "वैध ६ अंकी कोड टाका."));
      return;
    }

    if (!setResetStorageItem(RESET_VERIFIED_KEY, "true")) {
      setError(
        langText(
          "Your browser is blocking temporary reset storage. Please allow site storage and try again.",
          "तुमचा ब्राउझर तात्पुरते रीसेट स्टोरेज ब्लॉक करत आहे. साइट स्टोरेज परवानगी द्या आणि पुन्हा प्रयत्न करा."
        )
      );
      return;
    }

    router.push("/forgot-password/new-password");
  };

  return (
    <main className="relative flex min-h-[calc(100vh-12rem)] flex-1 items-center justify-center overflow-hidden px-6 pb-16 pt-28">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-container/50 opacity-90" />
        <img className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20 mix-blend-overlay" alt="" src={tractorBackdrop} />
        <img className="absolute bottom-0 left-0 h-1/2 w-1/3 object-cover opacity-10 mix-blend-overlay" alt="" src={soilBackdrop} />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-slate-700/30 dark:bg-slate-900/80">
          <div className="p-8 md:p-12">
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-on-primary shadow-inner">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  vibration
                </span>
              </div>
              <h1 className="mb-2 text-3xl font-black tracking-tight text-primary md:text-4xl">
                {langText("Verify your mobile number", "तुमच्या मोबाईल क्रमांकाची पडताळणी करा")}
              </h1>
              <p className="mb-4 text-sm font-medium text-primary/70">
                {PHONE_RESET_OTP_ENABLED
                  ? text("Enter the 6-digit verification code to continue your secure password reset.", {
                      cacheKey: "forgot-password.verify-otp.description",
                    })
                  : langText(
                      "Password reset verification will be activated once backend authentication is configured.",
                      "बॅकएंड प्रमाणीकरण कॉन्फिगर झाल्यावर पासवर्ड रीसेट पडताळणी सुरू होईल."
                    )}
              </p>
              <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-outline-variant/30 bg-surface-container/50 px-4 py-2">
                <span className="font-semibold tracking-widest text-on-surface-variant">{maskResetIdentifier(identifier)}</span>
                <Link className="flex items-center gap-1 text-xs font-bold text-secondary hover:underline" href="/forgot-password">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  {langText("Edit", "बदला")}
                </Link>
              </div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <div className={`mb-8 flex justify-between gap-3 ${PHONE_RESET_OTP_ENABLED ? "" : "opacity-50"}`}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(node) => {
                        inputsRef.current[index] = node;
                      }}
                      autoComplete="one-time-code"
                      className={`h-14 w-12 rounded-2xl border-2 bg-surface-container-lowest text-center font-mono text-2xl font-bold transition-all focus:outline-none md:h-20 md:w-16 ${
                        error && index === Math.max(otpDigits.findIndex((value) => value === ""), 0)
                          ? "border-error bg-error-container/20 text-error"
                          : "border-outline-variant text-on-surface focus:border-secondary"
                      }`}
                      inputMode="numeric"
                      maxLength={1}
                      disabled={!PHONE_RESET_OTP_ENABLED}
                      type="text"
                      value={digit}
                      onChange={(event) => updateDigit(index, event.target.value)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                    />
                  ))}
                </div>

                {error ? (
                  <div className="mb-6 flex items-center gap-2 text-sm font-medium text-error">
                    <span className="material-symbols-outlined text-base">error</span>
                    <span>{error}</span>
                  </div>
                ) : PHONE_RESET_OTP_ENABLED ? (
                  <div className="mb-6 flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-base">timer</span>
                    <span>{langText("Enter the verification code sent to your confirmed contact.", "तुमच्या खात्री झालेल्या संपर्कावर पाठवलेला पडताळणी कोड टाका.")}</span>
                  </div>
                ) : (
                  <div className="mb-6 rounded-2xl border border-primary-container/20 bg-primary-fixed/10 px-4 py-4 text-sm font-medium text-on-surface-variant">
                    {langText(
                      `Need help now? Call ${supportContact.phoneDisplay} or email ${supportContact.email}.`,
                      `तात्काळ मदत हवी आहे का? ${supportContact.phoneDisplay} वर कॉल करा किंवा ${supportContact.email} वर ईमेल करा.`
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <button
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-container px-6 py-4 text-lg font-bold text-white shadow-xl shadow-primary-container/20 transition-all hover:bg-primary hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-primary-container"
                  type="submit"
                  disabled={!PHONE_RESET_OTP_ENABLED}
                >
                  <span>{PHONE_RESET_OTP_ENABLED ? langText("Verify and Continue", "पडताळणी करा आणि पुढे जा") : langText("Verification Pending Backend Setup", "पडताळणी बॅकएंड सेटअपनंतर सुरू होईल")}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>

                <div className="flex flex-col items-center justify-between gap-4 px-2 text-sm md:flex-row">
                  <div className="flex items-center gap-2 font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">timer</span>
                    <span>
                      {PHONE_RESET_OTP_ENABLED
                        ? langText("Resend in:", "पुन्हा पाठविण्यासाठी:")
                        : langText("Backend verification pending", "बॅकएंड पडताळणी प्रलंबित")}{" "}
                      {PHONE_RESET_OTP_ENABLED ? <span className="font-bold text-secondary">00:59</span> : null}
                    </span>
                  </div>
                  <button className="cursor-not-allowed font-bold text-on-surface-variant/40" type="button">
                    {PHONE_RESET_OTP_ENABLED ? langText("Resend OTP", "ओटीपी पुन्हा पाठवा") : langText("Enable backend verification first", "प्रथम बॅकएंड पडताळणी सक्षम करा")}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-center gap-3 border-t border-outline-variant/20 bg-surface-container-high/50 p-4">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:-0.3s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:-0.15s]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-secondary" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {text("Encrypting Connection", { cacheKey: "forgot-password.verify-otp.encrypting" })}
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">verified_user</span>
            <span className="text-xs font-bold text-primary">
              {text("Secure Gateway", { cacheKey: "forgot-password.verify-otp.secure-gateway" })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">encrypted</span>
            <span className="text-xs font-bold text-primary">256-bit SSL</span>
          </div>
        </div>
      </div>
    </main>
  );
}
