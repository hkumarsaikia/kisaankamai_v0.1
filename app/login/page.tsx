"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/components/LanguageContext";
import { assetPath } from "@/lib/site";
import { account, databases, APPWRITE_CONFIG } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";

export default function LoginPage() {
  const router = useRouter();
  const { langText } = useLanguage();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      setError(
        langText(
          "Enter your mobile number or email and password to continue.",
          "पुढे जाण्यासाठी तुमचा मोबाईल क्रमांक किंवा ईमेल आणि पासवर्ड टाका."
        )
      );
      return;
    }

    // If identifier doesn't look like an email, assume it's a phone number and append domain
    // (matches the logic in registration where we generate phone@kisankamai.com if email is missing)

    try {
      setError("");
      // If identifier doesn't look like an email, assume it's a phone number and append domain
      const email = identifier.includes("@") ? identifier : `${identifier}@kisankamai.com`;

      // 1. Create session with Appwrite
      await account.createEmailPasswordSession(email, password);

      // 2. Fetch user profile to determine redirect
      const user = await account.get();
      try {
        const profile = await databases.getDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.userCollectionId,
          user.$id
        );

        if (profile.role === "owner") {
          router.push("/owner-dashboard");
        } else if (profile.role === "renter") {
          router.push("/renter-dashboard");
        } else {
          router.push("/profile-selection");
        }
      } catch (err) {
        // No profile found, probably need onboarding
        router.push("/profile-selection");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(langText("Invalid email or password.", "अवैध ईमेल किंवा पासवर्ड."));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Appwrite handles the redirect. After redirect, AuthContext will catch the session.
      account.createOAuth2Session(
        OAuthProvider.Google,
        `${window.location.origin}/verify-contact`, // Success redirect
        `${window.location.origin}/login` // Failure redirect
      );
    } catch {
      setError(langText("Google sign-in failed.", "Google साइन-इन अयशस्वी झाले."));
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      <main className="relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            src={assetPath("/assets/generated/farm_yard.png")}
            alt="Farm equipment yard"
            className="h-full w-full object-cover opacity-10 dark:opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background dark:from-slate-950/80 dark:via-slate-950/95 dark:to-slate-950" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-12rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-secondary backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-amber-400">
              <span className="material-symbols-outlined text-base">verified_user</span>
              {langText("Secure access", "सुरक्षित प्रवेश")}
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-primary dark:text-emerald-50 md:text-6xl">
              {langText("Welcome back to Kisan Kamai.", "किसान कमाईमध्ये पुन्हा स्वागत आहे.")}
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium text-slate-600 dark:text-slate-400">
              {langText(
                "Empowering every farmer with tools to grow, earn, and thrive.",
                "प्रत्येक शेतकऱ्याला प्रगती, कमाई आणि समृद्धीसाठी सक्षम बनवत आहोत."
              )}
            </p>


          </section>

          <section className="kk-glass mx-auto w-full max-w-xl p-8 lg:p-10">
            <div className="mb-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-secondary dark:text-amber-400">
                {langText("Login", "लॉगिन")}
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-primary dark:text-emerald-50">
                {langText("Access your account", "तुमच्या खात्यात प्रवेश करा")}
              </h2>
              <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                {langText(
                  "Use your registered phone number or email.",
                  "तुमचा नोंदणीकृत फोन नंबर किंवा ईमेल वापरा."
                )}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="identifier" className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {langText("Mobile or email", "मोबाईल किंवा ईमेल")}
                </label>
                <input
                  id="identifier"
                  className="kk-input"
                  placeholder={langText("Enter phone or email", "फोन किंवा ईमेल टाका")}
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {langText("Password", "पासवर्ड")}
                  </label>
                  <button type="button" className="text-xs font-bold text-secondary hover:underline dark:text-amber-400">
                    {langText("Forgot password?", "पासवर्ड विसरलात?")}
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  className="kk-input"
                  placeholder={langText("Enter password", "पासवर्ड टाका")}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              ) : null}



              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-black text-white transition-transform hover:scale-[0.99] dark:bg-emerald-700"
              >
                {langText("Login to Kisan Kamai", "किसान कमाईमध्ये लॉगिन करा")}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>

              <div className="relative flex items-center gap-4 py-2 mt-4">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{langText("OR", "किंवा")}</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              </div>

              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-[#111] text-white font-bold py-4 rounded-full border border-[#333] hover:bg-black transition-all shadow-md active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-label tracking-tighter">{langText("Continue with Google", "Google सह सुरू ठेवा")}</span>
              </button>
            </form>



            <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              {langText("New to Kisan Kamai?", "किसान कमाईवर नवीन आहात?")}{" "}
              <Link href="/register" className="font-black text-secondary hover:underline dark:text-amber-400">
                {langText("Create an account", "खाते तयार करा")}
              </Link>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
