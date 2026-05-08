import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerRecentBookingActivity } from "@/components/profile/OwnerRecentBookingActivity";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings } from "@/lib/server/local-data";

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
        <OwnerRecentBookingActivity bookings={recentBookings} />
      </div>
    </OwnerProfileWorkspaceShell>
  );
}
