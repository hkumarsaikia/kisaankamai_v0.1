import { AppLink } from "@/components/app-link";
import { FormShell } from "@/components/forms/FormKit";
import { RegisterClient } from "@/components/register-client";
import { getLocale } from "@/lib/i18n";

const copy = {
  en: {
    eyebrow: "Phone-first onboarding",
    title: "Create your account",
    description: "Verify your phone with OTP, then optionally link email/password to the same Firebase identity.",
    asideTitle: "What the account powers",
    asideBody:
      "This account becomes the source of truth for profile data, saved items, bookings, and owner workflows.",
    safetyTitle: "Guardrails",
    safetyBody: "Only verification can create the durable server session used by the app.",
    workspaceLabel: "Workspace choice",
    workspaceHint: "Choose the workspace you want to enter first. You can still switch later.",
    client: {
      fullName: "Full name",
      phone: "Phone",
      email: "Email (optional)",
      password: "Password (optional)",
      address: "Address",
      village: "Village / City",
      pincode: "Pincode",
      fieldArea: "Field area (acres)",
      workspacePreference: "Preferred workspace",
      otp: "OTP",
      verifyStatus: "Phone verification required",
      verifiedStatus: "Phone verified next",
      sendOtp: "Send OTP",
      verifyOtp: "Verify OTP and create account",
    },
  },
  mr: {
    eyebrow: "फोन-प्रथम नोंदणी",
    title: "तुमचे खाते तयार करा",
    description: "फोन OTP ने पडताळणी करा, मग हवे असल्यास email/password त्याच Firebase ओळखीशी जोडा.",
    asideTitle: "हे खाते काय चालवते",
    asideBody: "हे खाते प्रोफाइल नोंदी, सेव्ह केलेल्या नोंदी, बुकिंग्ज आणि मालक प्रवाह यांचे स्रोत राहते.",
    safetyTitle: "संरक्षक नियम",
    safetyBody: "फक्त पडताळणीच अॅपने वापरणारे स्थिर सर्व्हर सत्र तयार करू शकते.",
    workspaceLabel: "कार्यक्षेत्र निवड",
    workspaceHint: "प्रथम कोणते कार्यक्षेत्र उघडायचे ते निवडा. नंतर बदलता येईल.",
    client: {
      fullName: "पूर्ण नाव",
      phone: "फोन",
      email: "ईमेल (ऐच्छिक)",
      password: "पासवर्ड (ऐच्छिक)",
      address: "पत्ता",
      village: "गाव / शहर",
      pincode: "पिनकोड",
      fieldArea: "जमिनीचे क्षेत्र (एकर)",
      workspacePreference: "प्राधान्य कार्यक्षेत्र",
      otp: "OTP",
      verifyStatus: "फोन पडताळणी आवश्यक",
      verifiedStatus: "फोन पडताळला आहे",
      sendOtp: "OTP पाठवा",
      verifyOtp: "OTP पडताळा आणि खाते तयार करा",
    },
  },
} as const;

export default async function RegisterPage() {
  const locale = await getLocale();
  const page = copy[locale];

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(16,185,129,0.16),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.14),_transparent_34%)]" />
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 opacity-20">
        <div className="bg-[linear-gradient(135deg,_rgba(2,37,26,0.94),_rgba(2,37,26,0.72)),linear-gradient(45deg,#0f172a,#111827)]" />
        <div className="bg-[linear-gradient(135deg,_rgba(20,59,46,0.92),_rgba(20,59,46,0.68)),url('/assets/generated/harvester_action.png')] bg-cover bg-center" />
        <div className="bg-[linear-gradient(135deg,_rgba(2,37,26,0.92),_rgba(2,37,26,0.68)),linear-gradient(45deg,#1f2937,#0f172a)]" />
        <div className="bg-[linear-gradient(135deg,_rgba(20,59,46,0.9),_rgba(20,59,46,0.68)),linear-gradient(45deg,#172554,#0f172a)]" />
        <div className="bg-[linear-gradient(135deg,_rgba(2,37,26,0.9),_rgba(2,37,26,0.72)),url('/assets/generated/hero_tractor.png')] bg-cover bg-center" />
        <div className="bg-[linear-gradient(135deg,_rgba(20,59,46,0.92),_rgba(20,59,46,0.7)),linear-gradient(45deg,#111827,#1f2937)]" />
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
          <AppLink href="/login" className="rounded-full border border-brand-700 px-4 py-2 text-sm font-bold text-brand-700 transition hover:bg-brand-50 dark:border-brand-300 dark:text-brand-300 dark:hover:bg-brand-950/40">
            {locale === "mr" ? "साइन इन" : "Sign in"}
          </AppLink>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
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
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">{page.safetyTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{page.safetyBody}</p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-6xl">
            <FormShell
              eyebrow={page.eyebrow}
              locale={locale}
              title={locale === "mr" ? "फोन पडताळा, मग पुढे जा" : "Verify once, then continue"}
              description={
                locale === "mr"
                  ? "प्रत्येक खाते फोन OTP ने सुरू होते. ईमेल/पासवर्ड वैकल्पिक आहे."
                  : "Every account starts with phone OTP. Email/password stays optional."
              }
              step={1}
              totalSteps={3}
              aside={
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">{page.asideTitle}</h3>
                  <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">{page.asideBody}</p>
                  <div className="rounded-[1.25rem] border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
                    {page.workspaceHint}
                  </div>
                </div>
              }
            >
              <RegisterClient
                locale={locale}
                copy={page.client}
                workspaceOptions={[
                  { value: "renter", label: locale === "mr" ? "भाडेकरू कार्यक्षेत्र" : "Renter workspace" },
                  { value: "owner", label: locale === "mr" ? "मालक कार्यक्षेत्र" : "Owner workspace" },
                ]}
              />
            </FormShell>
          </div>
        </div>
      </div>
    </main>
  );
}
