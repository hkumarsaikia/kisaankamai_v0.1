import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Feature Request",
    description: "Share product ideas and workflow improvements for the Kisan Kamai platform.",
    path: "/feature-request",
  });
}
