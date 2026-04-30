import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileFeedbackSuccessCard } from "@/components/profile/ProfileFeedbackSuccessCard";
import { localizedText } from "@/lib/i18n";

export default function OwnerProfileFeedbackSuccessPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="owner-profile"
      activeTab="feedback"
      title={localizedText("Feedback Submitted", "अभिप्राय सबमिट झाला")}
      subtitle={localizedText(
        "Thank you for helping us improve the owner experience.",
        "मालक अनुभव सुधारण्यासाठी मदत केल्याबद्दल धन्यवाद."
      )}
    >
      <ProfileFeedbackSuccessCard
        primaryHref="/owner-profile"
        primaryLabel={localizedText("Back to Owner Profile", "मालक प्रोफाइलकडे परत")}
        secondaryHref="/owner-profile/browse"
        secondaryLabel={localizedText("Manage Equipment", "उपकरणे व्यवस्थापित करा")}
        message={localizedText(
          "Your feedback has been recorded for the owner workspace.",
          "मालक वर्कस्पेससाठी तुमचा अभिप्राय नोंदवला आहे."
        )}
      />
    </OwnerProfileWorkspaceShell>
  );
}
