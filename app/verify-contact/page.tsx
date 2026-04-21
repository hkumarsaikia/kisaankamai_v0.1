"use client";

import { AppLink as Link } from "@/components/AppLink";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";

function formatValue(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export default function VerifyContactPage() {
  const { user, profile, isProfileComplete } = useAuth();
  const { langText } = useLanguage();
  const email = profile?.email || user?.email || "";
  const phone = profile?.phone || user?.phone || "";
  const hasUsableEmail = Boolean(email && !email.endsWith("@kisankamai.local"));

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12">
        <div className="kk-glass w-full max-w-4xl p-8 lg:p-10">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-container/15 text-primary">
              <span className="material-symbols-outlined text-4xl">contact_phone</span>
            </div>
            <h1 className="text-3xl font-black text-primary">
              {langText("Review your contact sign-in details", "तुमचे संपर्क साइन-इन तपशील तपासा")}
            </h1>
            <p className="mt-4 text-slate-600 font-medium dark:text-slate-400">
              {langText(
                "This page does not auto-verify anything. It shows the phone and email currently stored on your account so you can confirm what works for sign-in, password reset, and future profile updates.",
                "ही पृष्ठ स्वतःहून कोणतीही पडताळणी करत नाही. तुमच्या खात्यात सध्या जतन असलेला फोन आणि ईमेल येथे दाखवला जातो, जेणेकरून साइन-इन, पासवर्ड रीसेट आणि पुढील प्रोफाइल अपडेटसाठी कोणते तपशील वापरले जातात ते स्पष्ट दिसेल."
              )}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <section className="rounded-3xl border border-outline-variant/30 bg-white/60 p-6 shadow-sm dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">smartphone</span>
                <h2 className="text-lg font-black text-primary">
                  {langText("Mobile number", "मोबाईल नंबर")}
                </h2>
              </div>
              <p className="mt-4 text-sm font-semibold text-on-surface">
                {formatValue(phone, langText("No mobile number is saved yet.", "अजून मोबाईल नंबर जतन केलेला नाही."))}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                {phone
                  ? langText(
                      "Phone OTP sign-in and password reset depend on this number.",
                      "फोन OTP साइन-इन आणि पासवर्ड रीसेट या नंबरवर अवलंबून असतात."
                    )
                  : langText(
                      "Add a mobile number from your profile before relying on phone OTP or password reset.",
                      "फोन OTP किंवा पासवर्ड रीसेट वापरण्यापूर्वी प्रोफाइलमधून मोबाईल नंबर जोडा."
                    )}
              </p>
            </section>

            <section className="rounded-3xl border border-outline-variant/30 bg-white/60 p-6 shadow-sm dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <h2 className="text-lg font-black text-primary">
                  {langText("Email sign-in", "ईमेल साइन-इन")}
                </h2>
              </div>
              <p className="mt-4 text-sm font-semibold text-on-surface">
                {hasUsableEmail
                  ? email
                  : langText("No linked email credential is currently visible.", "सध्या जोडलेला ईमेल क्रेडेन्शियल दिसत नाही.")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                {hasUsableEmail
                  ? langText(
                      "Email/password or Google sign-in can only use the email linked to your Firebase account.",
                      "ईमेल/पासवर्ड किंवा Google साइन-इन फक्त तुमच्या Firebase खात्याशी जोडलेल्या ईमेलवर काम करते."
                    )
                  : langText(
                      "If you only registered with phone OTP, email login may not be available until you link an email later.",
                      "जर तुम्ही फक्त फोन OTP ने नोंदणी केली असेल, तर नंतर ईमेल जोडल्याशिवाय ईमेल लॉगिन उपलब्ध नसेल."
                    )}
              </p>
            </section>

            <section className="rounded-3xl border border-outline-variant/30 bg-white/60 p-6 shadow-sm dark:bg-slate-900/40">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
                <h2 className="text-lg font-black text-primary">
                  {langText("Profile readiness", "प्रोफाइल तयारपणा")}
                </h2>
              </div>
              <p className="mt-4 text-sm font-semibold text-on-surface">
                {user
                  ? isProfileComplete
                    ? langText("Required contact fields are present.", "आवश्यक संपर्क फील्ड उपलब्ध आहेत.")
                    : langText("Profile details still need attention.", "प्रोफाइल तपशील अजून पूर्ण करायचे आहेत.")
                  : langText("Sign in to review your account.", "तुमचे खाते तपासण्यासाठी साइन इन करा.")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                {langText(
                  "Identity documents are not auto-approved here. Use your profile screens to correct contact details before relying on them.",
                  "येथे ओळखपत्र आपोआप मंजूर होत नाहीत. संपर्क तपशीलांवर अवलंबून राहण्यापूर्वी प्रोफाइल स्क्रीनमधून ते दुरुस्त करा."
                )}
              </p>
            </section>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {user ? (
              <>
                <Link href="/profile-selection" className="rounded-2xl bg-primary px-6 py-4 font-black text-white">
                  {langText("Go to profile selection", "प्रोफाइल निवडीकडे जा")}
                </Link>
                <Link href="/complete-profile" className="rounded-2xl border border-outline-variant px-6 py-4 font-black text-primary">
                  {langText("Edit contact details", "संपर्क तपशील संपादित करा")}
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-2xl bg-primary px-6 py-4 font-black text-white">
                  {langText("Sign in", "साइन इन करा")}
                </Link>
                <Link href="/register" className="rounded-2xl border border-outline-variant px-6 py-4 font-black text-primary">
                  {langText("Create account", "खाते तयार करा")}
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
