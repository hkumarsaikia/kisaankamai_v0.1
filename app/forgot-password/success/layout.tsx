import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.forgotPasswordSuccess;

export default function ForgotPasswordSuccessLayout({ children }: { children: ReactNode }) {
  return children;
}
