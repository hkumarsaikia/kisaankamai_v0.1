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
        "Review your active schedules, booking value, and tracking updates in one renter view.",
        "एका भाडेकरू दृश्यात सक्रिय वेळापत्रक, बुकिंग मूल्य आणि ट्रॅकिंग अपडेट तपासा."
      )}
    >
      <RenterBookingsBoard bookings={bookings} variant="dashboard" />
    </OwnerProfileWorkspaceShell>
  );
}
