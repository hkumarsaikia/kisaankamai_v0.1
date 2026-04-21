"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormActions, ChoicePills, FormField, FormNotice, FormSection } from "@/components/forms/FormKit";
import {
  clearRecaptchaVerifier,
  finishFirebaseAuthSession,
  getFirebaseAuthError,
  getOptionalFirebaseAuthClient,
  signInWithEmailPassword,
  startPhoneVerification,
  verifyPhoneOtp,
} from "@/components/auth/firebase-auth-client";

interface LoginClientProps {
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

export function LoginClient({ copy }: LoginClientProps) {
  const auth = useMemo(() => getOptionalFirebaseAuthClient(), []);
  const [mode, setMode] = useState<"phone" | "email">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => clearRecaptchaVerifier("login-client"), []);

  const startPhoneLogin = async () => {
    if (!auth) {
      setError("Firebase sign-in is unavailable in this deployment.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const verificationId = await startPhoneVerification({
        auth,
        phoneNumber: phone,
        containerId: "kk-login-recaptcha",
        storeKey: "login-client",
      });
      setConfirmationId(verificationId);
    } catch (err) {
      setError(getFirebaseAuthError(err, "Could not send OTP."));
    } finally {
      setBusy(false);
    }
  };

  const finishPhoneLogin = async () => {
    if (!auth) {
      setError("Firebase sign-in is unavailable in this deployment.");
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
      await finishFirebaseAuthSession({ auth });
      window.location.href = "/profile-selection";
    } catch (err) {
      setError(getFirebaseAuthError(err, "Could not verify OTP."));
    } finally {
      setBusy(false);
    }
  };

  const loginWithEmail = async () => {
    if (!auth) {
      setError("Firebase sign-in is unavailable in this deployment.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      await signInWithEmailPassword({
        auth,
        email,
        password,
      });
      await finishFirebaseAuthSession({ auth });
      window.location.href = "/profile-selection";
    } catch (err) {
      setError(getFirebaseAuthError(err, "Could not sign in."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Choose a sign-in method"
        description="Phone OTP and linked email/password both resolve to the same production account."
      >
        <ChoicePills
          value={mode}
          onChange={setMode}
          options={[
            { label: copy.authPhone, value: "phone" },
            { label: copy.authEmail, value: "email" },
          ]}
        />
      </FormSection>

      <FormSection
        title={mode === "phone" ? "Phone authentication" : "Email authentication"}
        description={
          mode === "phone"
            ? confirmationId
              ? "Verify the one-time password to complete server session creation."
              : "Send a one-time password to continue with the same Firebase-backed account."
            : "Use the email and password linked to your phone-first production account."
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
              <div id="kk-login-recaptcha" className="hidden" />
              <FormActions>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  Secure verification
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
                  Linked credential sign-in
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
