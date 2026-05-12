import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.terms;

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
