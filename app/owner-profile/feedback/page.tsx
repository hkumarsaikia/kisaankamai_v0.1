import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileFeedbackForm } from "@/components/profile/ProfileFeedbackForm";
import { localizedText } from "@/lib/i18n";
import { getCurrentSession } from "@/lib/server/local-auth";

export default async function OwnerProfileFeedbackPage() {
  const session = await getCurrentSession();

  if (!session) {
    return null;
  }

  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="feedback"
      title={localizedText("Feedback", "अभिप्राय")}
      subtitle={localizedText(
        "Share ideas that would improve the owner profile and fleet workflow.",
        "मालक प्रोफाइल आणि फ्लीट वर्कफ्लो सुधारण्यासाठी तुमच्या कल्पना शेअर करा."
      )}
    >
      <ProfileFeedbackForm family="owner-profile" session={session} />
    </OwnerProfileWorkspaceShell>
  );
}
