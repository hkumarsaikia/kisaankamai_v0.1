import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Create a New Password",
    description: "Set a new password for your Kisan Kamai account.",
    path: "/forgot-password/new-password",
    noIndex: true,
  });
}
