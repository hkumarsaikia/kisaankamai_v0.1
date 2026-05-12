import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.ownerBenefits;

export default function OwnerBenefitsLayout({ children }: { children: ReactNode }) {
  return children;
}
