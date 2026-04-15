"use client";

import { useState, useTransition } from "react";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageContext";
import { updateProfileSettingsAction } from "@/lib/actions/local-data";
import { FormActions, FormField, FormGrid, FormNotice, FormSection } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";

export default function RenterSettingsPage() {
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
    rolePreference: (profile?.rolePreference || "renter") as "owner" | "renter",
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
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-7 shadow-sm">
        <h1 className="text-3xl font-black tracking-tight text-primary dark:text-emerald-50">
          {langText("Settings", "सेटिंग्ज")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-on-surface-variant">
          {langText(
            "Manage your renter account, contact details, and notification preferences.",
            "तुमचे भाडेकरी खाते, संपर्क तपशील आणि सूचना पसंती व्यवस्थापित करा."
          )}
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <FormSection
            title={langText("Profile information", "प्रोफाइल माहिती")}
            description={langText(
              "Keep the renter profile fields in a cleaner grouped layout.",
              "भाडेकरी प्रोफाइल फील्ड अधिक स्वच्छ गटबद्ध स्वरूपात ठेवा."
            )}
          >
            <FormGrid>
              <FormField label={langText("Full name", "पूर्ण नाव")}>
                <input type="text" value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} className="kk-input" />
              </FormField>
              <FormField label={langText("Email", "ईमेल")}>
                <input type="email" disabled value={user?.email || ""} className="kk-input opacity-60 cursor-not-allowed" />
              </FormField>
              <FormField label={langText("Phone number", "फोन नंबर")}>
                <input type="tel" value={formData.phone} onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} className="kk-input" />
              </FormField>
              <FormField label={langText("Village / town", "गाव / शहर")}>
                <input type="text" value={formData.village} onChange={(event) => updateField("village", event.target.value)} className="kk-input" />
              </FormField>
              <FormField label={langText("Address", "पत्ता")}>
                <input type="text" value={formData.address} onChange={(event) => updateField("address", event.target.value)} className="kk-input" />
              </FormField>
              <FormField label={langText("Pincode", "पिनकोड")}>
                <input type="text" value={formData.pincode} onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))} className="kk-input" />
              </FormField>
              <FormField label={langText("Field area", "शेती क्षेत्र")}>
                <input type="number" min="0" value={formData.fieldArea} onChange={(event) => updateField("fieldArea", event.target.value)} className="kk-input" />
              </FormField>
              <FormField label={langText("Preferred workspace", "प्राधान्य वर्कस्पेस")}>
                <select value={formData.rolePreference} onChange={(event) => updateField("rolePreference", event.target.value)} className="kk-input">
                  <option value="renter">{langText("Renter", "भाडेकरी")}</option>
                  <option value="owner">{langText("Owner", "मालक")}</option>
                </select>
              </FormField>
            </FormGrid>
          </FormSection>

          <section className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-outline-variant px-6 py-5">
              <span className="material-symbols-outlined text-primary">notifications</span>
              <h2 className="text-lg font-black text-primary">{langText("Notification preferences", "सूचना पसंती")}</h2>
            </div>
            <div className="space-y-5 p-6">
              {[
                [langText("Booking confirmations", "बुकिंग पुष्टीकरण"), langText("Get notified when a booking is confirmed.", "बुकिंग पुष्टी झाल्यावर सूचना मिळवा."), true],
                [langText("Payment receipts", "पेमेंट पावत्या"), langText("Receive receipts via email.", "ईमेलद्वारे पावत्या मिळवा."), true],
                [langText("Equipment alerts", "उपकरण सूचना"), langText("New equipment near you.", "तुमच्या जवळील नवीन उपकरणे."), false],
                [langText("Promotional offers", "प्रोमोशनल ऑफर्स"), langText("Seasonal discounts and deals.", "हंगामी सवलती आणि ऑफर."), false],
              ].map(([label, desc, on]) => (
                <div key={label as string} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-bold text-on-surface">{label as string}</p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">{desc as string}</p>
                  </div>
                  <div className={`relative h-7 w-12 rounded-full ${on ? "bg-primary" : "bg-surface-container-high"}`}>
                    <div className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md ${on ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {error ? <FormNotice tone="error">{error}</FormNotice> : null}
          {message ? <FormNotice tone="success">{message}</FormNotice> : null}

          <FormActions>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
              {langText("Profile update", "प्रोफाइल अपडेट")}
            </span>
            <Button type="submit" disabled={isPending}>
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
            <p>{langText("Your renter and owner profiles still share the same core identity data.", "तुमचे भाडेकरी आणि मालक प्रोफाइल अजूनही समान मूलभूत माहिती शेअर करतात.")}</p>
            <p>{langText("Changes update the same profile store used by the rest of the app.", "बदल अॅपमध्ये वापरल्या जाणाऱ्या त्याच प्रोफाइल स्टोअरमध्ये जतन होतात.")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}


