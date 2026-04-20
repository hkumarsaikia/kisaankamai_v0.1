import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Forgot Password",
    description: "Review the secure password reset steps for your Kisan Kamai account.",
    path: "/forgot-password",
  });
}
