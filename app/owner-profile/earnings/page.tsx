import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings, getOwnerListings, getOwnerPayments } from "@/lib/server/local-data";

function formatPaymentDate(value: string) {
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

export default async function OwnerProfileEarningsPage() {
  const session = await getCurrentSession();
  const [payments, listings, bookings] = session
    ? await Promise.all([
        getOwnerPayments(session.user.id),
        getOwnerListings(session.user.id),
        getOwnerBookings(session.user.id),
      ])
    : [[], [], []];

  const pricingCards = listings.slice(0, 3);
  const paymentRows = payments.slice(0, 6);
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
      title="Pricing & Earnings"
      subtitle="Track listed rates, booking estimates, and completed rental income."
    >
      <div className="space-y-8">
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface">Pricing by Equipment</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Review pricing, rating, and booking counts for your live owner listings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pricingCards.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest"
              >
                <div className="relative h-32 bg-surface-container-high">
                  <img
                    alt={listing.name}
                    className="h-full w-full object-cover"
                    src={listing.coverImage}
                  />
                  <div className="absolute right-2 top-2 rounded bg-primary-container px-2 py-1 text-xs font-bold text-on-primary">
                    {listing.status === "active" ? "Active" : "Paused"}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-lg font-bold text-on-surface">{listing.name}</h3>
                  <p className="mb-4 flex items-center gap-1 text-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {listing.location}, {listing.district}
                  </p>
                  <div className="mt-auto rounded-xl border border-outline-variant bg-surface-container-low p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-medium text-on-surface-variant">Listed Rate</p>
                        <p className="font-bold text-on-surface">
                          ₹{listing.pricePerHour.toLocaleString("en-IN")}{" "}
                          <span className="text-sm font-normal">/ hour</span>
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold text-primary-container">
                          {bookingCountByListing.get(listing.id) || 0} bookings
                        </p>
                        <p className="text-on-surface-variant">{listing.rating.toFixed(1)} rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant p-5">
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface">Rental Income History</h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Completed, processing, and refunded owner payments tied to recent bookings.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-sm text-on-surface-variant">
                  <th className="p-4 font-medium">Date &amp; ID</th>
                  <th className="p-4 font-medium">Equipment</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Est. Amount</th>
                  <th className="p-4 font-medium">Settlement Mode</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {paymentRows.map((payment) => {
                  const booking = bookings.find((entry) => entry.id === payment.bookingId);
                  const listing = booking?.listing;
                  const paymentTone =
                    payment.status === "paid"
                      ? "bg-primary-fixed text-on-primary-fixed"
                      : payment.status === "refunded"
                        ? "bg-error-container text-error"
                        : "bg-secondary-fixed text-on-secondary-fixed";

                  return (
                    <tr key={payment.id} className="border-b border-outline-variant last:border-b-0">
                      <td className="p-4">
                        <p className="font-medium text-on-surface">{formatPaymentDate(payment.createdAt)}</p>
                        <p className="text-xs text-on-surface-variant">#{payment.bookingId}</p>
                      </td>
                      <td className="p-4 text-on-surface">{listing?.name || "Equipment Booking"}</td>
                      <td className="p-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold uppercase ${paymentTone}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-on-surface">₹{payment.amount.toLocaleString("en-IN")}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 rounded bg-surface-container px-2 py-1 text-xs font-medium text-on-surface-variant">
                          <span className="material-symbols-outlined text-[14px]">handshake</span>
                          {payment.method}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </OwnerProfileWorkspaceShell>
  );
}
