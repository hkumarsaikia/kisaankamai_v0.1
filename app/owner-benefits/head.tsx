import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Owner Benefits",
    description: "See how Kisan Kamai helps equipment owners grow bookings and earnings.",
    path: "/owner-benefits",
  });
}
