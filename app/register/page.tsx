"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AppLink as Link } from "@/components/AppLink";
import { useLanguage } from "@/components/LanguageContext";
import { ChoicePills, FormField, FormGrid, FormNotice, FormSection, FormShell, FormStepActions, ReviewList } from "@/components/forms/FormKit";
import { registerAction } from "@/lib/actions/local-data";
import { assetPath } from "@/lib/site";

type RoleValue = "renter" | "owner";

export default function RegisterPage() {
  const { t } = useLanguage();
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

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />
      <main className="relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image
            src={assetPath("/assets/generated/modern_farm_tech.png")}
            alt="Farm technology"
            className="object-cover opacity-10 dark:opacity-15"
            fill
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background dark:from-slate-950/80 dark:via-slate-950/95 dark:to-slate-950" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-secondary backdrop-blur dark:border-slate-800 dark:bg-slate-950/70 dark:text-amber-400">
              <span className="material-symbols-outlined text-base">person_add</span>
              {t("register.local_registration")}
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-primary dark:text-emerald-50 md:text-6xl">
              {t("register.create_your_kisan_kamai_account")}
            </h1>
            <p className="mt-5 text-lg font-medium text-slate-600 dark:text-slate-400">
              {t("register.use_email_or_phone_plus_password_otp_and_external_verification_are_disabled_in_this_local_phase")}
            </p>
          </div>

          <FormShell
            eyebrow={t("register.local_registration")}
            title={t("register.create_your_kisan_kamai_account")}
            description={t("register.use_email_or_phone_plus_password_otp_and_external_verification_are_disabled_in_this_local_phase")}
            step={step}
            totalSteps={3}
            aside={
              <div className="space-y-4">
                <h3 className="text-lg font-black text-primary dark:text-emerald-50">{t("register.preferred_workspace")}</h3>
                <p className="text-sm font-medium text-on-surface-variant">
                  New users still choose a preferred starting workspace, but every account can switch between owner and renter after sign-in.
                </p>
              </div>
            }
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error ? <FormNotice tone="error">{error}</FormNotice> : null}

              {step === 1 ? (
                <FormSection title="Account basics" description="Start with the same identity and password fields already used by the local registration flow.">
                  <FormGrid>
                    <FormField label={t("register.full_name")} required>
                      <input className="kk-input" value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
                    </FormField>
                    <FormField label={t("register.email")}>
                      <input className="kk-input" type="email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} />
                    </FormField>
                    <FormField label={t("register.phone")}>
                      <input className="kk-input" value={formData.phone} onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} />
                    </FormField>
                    <FormField label={t("register.password")} required>
                      <input className="kk-input" type="password" value={formData.password} onChange={(event) => updateField("password", event.target.value)} />
                    </FormField>
                  </FormGrid>
                  <FormStepActions nextLabel="Continue to location" onNext={() => setStep(2)} disableNext={!formData.fullName || !formData.password || (!formData.email && !formData.phone)} />
                </FormSection>
              ) : null}

              {step === 2 ? (
                <FormSection title="Location and farm profile" description="These fields map directly to the current profile schema used across the live app.">
                  <FormGrid>
                    <FormField label={t("register.village_city")} required>
                      <input className="kk-input" value={formData.village} onChange={(event) => updateField("village", event.target.value)} />
                    </FormField>
                    <FormField label={t("register.pincode")} required>
                      <input className="kk-input" value={formData.pincode} onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))} />
                    </FormField>
                    <FormField label={t("register.field_area")} required>
                      <input className="kk-input" value={formData.fieldArea} onChange={(event) => updateField("fieldArea", event.target.value)} />
                    </FormField>
                  </FormGrid>
                  <FormField label={t("register.address")} required>
                    <input className="kk-input" value={formData.address} onChange={(event) => updateField("address", event.target.value)} />
                  </FormField>
                  <FormStepActions backLabel="Back" nextLabel="Continue to workspace" onBack={() => setStep(1)} onNext={() => setStep(3)} disableNext={!formData.village || !formData.pincode || !formData.address || !formData.fieldArea} />
                </FormSection>
              ) : null}

              {step === 3 ? (
                <FormSection title="Workspace and review" description="Choose your initial workspace and confirm the data before the account is created.">
                  <FormField label={t("register.preferred_workspace")} required>
                    <ChoicePills
                      value={formData.role}
                      onChange={(value) => updateField("role", value)}
                      options={[
                        { label: t("register.renter"), value: "renter" },
                        { label: t("register.owner"), value: "owner" },
                      ]}
                    />
                  </FormField>
                  <ReviewList
                    items={[
                      { label: t("register.full_name"), value: formData.fullName },
                      { label: t("register.email"), value: formData.email || "-" },
                      { label: t("register.phone"), value: formData.phone || "-" },
                      { label: t("register.village_city"), value: formData.village },
                      { label: t("register.pincode"), value: formData.pincode },
                      { label: t("register.field_area"), value: formData.fieldArea },
                      { label: t("register.address"), value: formData.address },
                      { label: t("register.preferred_workspace"), value: formData.role === "owner" ? t("register.owner") : t("register.renter") },
                    ]}
                  />
                  <FormStepActions
                    backLabel="Back"
                    nextLabel={isPending ? t("register.creating_account") : t("register.create_account")}
                    onBack={() => setStep(2)}
                    submit
                    disableNext={isPending}
                  />
                </FormSection>
              ) : null}
            </form>

            <p className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
              {t("register.already_have_an_account")}{" "}
              <Link href="/login" className="font-black text-secondary hover:underline dark:text-amber-400">
                {t("register.login")}
              </Link>
            </p>
          </FormShell>
        </div>
      </main>
      <Footer />
    </div>
  );
}
