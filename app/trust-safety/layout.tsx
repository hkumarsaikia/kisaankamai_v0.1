import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.trustSafety;

export default function TrustSafetyLayout({ children }: { children: ReactNode }) {
  return children;
}
