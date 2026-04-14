"use client";

import { useState, useTransition } from "react";
import { useAuth } from "@/components/AuthContext";
import { updateProfileSettingsAction } from "@/lib/actions/firebase-data";
import { FormActions, FormField, FormGrid, FormNotice, FormSection } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";

export default function RenterSettingsPage() {
  const { user, profile, refreshProfile } = useAuth();
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
    <>
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">
          Settings / <span className="text-primary/60">सेटिंग्ज</span>
        </h1>
        <p className="text-slate-500 mt-1">Manage your renter account and local profile data.</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <FormSection title="Profile Information" description="Manage the same renter profile fields with the new premium form treatment.">
          <FormGrid>
            <FormField label="Full Name">
              <input
                type="text"
                value={formData.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="kk-input"
              />
            </FormField>
            <FormField label="Email">
              <input type="email" disabled value={user?.email || ""} className="kk-input opacity-60 cursor-not-allowed" />
            </FormField>
            <FormField label="Phone Number">
              <input
                type="tel"
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
                className="kk-input"
              />
            </FormField>
            <FormField label="Village / Town">
              <input
                type="text"
                value={formData.village}
                onChange={(event) => updateField("village", event.target.value)}
                className="kk-input"
              />
            </FormField>
            <FormField label="Address">
              <input
                type="text"
                value={formData.address}
                onChange={(event) => updateField("address", event.target.value)}
                className="kk-input"
              />
            </FormField>
            <FormField label="Pincode">
              <input
                type="text"
                value={formData.pincode}
                onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))}
                className="kk-input"
              />
            </FormField>
            <FormField label="Field Area">
              <input
                type="number"
                min="0"
                value={formData.fieldArea}
                onChange={(event) => updateField("fieldArea", event.target.value)}
                className="kk-input"
              />
            </FormField>
            <FormField label="Preferred Workspace">
              <select value={formData.rolePreference} onChange={(event) => updateField("rolePreference", event.target.value)} className="kk-input">
                <option value="renter">Renter</option>
                <option value="owner">Owner</option>
              </select>
            </FormField>
          </FormGrid>
        </FormSection>

        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <h2 className="text-lg font-bold text-primary">Notification Preferences</h2>
          </div>
          <div className="p-6 space-y-5">
            {[
              { label: "Booking Confirmations", desc: "Get notified when a booking is confirmed", on: true },
              { label: "Payment Receipts", desc: "Receive receipts via email", on: true },
              { label: "Equipment Alerts", desc: "New equipment near you", on: false },
              { label: "Promotional Offers", desc: "Seasonal discounts and deals", on: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-bold text-on-surface">{pref.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
                </div>
                <div className={`w-12 h-7 rounded-full relative ${pref.on ? "bg-primary" : "bg-slate-300"}`}>
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md ${pref.on ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {error ? <FormNotice tone="error">{error}</FormNotice> : null}
        {message ? <FormNotice tone="success">{message}</FormNotice> : null}

        <FormActions>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Local profile update</span>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </FormActions>
      </form>
    </>
  );
}


