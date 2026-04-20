import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { OwnerProfileSupportContent } from "@/components/owner-profile/OwnerProfileViews";

export default function RenterProfileSupportPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="support"
      title="Support / मदत"
      subtitle="Get booking help, owner support, and ticket updates in one place."
    >
      <OwnerProfileSupportContent />
    </OwnerProfileWorkspaceShell>
  );
}
