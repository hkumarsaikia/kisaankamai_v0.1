import { submitSupportAction } from "@/app/actions";
import { FormField, FormShell } from "@/components/forms/FormKit";
import { Button } from "@/components/ui/button";

export default async function SupportPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <FormShell
        eyebrow="Production support"
        title="Reach the Firebase-backed support desk"
        description="These support requests are stored in Firestore submissions and no longer use the legacy local JSON pipeline."
        aside={
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">Response flow</h3>
            <p className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
              Production support requests are stored centrally so they can be tracked alongside the authenticated user lifecycle.
            </p>
          </div>
        }
      >
        {params?.message ? <div className="kk-form-banner mb-6">{params.message}</div> : null}
        <form action={submitSupportAction} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Full name" required>
              <input className="kk-input" name="fullName" placeholder="Full name" required />
            </FormField>
            <FormField label="Phone" required>
              <input className="kk-input" name="phone" placeholder="+91XXXXXXXXXX" required />
            </FormField>
          </div>
          <FormField label="Category" required>
            <input className="kk-input" name="category" placeholder="Category" required />
          </FormField>
          <FormField label="Message" required>
            <textarea className="kk-input min-h-[180px]" name="message" placeholder="How can we help?" required />
          </FormField>
          <div className="flex justify-end">
            <Button type="submit">Submit support request</Button>
          </div>
        </form>
      </FormShell>
    </main>
  );
}
