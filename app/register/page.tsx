"use client";

import { FormEvent, useMemo, useState } from "react";
import { AppLink as Link } from "@/components/AppLink";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { FormNotice } from "@/components/forms/FormKit";
import { registerAction } from "@/lib/actions/local-data";

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    village: "",
    pincode: "",
    district: "Pune",
    role: "renter" as "renter" | "owner" | "both",
    idType: "",
    idNumber: "",
  });

  const address = useMemo(
    () => [formData.village.trim(), formData.district.trim(), formData.pincode.trim()].filter(Boolean).join(", "),
    [formData.district, formData.pincode, formData.village]
  );

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
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
        idType: formData.idType || undefined,
        idNumber: formData.idNumber.trim(),
        fieldArea: "N/A",
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
                    <input
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      placeholder="+91 90000 00000"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                    />
                  </label>

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
                  <h2 className="font-headline text-2xl font-bold text-primary">Optional Identity Verification / ऐच्छिक ओळख पडताळणी</h2>
                </div>
                <p className="max-w-3xl text-sm leading-relaxed text-on-surface-variant">
                  Uploading an identity document is optional. You can add Aadhaar, PAN, Voter ID, or another government-issued document later from your profile when backend verification is enabled.
                </p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <label className="space-y-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline">ID Type / ओळखपत्राचा प्रकार</span>
                    <select
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      value={formData.idType}
                      onChange={(e) => updateField("idType", e.target.value)}
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
                      className="w-full rounded-xl border-0 bg-surface-container-low px-4 py-3.5 text-on-surface shadow-sm focus:ring-2 focus:ring-primary-container/50"
                      placeholder="Document number (optional)"
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
                  disabled={isSubmitting}
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
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
