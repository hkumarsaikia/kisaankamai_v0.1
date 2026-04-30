import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileFeedbackForm } from "@/components/profile/ProfileFeedbackForm";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function RenterProfileFeedbackPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="feedback"
      title={localizedText("Feedback", "अभिप्राय")}
      subtitle={localizedText(
        "Tell us what would improve your renter experience.",
        "तुमचा भाडेकरू अनुभव सुधारण्यासाठी काय मदत होईल ते सांगा."
      )}
    >
      <ProfileFeedbackForm family="renter-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
