"use client";

import { useMemo, useState } from "react";
import {
  RecaptchaVerifier,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { FormActions, FormChoicePills, FormField, FormNotice, FormSection } from "@/components/forms/FormKit";
import { getFirebaseAuthClient } from "@/lib/firebase-client";
import type { Locale } from "@/lib/types";

interface LoginClientProps {
  locale: Locale;
  copy: {
    phoneLabel: string;
    otpLabel: string;
    emailLabel: string;
    passwordLabel: string;
    authPhone: string;
    authEmail: string;
    submit: string;
    verifyOtp: string;
  };
}

export function LoginClient({ locale, copy }: LoginClientProps) {
  const auth = useMemo(() => getFirebaseAuthClient(), []);
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const ensureRecaptcha = () => {
    const existing = (window as typeof window & { kkRecaptcha?: RecaptchaVerifier }).kkRecaptcha;
    if (existing) {
      return existing;
    }

    const verifier = new RecaptchaVerifier(auth, "kk-recaptcha", {
      size: "normal",
    });
    (window as typeof window & { kkRecaptcha?: RecaptchaVerifier }).kkRecaptcha = verifier;
    return verifier;
  };

  const createServerSession = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No Firebase user is available.");
    }

    const idToken = await currentUser.getIdToken(true);
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error || "Could not create a server session.");
    }

    await auth.signOut();
    window.location.href = "/profile-selection";
  };

  const startPhoneLogin = async () => {
    setBusy(true);
    setError("");
    try {
      await setPersistence(auth, inMemoryPersistence);
      const verifier = ensureRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationId(confirmation.verificationId);
    } catch (err) {
      setError(locale === "mr" ? "OTP पाठवता आला नाही." : err instanceof Error ? err.message : "Could not send OTP.");
    } finally {
      setBusy(false);
    }
  };

  const finishPhoneLogin = async () => {
    setBusy(true);
    setError("");
    try {
      const { PhoneAuthProvider, signInWithCredential } = await import("firebase/auth");
      const credential = PhoneAuthProvider.credential(confirmationId, otp);
      await signInWithCredential(auth, credential);
      await createServerSession();
    } catch (err) {
      setError(locale === "mr" ? "OTP पडताळणी झाली नाही." : err instanceof Error ? err.message : "Could not verify OTP.");
    } finally {
      setBusy(false);
    }
  };

  const loginWithEmail = async () => {
    setBusy(true);
    setError("");
    try {
      await setPersistence(auth, inMemoryPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      await createServerSession();
    } catch (err) {
      setError(locale === "mr" ? "साइन इन करता आले नाही." : err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormSection
        title={locale === "mr" ? "साइन-इन पद्धत निवडा" : "Choose a sign-in method"}
        description={
          locale === "mr"
            ? "फोन OTP आणि लिंक केलेले ईमेल/पासवर्ड दोन्ही एकाच खात्यावर जातात."
            : "Phone OTP and linked email/password both resolve to the same account."
        }
      >
        <FormChoicePills
          value={mode}
          onChange={setMode}
          options={[
            { label: copy.authPhone, value: "phone" },
            { label: copy.authEmail, value: "email" },
          ]}
        />
      </FormSection>

      <FormSection
        title={mode === "phone" ? (locale === "mr" ? "फोन पडताळणी" : "Phone authentication") : locale === "mr" ? "ईमेल पडताळणी" : "Email authentication"}
        description={
          mode === "phone"
            ? confirmationId
              ? locale === "mr"
                ? "सर्व्हर सत्र तयार करण्यासाठी एकदाच आलेला पासवर्ड पडताळा."
                : "Verify the one-time password to complete server session creation."
              : locale === "mr"
                ? "समान Firebase-आधारित खात्यासह पुढे जाण्यासाठी OTP पाठवा."
                : "Send a one-time password to continue with the same account."
            : locale === "mr"
              ? "फोन-प्रथम खात्याशी जोडलेला ईमेल आणि पासवर्ड वापरा."
              : "Use the email and password linked to your phone-first account."
        }
      >
        <div className="space-y-4">
          {mode === "phone" ? (
            <>
              <FormField label={copy.phoneLabel} required>
                <input className="kk-input" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91XXXXXXXXXX" />
              </FormField>
              {confirmationId ? (
                <FormField label={copy.otpLabel} required>
                  <input className="kk-input" value={otp} onChange={(event) => setOtp(event.target.value)} />
                </FormField>
              ) : null}
                <div className="kk-form-subtle">
                  <div id="kk-recaptcha" className="min-h-[78px]" />
                </div>
                <FormActions>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {locale === "mr" ? "सुरक्षित पडताळणी" : "Secure verification"}
                  </span>
                  <Button type="button" disabled={busy} className="w-full md:w-auto" onClick={confirmationId ? finishPhoneLogin : startPhoneLogin}>
                    {confirmationId ? copy.verifyOtp : copy.submit}
                  </Button>
                </FormActions>
            </>
          ) : (
            <>
              <FormField label={copy.emailLabel} required>
                <input className="kk-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </FormField>
              <FormField label={copy.passwordLabel} required>
                <input className="kk-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </FormField>
                <FormActions>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {locale === "mr" ? "जोडलेल्या खात्याने साइन-इन" : "Linked credential sign-in"}
                  </span>
                  <Button type="button" disabled={busy} className="w-full md:w-auto" onClick={loginWithEmail}>
                    {copy.submit}
                  </Button>
                </FormActions>
            </>
          )}
          {error ? <FormNotice tone="error">{error}</FormNotice> : null}
        </div>
      </FormSection>
    </div>
  );
}
