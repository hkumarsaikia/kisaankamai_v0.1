"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormActions, ChoicePills, FormField, FormGrid, FormNotice, FormSection } from "@/components/forms/FormKit";
import {
  clearRecaptchaVerifier,
  finishFirebaseAuthSession,
  getFirebaseAuthError,
  getOptionalFirebaseAuthClient,
  linkEmailPasswordCredential,
  startPhoneVerification,
  verifyPhoneOtp,
} from "@/components/auth/firebase-auth-client";

interface RegisterClientProps {
  workspaceOptions: Array<{ value: "owner" | "renter"; label: string }>;
}

export function RegisterClient({ workspaceOptions }: RegisterClientProps) {
  const auth = useMemo(() => getOptionalFirebaseAuthClient(), []);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    village: "",
    pincode: "",
    fieldArea: "",
    workspacePreference: "renter" as "owner" | "renter",
  });
  const [confirmationId, setConfirmationId] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  useEffect(() => () => clearRecaptchaVerifier("register-client"), []);

  const startVerification = async () => {
    if (!auth) {
      setError("Firebase registration is unavailable in this deployment.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const verificationId = await startPhoneVerification({
        auth,
        phoneNumber: form.phone,
        containerId: "kk-register-recaptcha",
        storeKey: "register-client",
      });
      setConfirmationId(verificationId);
    } catch (err) {
      setError(getFirebaseAuthError(err, "Could not send OTP."));
    } finally {
      setBusy(false);
    }
  };

  const completeRegistration = async () => {
    if (!auth) {
      setError("Firebase registration is unavailable in this deployment.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      await verifyPhoneOtp({
        auth,
        verificationId: confirmationId,
        otp,
      });

      if (form.email && form.password) {
        await linkEmailPasswordCredential({
          auth,
          email: form.email,
          password: form.password,
        });
      } else if (form.email || form.password) {
        throw new Error("Enter both email and password or leave both blank.");
      }

      await finishFirebaseAuthSession({
        auth,
        payload: {
          workspacePreference: form.workspacePreference,
          profile: {
            fullName: form.fullName,
            phone: form.phone,
            email: form.email || undefined,
            address: form.address,
            village: form.village,
            pincode: form.pincode,
            fieldArea: Number(form.fieldArea),
          },
        },
      });
      window.location.href = "/profile-selection";
    } catch (err) {
      setError(getFirebaseAuthError(err, "Could not complete registration."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Identity and contact"
        description="Production onboarding is phone-first. Optional email and password are linked to the same account after phone verification."
      >
        <FormGrid>
          <FormField label="Full name" required>
            <input className="kk-input" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
          </FormField>
          <FormField label="Phone" required>
            <input className="kk-input" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+91XXXXXXXXXX" />
          </FormField>
          <FormField label="Email (optional)">
            <input className="kk-input" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
          </FormField>
          <FormField label="Password (optional)">
            <input className="kk-input" type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
          </FormField>
        </FormGrid>
      </FormSection>

      <FormSection
        title="Location and profile"
        description="These fields map directly to the production Firestore user profile that will be created after verification."
      >
        <FormGrid>
          <FormField label="Address" required>
            <input className="kk-input" value={form.address} onChange={(event) => updateField("address", event.target.value)} />
          </FormField>
          <FormField label="Village / City" required>
            <input className="kk-input" value={form.village} onChange={(event) => updateField("village", event.target.value)} />
          </FormField>
          <FormField label="Pincode" required>
            <input className="kk-input" value={form.pincode} onChange={(event) => updateField("pincode", event.target.value)} />
          </FormField>
          <FormField label="Field area (acres)" required>
            <input className="kk-input" value={form.fieldArea} onChange={(event) => updateField("fieldArea", event.target.value)} />
          </FormField>
        </FormGrid>
      </FormSection>

      <FormSection
        title="Workspace and verification"
        description={confirmationId ? "Enter the OTP to verify the number and create the server session." : "Choose your starting workspace before we send the OTP."}
      >
        <div className="space-y-4">
          <FormField label="Preferred workspace" required>
            <ChoicePills
              value={form.workspacePreference}
              onChange={(value: any) => updateField("workspacePreference", value)}
              options={workspaceOptions}
            />
          </FormField>
          {confirmationId ? (
            <FormField label="OTP" required>
              <input className="kk-input" value={otp} onChange={(event) => setOtp(event.target.value)} />
            </FormField>
          ) : null}
          <div id="kk-register-recaptcha" className="kk-recaptcha-slot" aria-hidden="true" />
          {error ? <FormNotice tone="error">{error}</FormNotice> : null}
          <FormActions>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {confirmationId ? "Phone verified next" : "Phone verification required"}
            </span>
            <Button type="button" disabled={busy} className="w-full md:w-auto" onClick={confirmationId ? completeRegistration : startVerification}>
              {confirmationId ? "Verify OTP and create account" : "Send OTP"}
            </Button>
          </FormActions>
        </div>
      </FormSection>
    </div>
  );
}
