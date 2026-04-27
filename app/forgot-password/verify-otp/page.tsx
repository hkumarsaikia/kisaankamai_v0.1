"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearRecaptchaVerifier,
  getFirebaseAuthError,
  getOptionalFirebaseAuthClient,
  startPhoneVerification,
  verifyPhoneOtp,
} from "@/components/auth/firebase-auth-client";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import { useLanguage } from "@/components/LanguageContext";
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

export default function VerifyOtpPage() {
  const router = useRouter();
  const { langText } = useLanguage();
  const auth = useMemo(() => getOptionalFirebaseAuthClient(), []);
  const [phoneE164, setPhoneE164] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: 6 }, () => ""));
  const [verificationId, setVerificationId] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendAvailableIn, setResendAvailableIn] = useState(60);

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

  const sendCode = useCallback(async () => {
    if (isSending || !PHONE_RESET_OTP_ENABLED || !auth || !phoneE164) {
      return;
    }

    setIsSending(true);
    setError("");

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
    } catch (sendError) {
      setError(
        getFirebaseAuthError(
          sendError,
          langText("Could not send the reset OTP.", "रीसेट OTP पाठवता आला नाही.")
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [auth, isSending, langText, phoneE164, storageBlockedMessage]);

  useEffect(() => {
    if (!PHONE_RESET_OTP_ENABLED || !auth || !phoneE164 || verificationId) {
      return;
    }

    void sendCode();
  }, [auth, phoneE164, sendCode, verificationId]);

  const handleSubmit = async () => {
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
      setError(langText("Enter a valid 6-digit code.", "वैध 6 अंकी कोड टाका."));
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
          langText("Incorrect OTP. Please try again.", "चुकीचा OTP. कृपया पुन्हा प्रयत्न करा.")
        )
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="kk-auth-page bg-surface px-4 py-10 font-body text-on-surface">
      <div className="absolute inset-0 z-0">
        <img
          alt="Kisan Kamai agriculture background"
          className="h-full w-full object-cover grayscale-[10%] brightness-[90%]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxQOjwxd1GOcMalqWnNbjRE_PdmUfc0-NmR6Q4TuQErXFd_qzDuGiC_WdF1g7ttCtoM0UiVMbVLaVQm0WLKWYov6lMhQOFyseyikTrMes5EQXOe_I4a_6cw2Ae-j6WIH5Gaez5ZmPfqiySohcSrnOyQ_NlH63cuQmtxASSLmjDCc3vYWLKGGxXawj6rqyL0fVwYXIhDuPqyurvIFiseFluZhvpkLiRugKXITVBrfbosLWRWCYExgO7RrH5oe0TEtMmGSkIJsYbgPtE"
        />
        <div className="kk-dark-image-overlay" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md">
          <OtpVerificationForm
            phone={maskedPhone || langText("your registered mobile number", "तुमचा नोंदणीकृत मोबाईल नंबर")}
            otpDigits={otpDigits}
            setOtpDigits={setOtpDigits}
            onSubmit={handleSubmit}
            isSubmitting={isVerifying || isSending}
            resendAvailableIn={resendAvailableIn}
            onResend={sendCode}
            onChangeNumber={() => router.push("/forgot-password")}
            error={error}
            title={langText("Verify reset OTP", "रीसेट OTP पडताळा")}
            description={langText("Enter the six-digit code sent to", "तुमच्या मोबाईलवर पाठवलेला सहा अंकी कोड टाका")}
            submitLabel={langText("Verify and Continue", "पडताळणी करून पुढे जा")}
            submittingLabel={langText("Verifying...", "पडताळणी होत आहे...")}
            resendLabel={langText("Resend OTP", "OTP पुन्हा पाठवा")}
            resendCountdownLabel={langText("Resend in", "पुन्हा पाठवा")}
            editLabel={langText("Edit details", "तपशील संपादित करा")}
            bannerTitle={
              !PHONE_RESET_OTP_ENABLED
                ? resetUnavailableMessage
                : resendAvailableIn === 0 && !error
                  ? langText("OTP has expired. Please request a new one.", "OTP ची मुदत संपली आहे. कृपया नवीन OTP मागवा.")
                  : undefined
            }
            bannerDescription={
              !PHONE_RESET_OTP_ENABLED
                ? undefined
                : resendAvailableIn === 0 && !error
                  ? langText("Use resend to receive a fresh reset code.", "नवीन रीसेट कोड मिळवण्यासाठी पुन्हा पाठवा निवडा.")
                  : undefined
            }
            bannerTone={!PHONE_RESET_OTP_ENABLED ? "error" : "info"}
            view={isVerifying ? "loading" : "entry"}
          />
          <div id="kk-reset-recaptcha" className="hidden" />
        </div>
      </main>
    </div>
  );
}
