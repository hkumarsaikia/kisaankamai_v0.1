import { LoginClient } from "@/components/login-client";
import { FormShell } from "@/components/forms/FormKit";
import { getLocale } from "@/lib/i18n";

export default async function LoginPage() {
  await getLocale();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-soil-700 dark:text-soil-300">Production access</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Sign in to the production marketplace</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Use either phone OTP or linked email/password. Both land in the same Firebase-backed account and server session.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-5xl">
        <FormShell
          eyebrow="Secure sign-in"
          title="Choose the fastest trusted way back into your account"
          description="Use the production auth rail that matches your account. The session is created server-side after Firebase verification succeeds."
          aside={
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">What stays the same</h3>
              <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                Phone OTP and email/password both resolve to the same profile, workspace preference, and server session.
              </p>
              <div className="kk-form-subtle space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-soil-700 dark:text-soil-300">Trust cues</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Server session cookies are created only after Firebase verification succeeds.</p>
              </div>
            </div>
          }
        >
          <LoginClient
            copy={{
              phoneLabel: "Phone number",
              otpLabel: "OTP",
              emailLabel: "Email",
              passwordLabel: "Password",
              authPhone: "Phone OTP",
              authEmail: "Email + password",
              submit: "Continue",
              verifyOtp: "Verify OTP",
            }}
          />
        </FormShell>
      </div>
    </main>
  );
}
