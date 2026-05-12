import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.partner;

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return children;
}
