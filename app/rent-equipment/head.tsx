import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Rent Equipment",
    description: "Browse tractors, implements, and harvesters available for rent on Kisan Kamai.",
    path: "/rent-equipment",
  });
}
