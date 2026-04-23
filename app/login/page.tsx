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
import { OtpVerificationForm } from "@/components/auth/OtpVerificationForm";
import { useLanguage } from "@/components/LanguageContext";

const collageTiles = [
  {
    className: "col-span-5 row-span-6",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_pcRi7kqAR57jlutMIa12HOJnU_9q3iInzLHc0nMY9xx0b5IHaLNAEfa9Ssfgi2ns2LFedCH_oZcTOAr3Hfvi49ZsgiKvFE9b7hsmJ-kU9hlgHoNtuG53dODDCb-960DUnL5SL6rCrSYkv7MSIy34UsaMpXN4H988Cfb5j1fVBJq4O3EUSw0jEJiJzuU9LYyGSRONAlfc7gmgD7Dkq-CkaqP2nypiWlG7sptJGw8Q3r8QZEUjextFG4-WyM6ePMe37JC-WPqXCOaT",
  },
  {
    className: "col-span-7 row-span-4",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhG2qAkWx4YRhXVOwVwDIYnJ2RBDKYq_HG7rBOpDy1QQSyz7fI8lKhmuL3FMrqynLMDJ2aa4ONVz1shtrpSJAtie3PKzMRkXgxzXQtHvF2eSLU3p4RnOZCimoEnM2Nv_OWCbLSJRkVg98m5_TBKWo4BAHhYbxq7slGwVHoTa8rqa624Exf6JR35BfwO40PhaM1uD380Q2YVPpfVfFaj0igWCOBH1uplA_lc_w2PROYG-je7zbBYEE1-VvBi8FzPMY4kQKMpIbIU5oU",
  },
  {
    className: "col-span-3 row-span-6",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPliM4zCgbkjzQ2PDyIhXJwYKu22V0x4kvFCJAcrVqvQIcHCEGeR7sjRINQFuD1afhsbWHP6UZaJCmfaFKynXLXeG7Yf5pOCOp6PwpDoeWkslI4_K_9xIHgmJGuxqlDo-rb87ttAlnAJ880r8xlV6gLEpsGteEQrCxDfo9Hpv4oFn9rHYa64feiASJfRTCgDICpKJ3PVimJEzWY6N228FSnBVauwYL5Xor6gJdmgShSrpjOU4E_00GI-8QP0dh28HZuzYIRMZLiw1N",
  },
  {
    className: "col-span-7 row-span-4",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBV7vj9X1VdEt0syXe9h5Qf0sy6c2TGocRc-QhKPdTAuOQzpeUj4xVbzvJzY9G9-zrVOImIQpJldku8HV8VxgpWEmFycmIN_RVpxRuvbWxflff1hXDlXotZsThAYVSli1lFHlS6R5GJGjylaDjJmmpv5OZmXv0M4faKaMgTrcNCf0x-M30vmreHm_dh9b2uuUwEn-D9VPmaryJRERtdh5PmkksU7tSysfFQt6nNOYeORzev5raE0rA_-vPKNit7Gi_8RRT7PiFNOiDW",
  },
  {
    className: "col-span-4 row-span-4",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDH660fQmy5SHxapGGMyLHpABbs4WzGa0l-t8LHgTD8qbYMgcsoH1w1mvgwSN11XmYT1RjtbToWZhEG3TIRC_R9P8_IGZU0HleM79DHh42vmnPudSGNOCTG-qzWdRvAmAOwogVg-YgNwLdhqwXgWbrF4sNC0DPi4A7zZcyb8vXdmAdGNiQgajwSQHXdgyrVfYTF9m6J06lRM6tCRuILUTuAO6fIi_YzMP_hvGKPdIIUonfAfDMXhZZv38YrVAGiELz_ltCRxBfCQ7tz",
  },
  {
    className: "col-span-3 row-span-4",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_pcRi7kqAR57jlutMIa12HOJnU_9q3iInzLHc0nMY9xx0b5IHaLNAEfa9Ssfgi2ns2LFedCH_oZcTOAr3Hfvi49ZsgiKvFE9b7hsmJ-kU9hlgHoNtuG53dODDCb-960DUnL5SL6rCrSYkv7MSIy34UsaMpXN4H988Cfb5j1fVBJq4O3EUSw0jEJiJzuU9LYyGSRONAlfc7gmgD7Dkq-CkaqP2nypiWlG7sptJGw8Q3r8QZEUjextFG4-WyM6ePMe37JC-WPqXCOaT",
  },
  {
    className: "col-span-2 row-span-6",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhG2qAkWx4YRhXVOwVwDIYnJ2RBDKYq_HG7rBOpDy1QQSyz7fI8lKhmuL3FMrqynLMDJ2aa4ONVz1shtrpSJAtie3PKzMRkXgxzXQtHvF2eSLU3p4RnOZCimoEnM2Nv_OWCbLSJRkVg98m5_TBKWo4BAHhYbxq7slGwVHoTa8rqa624Exf6JR35BfwO40PhaM1uD380Q2YVPpfVfFaj0igWCOBH1uplA_lc_w2PROYG-je7zbBYEE1-VvBi8FzPMY4kQKMpIbIU5oU",
  },
];

export default function LoginPage() {
  const { langText } = useLanguage();
  const auth = useMemo(() => getOptionalFirebaseAuthClient(), []);
  const [mode, setMode] = useState<"phone" | "email">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array.from({ length: 6 }, () => ""));
  const [resendAvailableIn, setResendAvailableIn] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const authUnavailableMessage = langText(
    "Firebase sign-in is unavailable in this deployment. Please try again after the Firebase public configuration is restored.",
    "या डिप्लॉयमेंटमध्ये Firebase साइन-इन उपलब्ध नाही. Firebase सार्वजनिक कॉन्फिगरेशन पुन्हा सक्षम झाल्यावर पुन्हा प्रयत्न करा."
  );

  useEffect(() => () => clearRecaptchaVerifier("login"), []);

  useEffect(() => {
    if (!resendAvailableIn) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendAvailableIn((current) => (current <= 1 ? 0 : current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendAvailableIn]);

  const resetOtpState = () => {
    setConfirmationId("");
    setOtpDigits(Array.from({ length: 6 }, () => ""));
    setError("");
  };

  const withBusyState = async (action: () => Promise<void>) => {
    setIsSubmitting(true);
    setError("");

    try {
      await action();
    } finally {
      setIsSubmitting(false);
    }
  };

  const startPhoneLogin = async () => {
    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    await withBusyState(async () => {
      try {
        const verificationId = await startPhoneVerification({
          auth,
          phoneNumber: identifier,
          containerId: "kk-login-recaptcha",
          storeKey: "login",
        });
        setConfirmationId(verificationId);
        setResendAvailableIn(60);
      } catch (authError) {
        setError(getFirebaseAuthError(authError, langText("Could not send the OTP.", "OTP पाठवता आला नाही.")));
      }
    });
  };

  const finishPhoneLogin = async () => {
    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    await withBusyState(async () => {
      try {
        await verifyPhoneOtp({
          auth,
          verificationId: confirmationId,
          otp: otpDigits.join(""),
        });
        await finishFirebaseAuthSession({ auth });
        window.location.href = "/profile-selection";
      } catch (authError) {
        setError(getFirebaseAuthError(authError, langText("Incorrect OTP. Please try again.", "चुकीचा OTP. कृपया पुन्हा प्रयत्न करा.")));
      }
    });
  };

  const loginWithEmail = async () => {
    if (!auth) {
      setError(authUnavailableMessage);
      return;
    }

    await withBusyState(async () => {
      try {
        await signInWithEmailPassword({
          auth,
          email: identifier,
          password,
        });
        await finishFirebaseAuthSession({ auth });
        window.location.href = "/profile-selection";
      } catch (authError) {
        setError(getFirebaseAuthError(authError, langText("Login failed.", "लॉगिन अयशस्वी झाले.")));
      }
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (mode === "phone") {
      if (confirmationId) {
        await finishPhoneLogin();
      } else {
        await startPhoneLogin();
      }
      return;
    }

    await loginWithEmail();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-background">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-1 bg-primary">
        {collageTiles.map((tile) => (
          <div
            key={tile.image + tile.className}
            className={`relative ${tile.className}`}
            style={{
              backgroundImage: `url(${tile.image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              filter: "brightness(0.85)",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,37,26,0.4)_0%,rgba(0,37,26,0.1)_50%,rgba(0,37,26,0.45)_100%)]" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-[540px] overflow-hidden rounded-[3rem] border border-white/30 bg-white/92 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] ring-1 ring-white/20 backdrop-blur-xl md:p-14">
          <div className="space-y-10">
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-container/10 ring-1 ring-primary-container/20">
                <span className="material-symbols-outlined text-5xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  agriculture
                </span>
              </div>
              <div className="space-y-1">
                <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-background">
                  {langText("Welcome to Kisan Kamai", "किसान कमाईमध्ये स्वागत आहे")}
                </h1>
                <p className="font-headline text-sm font-bold text-slate-600">
                  {langText("Sign in to your account", "आपल्या खात्यात साइन इन करा")}
                </p>
                {!auth ? <p className="text-sm font-semibold text-amber-700">{authUnavailableMessage}</p> : null}
              </div>
            </div>

            <div className="space-y-5">
              <GoogleAuthButton label={langText("Continue with Google", "Google सह पुढे जा")} />

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  {langText("or use your credentials", "किंवा तुमचे तपशील वापरा")}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="mx-auto flex max-w-sm gap-1 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("email");
                    resetOtpState();
                  }}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                    mode === "email" ? "bg-white text-primary shadow-sm" : "text-slate-500"
                  }`}
                >
                  {langText("Email", "ईमेल")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("phone");
                    resetOtpState();
                  }}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                    mode === "phone" ? "bg-white text-primary shadow-sm" : "text-slate-500"
                  }`}
                >
                  {langText("Phone OTP", "फोन OTP")}
                </button>
              </div>
            </div>

            {mode === "phone" && confirmationId ? (
              <>
                <OtpVerificationForm
                  phone={identifier}
                  otpDigits={otpDigits}
                  setOtpDigits={setOtpDigits}
                  onSubmit={finishPhoneLogin}
                  isSubmitting={isSubmitting}
                  resendAvailableIn={resendAvailableIn}
                  onResend={startPhoneLogin}
                  onChangeNumber={resetOtpState}
                  error={error}
                  title={langText("Verify your mobile number", "तुमच्या मोबाईल नंबरची पडताळणी करा")}
                  description={langText("Enter the six-digit code sent to", "तुमच्या मोबाईलवर पाठवलेला सहा अंकी कोड टाका")}
                  submitLabel={langText("Verify and Continue", "पडताळणी करून पुढे जा")}
                  submittingLabel={langText("Verifying...", "पडताळणी होत आहे...")}
                  resendLabel={langText("Resend OTP", "OTP पुन्हा पाठवा")}
                  resendCountdownLabel={langText("Resend in", "पुन्हा पाठवा")}
                  editLabel={langText("Edit details", "तपशील संपादित करा")}
                  bannerTitle={
                    resendAvailableIn === 0 && !error
                      ? langText("OTP has expired. Please request a new one.", "OTP ची मुदत संपली आहे. कृपया नवीन OTP मागवा.")
                      : undefined
                  }
                  bannerDescription={
                    resendAvailableIn === 0 && !error
                      ? langText("Use resend to receive a fresh code.", "नवीन कोड मिळवण्यासाठी पुन्हा पाठवा निवडा.")
                      : undefined
                  }
                  view={isSubmitting ? "loading" : "entry"}
                />
                <div id="kk-login-recaptcha" className="hidden" />
              </>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div id="kk-login-recaptcha" className="hidden" />

                <div className="space-y-3">
                  <label className="ml-1 text-[12px] font-bold uppercase tracking-[0.15em] text-slate-500" htmlFor="identifier">
                    {mode === "email"
                      ? langText("Email address", "ईमेल पत्ता")
                      : langText("Mobile number", "मोबाईल नंबर")}
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-500 transition-colors group-focus-within:text-primary-container">
                      {mode === "email" ? "mail" : "fingerprint"}
                    </span>
                    <input
                      id="identifier"
                      type={mode === "email" ? "email" : "tel"}
                      value={identifier}
                      onChange={(event) => {
                        setIdentifier(event.target.value);
                        setError("");
                      }}
                      placeholder={mode === "email" ? "name@example.com" : "+91 90000 00000"}
                      className="w-full rounded-[1.25rem] border border-slate-300 bg-white py-5 pl-14 pr-5 font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                {mode === "email" ? (
                  <div className="space-y-3">
                    <div className="ml-1 flex items-center justify-between">
                      <label className="text-[12px] font-bold uppercase tracking-[0.15em] text-slate-500" htmlFor="password">
                        {langText("Password", "पासवर्ड")}
                      </label>
                      <Link href="/forgot-password" className="text-[11px] font-bold uppercase tracking-widest text-secondary transition-colors hover:text-primary-container">
                        {langText("Forgot password?", "पासवर्ड विसरलात?")}
                      </Link>
                    </div>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-500 transition-colors group-focus-within:text-primary-container">
                        lock
                      </span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          setError("");
                        }}
                        placeholder="••••••••"
                        className="w-full rounded-[1.25rem] border border-slate-300 bg-white py-5 pl-14 pr-14 font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10"
                        disabled={isSubmitting}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-primary-container"
                        aria-label={langText("Toggle password visibility", "पासवर्ड दृश्यमानता बदला")}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}

                {error ? <p className="text-sm font-semibold text-error">{error}</p> : null}

                <div className="space-y-8 pt-4 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-container py-5 text-lg font-bold text-white shadow-[0_12px_24px_-8px_rgba(20,59,46,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_32px_-12px_rgba(20,59,46,0.6)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    <span>
                      {isSubmitting
                        ? langText("Please wait...", "कृपया प्रतीक्षा करा...")
                        : langText("Login to Kisan Kamai", "किसान कमाईमध्ये लॉगिन करा")}
                    </span>
                    <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>

                  <p className="text-sm font-semibold text-slate-600">
                    {langText("New to Kisan Kamai?", "किसान कमाईमध्ये नवीन आहात?")}{" "}
                    <Link href="/register" className="font-extrabold text-primary-container hover:underline">
                      {langText("Create Account", "खाते तयार करा")}
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
