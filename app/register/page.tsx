"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { FormNotice } from "@/components/forms/FormKit";
import { registerAction } from "@/lib/actions/local-data";

const DEMO_OTP = "123456";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    village: "",
    pincode: "",
    district: "Pune",
    role: "renter" as "renter" | "owner" | "both",
    idType: "Aadhaar Card",
    idNumber: "",
  });

  const address = useMemo(
    () => [formData.village.trim(), formData.district.trim(), formData.pincode.trim()].filter(Boolean).join(", "),
    [formData.district, formData.pincode, formData.village]
  );

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (field === "phone") {
      setOtpVerified(false);
    }
  };

  const handleSendOtp = () => {
    setShowOtp(true);
    setOtp("");
    setOtpVerified(false);
    setError("");
  };

  const handleVerifyOtp = () => {
    if (otp.trim() === DEMO_OTP) {
      setOtpVerified(true);
      setError("");
      window.alert("OTP verified successfully.");
      return;
    }

    setOtpVerified(false);
    window.alert("OTP could not be verified. Please check and try again.");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    if (!otpVerified) {
      setError("Please verify the OTP before creating your account.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await registerAction({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        village: formData.village.trim(),
        pincode: formData.pincode.trim(),
        address,
        district: formData.district,
        role: formData.role,
        idType: formData.idType,
        idNumber: formData.idNumber.trim(),
        fieldArea: "N/A",
        otpVerified: true,
      });

      if (!result.ok) {
        setError(result.error || "Registration failed.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = result.redirectTo || "/register/success";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Registration failed.");
      setIsSubmitting(false);
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
            </div>

            <form className="space-y-10 px-6 py-8 sm:px-10 sm:py-10" onSubmit={handleSubmit}>
              {error ? <FormNotice tone="error">{error}</FormNotice> : null}

              <section className="space-y-5">
                <GoogleAuthButton label="Create your account with Google / गुगलसह खाते तयार करा" />
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-outline-variant/70" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-outline">or register manually</span>
                  <div className="h-px flex-1 bg-outline-variant/70" />
                </div>
              </section>

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
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      placeholder="E.g. Rajesh Patil"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      required
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">Mobile Number / मोबाईल नंबर</span>
                    <div className="flex gap-2">
                      <input
                        className="min-w-0 flex-1 rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                        placeholder="+91 98765 43210"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        required
                      />
                      <button
                        className="shrink-0 rounded-xl bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-primary-container"
                        type="button"
                        onClick={handleSendOtp}
                      >
                        Send OTP
                      </button>
                    </div>
                  </label>

                  {showOtp ? (
                    <div className="space-y-3 md:col-span-2">
                      <div className="rounded-2xl border border-primary-fixed bg-primary-fixed/20 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                          <label className="min-w-0 flex-1 space-y-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">Enter OTP</span>
                            <input
                              className="w-full rounded-xl border-0 bg-white px-4 py-3.5 font-mono text-lg font-bold tracking-[0.45em] text-center text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                              inputMode="numeric"
                              maxLength={6}
                              placeholder="000000"
                              value={otp}
                              onChange={(e) => {
                                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                                setOtpVerified(false);
                              }}
                            />
                          </label>
                          <button
                            className="rounded-xl bg-primary-container px-5 py-3 font-bold text-white transition-colors hover:bg-primary"
                            type="button"
                            onClick={handleVerifyOtp}
                          >
                            Verify OTP
                          </button>
                        </div>
                        <p className="mt-3 text-xs font-medium text-on-surface-variant">
                          Demo OTP: <span className="font-bold text-primary">123456</span>
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <label className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">Email Address / ईमेल पत्ता</span>
                    <input
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      placeholder="name@example.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </label>

                  <label className="relative space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">Password / पासवर्ड</span>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 pr-12 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        required
                      />
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline transition-colors hover:text-primary"
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
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
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      type="text"
                      value={formData.village}
                      onChange={(e) => updateField("village", e.target.value)}
                      required
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">District / जिल्हा</span>
                    <select
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      value={formData.district}
                      onChange={(e) => updateField("district", e.target.value)}
                    >
                      <option value="Pune">Pune</option>
                      <option value="Satara">Satara</option>
                      <option value="Kolhapur">Kolhapur</option>
                      <option value="Nashik">Nashik</option>
                    </select>
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">Pincode / पिनकोड</span>
                    <input
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      inputMode="numeric"
                      maxLength={6}
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">Role / भूमिका</span>
                    <select
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      value={formData.role}
                      onChange={(e) => updateField("role", e.target.value)}
                    >
                      <option value="renter">Renter</option>
                      <option value="owner">Owner</option>
                      <option value="both">Both</option>
                    </select>
                  </label>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-primary-container/20 pb-4">
                  <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified_user
                  </span>
                  <h2 className="font-headline text-2xl font-bold text-primary">Verification / पडताळणी</h2>
                </div>
                <p className="max-w-3xl text-sm leading-relaxed text-on-surface-variant">
                  Aadhaar verification helps confirm identity and builds trust between owners and renters. You can also do this later from your profile.
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">ID Type / ओळखपत्राचा प्रकार</span>
                    <select
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      value={formData.idType}
                      onChange={(e) => updateField("idType", e.target.value)}
                    >
                      <option>Aadhaar Card</option>
                      <option>PAN Card</option>
                      <option>Voter ID</option>
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">ID Number / ओळखपत्र क्रमांक</span>
                    <input
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      placeholder="XXXX XXXX XXXX"
                      type="text"
                      value={formData.idNumber}
                      onChange={(e) => updateField("idNumber", e.target.value)}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low/40 px-6 py-8 text-center">
                    <span className="material-symbols-outlined text-3xl text-outline">upload_file</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">Front Side / समोरची बाजू</span>
                  </div>
                  <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low/40 px-6 py-8 text-center">
                    <span className="material-symbols-outlined text-3xl text-outline">upload_file</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">Back Side / मागची बाजू</span>
                  </div>
                </div>
              </section>

              <div className="space-y-4 border-t border-outline-variant/30 pt-8">
                <button
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-5 text-lg font-bold text-white shadow-2xl shadow-primary/20 transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70"
                  type="submit"
                  disabled={isSubmitting || !otpVerified}
                >
                  {isSubmitting ? "Creating Account..." : "Create My Account / माझे खाते तयार करा"}
                  <span className="material-symbols-outlined">how_to_reg</span>
                </button>
                <p className="text-center text-sm font-medium text-on-surface-variant">
                  Already have an account?{" "}
                  <Link href="/login" className="font-bold text-primary hover:underline">
                    Login here
                  </Link>
                </p>
                {!otpVerified ? (
                  <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-outline">
                    Verify OTP to unlock account creation
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
