import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "How Farm Equipment Renting Works",
    description: "See how renters and owners use Kisan Kamai to find equipment, review details, contact each other, and coordinate work directly.",
    path: "/how-it-works",
  });
}
