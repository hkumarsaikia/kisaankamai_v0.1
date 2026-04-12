"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { useAuth } from "@/components/AuthContext";
import { postJson, SubmissionError } from "@/lib/client/forms";
import { completeProfileSchema } from "@/lib/validation/forms";
import { DEMO_AUTH_CONFIG } from "@/lib/demoAuth";
import { account } from "@/lib/appwrite";

export default function CompleteProfile() {
  const router = useRouter();
  const { langText } = useLanguage();
  const { user, profile, loading, isProfileComplete, refreshProfile } = useAuth();
  
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && isProfileComplete) {
      router.push("/profile-selection");
    }
  }, [user, loading, isProfileComplete, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = completeProfileSchema.safeParse({
      phone,
      pincode,
      village: "",
      address: "",
      role: profile?.role || "renter",
    });

    if (!parsed.success) {
      setError(
        parsed.error.flatten().formErrors[0] ||
          parsed.error.flatten().fieldErrors.phone?.[0] ||
          parsed.error.flatten().fieldErrors.pincode?.[0] ||
          langText("Please enter valid phone and pincode.", "कृपया वैध फोन आणि पिनकोड प्रविष्ट करा.")
      );
      return;
    }

    setIsVerifying(true);
    try {
      const jwt = await account.createJWT();

      await postJson("/api/profile/complete", {
        ...parsed.data,
        jwt: jwt.jwt,
      });

      await refreshProfile();
      router.push("/profile-selection");
    } catch (err: any) {
      console.error("Profile save error:", err);
      if (err instanceof SubmissionError) {
        setError(err.message);
      } else {
        setError("Failed to save profile: " + err.message);
      }
    }
    setIsVerifying(false);
  };

  if (loading) return null;

  if (DEMO_AUTH_CONFIG.enabled) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
          <div className="kk-glass w-full max-w-xl p-8 lg:p-10 text-center">
            <h1 className="text-3xl font-black text-primary dark:text-emerald-50 mb-4">
              {langText("Demo Profile Ready", "Demo प्रोफाइल तयार आहे")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">
              {user
                ? langText(
                    "Profile completion is skipped in demo mode. Continue to profile selection.",
                    "Demo mode मध्ये profile completion वगळले आहे. Profile selection कडे जा."
                  )
                : langText(
                    "Demo mode uses browser-local sessions. Sign in with the shared demo credentials first.",
                    "Demo mode browser-local session वापरतो. आधी shared demo credentials ने sign in करा."
                  )}
            </p>
            <button
              type="button"
              onClick={() => router.push(user ? "/profile-selection" : "/login")}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl"
            >
              {user
                ? langText("Go to Profile Selection", "प्रोफाइल निवडीकडे जा")
                : langText("Go to Login", "लॉगिनकडे जा")}
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <div className="kk-glass w-full max-w-xl p-8 lg:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary dark:text-emerald-50 mb-2">
              {langText("Complete Your Profile", "तुमची प्रोफाइल पूर्ण करा")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {langText("Just a few more details to get you started.", "सुरू करण्यासाठी फक्त काही अधिक तपशील.")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                {langText("Phone Number", "फोन नंबर")}
              </label>
              <input
                className="kk-input"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500">
                {langText("Pin Code", "पिन कोड")}
              </label>
              <input
                className="kk-input"
                placeholder="6-digit pin code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </div>

            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isVerifying ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
              {langText("Complete Profile", "प्रोफाइल पूर्ण करा")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
