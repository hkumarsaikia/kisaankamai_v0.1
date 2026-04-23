"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { useLanguage } from "@/components/LanguageContext";
import { FormNotice } from "@/components/forms/FormKit";
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import {
  clearRecaptchaVerifier,
  finishFirebaseAuthSession,
  getFirebaseAuthError,
  getOptionalFirebaseAuthClient,
  linkEmailPasswordCredential,
  startPhoneVerification,
  verifyPhoneOtp,
} from "@/components/auth/firebase-auth-client";

export default function RegisterPage() {
  const { langText } = useLanguage();
  const auth = useMemo(() => getOptionalFirebaseAuthClient(), []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [confirmationId, setConfirmationId] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: 6 }, () => ""));
  const [resendAvailableIn, setResendAvailableIn] = useState(0);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    village: "",
    pincode: "",
    district: "Pune",
    district: "Pune",
    role: "renter",
    idType: "",
    idNumber: "",
  });

  useEffect(() => {
    if (!resendAvailableIn) return;
    const timer = window.setInterval(() => {
      setResendAvailableIn((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendAvailableIn]);

  const address = useMemo(
    () => [formData.village.trim(), formData.district.trim(), formData.pincode.trim()].filter(Boolean).join(", "),
    [formData.district, formData.pincode, formData.village]
  );
  const authUnavailableMessage = langText(
    "Firebase registration is unavailable in this deployment. Please restore the Firebase public config and try again.",
    "या डिप्लॉयमेंटमध्ये Firebase नोंदणी उपलब्ध नाही. Firebase सार्वजनिक कॉन्फिगरेशन पुन्हा सक्षम करून पुन्हा प्रयत्न करा."
  );

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => () => clearRecaptchaVerifier("register"), []);

  const startVerification = async () => {
    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const verificationId = await startPhoneVerification({
        auth,
        phoneNumber: formData.phone,
        containerId: "kk-register-recaptcha",
        storeKey: "register",
      });
      setConfirmationId(verificationId);
      setResendAvailableIn(60);
    } catch (error) {
      setError(getFirebaseAuthError(error, "Could not send OTP."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeRegistration = async () => {
    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await verifyPhoneOtp({
        auth,
        verificationId: confirmationId,
        otp: otpDigits.join(""),
      });

      if (formData.email && formData.password) {
        try {
          await linkEmailPasswordCredential({
            auth,
            email: formData.email,
            password: formData.password,
          });
        } catch (linkError) {
          console.warn("Email/password could not be linked to this phone-auth account.", linkError);
        }
      }

      await finishFirebaseAuthSession({
        auth,
        payload: {
          workspacePreference: "renter",
          profile: {
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim() || undefined,
            address,
            village: formData.village.trim(),
            pincode: formData.pincode.trim(),
            fieldArea: 0,
          },
        },
      });
      window.location.href = "/register/success";
    } catch (error) {
      setError(getFirebaseAuthError(error, "Could not complete registration."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (confirmationId) {
      await completeRegistration();
    } else {
      await startVerification();
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed flex flex-col">
      <main className="relative flex-grow overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/15 via-transparent to-secondary-container/10" />
          <img
            alt="Maharashtra agriculture background"
            className="h-full w-full object-cover grayscale-[10%] brightness-[92%]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxQOjwxd1GOcMalqWnNbjRE_PdmUfc0-NmR6Q4TuQErXFd_qzDuGiC_WdF1g7ttCtoM0UiVMbVLaVQm0WLKWYov6lMhQOFyseyikTrMes5EQXOe_I4a_6cw2Ae-j6WIH5Gaez5ZmPfqiySohcSrnOyQ_NlH63cuQmtxASSLmjDCc3vYWLKGGxXawj6rqyL0fVwYXIhDuPqyurvIFiseFluZhvpkLiRugKXITVBrfbosLWRWCYExgO7RrH5oe0TEtMmGSkIJsYbgPtE"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-3xl px-4">
          <div className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/90 shadow-2xl backdrop-blur-xl">
            <div className="bg-primary-container px-6 py-8 text-white sm:px-10">
              <h1 className="font-headline text-3xl font-extrabold tracking-tight sm:text-4xl">Join Kisan Kamai</h1>
              <p className="mt-2 max-w-2xl text-sm font-medium text-primary-fixed-dim sm:text-base">
                आजच तुमचे खाते तयार करा आणि शेती सुलभ करा.
              </p>
              {!auth ? (
                <p className="mt-3 text-sm font-semibold text-primary-fixed">
                  {authUnavailableMessage}
                </p>
              ) : null}
            </div>

            <form className="space-y-10 px-6 py-8 sm:px-10 sm:py-10" onSubmit={handleSubmit}>
              {error ? <FormNotice tone="error">{error}</FormNotice> : null}

              <div id="kk-register-recaptcha" className="hidden" />

              <section className="space-y-5">
                <GoogleAuthButton label="Create your account with Google / गुगलसह खाते तयार करा" />
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-outline-variant/70" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-outline">or register manually</span>
                  <div className="h-px flex-1 bg-outline-variant/70" />
                </div>
              </section>

              {!confirmationId ? (
                <>
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-primary-container/20 pb-4">
                      <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        account_circle
                      </span>
                      <h2 className="font-headline text-2xl font-bold text-primary">Account Details / खाते तपशील</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <label className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">Full Name / पूर्ण नाव</span>
                        <input
                          className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50 disabled:opacity-50"
                          placeholder="E.g. Rajesh Patil"
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => updateField("fullName", e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </label>

                      <label className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">Mobile Number / मोबाईल नंबर</span>
                        <input
                          className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50 disabled:opacity-50"
                          placeholder="+91 90000 00000"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </label>

                      <label className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">Email Address / ईमेल पत्ता</span>
                        <input
                          className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50 disabled:opacity-50"
                          placeholder="name@example.com"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          disabled={isSubmitting}
                        />
                      </label>

                      <label className="relative space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">Password / पासवर्ड</span>
                        <div className="relative">
                          <input
                            className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 pr-12 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50 disabled:opacity-50"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => updateField("password", e.target.value)}
                            required
                            disabled={isSubmitting}
                          />
                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-primary disabled:opacity-50"
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            disabled={isSubmitting}
                          >
                            <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
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
                      <h2 className="font-headline text-2xl font-bold text-primary">Location & Profile / स्थान आणि प्रोफाइल</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <label className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">Village/Town / गाव/शहर</span>
                        <input
                          className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50 disabled:opacity-50"
                          type="text"
                          value={formData.village}
                          onChange={(e) => updateField("village", e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </label>

                      <label className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">District / जिल्हा</span>
                        <input
                          list="maharashtra-districts"
                          className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50 disabled:opacity-50"
                          placeholder="Select or type district"
                          value={formData.district}
                          onChange={(e) => updateField("district", e.target.value)}
                          disabled={isSubmitting}
                        />
                        <datalist id="maharashtra-districts">
                          <option value="Ahmednagar" />
                          <option value="Akola" />
                          <option value="Amravati" />
                          <option value="Aurangabad" />
                          <option value="Beed" />
                          <option value="Bhandara" />
                          <option value="Buldhana" />
                          <option value="Chandrapur" />
                          <option value="Dhule" />
                          <option value="Gadchiroli" />
                          <option value="Gondia" />
                          <option value="Hingoli" />
                          <option value="Jalgaon" />
                          <option value="Jalna" />
                          <option value="Kolhapur" />
                          <option value="Latur" />
                          <option value="Mumbai City" />
                          <option value="Mumbai Suburban" />
                          <option value="Nagpur" />
                          <option value="Nanded" />
                          <option value="Nandurbar" />
                          <option value="Nashik" />
                          <option value="Osmanabad" />
                          <option value="Palghar" />
                          <option value="Parbhani" />
                          <option value="Pune" />
                          <option value="Raigad" />
                          <option value="Ratnagiri" />
                          <option value="Sangli" />
                          <option value="Satara" />
                          <option value="Sindhudurg" />
                          <option value="Solapur" />
                          <option value="Thane" />
                          <option value="Wardha" />
                          <option value="Washim" />
                          <option value="Yavatmal" />
                        </datalist>
                      </label>

                      <label className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">Pincode / पिनकोड</span>
                        <input
                          className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50 disabled:opacity-50"
                          inputMode="numeric"
                          maxLength={6}
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                          required
                          disabled={isSubmitting}
                        />
                      </label>
                    </div>
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-primary-container/20 pb-4">
                      <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified_user
                      </span>
                      <h2 className="font-headline text-2xl font-bold text-primary">Optional Identity Verification / ऐच्छिक ओळख पडताळणी</h2>
                    </div>
                    <p className="max-w-3xl text-sm leading-relaxed text-on-surface-variant">
                      Uploading an identity document is optional. You can add Aadhaar, PAN, Voter ID, or another government-issued document later from your profile when backend verification is enabled.
                    </p>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <label className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">ID Type / ओळखपत्राचा प्रकार</span>
                        <select
                          className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50 disabled:opacity-50"
                          value={formData.idType}
                          onChange={(e) => updateField("idType", e.target.value)}
                          disabled={isSubmitting}
                        >
                          <option value="">Select document type (optional)</option>
                          <option>Aadhaar Card</option>
                          <option>PAN Card</option>
                          <option>Voter ID</option>
                          <option>Driving License</option>
                        </select>
                      </label>
                      <label className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-outline">ID Number / ओळखपत्र क्रमांक</span>
                        <input
                          className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50 disabled:opacity-50"
                          placeholder="Document number (optional)"
                          type="text"
                          value={formData.idNumber}
                          onChange={(e) => updateField("idNumber", e.target.value)}
                          disabled={isSubmitting}
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <label className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-container/30 bg-surface-container-low/40 px-6 py-8 text-center cursor-pointer hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined text-3xl text-primary-container">upload_file</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-container">Front Side / समोरची बाजू</span>
                        <input type="file" className="hidden" accept="image/*,.pdf" />
                      </label>
                      <label className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary-container/30 bg-surface-container-low/40 px-6 py-8 text-center cursor-pointer hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined text-3xl text-primary-container">upload_file</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-container">Back Side / मागची बाजू</span>
                        <input type="file" className="hidden" accept="image/*,.pdf" />
                      </label>
                    </div>
                  </section>
                </>
              ) : (
                <section className="animate-in fade-in slide-in-from-bottom-2">
                  <OtpVerificationForm
                    phone={formData.phone}
                    otpDigits={otpDigits}
                    setOtpDigits={setOtpDigits}
                    onSubmit={completeRegistration}
                    isSubmitting={isSubmitting}
                    resendAvailableIn={resendAvailableIn}
                    onResend={startVerification}
                    onChangeNumber={() => { setConfirmationId(""); setOtpDigits(Array.from({ length: 6 }, () => "")); }}
                  />
                </section>
              )}

              {confirmationId ? null : (
                <div className="space-y-4 border-t border-outline-variant/30 pt-8">
                  <button
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-lg font-bold text-white shadow-2xl shadow-primary/20 transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? "Please wait..." 
                      : "Send OTP / OTP पाठवा"}
                    <span className="material-symbols-outlined">sms</span>
                  </button>
                  <p className="text-center text-sm font-medium text-on-surface-variant">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-primary hover:underline">
                      Login here
                    </Link>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
