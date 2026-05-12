import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.feedback;

export default function FeedbackLayout({ children }: { children: ReactNode }) {
  return children;
}
