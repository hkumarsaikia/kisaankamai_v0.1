import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.legal;

export default function LegalLayout({ children }: { children: ReactNode }) {
  return children;
}
