import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Sign Out",
    description: "Sign out of your Kisan Kamai account.",
    path: "/logout",
    noIndex: true,
  });
}
