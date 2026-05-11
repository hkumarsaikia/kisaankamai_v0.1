import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "About Our Farm Equipment Marketplace",
    description: "Learn how Kisan Kamai connects farm equipment owners and renters across Northern Maharashtra through direct, local coordination.",
    path: "/about",
  });
}
