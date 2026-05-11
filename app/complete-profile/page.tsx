"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { ChoicePills, FormField, FormGrid, FormNotice, FormSection, FormShell, FormStepActions, ReviewList } from "@/components/forms/FormKit";
import { completeProfileAction } from "@/lib/actions/local-data";

export default function CompleteProfilePage() {
  const { user, profile, loading } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: profile?.phone || "",
    pincode: profile?.pincode || "",
    village: profile?.village || "",
    address: profile?.address || "",
    role: (profile?.rolePreference || "renter") as "renter" | "owner",
  });

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading, user]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await completeProfileAction(formData);
      if (!result.ok) {
        setError(result.error || t("complete-profile.could_not_save_profile"));
        return;
      }

      window.location.href = result.redirectTo || "/profile-selection";
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t("complete-profile.could_not_save_profile"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
        <FormShell
          eyebrow={t("complete-profile.complete_your_profile")}
          title={t("complete-profile.complete_your_profile")}
          description={t("complete-profile.update_your_core_contact_details_for_local_testing")}
          step={step}
          totalSteps={2}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? <FormNotice tone="error">{error}</FormNotice> : null}

            {step === 1 ? (
              <FormSection title="Contact and location" description="These fields update the same shared profile record already used across owner and renter flows.">
                <FormGrid>
                  <FormField label={t("complete-profile.phone_number")} required>
                    <input className="kk-input" value={formData.phone} onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} />
                  </FormField>
                  <FormField label={t("complete-profile.pin_code")} required>
                    <input className="kk-input" value={formData.pincode} onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))} />
                  </FormField>
                  <FormField label={t("complete-profile.village_city")}>
                    <input className="kk-input" value={formData.village} onChange={(event) => updateField("village", event.target.value)} />
                  </FormField>
                  <FormField label={t("complete-profile.address")}>
                    <input className="kk-input" value={formData.address} onChange={(event) => updateField("address", event.target.value)} />
                  </FormField>
                </FormGrid>
                <FormStepActions nextLabel="Review workspace" onNext={() => setStep(2)} disableNext={!formData.phone || !formData.pincode} />
              </FormSection>
            ) : null}

            {step === 2 ? (
              <FormSection title="Workspace preference and review" description="You can switch between owner and renter later. This just sets the initial preference.">
                <FormField label={t("complete-profile.preferred_workspace")} required>
                  <ChoicePills
                    value={formData.role}
                    onChange={(value) => updateField("role", value)}
                    options={[
                      { label: t("complete-profile.renter"), value: "renter" },
                      { label: t("complete-profile.owner"), value: "owner" },
                    ]}
                  />
                </FormField>
                <ReviewList
                  items={[
                    { label: t("complete-profile.phone_number"), value: formData.phone },
                    { label: t("complete-profile.pin_code"), value: formData.pincode },
                    { label: t("complete-profile.village_city"), value: formData.village || "-" },
                    { label: t("complete-profile.address"), value: formData.address || "-" },
                    { label: t("complete-profile.preferred_workspace"), value: formData.role === "owner" ? t("complete-profile.owner") : t("complete-profile.renter") },
                  ]}
                />
                <FormStepActions backLabel="Back" nextLabel={isSubmitting ? t("complete-profile.saving") : t("complete-profile.complete_profile")} onBack={() => setStep(1)} submit disableNext={isSubmitting} />
              </FormSection>
            ) : null}
          </form>
        </FormShell>
      </main>
    </div>
  );
}
