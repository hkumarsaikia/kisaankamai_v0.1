import { renderHeadMetadata } from "@/lib/site-metadata";

export default function Head() {
  return renderHeadMetadata({
    title: "Reset Your Password",
    description: "Reset a Kisan Kamai account password using the registered mobile number linked to your profile.",
    path: "/forgot-password",
    noIndex: true,
  });
}
