import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "About Kisan Kamai",
    description: "Learn how Kisan Kamai connects rural equipment owners and renters across Maharashtra.",
    path: "/about",
  });
}
