import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "FAQ",
    description: "Find answers about renting, listing, payments, and trust on Kisan Kamai.",
    path: "/faq",
  });
}
