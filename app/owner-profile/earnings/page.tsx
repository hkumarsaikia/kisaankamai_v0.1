import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterProfileEarningsContent } from "@/components/renter-profile/RenterProfileViews";

export default function OwnerProfileEarningsPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="earnings"
      title="Earnings"
      subtitle="Review payouts, pending amounts, and completed transaction history."
    >
      <RenterProfileEarningsContent />
    </OwnerProfileWorkspaceShell>
  );
}
