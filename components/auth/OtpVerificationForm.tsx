"use client";

import { FormEvent, KeyboardEvent, useRef } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { FormNotice } from "@/components/forms/FormKit";

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
  info?: string;
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
  info,
}: OtpVerificationFormProps) {
  const { langText } = useLanguage();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-primary-container/10 text-primary rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-sm">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>vibration</span>
          </div>
          <h3 className="text-2xl font-extrabold text-primary font-headline tracking-tight">
            {langText("Verify your mobile number", "तुमच्या मोबाईल नंबरची पडताळणी करा")}
          </h3>
          <p className="text-on-surface-variant mt-3 text-sm">
            {langText("Enter the 6-digit code sent to", "")} <span className="font-bold text-on-surface font-mono">{phone}</span><br/>
            <span className="text-xs mt-1 block">तुमच्या मोबाईलवर पाठवलेला ६ अंकी कोड प्रविष्ट करा</span>
          </p>
        </div>

        <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center mb-6 w-full max-w-sm">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(node) => { inputsRef.current[index] = node; }}
                className="otp-input w-full bg-slate-100/50 border border-slate-200/50 focus:bg-white focus:ring-2 focus:ring-primary-container/40 rounded-xl px-2 py-4 text-center text-xl font-bold text-on-surface transition-all outline-none"
                maxLength={1}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => updateDigit(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isSubmitting}
                autoFocus={index === 0}
              />
            ))}
          </div>

          <div className="w-full max-w-sm mb-6">
            {error && <FormNotice tone="error">{error}</FormNotice>}
            {!error && info && <FormNotice tone="info">{info}</FormNotice>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-sm bg-primary-container text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:hover:scale-100 mb-6"
          >
            {isSubmitting 
              ? langText("Verifying...", "पडताळणी करत आहे...") 
              : langText("Verify & Continue / पडताळणी करा आणि पुढे जा", "Verify & Continue / पडताळणी करा आणि पुढे जा")}
          </button>

          <div className="space-y-4 w-full max-w-sm">
            <div className="flex items-center justify-between px-2 text-xs font-bold uppercase tracking-widest">
              <span className="text-outline">
                {resendAvailableIn > 0 
                  ? `${langText("Resend in", "पुन्हा पाठवा")} 00:${String(resendAvailableIn).padStart(2, "0")}` 
                  : langText("Need a new code?", "नवीन कोड हवा आहे?")}
              </span>
              <button
                type="button"
                onClick={onResend}
                disabled={isSubmitting || resendAvailableIn > 0}
                className={`font-bold transition-colors ${resendAvailableIn > 0 ? "text-primary opacity-50 cursor-not-allowed" : "text-secondary hover:text-primary"}`}
              >
                Resend OTP
              </button>
            </div>
            <div className="h-px bg-surface-container-highest/60 w-full" />
            <button
              type="button"
              onClick={onChangeNumber}
              disabled={isSubmitting}
              className="text-sm font-bold text-primary hover:underline inline-block mt-2"
            >
              Edit Details / तपशील संपादित करा
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
