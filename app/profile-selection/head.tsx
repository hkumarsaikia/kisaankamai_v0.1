import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Choose Your Profile",
    description: "Select the right owner or renter workspace inside Kisan Kamai.",
    path: "/profile-selection",
  });
}
