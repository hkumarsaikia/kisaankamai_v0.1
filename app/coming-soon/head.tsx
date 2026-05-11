import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Kisan Kamai Expansion Updates",
    description: "Track where Kisan Kamai is expanding next and request updates when farm equipment access launches near your area.",
    path: "/coming-soon",
  });
}
