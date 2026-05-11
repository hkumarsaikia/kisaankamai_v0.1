import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Terms and Safety Guidelines",
    description: "Review Kisan Kamai terms, direct-dealing guidelines, and safety rules for farm equipment owners and renters.",
    path: "/terms",
  });
}
