"use client";

import { useState, useTransition } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { ChoicePills, FormField, FormGrid, FormNotice, ReviewList } from "@/components/forms/FormKit";
import { registerAction } from "@/lib/actions/local-data";
import { assetPath } from "@/lib/site";

type RoleValue = "renter" | "owner";

const totalSteps = 3;

export default function RegisterPage() {
  const { t, langText } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    village: "",
    pincode: "",
    fieldArea: "",
    password: "",
    role: "renter" as RoleValue,
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await registerAction({
        ...formData,
        phone: formData.phone.trim(),
        fieldArea: formData.fieldArea,
        otpVerified: true,
      });

      if (!result.ok) {
        setError(result.error || t("register.registration_failed"));
        return;
      }

      window.location.href = result.redirectTo || "/profile-selection";
    });
  };

  const progressValue = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      <main className="relative overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/25 via-background/40 to-secondary/10 dark:from-primary-container/20 dark:via-slate-950/60 dark:to-secondary/10" />
          <div
            className="h-full w-full bg-cover bg-center opacity-20 dark:opacity-15"
            style={{ backgroundImage: `url('${assetPath("/assets/generated/modern_farm_tech.png")}')` }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-secondary backdrop-blur">
              <span className="material-symbols-outlined text-base">person_add</span>
              {langText("Create your Kisan Kamai account", "तुमचे किसान कमाई खाते तयार करा")}
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-primary dark:text-emerald-50 md:text-6xl">
              {langText("Join the marketplace with the same original registration form.", "मूळ नोंदणी फॉर्मसह बाजारपेठेत सामील व्हा.")}
            </h1>
            <p className="mt-5 text-lg font-medium leading-8 text-on-surface-variant">
              {langText(
                "The layout now follows the imported onboarding design more closely, while keeping your existing fields and submit contract intact.",
                "लेआउट आता आयात केलेल्या ऑनबोर्डिंग डिझाइनशी अधिक जुळते, पण तुमची विद्यमान फील्ड आणि सबमिट करार तसाच ठेवते."
              )}
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2.4rem] border border-white/35 bg-white/85 shadow-[0_28px_120px_-24px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90">
            <div className="bg-primary-container p-8 text-white md:p-10">
              <h2 className="text-3xl font-black tracking-tight">
                {langText("Create your account", "तुमचे खाते तयार करा")}
              </h2>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary-fixed-dim">
                {langText(`Step ${step} of ${totalSteps}`, `पायरी ${step} / ${totalSteps}`)}
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex gap-2">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 flex-1 rounded-full ${index < step ? "bg-white" : "bg-white/20"}`}
                    />
                  ))}
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                  {langText(`Progress ${progressValue}%`, `प्रगती ${progressValue}%`)}
                </p>
              </div>
            </div>

            <form className="space-y-8 p-8 md:p-10" onSubmit={handleSubmit}>
              {error ? <FormNotice tone="error">{error}</FormNotice> : null}

              {step === 1 ? (
                <section className="space-y-6">
                  <SectionHeading
                    icon="account_circle"
                    title={langText("Account details", "खाते तपशील")}
                    description={langText("Start with identity, contact, and password fields.", "ओळख, संपर्क आणि पासवर्ड फील्डपासून सुरुवात करा.")}
                  />
                  <FormGrid>
                    <FormField label={langText("Full name", "पूर्ण नाव")} required htmlFor="fullName">
                      <input id="fullName" className="kk-input" value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
                    </FormField>
                    <FormField label={langText("Mobile number", "मोबाईल नंबर")} required htmlFor="phone">
                      <input
                        id="phone"
                        className="kk-input"
                        value={formData.phone}
                        onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="9876543210"
                      />
                    </FormField>
                    <FormField label={langText("Email address", "ईमेल पत्ता")} htmlFor="email">
                      <input id="email" type="email" className="kk-input" value={formData.email} onChange={(event) => updateField("email", event.target.value)} />
                    </FormField>
                    <FormField label={langText("Password", "पासवर्ड")} required htmlFor="password">
                      <input id="password" type="password" className="kk-input" value={formData.password} onChange={(event) => updateField("password", event.target.value)} />
                    </FormField>
                  </FormGrid>
                  <StepActions
                    nextLabel={langText("Continue", "पुढे")}
                    onNext={() => setStep(2)}
                    disableNext={!formData.fullName || !formData.password || (!formData.email && !formData.phone)}
                  />
                </section>
              ) : null}

              {step === 2 ? (
                <section className="space-y-6">
                  <SectionHeading
                    icon="location_on"
                    title={langText("Basic profile", "मूलभूत प्रोफाइल")}
                    description={langText("Add the same location and farming details already stored today.", "आज जतन होणारे तेच स्थान आणि शेती तपशील जोडा.")}
                  />
                  <FormGrid>
                    <FormField label={langText("Village / town", "गाव / शहर")} required htmlFor="village">
                      <input id="village" className="kk-input" value={formData.village} onChange={(event) => updateField("village", event.target.value)} />
                    </FormField>
                    <FormField label={langText("Pincode", "पिनकोड")} required htmlFor="pincode">
                      <input
                        id="pincode"
                        className="kk-input"
                        value={formData.pincode}
                        onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                      />
                    </FormField>
                    <FormField label={langText("Field area", "शेती क्षेत्र")} required htmlFor="fieldArea">
                      <input id="fieldArea" className="kk-input" value={formData.fieldArea} onChange={(event) => updateField("fieldArea", event.target.value)} />
                    </FormField>
                  </FormGrid>
                  <FormField label={langText("Address", "पत्ता")} required htmlFor="address">
                    <input id="address" className="kk-input" value={formData.address} onChange={(event) => updateField("address", event.target.value)} />
                  </FormField>
                  <StepActions
                    backLabel={langText("Back", "मागे")}
                    nextLabel={langText("Continue", "पुढे")}
                    onBack={() => setStep(1)}
                    onNext={() => setStep(3)}
                    disableNext={!formData.village || !formData.pincode || !formData.address || !formData.fieldArea}
                  />
                </section>
              ) : null}

              {step === 3 ? (
                <section className="space-y-6">
                  <SectionHeading
                    icon="diversity_3"
                    title={langText("Role and review", "भूमिका आणि पुनरावलोकन")}
                    description={langText("Choose the starting workspace, then confirm the details before creating the account.", "प्रारंभिक वर्कस्पेस निवडा आणि खाते तयार करण्यापूर्वी तपशील तपासा.")}
                  />
                  <FormField label={langText("Preferred workspace", "प्राधान्य वर्कस्पेस")} required>
                    <ChoicePills
                      value={formData.role}
                      onChange={(value) => updateField("role", value)}
                      options={[
                        { label: langText("Renter workspace", "भाडेकरी वर्कस्पेस"), value: "renter" },
                        { label: langText("Owner workspace", "मालक वर्कस्पेस"), value: "owner" },
                      ]}
                    />
                  </FormField>
                  <ReviewList
                    items={[
                      { label: langText("Full name", "पूर्ण नाव"), value: formData.fullName },
                      { label: langText("Mobile number", "मोबाईल नंबर"), value: formData.phone || "-" },
                      { label: langText("Email", "ईमेल"), value: formData.email || "-" },
                      { label: langText("Village / town", "गाव / शहर"), value: formData.village },
                      { label: langText("Pincode", "पिनकोड"), value: formData.pincode },
                      { label: langText("Field area", "शेती क्षेत्र"), value: formData.fieldArea },
                      { label: langText("Address", "पत्ता"), value: formData.address },
                      { label: langText("Preferred workspace", "प्राधान्य वर्कस्पेस"), value: formData.role === "owner" ? langText("Owner", "मालक") : langText("Renter", "भाडेकरी") },
                    ]}
                  />
                  <StepActions
                    backLabel={langText("Back", "मागे")}
                    nextLabel={isPending ? t("register.creating_account") : langText("Create account", "खाते तयार करा")}
                    onBack={() => setStep(2)}
                    submit
                    disableNext={isPending}
                  />
                </section>
              ) : null}
            </form>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-on-surface-variant">
            {t("register.already_have_an_account")}{" "}
            <Link href="/login" className="font-black text-primary hover:underline dark:text-emerald-300">
              {t("register.login")}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h2 className="text-xl font-black text-primary">{title}</h2>
      </div>
      <p className="text-sm font-medium leading-7 text-on-surface-variant">{description}</p>
    </div>
  );
}

function StepActions({
  backLabel = "Back",
  nextLabel = "Continue",
  onBack,
  onNext,
  disableNext,
  submit,
}: {
  backLabel?: string;
  nextLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
  disableNext?: boolean;
  submit?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-outline-variant pt-6">
      {onBack ? (
        <button type="button" onClick={onBack} className="rounded-xl border border-outline-variant px-5 py-3 text-sm font-black text-on-surface transition-colors hover:bg-surface-container-low">
          {backLabel}
        </button>
      ) : (
        <span />
      )}
      <button
        type={submit ? "submit" : "button"}
        onClick={submit ? undefined : onNext}
        disabled={disableNext}
        className="rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-[0_14px_28px_-12px_rgba(20,59,46,0.55)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {nextLabel}
      </button>
    </div>
  );
}
