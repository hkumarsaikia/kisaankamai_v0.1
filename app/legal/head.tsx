import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Legal",
    description: "Review Kisan Kamai legal policies and terms.",
    path: "/legal",
  });
}
