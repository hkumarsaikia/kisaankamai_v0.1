import { OwnerProfileWorkspaceShell } from "@/components/owner-profile/OwnerProfileWorkspaceShell";
import { ProfileFeedbackSuccessCard } from "@/components/profile/ProfileFeedbackSuccessCard";
import { localizedText } from "@/lib/i18n";

export default function RenterProfileFeedbackSuccessPage() {
  return (
    <OwnerProfileWorkspaceShell
      family="renter-profile"
      activeTab="feedback"
      title={localizedText("Feedback Submitted", "अभिप्राय सबमिट झाला")}
      subtitle={localizedText(
        "Thank you for helping us improve the renter experience.",
        "भाडेकरू अनुभव सुधारण्यासाठी मदत केल्याबद्दल धन्यवाद."
      )}
    >
      <ProfileFeedbackSuccessCard
        primaryHref="/renter-profile"
        primaryLabel={localizedText("Back to Renter Profile", "भाडेकरू प्रोफाइलकडे परत")}
        secondaryHref="/renter-profile/bookings"
        secondaryLabel={localizedText("My Bookings", "माझी बुकिंग")}
        message={localizedText(
          "Your feedback has been recorded for the renter workspace.",
          "भाडेकरू वर्कस्पेससाठी तुमचा अभिप्राय नोंदवला आहे."
        )}
      />
    </OwnerProfileWorkspaceShell>
  );
}
