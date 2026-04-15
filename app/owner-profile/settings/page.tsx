"use client";

import { useState, useTransition } from "react";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { updateProfileSettingsAction } from "@/lib/actions/local-data";
import { FormActions, FormField, FormGrid, FormNotice, FormSection } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";

export default function SettingsDashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const { langText } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    phone: profile?.phone || "",
    village: profile?.village || "",
    address: profile?.address || "",
    pincode: profile?.pincode || "",
    fieldArea: String(profile?.fieldArea || 0),
    rolePreference: (profile?.rolePreference || "owner") as "owner" | "renter",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    startTransition(async () => {
      const result = await updateProfileSettingsAction({
        ...formData,
        fieldArea: Number(formData.fieldArea || 0),
        rolePreference: formData.rolePreference as "owner" | "renter",
      });

      if (!result.ok) {
        setError(result.error || "Could not update settings.");
        return;
      }

      await refreshProfile();
      setMessage("Settings updated.");
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-7 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-primary dark:text-emerald-50">
          {langText("Settings", "सेटिंग्ज")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-on-surface-variant">
          {langText(
            "Update your owner account, contact details, and workspace preference.",
            "तुमचे मालक खाते, संपर्क तपशील आणि वर्कस्पेस पसंती अपडेट करा."
          )}
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <FormSection
            title={langText("Owner profile", "मालक प्रोफाइल")}
            description={langText(
              "Keep the same profile fields but present them in a cleaner, grouped layout.",
              "तेच प्रोफाइल फील्ड अधिक स्वच्छ आणि गटबद्ध स्वरूपात ठेवा."
            )}
          >
            <FormGrid>
              <FormField label={langText("Full name", "पूर्ण नाव")}>
                <input className="kk-input" value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
              </FormField>
              <FormField label={langText("Email", "ईमेल")}>
                <input className="kk-input opacity-60 cursor-not-allowed" disabled value={user?.email || ""} />
              </FormField>
              <FormField label={langText("Phone", "फोन")}>
                <input className="kk-input" value={formData.phone} onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} />
              </FormField>
              <FormField label={langText("Village / city", "गाव / शहर")}>
                <input className="kk-input" value={formData.village} onChange={(event) => updateField("village", event.target.value)} />
              </FormField>
              <FormField label={langText("Address", "पत्ता")}>
                <input className="kk-input" value={formData.address} onChange={(event) => updateField("address", event.target.value)} />
              </FormField>
              <FormField label={langText("Pincode", "पिनकोड")}>
                <input className="kk-input" value={formData.pincode} onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))} />
              </FormField>
              <FormField label={langText("Field area", "शेती क्षेत्र")}>
                <input className="kk-input" value={formData.fieldArea} onChange={(event) => updateField("fieldArea", event.target.value)} />
              </FormField>
              <FormField label={langText("Preferred workspace", "प्राधान्य वर्कस्पेस")}>
                <select className="kk-input" value={formData.rolePreference} onChange={(event) => updateField("rolePreference", event.target.value)}>
                  <option value="owner">{langText("Owner", "मालक")}</option>
                  <option value="renter">{langText("Renter", "भाडेकरी")}</option>
                </select>
              </FormField>
            </FormGrid>
          </FormSection>

          {error ? <FormNotice tone="error">{error}</FormNotice> : null}
          {message ? <FormNotice tone="success">{message}</FormNotice> : null}

          <FormActions>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              {langText("Profile update", "प्रोफाइल अपडेट")}
            </span>
            <Button disabled={isPending}>
              {isPending ? langText("Saving...", "जतन करत आहे...") : langText("Save changes", "बदल जतन करा")}
            </Button>
          </FormActions>
        </form>

        <aside className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-secondary">
            {langText("Workspace notes", "वर्कस्पेस नोंदी")}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-6 text-on-surface-variant">
            <p>{langText("Email stays read-only in this form.", "या फॉर्ममध्ये ईमेल फक्त पाहण्यासाठी आहे.")}</p>
            <p>{langText("Your owner and renter profiles still share the same core identity data.", "तुमचे मालक आणि भाडेकरी प्रोफाइल अजूनही समान मूलभूत माहिती शेअर करतात.")}</p>
            <p>{langText("Changes update the same profile store used by the rest of the app.", "बदल अॅपमध्ये वापरल्या जाणाऱ्या त्याच प्रोफाइल स्टोअरमध्ये जतन होतात.")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}


