import { RenterPaymentsPanel } from "@/components/workspace/RenterPaymentsPanel";
import { getCurrentSession } from "@/lib/server/local-auth";
import { getRenterPayments } from "@/lib/server/firebase-data";

export default async function PaymentsPage() {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  const payments = await getRenterPayments(session.user.id);
  return <RenterPaymentsPanel payments={payments} />;
}
