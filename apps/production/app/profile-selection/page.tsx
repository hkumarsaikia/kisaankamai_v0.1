import { redirect } from "next/navigation";
import { logoutAction, selectWorkspaceAction } from "@/app/actions";
import { AppLink } from "@/components/app-link";
import { Button } from "@/components/ui/button";
import { getCurrentSession } from "@/lib/server/auth";

export default async function ProfileSelectionPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const [session, params] = await Promise.all([getCurrentSession(), searchParams]);
  if (!session) {
    redirect("/login");
  }

  if (!session.profile) {
    redirect("/register");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="kk-form-surface overflow-hidden">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-700 dark:text-brand-300">Authenticated</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight">Choose your workspace</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          Signed in as {session.user.fullName}. Select which workspace should be active for this session. You can switch later.
        </p>
        {params?.message ? (
          <p className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800 dark:border-brand-900/40 dark:bg-brand-950/40 dark:text-brand-200">
            {params.message}
          </p>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <form action={selectWorkspaceAction} className="kk-form-surface space-y-4">
            <input type="hidden" name="workspace" value="renter" />
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-soil-700 dark:text-soil-300">Browse + book</p>
            <h2 className="text-2xl font-black">Renter</h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              Browse equipment, save listings, and submit booking requests across the production service area.
            </p>
            <Button className="w-full">Enter renter dashboard</Button>
          </form>
          <form action={selectWorkspaceAction} className="kk-form-surface space-y-4">
            <input type="hidden" name="workspace" value="owner" />
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-soil-700 dark:text-soil-300">List + manage</p>
            <h2 className="text-2xl font-black">Owner</h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              Manage listings, review renter demand, and track payments from one production dashboard.
            </p>
            <Button className="w-full">Enter owner dashboard</Button>
          </form>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <AppLink href="/rent-equipment" className="kk-button-secondary">Browse public marketplace</AppLink>
          <form action={logoutAction}>
            <button className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-red-300 hover:text-red-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-red-700 dark:hover:text-red-300">
              Log out
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
