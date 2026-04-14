"use client";

import { useMemo, useState } from "react";
import {
  EmailAuthProvider,
  RecaptchaVerifier,
  inMemoryPersistence,
  linkWithCredential,
  setPersistence,
  signInWithPhoneNumber,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { FormActions, FormChoicePills, FormField, FormGrid, FormNotice, FormSection } from "@/components/forms/FormKit";
import { getFirebaseAuthClient } from "@/lib/firebase-client";

interface RegisterClientProps {
  workspaceOptions: Array<{ value: "owner" | "renter"; label: string }>;
}

export function RegisterClient({ workspaceOptions }: RegisterClientProps) {
  const auth = useMemo(() => getFirebaseAuthClient(), []);
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

  const ensureRecaptcha = () => {
    const existing = (window as typeof window & { kkRegisterRecaptcha?: RecaptchaVerifier }).kkRegisterRecaptcha;
    if (existing) {
      return existing;
    }

    const verifier = new RecaptchaVerifier(auth, "kk-register-recaptcha", {
      size: "normal",
    });
    (window as typeof window & { kkRegisterRecaptcha?: RecaptchaVerifier }).kkRegisterRecaptcha = verifier;
    return verifier;
  };

  const startVerification = async () => {
    setBusy(true);
    setError("");
    try {
      await setPersistence(auth, inMemoryPersistence);
      const verifier = ensureRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, form.phone, verifier);
      setConfirmationId(confirmation.verificationId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP.");
    } finally {
      setBusy(false);
    }
  };

  const completeRegistration = async () => {
    setBusy(true);
    setError("");
    try {
      const { PhoneAuthProvider, signInWithCredential } = await import("firebase/auth");
      const credential = PhoneAuthProvider.credential(confirmationId, otp);
      const result = await signInWithCredential(auth, credential);

      if (form.email && form.password) {
        const emailCredential = EmailAuthProvider.credential(form.email, form.password);
        await linkWithCredential(result.user, emailCredential);
      }

      const idToken = await result.user.getIdToken(true);
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
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
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Could not create a server session.");
      }

      await auth.signOut();
      window.location.href = "/profile-selection";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete registration.");
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
            <FormChoicePills
              value={form.workspacePreference}
              onChange={(value) => updateField("workspacePreference", value)}
              options={workspaceOptions}
            />
          </FormField>
          {confirmationId ? (
            <FormField label="OTP" required>
              <input className="kk-input" value={otp} onChange={(event) => setOtp(event.target.value)} />
            </FormField>
          ) : null}
          <div className="kk-form-subtle">
            <div id="kk-register-recaptcha" className="min-h-[78px]" />
          </div>
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
