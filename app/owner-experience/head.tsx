import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Owner Experience",
    description: "Review the owner-side equipment listing and booking workflow on Kisan Kamai.",
    path: "/owner-experience",
    noIndex: true,
  });
}
