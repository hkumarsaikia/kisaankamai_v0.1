import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Coming Soon",
    description: "Track the Kisan Kamai rollout and sign up for updates as new regions go live.",
    path: "/coming-soon",
  });
}
