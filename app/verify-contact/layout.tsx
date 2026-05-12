import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.verifyContact;

export default function VerifyContactLayout({ children }: { children: ReactNode }) {
  return children;
}
