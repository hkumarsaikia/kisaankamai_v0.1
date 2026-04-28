"use client";

import type { FormEvent, KeyboardEvent, ReactNode } from "react";
import { useRef } from "react";

interface OtpVerificationFormProps {
  phone: string;
  otpDigits: string[];
  setOtpDigits: (digits: string[]) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  resendAvailableIn: number;
  onResend: () => void;
  onChangeNumber: () => void;
  error?: string;
  title: string;
  description: ReactNode;
  submitLabel: string;
  submittingLabel: string;
  resendLabel: string;
  resendCountdownLabel: string;
  editLabel: string;
  bannerTitle?: string;
  bannerDescription?: string;
  bannerTone?: "info" | "error";
  view?: "entry" | "loading" | "success";
  successTitle?: string;
  successMessage?: string;
}

export function OtpVerificationForm({
  phone,
  otpDigits,
  setOtpDigits,
  onSubmit,
  isSubmitting,
  resendAvailableIn,
  onResend,
  onChangeNumber,
  error,
  title,
  description,
  submitLabel,
  submittingLabel,
  resendLabel,
  resendCountdownLabel,
  editLabel,
  bannerTitle,
  bannerDescription,
  bannerTone = "info",
  view = "entry",
  successTitle,
  successMessage,
}: OtpVerificationFormProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const disableInputs = isSubmitting || view !== "entry";
  const showErrorState = Boolean(error) && view === "entry";
  const canSubmit = otpDigits.every((digit) => digit.trim().length === 1);

  const updateDigit = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = nextValue;
    setOtpDigits(nextDigits);

    if (nextValue && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedValue = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpDigits.length);
    if (!pastedValue) {
      return;
    }

    event.preventDefault();
    const nextDigits = Array.from({ length: otpDigits.length }, (_, index) => pastedValue[index] || "");
    setOtpDigits(nextDigits);
    const nextIndex = Math.min(pastedValue.length, otpDigits.length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="kk-auth-card w-full">
      <div className="p-10 text-center">
        {view === "success" ? (
          <div className="space-y-5">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-container/10 text-primary shadow-sm">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="font-headline text-2xl font-extrabold tracking-tight text-primary">
                {successTitle}
              </h3>
              <p className="text-sm text-on-surface-variant">{successMessage}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-container/10 text-primary shadow-sm">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  vibration
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-2xl font-extrabold tracking-tight text-primary">{title}</h3>
                <div className="space-y-1 text-sm text-on-surface-variant">
                  <div>{description}</div>
                  <div className="font-mono font-bold text-on-surface">{phone}</div>
                </div>
              </div>
            </div>

            {bannerTitle ? (
              <div
                className={`flex items-start gap-3 rounded-xl border p-3 text-left ${
                  bannerTone === "error"
                    ? "border-error/30 bg-error-container/40 text-error"
                    : "border-outline-variant bg-surface-container-low text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {bannerTone === "error" ? "error" : "info"}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{bannerTitle}</p>
                  {bannerDescription ? <p className="text-xs text-on-surface-variant">{bannerDescription}</p> : null}
                </div>
              </div>
            ) : null}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex gap-2" onPaste={handlePaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(node) => {
                      inputsRef.current[index] = node;
                    }}
                    className={`otp-input kk-otp-input ${
                      showErrorState
                        ? "border-error/50 bg-error-container/20"
                        : ""
                    } ${disableInputs ? "opacity-60" : ""}`}
                    maxLength={1}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => updateDigit(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disableInputs}
                    autoFocus={index === 0 && view === "entry"}
                  />
                ))}
              </div>

              {error ? <p className="text-sm font-bold text-error">{error}</p> : null}

              <button
                type="submit"
                disabled={disableInputs || !canSubmit}
                data-loading={view === "loading" ? "true" : "false"}
                aria-busy={view === "loading"}
                className="kk-flow-button w-full rounded-2xl bg-primary-container py-4 text-lg font-bold text-white shadow-xl shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-90"
              >
                {view === "loading" ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="kk-flow-spinner" aria-hidden="true" />
                    <span>{submittingLabel}</span>
                  </span>
                ) : (
                  submitLabel
                )}
              </button>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-widest text-outline">
                  <span>
                    {resendAvailableIn > 0
                      ? `${resendCountdownLabel} 00:${String(resendAvailableIn).padStart(2, "0")}`
                      : resendCountdownLabel}
                  </span>
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={isSubmitting || resendAvailableIn > 0}
                    className={`font-bold transition-colors ${
                      resendAvailableIn > 0 ? "cursor-not-allowed opacity-50" : "text-primary"
                    }`}
                  >
                    {resendLabel}
                  </button>
                </div>
                <div className="h-px bg-surface-container-highest/60" />
                <button
                  type="button"
                  onClick={onChangeNumber}
                  disabled={isSubmitting}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  {editLabel}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
