import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.faq;

export default function FaqLayout({ children }: { children: ReactNode }) {
  return children;
}
