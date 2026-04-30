import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterBookingsBoard } from "@/components/renter-profile/RenterBookingsBoard";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getRenterBookings } from "@/lib/server/local-data";

export default async function RenterProfileBookingsPage() {
  const session = await getCurrentSession();
  const bookings = session ? await getRenterBookings(session.user.id) : [];

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="bookings"
      title={localizedText("My Bookings", "माझी बुकिंग")}
      subtitle={localizedText(
        "Manage active, pending, completed, and cancelled rentals with inline tracking.",
        "इनलाइन ट्रॅकिंगसह सक्रिय, प्रलंबित, पूर्ण आणि रद्द भाडे व्यवस्थापित करा."
      )}
    >
      <RenterBookingsBoard bookings={bookings} variant="page" />
    </OwnerProfileWorkspaceShell>
  );
}
