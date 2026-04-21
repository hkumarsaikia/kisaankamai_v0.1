"use client";

import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink as Link } from "@/components/AppLink";
import {
  clearRecaptchaVerifier,
  getFirebaseAuthError,
  getOptionalFirebaseAuthClient,
  startPhoneVerification,
  verifyPhoneOtp,
} from "@/components/auth/firebase-auth-client";
import { useLanguage } from "@/components/LanguageContext";
import { FormNotice } from "@/components/forms/FormKit";
import { supportContact } from "@/lib/support-contact";
import { PHONE_RESET_OTP_ENABLED } from "@/lib/auth-capabilities";
import {
  getResetStorageItem,
  removeResetStorageItem,
  RESET_ID_TOKEN_KEY,
  RESET_IDENTIFIER_KEY,
  RESET_MASKED_PHONE_KEY,
  RESET_PHONE_E164_KEY,
  RESET_VERIFICATION_ID_KEY,
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
  const auth = useMemo(() => getOptionalFirebaseAuthClient(), []);
  const [phoneE164, setPhoneE164] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: 6 }, () => ""));
  const [verificationId, setVerificationId] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendAvailableIn, setResendAvailableIn] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const resetUnavailableMessage = langText(
    "Password reset by OTP is unavailable in this deployment because Firebase phone authentication is not configured.",
    "या डिप्लॉयमेंटमध्ये Firebase फोन प्रमाणीकरण कॉन्फिगर नसल्यामुळे OTP द्वारे पासवर्ड रीसेट उपलब्ध नाही."
  );
  const storageBlockedMessage = langText(
    "Your browser blocked temporary reset storage. Please allow site storage and try again.",
    "तुमच्या ब्राउझरने तात्पुरते रीसेट स्टोरेज ब्लॉक केले. साइट स्टोरेज परवानगी द्या आणि पुन्हा प्रयत्न करा."
  );

  useEffect(() => {
    const storedIdentifier = getResetStorageItem(RESET_IDENTIFIER_KEY);
    const storedPhone = getResetStorageItem(RESET_PHONE_E164_KEY);
    const storedMaskedPhone = getResetStorageItem(RESET_MASKED_PHONE_KEY);
    const storedVerificationId = getResetStorageItem(RESET_VERIFICATION_ID_KEY);

    if (!storedIdentifier || !storedPhone || !storedMaskedPhone) {
      router.replace("/forgot-password");
      return;
    }

    setPhoneE164(storedPhone);
    setMaskedPhone(storedMaskedPhone);
    setVerificationId(storedVerificationId || "");
  }, [router]);

  useEffect(() => () => clearRecaptchaVerifier("password-reset"), []);

  useEffect(() => {
    if (!resendAvailableIn) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendAvailableIn((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendAvailableIn]);

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

  const sendCode = useCallback(async () => {
    if (!PHONE_RESET_OTP_ENABLED || !auth || !phoneE164 || isSending) {
      if (!PHONE_RESET_OTP_ENABLED || !auth) {
        setError(resetUnavailableMessage);
      }
      return;
    }

    setIsSending(true);
    setError("");
    setInfo("");

    try {
      const nextVerificationId = await startPhoneVerification({
        auth,
        phoneNumber: phoneE164,
        containerId: "kk-reset-recaptcha",
        storeKey: "password-reset",
      });
      if (!setResetStorageItem(RESET_VERIFICATION_ID_KEY, nextVerificationId)) {
        throw new Error(storageBlockedMessage);
      }

      removeResetStorageItem(RESET_ID_TOKEN_KEY);
      removeResetStorageItem(RESET_VERIFIED_KEY);
      setVerificationId(nextVerificationId);
      setResendAvailableIn(60);
      setInfo(
        langText(
          `A reset code was sent to ${maskedPhone}. Enter the six-digit code to continue.`,
          `${maskedPhone} वर रीसेट कोड पाठवला आहे. पुढे जाण्यासाठी सहा अंकी कोड टाका.`
        )
      );
    } catch (sendError) {
      setError(
        getFirebaseAuthError(
          sendError,
          langText("Could not send the reset OTP.", "रीसेट ओटीपी पाठवता आला नाही.")
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [auth, isSending, langText, maskedPhone, phoneE164, resetUnavailableMessage, storageBlockedMessage]);

  useEffect(() => {
    if (!PHONE_RESET_OTP_ENABLED || !auth || !phoneE164 || verificationId) {
      return;
    }

    void sendCode();
  }, [auth, phoneE164, sendCode, verificationId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isVerifying) {
      return;
    }

    if (!PHONE_RESET_OTP_ENABLED || !auth) {
      setError(resetUnavailableMessage);
      return;
    }

    const otp = otpDigits.join("");
    if (!verificationId) {
      setError(langText("Send a reset code first.", "प्रथम रीसेट कोड पाठवा."));
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(langText("Enter a valid 6-digit code.", "वैध ६ अंकी कोड टाका."));
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const result = await verifyPhoneOtp({
        auth,
        verificationId,
        otp,
      });
      const idToken = await result.user.getIdToken(true);

      const writesSucceeded = [
        setResetStorageItem(RESET_ID_TOKEN_KEY, idToken),
        setResetStorageItem(RESET_VERIFIED_KEY, "true"),
      ];

      if (writesSucceeded.includes(false)) {
        throw new Error(storageBlockedMessage);
      }

      router.push("/forgot-password/new-password");
    } catch (verifyError) {
      setError(
        getFirebaseAuthError(
          verifyError,
          langText("Could not verify the reset OTP.", "रीसेट ओटीपी पडताळता आला नाही.")
        )
      );
    } finally {
      setIsVerifying(false);
    }
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
                {text("Enter the 6-digit verification code sent to the registered mobile number linked to your account.", {
                  cacheKey: "forgot-password.verify-otp.description",
                })}
              </p>
              <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-outline-variant/30 bg-surface-container/50 px-4 py-2">
                <span className="font-semibold tracking-widest text-on-surface-variant">
                  {maskedPhone || langText("your registered mobile", "तुमचा नोंदणीकृत मोबाईल")}
                </span>
                <Link className="flex items-center gap-1 text-xs font-bold text-secondary hover:underline" href="/forgot-password">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  {langText("Edit", "बदला")}
                </Link>
              </div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <div className="mb-8 flex justify-between gap-3">
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
                      type="text"
                      value={digit}
                      onChange={(event) => updateDigit(index, event.target.value)}
                      onKeyDown={(event) => handleKeyDown(index, event)}
                    />
                  ))}
                </div>

                <div id="kk-reset-recaptcha" className="hidden" />

                {error ? <FormNotice tone="error">{error}</FormNotice> : null}
                {!error && info ? <FormNotice tone="info">{info}</FormNotice> : null}
                {!error && !info ? (
                  <div className="mb-6 rounded-2xl border border-primary-container/20 bg-primary-fixed/10 px-4 py-4 text-sm font-medium text-on-surface-variant">
                    {langText(
                      `Reset will continue only after OTP verification on ${maskedPhone || "your registered mobile number"}.`,
                      `${maskedPhone || "तुमच्या नोंदणीकृत मोबाईल नंबरवर"} ओटीपी पडताळल्यानंतरच रीसेट पुढे जाईल.`
                    )}
                  </div>
                ) : null}
              </div>

              <div className="space-y-6">
                <button
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-container px-6 py-4 text-lg font-bold text-white shadow-xl shadow-primary-container/20 transition-all hover:bg-primary hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-primary-container"
                  type="submit"
                  disabled={isSending || isVerifying}
                >
                  <span>{isVerifying ? langText("Verifying...", "पडताळणी करत आहे...") : langText("Verify and Continue", "पडताळणी करा आणि पुढे जा")}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>

                <div className="flex flex-col items-center justify-between gap-4 px-2 text-sm md:flex-row">
                  <div className="flex items-center gap-2 font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">timer</span>
                    <span>
                      {resendAvailableIn > 0
                        ? langText("Resend in", "पुन्हा पाठवण्यासाठी")
                        : langText("Need a new code?", "नवीन कोड हवा आहे?")}{" "}
                      {resendAvailableIn > 0 ? <span className="font-bold text-secondary">{String(resendAvailableIn).padStart(2, "0")}s</span> : null}
                    </span>
                  </div>
                  <button
                    className="font-bold text-secondary disabled:cursor-not-allowed disabled:text-on-surface-variant/40"
                    type="button"
                    onClick={() => void sendCode()}
                    disabled={isSending || resendAvailableIn > 0}
                  >
                    {isSending ? langText("Sending...", "पाठवत आहे...") : langText("Resend OTP", "ओटीपी पुन्हा पाठवा")}
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

        <div className="mt-8 flex flex-col items-center gap-3 opacity-70 md:flex-row md:justify-center md:gap-8">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">verified_user</span>
            <span className="text-xs font-bold text-primary">
              {text("Secure Gateway", { cacheKey: "forgot-password.verify-otp.secure-gateway" })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">support_agent</span>
            <span className="text-xs font-bold text-primary">
              {langText(`Need help? Call ${supportContact.phoneDisplay}`, `मदत हवी आहे का? ${supportContact.phoneDisplay} वर कॉल करा`)}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
