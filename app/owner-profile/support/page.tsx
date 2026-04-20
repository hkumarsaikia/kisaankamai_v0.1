import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { RenterProfileSupportContent } from "@/components/renter-profile/RenterProfileViews";

export default function OwnerProfileSupportPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="support"
      title="Support"
      subtitle="Get owner help for listing, booking, and verification issues."
    >
      <RenterProfileSupportContent />
    </OwnerProfileWorkspaceShell>
  );
}
