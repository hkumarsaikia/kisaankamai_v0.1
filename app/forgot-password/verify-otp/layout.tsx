import type { ReactNode } from "react";
import { publicPageMetadata } from "@/lib/public-page-metadata";

export const metadata = publicPageMetadata.forgotPasswordVerifyOtp;

export default function ForgotPasswordVerifyOtpLayout({ children }: { children: ReactNode }) {
  return children;
}
