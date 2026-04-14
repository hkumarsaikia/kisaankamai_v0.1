import { RegisterClient } from "@/components/register-client";
import { FormShell } from "@/components/forms/FormKit";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-soil-700 dark:text-soil-300">Production onboarding</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">Create your production account</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Production onboarding is phone-first. Verify the phone with OTP, then optionally link email/password to the same Firebase account.
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-6xl">
        <FormShell
          eyebrow="Phone-first account"
          title="Verify once, then enter the marketplace with one durable identity"
          description="Every production account starts with phone verification. Email and password stay optional and can be linked to the same Firebase identity."
          step={1}
          totalSteps={3}
          aside={
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">Before you continue</h3>
              <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
                The account you create here becomes the single source of truth for Firestore profile data, saved items, bookings, and owner workflows.
              </p>
              <div className="kk-form-subtle space-y-2">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-soil-700 dark:text-soil-300">Workspace choice</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Pick the workspace you want to enter first. You can still switch later.</p>
              </div>
            </div>
          }
        >
          <RegisterClient
            workspaceOptions={[
              { value: "renter", label: "Renter workspace" },
              { value: "owner", label: "Owner workspace" },
            ]}
          />
        </FormShell>
      </div>
    </main>
  );
}
