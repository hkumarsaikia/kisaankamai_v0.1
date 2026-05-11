import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Legal Policies",
    description: "Review Kisan Kamai legal policies for using the farm equipment marketplace.",
    path: "/legal",
  });
}
