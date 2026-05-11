import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Choose Your Workspace",
    description: "Select the owner or renter workspace for your signed-in Kisan Kamai account.",
    path: "/profile-selection",
    noIndex: true,
  });
}
