import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Share Product Feedback",
    description: "Send product ideas and workflow improvements that can help Kisan Kamai serve equipment owners and renters more clearly.",
    path: "/feature-request",
    noIndex: true,
  });
}
