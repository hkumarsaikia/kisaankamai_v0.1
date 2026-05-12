import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.forgotPasswordNewPassword;

export default function ForgotPasswordNewPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}
