import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Trust and Safety for Equipment Rentals",
    description: "Review practical trust and safety guidance for using Kisan Kamai to rent or list farm equipment.",
    path: "/trust-safety",
  });
}
