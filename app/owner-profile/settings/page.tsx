"use client";

import { useState, useTransition } from "react";
import { useAuth } from "@/components/AuthContext";
import { updateProfileSettingsAction } from "@/lib/actions/local-data";
import { FormActions, FormField, FormGrid, FormNotice, FormSection } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";

export default function SettingsDashboard() {
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
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-on-surface dark:text-emerald-50 tracking-tight font-headline">Settings</h2>
        <p className="text-on-surface-variant dark:text-slate-400 font-body mt-1">Manage your owner account and local profile data.</p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <FormSection title="Owner Profile" description="Manage the same local profile fields, now with clearer grouping and hierarchy.">
          <FormGrid>
            <FormField label="Full Name">
              <input className="kk-input" value={formData.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
            </FormField>
            <FormField label="Email">
              <input className="kk-input opacity-60 cursor-not-allowed" disabled value={user?.email || ""} />
            </FormField>
            <FormField label="Phone">
              <input className="kk-input" value={formData.phone} onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))} />
            </FormField>
            <FormField label="Village / City">
              <input className="kk-input" value={formData.village} onChange={(event) => updateField("village", event.target.value)} />
            </FormField>
            <FormField label="Address">
              <input className="kk-input" value={formData.address} onChange={(event) => updateField("address", event.target.value)} />
            </FormField>
            <FormField label="Pincode">
              <input className="kk-input" value={formData.pincode} onChange={(event) => updateField("pincode", event.target.value.replace(/\D/g, "").slice(0, 6))} />
            </FormField>
            <FormField label="Field Area">
              <input className="kk-input" value={formData.fieldArea} onChange={(event) => updateField("fieldArea", event.target.value)} />
            </FormField>
            <FormField label="Preferred Workspace">
              <select className="kk-input" value={formData.rolePreference} onChange={(event) => updateField("rolePreference", event.target.value)}>
                <option value="owner">Owner</option>
                <option value="renter">Renter</option>
              </select>
            </FormField>
          </FormGrid>
        </FormSection>

        {error ? <FormNotice tone="error">{error}</FormNotice> : null}
        {message ? <FormNotice tone="success">{message}</FormNotice> : null}

        <FormActions>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Local profile update</span>
          <Button disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </FormActions>
      </form>
    </div>
  );
}


