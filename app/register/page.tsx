"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink as Link } from "@/components/AppLink";
import {
  clearRecaptchaVerifier,
  finishFirebaseAuthSession,
  getFirebaseAuthError,
  getOptionalFirebaseAuthClient,
  startPhoneVerification,
  verifyPhoneOtp,
} from "@/components/auth/firebase-auth-client";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import { useLanguage } from "@/components/LanguageContext";
import { emitAuthSyncEvent } from "@/lib/client/auth-sync";
import { MAHARASHTRA_DISTRICTS } from "@/lib/auth/india-districts";

type RegisterFormState = {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  village: string;
  district: string;
  pincode: string;
};

type VerificationStage = "form" | "otp" | "verifying" | "verified";

export default function RegisterPage() {
  const router = useRouter();
  const { langText } = useLanguage();
  const auth = useMemo(() => getOptionalFirebaseAuthClient(), []);
  const [formState, setFormState] = useState<RegisterFormState>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    village: "",
    district: "",
    pincode: "",
  });
  const [confirmationId, setConfirmationId] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: 6 }, () => ""));
  const [resendAvailableIn, setResendAvailableIn] = useState(0);
  const [stage, setStage] = useState<VerificationStage>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const authUnavailableMessage = langText(
    "Firebase registration is unavailable in this deployment. Please restore the Firebase public configuration and try again.",
    "या डिप्लॉयमेंटमध्ये Firebase नोंदणी उपलब्ध नाही. Firebase सार्वजनिक कॉन्फिगरेशन पुन्हा सक्षम करून पुन्हा प्रयत्न करा."
  );

  useEffect(() => () => clearRecaptchaVerifier("register"), []);

  useEffect(() => {
    if (!resendAvailableIn) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendAvailableIn((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendAvailableIn]);

  useEffect(() => {
    if (stage !== "verified") {
      return;
    }

    const timer = window.setTimeout(() => {
      router.replace("/login");
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [router, stage]);

  const updateField = <K extends keyof RegisterFormState>(field: K, value: RegisterFormState[K]) => {
    setFormState((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const resetOtpStage = () => {
    setStage("form");
    setConfirmationId("");
    setOtpDigits(Array.from({ length: 6 }, () => ""));
    setResendAvailableIn(0);
    setIsOtpVerified(false);
    setError("");
  };

  const validateRegisterForm = () => {
    if (formState.fullName.trim().length < 2) {
      return langText("Enter your full name.", "तुमचे पूर्ण नाव टाका.");
    }

    if (!/^\+?\d[\d\s-]{9,14}$/.test(formState.phone.trim())) {
      return langText("Enter a valid mobile number.", "वैध मोबाईल नंबर टाका.");
    }

    if (!formState.village.trim()) {
      return langText("Enter your village or town.", "तुमचे गाव किंवा शहर टाका.");
    }

    if (!formState.district.trim()) {
      return langText("Enter your district.", "तुमचा जिल्हा टाका.");
    }

    if (!/^\d{6}$/.test(formState.pincode.trim())) {
      return langText("Enter a valid 6-digit pincode.", "वैध 6 अंकी पिनकोड टाका.");
    }

    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      return langText("Enter a valid email address.", "वैध ईमेल पत्ता टाका.");
    }

    if (!formState.password || formState.password.length < 6) {
      return langText("Password must be at least 6 characters.", "पासवर्ड किमान 6 अक्षरांचा असावा.");
    }

    return "";
  };

  const preflightRegistration = async () => {
    let token = "";
    try {
      token =
        window.sessionStorage.getItem("kk_phone_auth_test_token") ||
        window.localStorage.getItem("kk_phone_auth_test_token") ||
        "";
    } catch {
      token = "";
    }

    const response = await fetch("/api/auth/register/preflight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "x-kk-phone-auth-test-token": token } : {}),
      },
      credentials: "include",
      body: JSON.stringify({
        phone: formState.phone,
        email: formState.email,
      }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; error?: string }
      | null;

    if (!response.ok || !payload?.ok) {
      throw new Error(payload?.error || langText("Could not validate this account.", "हे खाते तपासता आले नाही."));
    }
  };

  const resolvePhoneAuthTestMode = async () => {
    let token = "";
    try {
      token =
        window.sessionStorage.getItem("kk_phone_auth_test_token") ||
        window.localStorage.getItem("kk_phone_auth_test_token") ||
        "";
    } catch {
      token = "";
    }

    if (!token) {
      return false;
    }

    try {
      const response = await fetch("/api/auth/phone-test-mode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-kk-phone-auth-test-token": token,
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          phone: formState.phone,
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; enabled?: boolean }
        | null;

      return Boolean(response.ok && payload?.ok && payload.enabled);
    } catch {
      return false;
    }
  };

  const startVerification = async () => {
    const validationError = validateRegisterForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await preflightRegistration();
      const disableAppVerificationForTesting = await resolvePhoneAuthTestMode();
      const verificationId = await startPhoneVerification({
        auth,
        phoneNumber: formState.phone,
        containerId: "kk-register-recaptcha",
        storeKey: "register",
        disableAppVerificationForTesting,
      });
      setConfirmationId(verificationId);
      setStage("otp");
      setResendAvailableIn(60);
    } catch (authError) {
      setError(getFirebaseAuthError(authError, langText("Could not send the OTP.", "OTP पाठवता आला नाही.")));
    } finally {
      setIsSubmitting(false);
    }
  };

  const finishRegistration = async () => {
    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    setIsSubmitting(true);
    setError("");
    setStage("verifying");

    try {
      if (!isOtpVerified) {
        await verifyPhoneOtp({
          auth,
          verificationId: confirmationId,
          otp: otpDigits.join(""),
        });
        setIsOtpVerified(true);
      }

      await finishFirebaseAuthSession({
        auth,
        payload: {
          password: formState.password,
          profile: {
            fullName: formState.fullName.trim(),
            phone: formState.phone.trim(),
            email: formState.email.trim() || undefined,
            address: `${formState.village.trim()}, ${formState.district.trim()}, ${formState.pincode.trim()}`,
            village: formState.village.trim(),
            pincode: formState.pincode.trim(),
            fieldArea: 0,
            district: formState.district.trim(),
            verificationStatus: "not_submitted",
          },
        },
      });
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }).catch(() => undefined);
      await auth.signOut().catch(() => undefined);
      emitAuthSyncEvent("logout");

      setStage("verified");
    } catch (authError) {
      setStage("otp");
      setError(getFirebaseAuthError(authError, langText("Could not complete registration.", "नोंदणी पूर्ण करता आली नाही.")));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (stage === "otp") {
      await finishRegistration();
      return;
    }

    await startVerification();
  };

  return (
    <div className="kk-auth-page bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="absolute inset-0 z-0">
	        <img
	          alt="Kisan Kamai agriculture background"
	          className="h-full w-full object-cover grayscale-[10%] brightness-[90%]"
	          height={900}
	          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxQOjwxd1GOcMalqWnNbjRE_PdmUfc0-NmR6Q4TuQErXFd_qzDuGiC_WdF1g7ttCtoM0UiVMbVLaVQm0WLKWYov6lMhQOFyseyikTrMes5EQXOe_I4a_6cw2Ae-j6WIH5Gaez5ZmPfqiySohcSrnOyQ_NlH63cuQmtxASSLmjDCc3vYWLKGGxXawj6rqyL0fVwYXIhDuPqyurvIFiseFluZhvpkLiRugKXITVBrfbosLWRWCYExgO7RrH5oe0TEtMmGSkIJsYbgPtE"
	          width={1600}
	        />
        <div className="kk-dark-image-overlay" />
      </div>

      <main className="relative z-10 flex min-h-[calc(100svh-5rem)] items-center justify-center px-4 pb-12 pt-28 sm:pb-16">
        <div className="w-full max-w-3xl">
          {stage === "otp" || stage === "verifying" || stage === "verified" ? (
            <div className="mx-auto max-w-md">
              <OtpVerificationForm
                phone={formState.phone}
                otpDigits={otpDigits}
                setOtpDigits={setOtpDigits}
                onSubmit={finishRegistration}
                isSubmitting={isSubmitting}
                resendAvailableIn={resendAvailableIn}
                onResend={startVerification}
                onChangeNumber={resetOtpStage}
                error={error}
                title={langText("Verify your mobile number", "तुमच्या मोबाईल नंबरची पडताळणी करा")}
                description={langText("Enter the six-digit code sent to", "तुमच्या मोबाईलवर पाठवलेला सहा अंकी कोड टाका")}
                submitLabel={langText("Verify and Continue", "पडताळणी करून पुढे जा")}
                submittingLabel={langText("Verifying…", "पडताळणी होत आहे…")}
                resendLabel={langText("Resend OTP", "OTP पुन्हा पाठवा")}
                resendCountdownLabel={langText("Resend in", "पुन्हा पाठवा")}
                editLabel={langText("Edit details", "तपशील संपादित करा")}
                bannerTitle={
                  stage === "otp" && resendAvailableIn === 0 && !error
                    ? langText("OTP has expired. Please request a new one.", "OTP ची मुदत संपली आहे. कृपया नवीन OTP मागवा.")
                    : undefined
                }
                bannerDescription={
                  stage === "otp" && resendAvailableIn === 0 && !error
                    ? langText("Use resend to receive a fresh code.", "नवीन कोड मिळवण्यासाठी पुन्हा पाठवा निवडा.")
                    : undefined
                }
                view={stage === "verified" ? "success" : stage === "verifying" ? "loading" : "entry"}
                successTitle={langText("Account created", "खाते तयार झाले")}
                successMessage={langText(
                  "Congratulation! The account has been created. You may login with your provided phone number and password.",
                  "अभिनंदन! खाते तयार झाले आहे. तुम्ही दिलेल्या फोन नंबर आणि पासवर्डने लॉगिन करू शकता."
                )}
              />
              <div id="kk-register-recaptcha" className="kk-recaptcha-slot" aria-hidden="true" />
            </div>
          ) : (
            <div className="kk-auth-card overflow-hidden">
              <div className="border-b border-outline-variant bg-surface-container-low/80 px-6 py-8 text-center sm:px-10">
                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                    {langText("Create your Kisan Kamai account", "तुमचे किसान कमाई खाते तयार करा")}
                  </h1>
                  {!auth ? <p className="text-sm font-semibold text-amber-700">{authUnavailableMessage}</p> : null}
                </div>
              </div>

              <form className="space-y-8 px-6 py-8 sm:px-10 sm:py-10" onSubmit={handleSubmit}>
                <div id="kk-register-recaptcha" className="kk-recaptcha-slot" aria-hidden="true" />

                {error ? <p className="text-sm font-semibold text-error">{error}</p> : null}

                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-primary-container/20 pb-4">
                    <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      account_circle
                    </span>
                    <h2 className="font-headline text-2xl font-bold text-primary">
                      {langText("Account details", "खाते तपशील")}
                    </h2>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-1.5" htmlFor="register-full-name">
                      <span className="text-xs font-bold uppercase tracking-wider text-outline">
                        {langText("Full name", "पूर्ण नाव")}
                      </span>
	                      <input
	                        id="register-full-name"
	                        className="w-full rounded-xl bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm outline-none transition-[background-color,box-shadow] focus:ring-2 focus:ring-primary-container/40"
	                        name="fullName"
	                        autoComplete="name"
	                        value={formState.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)}
                        placeholder={langText("Rajesh Patil", "राजेश पाटील")}
                        disabled={isSubmitting}
                        required
                      />
                    </label>

                    <label className="space-y-1.5" htmlFor="register-phone">
                      <span className="text-xs font-bold uppercase tracking-wider text-outline">
                        {langText("Mobile number", "मोबाईल नंबर")}
                      </span>
	                      <input
	                        id="register-phone"
	                        className="w-full rounded-xl bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm outline-none transition-[background-color,box-shadow] focus:ring-2 focus:ring-primary-container/40"
	                        name="phone"
	                        type="tel"
	                        autoComplete="tel"
	                        inputMode="tel"
	                        value={formState.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        placeholder="+91 90000 00000"
                        disabled={isSubmitting}
                        required
                      />
                    </label>

                    <label className="space-y-1.5" htmlFor="register-email">
                      <span className="text-xs font-bold uppercase tracking-wider text-outline">
                        {langText("Email address (optional)", "ईमेल पत्ता (पर्यायी)")}
                      </span>
	                      <input
	                        id="register-email"
	                        className="w-full rounded-xl bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm outline-none transition-[background-color,box-shadow] focus:ring-2 focus:ring-primary-container/40"
	                        name="email"
	                        autoComplete="email"
	                        spellCheck={false}
	                        value={formState.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        placeholder="name@example.com"
                        type="email"
                        disabled={isSubmitting}
                      />
                    </label>

                    <label className="space-y-1.5" htmlFor="register-password">
                      <span className="text-xs font-bold uppercase tracking-wider text-outline">
                        {langText("Password", "पासवर्ड")}
                      </span>
                      <div className="relative">
	                        <input
	                          id="register-password"
	                          className="w-full rounded-xl bg-surface-container-low px-4 py-3.5 pr-12 text-on-surface shadow-sm outline-none transition-[background-color,box-shadow] focus:ring-2 focus:ring-primary-container/40"
	                          name="password"
	                          autoComplete="new-password"
	                          value={formState.password}
                          onChange={(event) => updateField("password", event.target.value)}
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          disabled={isSubmitting}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className="absolute right-1.5 top-1/2 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-container hover:text-primary"
                          aria-label={langText("Toggle password visibility", "पासवर्ड दृश्यमानता बदला")}
                        >
                          <span className="material-symbols-outlined">
                            {showPassword ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                    </label>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-primary-container/20 pb-4">
                    <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      location_on
                    </span>
                    <h2 className="font-headline text-2xl font-bold text-primary">
                      {langText("Location", "स्थान")}
                    </h2>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <label className="space-y-1.5" htmlFor="register-village">
                      <span className="text-xs font-bold uppercase tracking-wider text-outline">
                        {langText("Village or town", "गाव किंवा शहर")}
                      </span>
	                      <input
	                        id="register-village"
	                        className="w-full rounded-xl bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm outline-none transition-[background-color,box-shadow] focus:ring-2 focus:ring-primary-container/40"
	                        name="village"
	                        autoComplete="address-level3"
	                        value={formState.village}
                        onChange={(event) => updateField("village", event.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </label>

                    <label className="space-y-1.5" htmlFor="register-district">
                      <span className="text-xs font-bold uppercase tracking-wider text-outline">
                        {langText("District", "जिल्हा")}
                      </span>
	                      <select
	                        id="register-district"
	                        className="w-full rounded-xl bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm outline-none transition-[background-color,box-shadow] focus:ring-2 focus:ring-primary-container/40"
	                        name="district"
	                        autoComplete="address-level2"
                        value={formState.district}
                        onChange={(event) => updateField("district", event.target.value)}
                        disabled={isSubmitting}
                        required
                      >
                        <option value="">
                          {langText("Select your district", "तुमचा जिल्हा निवडा")}
                        </option>
                        {MAHARASHTRA_DISTRICTS.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1.5 md:col-span-2" htmlFor="register-pincode">
                      <span className="text-xs font-bold uppercase tracking-wider text-outline">
                        {langText("Pincode", "पिनकोड")}
                      </span>
	                      <input
	                        id="register-pincode"
	                        className="w-full rounded-xl bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm outline-none transition-[background-color,box-shadow] focus:ring-2 focus:ring-primary-container/40"
	                        name="pincode"
	                        autoComplete="postal-code"
	                        value={formState.pincode}
                        onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                        inputMode="numeric"
                        maxLength={6}
                        disabled={isSubmitting}
                        required
                      />
                    </label>
                  </div>
                </section>

                <div className="space-y-4 border-t border-outline-variant/30 pt-8">
                  <button
                    className="kk-flow-button group flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-lg font-bold text-white shadow-xl shadow-primary/15 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary-fixed dark:text-on-primary-fixed"
                    type="submit"
                    disabled={isSubmitting}
                    data-loading={isSubmitting ? "true" : "false"}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? <span className="kk-flow-spinner" aria-hidden="true" /> : null}
                    <span>
                      {isSubmitting
	                        ? langText("Please wait…", "कृपया प्रतीक्षा करा…")
                        : langText("Create Account", "खाते तयार करा")}
                    </span>
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>

                  <p className="text-center text-sm font-medium text-on-surface-variant">
                    {langText("Already have an account?", "आधीच खाते आहे का?")}{" "}
                    <Link href="/login" className="inline-flex min-h-9 items-center rounded-full px-2 font-bold text-primary hover:underline">
                      {langText("Login here", "इथे लॉगिन करा")}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
