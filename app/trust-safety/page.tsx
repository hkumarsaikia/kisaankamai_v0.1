import { redirect } from "next/navigation";

export default function TrustSafetyRedirect() {
  redirect("/terms");
}
