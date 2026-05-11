import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Review Contact Details",
    description: "Review your saved contact details before continuing into Kisan Kamai.",
    path: "/verify-contact",
    noIndex: true,
  });
}
