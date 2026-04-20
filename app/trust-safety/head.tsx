import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Trust & Safety",
    description: "Review trust, safety, and platform protection information for Kisan Kamai.",
    path: "/trust-safety",
  });
}
