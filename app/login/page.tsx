"use client";

import { useEffect, useMemo, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import {
  clearRecaptchaVerifier,
  finishFirebaseAuthSession,
  getFirebaseAuthError,
  getOptionalFirebaseAuthClient,
  signInWithEmailPassword,
  startPhoneVerification,
  verifyPhoneOtp,
} from "@/components/auth/firebase-auth-client";
import { useLanguage } from "@/components/LanguageContext";
import { FormNotice } from "@/components/forms/FormKit";

const collageTiles = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1NdTf_TQE_mui1qW599KaJFqfLAHNiHUMX5Gu_45w185fZoQy9NWmAauTutW8u_nNTpuUyDZXjGJD7t43mSOFR8_HurEJAdDUcI5FErR3-ZXK0KgYkSysjyeml1WzYMwxm-9F8PcBb1bcj6oLnxg7D5meKMQwpmefnzuB9QFftY2o0ZN8a5CZeZni3YlW_u10JW0duifo2OXANqqYVkOO5EqGl7ZB1KiuWYCRqX3QTj1jpUCYU6ND3RdCNhFPeHXGZeBlKsEvOUXO",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAlgpeZWJbUZsmbZ8XaO0XmLQUKQDEkl-bmeb9Drj4hNP00BxUEFihyyMfzGeO7g71DTxY8bEsxcLPVSK4n8wpAPpYMNVFSy9f7TEO37HIlydnDYsbGYQiqY77nE-jMRZIYdG_NNoPr9Vs2_70Gy4ip6A0tmnn_GZvHyEVKEPkShAqbzkZ1R7Yku7CNigayWPOUpJeYI_tmweffN44ABOv0D943UcY-KODmUguxYTTw6XTCiIzVVYduEw8OYyCBUmbNaFb0mqIST3aZ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCqHTQZtetKJbo1gUXV05Ncked-C3RqcJhKsWplYgeG-FBZexcWLhA7l3xcXoZdjeGnX4fVuRT2UWuwRlV7rJjhZPFFqBI2kBRhju1xbyrRaXQ1LOLj36ScKmnYQIaqQFeY4BP1Pja8GrEnTkaRKagTWgAfG7lmUv7U4JeNDKP5_VcFDalE1nLWcTJx3Qs7fUpr-BiSQNSdX4R4uT5DzpHYdhuZkqoRsp85Se-3_IonDkf5J8_fUJSWaOql843dx-9QsfSiofAD5G0M",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCxVjoIDCi4qXyHGRpT90MKo-ANJ5IS82NSsQuh6Ar0m9bMySmgUBAqpaVym7oj4aVA2LTdYkngtq2hbUDl8jNGH9ixPxg5dvjTPt5fn8_bUVMIzX4Z-MnTh04IlfKvFHcsmky5nZh-5ZB12gP2P8dYVyXtzC0ujaUUXDfRLAwE2MnTCtD_vnEpZnQPVytiNnDIQEDIWB6_URyggToQgWw6dZ7DuMFZwp90XEg8eK8cw3BqxuclClplBsgYMTBAgv1ypCE_gTubzd5G",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAoEshckljM-rzWOXN5zxmnMaKHFvxxRArCXOs7XpzRpbXJ5FOqiVoRnRzMsYs3zLx-TdiJ1_uTHIWGnXvujGglm5jrER9d00jb9lLjY6veTOguWA6u2rt_Qlj-nkfCx7baWXPDQV5OPtXwoEsGb6QTu9SFP2ok2Lx3w-wGwzvwQ0-vrl6xoOLLyxxbUkeaGSKYYyV_YAsWDC2g3w5i63UME62xuvba1AwpznEtfzRT_gW7LBGZYKCIotsAFExblyuVJYdA_y6_c75q",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAJRkw1C3bl1LlarpIhMrl1isLFlE5vIRxQgRzYvPME43nJJx6_7gAhSegAA9vfzfjwkw2-PsKfxBOtTwOhO1iJhN5v4fDAyyjZOikKz8VVaMXTktXbEjtY9v21F3IlNxr27M-b24T__nzXEiPAVgYn8lLQ0CIvgJxl8tXhcrcCHXO2I1pw6VDUF2wsBv3v1gLRAI2OPwawAlDpNvBjV51BGtce7_Jw-PPlDH2_qE9NgrDXVVny8BAs8S_ugnojB8BVS_qZKxZ8-iIh",
];

export default function LoginPage() {
  const { t, langText } = useLanguage();
  const auth = useMemo(() => getOptionalFirebaseAuthClient(), []);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [mode, setMode] = useState<"phone" | "email">("phone");
  
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authUnavailableMessage = langText(
    "Firebase sign-in is unavailable in this deployment. Please try again after the Firebase public config is restored.",
    "या डिप्लॉयमेंटमध्ये Firebase साइन-इन उपलब्ध नाही. Firebase सार्वजनिक कॉन्फिगरेशन पुन्हा सक्षम झाल्यावर पुन्हा प्रयत्न करा."
  );

  useEffect(() => () => clearRecaptchaVerifier("login"), []);

  const setBusy = (val: boolean) => {
    setIsSubmitting(val);
    if (val) setError("");
  };

  const startPhoneLogin = async () => {
    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    setBusy(true);
    try {
      const verificationId = await startPhoneVerification({
        auth,
        phoneNumber: identifier,
        containerId: "kk-recaptcha",
        storeKey: "login",
      });
      setConfirmationId(verificationId);
    } catch (error) {
      setError(getFirebaseAuthError(error, langText("Could not send OTP.", "OTP पाठवता आला नाही.")));
    } finally {
      setBusy(false);
    }
  };

  const finishPhoneLogin = async () => {
    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    setBusy(true);
    try {
      await verifyPhoneOtp({
        auth,
        verificationId: confirmationId,
        otp,
      });
      await finishFirebaseAuthSession({ auth });
      window.location.href = "/profile-selection";
    } catch (error) {
      setError(getFirebaseAuthError(error, langText("Invalid OTP.", "अवैध OTP.")));
    } finally {
      setBusy(false);
    }
  };

  const loginWithEmail = async () => {
    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    setBusy(true);
    try {
      await signInWithEmailPassword({
        auth,
        email: identifier,
        password,
      });
      await finishFirebaseAuthSession({ auth });
      window.location.href = "/profile-selection";
    } catch (error) {
      setError(getFirebaseAuthError(error, t("login.login_failed")));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (mode === "phone") {
      if (confirmationId) {
        await finishPhoneLogin();
      } else {
        await startPhoneLogin();
      }
    } else {
      await loginWithEmail();
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <main className="flex-grow min-h-screen relative flex items-center justify-center pt-20 overflow-hidden">
        {/* Sharp Creative Tiled Background */}
        <div className="absolute inset-0 z-0" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(2, 1fr)", gap: 0, background: "#00251a", overflow: "hidden" }}>
          {collageTiles.map((image, index) => (
            <div
              key={`${image.slice(-10)}-${index}`}
              className="relative transition-transform duration-500"
              style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)" }}
            />
          ))}
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(0,37,26,0.1) 0%, rgba(0,37,26,0.5) 100%)" }} />
        </div>

        <div className="container relative z-10 mx-auto px-6 flex justify-center py-12">
          {/* Glassmorphic Login Card */}
          <div className="w-full max-w-[520px] bg-white/85 backdrop-blur-[24px] saturate-[180%] border border-white/40 rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden p-8 md:p-14 ring-1 ring-white/40">
            <div className="flex flex-col items-center text-center space-y-10">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="w-20 h-20 bg-primary-container/10 rounded-3xl flex items-center justify-center mx-auto ring-1 ring-primary-container/20">
                  <span className="material-symbols-outlined text-5xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                    agriculture
                  </span>
                </div>
                <div className="space-y-1">
                  <h1 className="text-3xl font-extrabold text-on-background font-headline tracking-tight">
                    {langText("Welcome to Kisan Kamai", "किसान कमाई मध्ये स्वागत आहे")}
                  </h1>
                  <p className="text-slate-700 font-bold font-headline">
                    {langText("Sign in to your account", "आपल्या खात्यात साइन इन करा")}
                  </p>
                  {!auth ? (
                    <p className="text-sm font-semibold text-amber-700">
                      {authUnavailableMessage}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="w-full space-y-5">
                <GoogleAuthButton label="Login with Google" />
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                    {langText("or use phone/email", "किंवा फोन/ईमेल वापरा")}
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                {/* Mode Selector */}
                <div className="flex bg-slate-100 rounded-xl p-1 gap-1 w-full max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={() => { setMode("phone"); setConfirmationId(""); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "phone" ? "bg-white shadow-sm text-primary-container" : "text-slate-500 hover:bg-slate-200"}`}
                  >
                    Phone OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode("email"); setConfirmationId(""); }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "email" ? "bg-white shadow-sm text-primary-container" : "text-slate-500 hover:bg-slate-200"}`}
                  >
                    Email
                  </button>
                </div>
              </div>

              <form className="w-full text-left space-y-6" onSubmit={handleSubmit}>
                <div id="kk-recaptcha" className="hidden" />

                {/* Identifier Input */}
                {mode === "phone" && !confirmationId ? (
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-600 font-label ml-1" htmlFor="identifier">
                      {langText("Mobile number", "मोबाईल नंबर")}
                    </label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-xl group-focus-within:text-primary-container transition-colors">
                        phone
                      </span>
                      <input
                        className="w-full pl-14 pr-5 py-5 bg-white border border-slate-300 rounded-[1.25rem] focus:ring-4 focus:ring-primary-container/10 focus:border-primary-container transition-all outline-none text-slate-900 font-semibold placeholder:text-slate-400 disabled:opacity-50"
                        id="identifier"
                        placeholder="+91 90000 00000"
                        type="tel"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        disabled={!!confirmationId || isSubmitting}
                      />
                    </div>
                  </div>
                ) : mode === "email" ? (
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-600 font-label ml-1" htmlFor="identifier">
                      {langText("Email ID", "ईमेल आयडी")}
                    </label>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-xl group-focus-within:text-primary-container transition-colors">
                        mail
                      </span>
                      <input
                        className="w-full pl-14 pr-5 py-5 bg-white border border-slate-300 rounded-[1.25rem] focus:ring-4 focus:ring-primary-container/10 focus:border-primary-container transition-all outline-none text-slate-900 font-semibold placeholder:text-slate-400 disabled:opacity-50"
                        id="identifier"
                        placeholder="name@example.com"
                        type="email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ) : null}

                {/* OTP Input */}
                {mode === "phone" && confirmationId ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-600 font-label" htmlFor="otp">
                        {langText("Enter OTP", "OTP प्रविष्ट करा")}
                      </label>
                      <button
                        type="button"
                        onClick={() => { setConfirmationId(""); setOtp(""); }}
                        className="text-[11px] font-bold text-secondary hover:text-primary-container transition-colors uppercase tracking-widest cursor-pointer"
                        disabled={isSubmitting}
                      >
                        Change Number
                      </button>
                    </div>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-xl group-focus-within:text-primary-container transition-colors">
                        password
                      </span>
                      <input
                        className="w-full pl-14 pr-5 py-5 bg-white border border-slate-300 rounded-[1.25rem] focus:ring-4 focus:ring-primary-container/10 focus:border-primary-container transition-all outline-none text-slate-900 font-bold text-lg tracking-[0.2em] placeholder:tracking-normal placeholder:text-slate-400 disabled:opacity-50"
                        id="otp"
                        placeholder="123456"
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                ) : null}

                {/* Password Input (Email Only) */}
                {mode === "email" ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-600 font-label" htmlFor="password">
                        {langText("Password", "पासवर्ड")}
                      </label>
                      <Link href="/forgot-password" title="Forgot Password?">
                        <span className="text-[11px] font-bold text-secondary hover:text-primary-container transition-colors uppercase tracking-widest cursor-pointer">
                          {langText("Forgot Password?", "पासवर्ड विसरलात?")}
                        </span>
                      </Link>
                    </div>
                    <div className="relative group">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 text-xl group-focus-within:text-primary-container transition-colors">
                        lock
                      </span>
                      <input
                        className="w-full pl-14 pr-14 py-5 bg-white border border-slate-300 rounded-[1.25rem] focus:ring-4 focus:ring-primary-container/10 focus:border-primary-container transition-all outline-none text-slate-900 font-semibold placeholder:text-slate-400 disabled:opacity-50"
                        id="password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary-container transition-colors disabled:opacity-50"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {error ? <FormNotice tone="error">{error}</FormNotice> : null}

                {/* Login CTA */}
                <div className="pt-4 flex flex-col items-center gap-8">
                  <button
                    className="w-full py-5 bg-primary-container text-white text-lg font-bold rounded-2xl shadow-[0_12px_24px_-8px_rgba(20,59,46,0.5)] hover:shadow-[0_20px_32px_-12px_rgba(20,59,46,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 group disabled:opacity-70 disabled:hover:translate-y-0"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? langText("Please wait...", "कृपया प्रतीक्षा करा...") 
                      : mode === "phone" && confirmationId 
                        ? langText("Verify OTP", "OTP तपासा") 
                        : langText("Login / लॉगिन", "लॉगिन करा")}
                    <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">
                      {mode === "phone" && !confirmationId ? "sms" : "arrow_forward"}
                    </span>
                  </button>
                  <p className="text-sm font-semibold text-slate-700">
                    {langText("New to Kisan Kamai?", "किसान कमाई मध्ये नवीन आहात?")}{" "}
                    <Link href="/register">
                      <span className="text-primary-container font-extrabold hover:underline ml-1 cursor-pointer">
                        {langText("Create Account", "खाते तयार करा")}
                      </span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
