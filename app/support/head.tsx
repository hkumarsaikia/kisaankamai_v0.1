import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Support",
    description: "Reach Kisan Kamai support through direct call, WhatsApp, or the support request form.",
    path: "/support",
  });
}
