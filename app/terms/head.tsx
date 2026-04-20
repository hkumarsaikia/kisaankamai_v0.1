import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Terms and Safety",
    description: "Review the Kisan Kamai terms, trust guidelines, and safety rules for owners and renters.",
    path: "/terms",
  });
}
