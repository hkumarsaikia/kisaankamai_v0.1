import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Password Reset Complete",
    description: "Your Kisan Kamai password reset steps are complete.",
    path: "/forgot-password/success",
  });
}
