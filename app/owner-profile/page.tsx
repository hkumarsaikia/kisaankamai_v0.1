import { AppLink as Link } from "@/components/AppLink";
import { LocalizedText } from "@/components/LocalizedText";
import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings } from "@/lib/server/local-data";
import { supportContact } from "@/lib/support-contact";

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
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-black text-primary">
              <LocalizedText en="Recent Booking Activity" mr="अलीकडील बुकिंग हालचाल" />
            </h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/owner-profile/browse"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container dark:border-slate-700 dark:text-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">agriculture</span>
                <LocalizedText en="My Equipment" mr="माझी उपकरणे" />
              </Link>
              <Link
                href="/list-equipment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <LocalizedText en="Add Listing" mr="लिस्टिंग जोडा" />
              </Link>
            </div>
          </div>

          <div className="space-y-4 p-6">
            {recentBookings.length ? (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-[1.5rem] border border-slate-200 bg-surface-container-low p-4 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    <img
                      src={booking.listing?.coverImage || "https://placehold.co/320x240?text=Equipment"}
                      alt={booking.listing?.name || "Equipment"}
                      className="h-32 w-full rounded-[1.25rem] object-cover md:h-24 md:w-28"
                    />
                    <div className="flex flex-1 items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface dark:text-slate-100">
                          {booking.listing?.name || "Equipment Booking"}
                        </h3>
                        <p className="mt-1 text-sm text-on-surface-variant dark:text-slate-400">
                          {booking.renterProfile?.fullName || <LocalizedText en="Verified renter" mr="पडताळलेला भाडेकरू" />}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-primary-container">
                          {booking.startDate} <LocalizedText en="to" mr="ते" /> {booking.endDate}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary-fixed px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary-container">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`tel:${booking.renterProfile?.phone || supportContact.phoneE164}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-on-surface dark:border-slate-700 dark:text-slate-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      <LocalizedText en="Call Renter" mr="भाडेकरूला कॉल करा" />
                    </a>
                    <Link
                      href={`/owner-profile/equipment/${booking.listing?.id || booking.listingId}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2 text-sm font-bold text-white"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <LocalizedText en="View Equipment" mr="उपकरण पहा" />
                    </Link>
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
