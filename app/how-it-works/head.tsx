import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "How It Works",
    description: "Understand how renters and owners use Kisan Kamai to discover equipment, connect, and manage work.",
    path: "/how-it-works",
  });
}
