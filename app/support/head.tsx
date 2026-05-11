import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Kisan Kamai Support",
    description: "Contact Kisan Kamai support for help with equipment listings, booking requests, account access, and platform questions.",
    path: "/support",
  });
}
