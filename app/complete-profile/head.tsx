import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Complete Your Profile",
    description: "Complete the profile details required for your signed-in Kisan Kamai account.",
    path: "/complete-profile",
    noIndex: true,
  });
}
