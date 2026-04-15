import { OwnerRevenuePanel } from "@/components/workspace/OwnerRevenuePanel";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getOwnerBookings, getOwnerPayments } from "@/lib/server/firebase-data";

export default async function EarningsDashboard() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const [payments, bookings] = await Promise.all([
    getOwnerPayments(session.user.id),
    getOwnerBookings(session.user.id),
  ]);

  return <OwnerRevenuePanel payments={payments} linkedBookings={bookings.length} />;
}
