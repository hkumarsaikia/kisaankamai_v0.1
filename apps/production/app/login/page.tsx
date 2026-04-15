import { AppLink } from "@/components/app-link";
import { FormShell } from "@/components/forms/FormKit";
import { LoginClient } from "@/components/login-client";
import { getLocale } from "@/lib/i18n";

const copy = {
  en: {
    eyebrow: "Secure access",
    title: "Sign in to the marketplace",
    description: "Use phone OTP or a linked email/password. Both resolve to the same account and server session.",
    asideTitle: "Trust boundary",
    asideBody:
      "Server session cookies are created only after verification succeeds, so the client never becomes the source of truth.",
    trustTitle: "What stays protected",
    trustBody: "Your account identity, workspace preference, and profile data remain bound to your account record.",
    client: {
      phoneLabel: "Phone number",
      otpLabel: "OTP",
      emailLabel: "Email",
      passwordLabel: "Password",
      authPhone: "Phone OTP",
      authEmail: "Email + password",
      submit: "Continue",
      verifyOtp: "Verify OTP",
    },
  },
  mr: {
    eyebrow: "सुरक्षित प्रवेश",
    title: "बाजारपेठेत साइन इन करा",
    description: "फोन OTP किंवा लिंक केलेले ईमेल/पासवर्ड वापरा. दोन्ही एकाच खाते आणि सर्व्हर सत्राशी जोडले जातात.",
    asideTitle: "विश्वासाची मर्यादा",
    asideBody: "सर्व्हर सत्र कुकी फक्त पडताळणी यशस्वी झाल्यावर तयार होते. क्लायंट कधीच अंतिम सत्य नसतो.",
    trustTitle: "काय संरक्षित राहते",
    trustBody: "तुमची ओळख, कार्यक्षेत्र निवड आणि प्रोफाइल डेटा तुमच्या खाते नोंदीशी जोडलेले राहतात.",
    client: {
      phoneLabel: "फोन नंबर",
      otpLabel: "OTP",
      emailLabel: "ईमेल",
      passwordLabel: "पासवर्ड",
      authPhone: "फोन OTP",
      authEmail: "ईमेल + पासवर्ड",
      submit: "सुरू ठेवा",
      verifyOtp: "OTP पडताळा",
    },
  },
} as const;

export default async function LoginPage() {
  const locale = await getLocale();
  const page = copy[locale];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(43,157,109,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_36%)]" />
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-20">
        <div className="bg-[linear-gradient(135deg,_rgba(2,37,26,0.95),_rgba(2,37,26,0.8)),linear-gradient(45deg,#0f172a,#111827)]" />
        <div className="bg-[linear-gradient(135deg,_rgba(20,59,46,0.92),_rgba(20,59,46,0.65)),url('/assets/generated/harvester_action.png')] bg-cover bg-center" />
        <div className="bg-[linear-gradient(135deg,_rgba(2,37,26,0.92),_rgba(2,37,26,0.7)),linear-gradient(45deg,#1f2937,#0f172a)]" />
        <div className="bg-[linear-gradient(135deg,_rgba(20,59,46,0.9),_rgba(20,59,46,0.7)),linear-gradient(45deg,#111827,#1f2937)]" />
        <div className="bg-[linear-gradient(135deg,_rgba(2,37,26,0.94),_rgba(2,37,26,0.72)),url('/assets/generated/hero_tractor.png')] bg-cover bg-center" />
        <div className="bg-[linear-gradient(135deg,_rgba(20,59,46,0.92),_rgba(20,59,46,0.68)),linear-gradient(45deg,#172554,#0f172a)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/30 bg-white/80 px-5 py-3 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-700 text-white">
              <span className="material-symbols-outlined text-xl">agriculture</span>
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Kisan Kamai</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{page.eyebrow}</p>
            </div>
          </div>
          <div className="hidden items-center gap-5 md:flex">
            <AppLink href="/rent-equipment" className="text-sm font-bold text-slate-600 transition hover:text-brand-700 dark:text-slate-300 dark:hover:text-brand-300">
              {locale === "mr" ? "उपकरणे पाहा" : "Browse equipment"}
            </AppLink>
            <AppLink href="/register" className="rounded-full bg-brand-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600">
              {locale === "mr" ? "खाते तयार करा" : "Create account"}
            </AppLink>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/40 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-brand-800 shadow-soft dark:border-slate-800 dark:bg-slate-950/80 dark:text-brand-200">
              {page.eyebrow}
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white md:text-6xl">{page.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">{page.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/50 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{page.asideTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{page.asideBody}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/50 bg-white/85 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{page.trustTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{page.trustBody}</p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-5xl">
            <FormShell
              eyebrow={page.eyebrow}
              locale={locale}
              title={locale === "mr" ? "विश्वसनीय मार्ग निवडा" : "Choose the trusted sign-in path"}
              description={
                locale === "mr"
                  ? "फोन OTP किंवा ईमेल/पासवर्ड वापरून साइन-इन पूर्ण करा. नंतर सर्व्हर सत्र तयार होते."
                  : "Complete sign-in with phone OTP or email/password, then let the server create the session."
              }
              aside={
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">{page.asideTitle}</h3>
                  <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{page.asideBody}</p>
                  <div className="rounded-[1.25rem] border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
                    {locale === "mr" ? "सत्र कुकी पडताळणीशिवाय कधीच तयार होत नाही." : "Session cookies are never created without verification."}
                  </div>
                </div>
              }
            >
              <LoginClient locale={locale} copy={page.client} />
            </FormShell>
          </div>
        </div>
      </div>
    </main>
  );
}
