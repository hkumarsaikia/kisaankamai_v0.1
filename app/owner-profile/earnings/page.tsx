import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { LocalizedText } from "@/components/LocalizedText";
import { getVisibleEquipmentRating } from "@/lib/equipment";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings, getOwnerListings } from "@/lib/server/local-data";

function formatBookingDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function bookingStatusLabel(status: string) {
  switch (status) {
    case "confirmed":
      return <LocalizedText en="Confirmed" mr="पुष्टी झाले" />;
    case "active":
      return <LocalizedText en="Active" mr="सक्रिय" />;
    case "upcoming":
      return <LocalizedText en="Scheduled" mr="नियोजित" />;
    case "completed":
      return <LocalizedText en="Completed" mr="पूर्ण झाले" />;
    case "cancelled":
      return <LocalizedText en="Cancelled" mr="रद्द झाले" />;
    default:
      return <LocalizedText en="Pending" mr="प्रलंबित" />;
  }
}

function bookingStatusTone(status: string) {
  switch (status) {
    case "completed":
    case "confirmed":
    case "active":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200";
    case "cancelled":
      return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200";
    default:
      return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200";
  }
}

export default async function OwnerProfileEarningsPage() {
  const session = await getCurrentSession();
  const [listings, bookings] = session
    ? await Promise.all([
        getOwnerListings(session.user.id),
        getOwnerBookings(session.user.id),
      ])
    : [[], []];

  const pricingCards = listings.slice(0, 3);
  const bookingRows = bookings.slice(0, 6);
  const bookingCountByListing = new Map<string, number>();

  for (const booking of bookings) {
    bookingCountByListing.set(
      booking.listingId,
      (bookingCountByListing.get(booking.listingId) || 0) + 1
    );
  }

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="earnings"
      title={localizedText("Pricing & Earnings", "किंमत आणि कमाई")}
    >
      <div className="space-y-8">
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface">
                <LocalizedText en="Pricing by Equipment" mr="उपकरणानुसार किंमत" />
              </h2>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pricingCards.map((listing) => {
              const visibleRating = getVisibleEquipmentRating(listing);

              return (
                <div
                  key={listing.id}
                  className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest"
                >
                <div className="relative h-32 bg-surface-container-high">
                  <img
                    alt={listing.name}
                    className="h-full w-full object-cover"
                    src={listing.coverImage}
                  />
                  <div className="absolute right-2 top-2 rounded bg-primary-container px-2 py-1 text-xs font-bold text-on-primary">
                    {listing.status === "active"
                      ? <LocalizedText en="Active" mr="सक्रिय" />
                      : <LocalizedText en="Paused" mr="थांबवलेले" />}
                  </div>
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-4">
                  <h3 className="break-words text-lg font-bold text-on-surface">{listing.name}</h3>
                  <p className="mb-4 flex min-w-0 items-center gap-1 break-words text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {listing.location}, {listing.district}
                  </p>
                  <div className="mt-auto min-w-0 rounded-xl border border-outline-variant bg-surface-container-low p-3">
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-on-surface-variant">
                          <LocalizedText en="Listed Rate" mr="लिस्ट केलेला दर" />
                        </p>
                        <p className="break-words font-bold text-on-surface">
                          ₹{listing.pricePerHour.toLocaleString("en-IN")}{" "}
                          <span className="text-sm font-normal">
                            <LocalizedText en="/ hour" mr="प्रति तास" />
                          </span>
                        </p>
                      </div>
                      <div className="text-sm sm:text-right">
                        <p className="font-semibold text-primary-container">
                          {bookingCountByListing.get(listing.id) || 0} <LocalizedText en="booking requests" mr="बुकिंग विनंत्या" />
                        </p>
                        {visibleRating ? (
                          <p className="equipment-rating-pill mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                            <span className="material-symbols-outlined text-[15px]">star</span>
                            {visibleRating.value.toFixed(1)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
          <div className="border-b border-outline-variant p-5">
            <h2 className="font-headline text-xl font-bold text-on-surface">
              <LocalizedText en="Booking Value History" mr="बुकिंग मूल्य इतिहास" />
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-sm text-on-surface-variant">
                  <th className="p-4 font-medium"><LocalizedText en="Date & ID" mr="दिनांक आणि ID" /></th>
                  <th className="p-4 font-medium"><LocalizedText en="Equipment" mr="उपकरण" /></th>
                  <th className="p-4 font-medium"><LocalizedText en="Status" mr="स्थिती" /></th>
                  <th className="p-4 font-medium"><LocalizedText en="Estimated Rental Value" mr="अंदाजित भाडे मूल्य" /></th>
                  <th className="p-4 font-medium"><LocalizedText en="Coordination" mr="समन्वय" /></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {bookingRows.map((booking) => {
                  const listing = booking?.listing;

                  return (
                    <tr key={booking.id} className="border-b border-outline-variant last:border-b-0">
                      <td className="p-4">
                        <p className="font-medium text-on-surface">{formatBookingDate(booking.createdAt)}</p>
                        <p className="text-xs text-on-surface-variant">#{booking.id}</p>
                      </td>
                      <td className="p-4 text-on-surface">{listing?.name || <LocalizedText en="Equipment Booking" mr="उपकरण बुकिंग" />}</td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold uppercase ${bookingStatusTone(booking.status)}`}>
                          {bookingStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-on-surface">₹{booking.amount.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 rounded bg-surface-container px-2 py-1 text-xs font-medium text-on-surface-variant">
                          <span className="material-symbols-outlined text-[14px]">handshake</span>
                          <LocalizedText en="Offline settlement" mr="ऑफलाइन व्यवहार" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {!bookingRows.length ? (
                  <tr>
                    <td className="p-6 text-sm font-medium text-on-surface-variant" colSpan={5}>
                      <LocalizedText en="No booking value records yet." mr="अद्याप बुकिंग मूल्य नोंदी नाहीत." />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </OwnerProfileWorkspaceShell>
  );
}
