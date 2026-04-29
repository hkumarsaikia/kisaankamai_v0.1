import { AppLink as Link } from "@/components/AppLink";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";

export default function RenterProfileEarningsPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="bookings"
      title="Renter Activity"
      subtitle="Renters do not have earnings in Kisan Kamai. Use bookings and saved equipment to manage rentals."
    >
      <section className="rounded-3xl border border-outline-variant bg-white p-8 shadow-sm dark:bg-slate-950">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-secondary">Renter flow</p>
            <h2 className="mt-3 font-headline text-2xl font-black text-primary">No renter earnings dashboard</h2>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-on-surface-variant">
              Earnings are only available to equipment owners. Continue to your renter bookings to track requests,
              confirmations, and completed rentals.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/renter-profile/bookings"
              className="rounded-2xl bg-primary px-5 py-3 text-center text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              View Bookings
            </Link>
            <Link
              href="/renter-profile/browse"
              className="rounded-2xl border border-outline-variant px-5 py-3 text-center text-sm font-bold text-primary transition-colors hover:bg-surface-container-low"
            >
              Browse Equipment
            </Link>
          </div>
        </div>
      </section>
    </OwnerProfileWorkspaceShell>
  );
}
