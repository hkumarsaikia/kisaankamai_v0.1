import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.forgotPassword;

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
