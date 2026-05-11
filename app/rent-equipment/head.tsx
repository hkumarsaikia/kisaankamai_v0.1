import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Rent Farm Equipment in Maharashtra",
    description: "Browse tractors, implements, harvesters, pumps, seeders, and other farm equipment available through Kisan Kamai.",
    path: "/rent-equipment",
  });
}
