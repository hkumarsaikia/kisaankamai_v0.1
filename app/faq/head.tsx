import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Farm Equipment Rental FAQ",
    description: "Find clear answers about renting equipment, listing machinery, direct settlement, support, and trust on Kisan Kamai.",
    path: "/faq",
  });
}
