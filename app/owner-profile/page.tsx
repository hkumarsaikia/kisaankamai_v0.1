import { AppLink as Link } from "@/components/AppLink";
import { LocalizedText } from "@/components/LocalizedText";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings } from "@/lib/server/local-data";
import { supportContact } from "@/lib/support-contact";

function formatDashboardDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  });

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return `${startDate} - ${endDate}`;
  }

  const formattedStart = formatter.format(start);
  const formattedEnd = formatter.format(end);
  return formattedStart === formattedEnd ? formattedStart : `${formattedStart} - ${formattedEnd}`;
}

export default async function OwnerProfilePage() {
  const session = await getCurrentSession();
  const bookings = session ? await getOwnerBookings(session.user.id) : [];
  const recentBookings = bookings.slice(0, 4);

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="dashboard"
      title={localizedText("Owner Profile", "मालक प्रोफाइल")}
      subtitle={localizedText(
        "Review bookings, equipment performance, and earnings without leaving the owner workspace.",
        "मालक वर्कस्पेस न सोडता बुकिंग, उपकरण कामगिरी आणि कमाई तपासा."
      )}
    >
      <div className="space-y-5">
        <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black text-primary sm:text-2xl">
              <LocalizedText en="Recent Booking Activity" mr="अलीकडील बुकिंग हालचाल" />
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/owner-profile/browse"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-on-surface transition-colors hover:bg-surface-container dark:border-slate-700 dark:text-slate-100 sm:text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">agriculture</span>
                <LocalizedText en="My Equipment" mr="माझी उपकरणे" />
              </Link>
              <Link
                href="/list-equipment"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary-container px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 sm:text-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <LocalizedText en="Add Listing" mr="लिस्टिंग जोडा" />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
            {recentBookings.length ? (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="owner-dashboard-booking-card flex min-h-[24.5rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-surface-container-lowest shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="relative h-40 shrink-0 overflow-hidden bg-surface-container sm:h-44">
                    <img
                      src={booking.listing?.coverImage || "https://placehold.co/320x240?text=Equipment"}
                      alt={booking.listing?.name || "Equipment"}
                      className="owner-dashboard-booking-image h-full w-full object-cover"
                    />
                    <span className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-primary-fixed px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary-container shadow-sm">
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-on-surface dark:text-slate-100">
                        {booking.listing?.name || "Equipment Booking"}
                      </h3>
                      <p className="mt-1 truncate text-sm text-on-surface-variant dark:text-slate-400">
                        {booking.renterProfile?.fullName || <LocalizedText en="Verified renter" mr="पडताळलेला भाडेकरू" />}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface-container-low p-3">
                      <div>
                        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                          <LocalizedText en="Dates" mr="तारखा" />
                        </p>
                        <p className="mt-1 whitespace-nowrap text-sm font-semibold text-on-background">
                          {formatDashboardDateRange(booking.startDate, booking.endDate)}
                        </p>
                      </div>
                      <div>
                        <p className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
                          <LocalizedText en="Total" mr="एकूण" />
                        </p>
                        <p className="mt-1 text-sm font-semibold text-on-background">
                          ₹{booking.amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="owner-dashboard-booking-actions grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${booking.renterProfile?.phone || supportContact.phoneE164}`}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-on-surface transition-colors hover:bg-white/70 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
                      >
                        <span className="material-symbols-outlined text-[18px]">call</span>
                        <LocalizedText en="Call" mr="कॉल" />
                      </a>
                      <Link
                        href={`/owner-profile/equipment/${booking.listing?.id || booking.listingId}`}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-primary-container px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        <LocalizedText en="View" mr="पहा" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
                <h3 className="text-2xl font-black text-primary">
                  <LocalizedText en="No booking activity yet" mr="अजून बुकिंग हालचाल नाही" />
                </h3>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/owner-profile/browse"
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100"
                  >
                    <LocalizedText en="View Equipment" mr="उपकरणे पहा" />
                  </Link>
                  <Link
                    href="/owner-profile/support"
                    className="rounded-xl bg-primary-container px-4 py-2 text-sm font-bold text-white"
                  >
                    <LocalizedText en="Contact Support" mr="सपोर्टशी संपर्क" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </OwnerProfileWorkspaceShell>
  );
}
