import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterBookingsBoard } from "@/components/renter-profile/RenterBookingsBoard";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getRenterBookings } from "@/lib/server/local-data";

export default async function RenterProfilePage() {
  const session = await getCurrentSession();
  const bookings = session ? await getRenterBookings(session.user.id) : [];

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="dashboard"
      title={localizedText("Renter Profile", "भाडेकरू प्रोफाइल")}
      subtitle={localizedText(
        "Find, track, and manage equipment bookings from your renter workspace.",
        "भाडेकरू वर्कस्पेसमधून उपकरणे शोधा, बुकिंग ट्रॅक करा आणि व्यवस्थापित करा."
      )}
    >
      <RenterBookingsBoard bookings={bookings} variant="dashboard" />
    </OwnerProfileWorkspaceShell>
  );
}
