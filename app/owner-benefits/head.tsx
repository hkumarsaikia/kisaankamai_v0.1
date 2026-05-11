import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Benefits for Equipment Owners",
    description: "See how Kisan Kamai helps equipment owners list machinery, receive booking requests, and coordinate rentals directly.",
    path: "/owner-benefits",
  });
}
