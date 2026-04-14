"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  PAGE_ENTER_DURATION_SECONDS,
  PREMIUM_EASE,
  REDUCED_DURATION_SECONDS,
} from "@/lib/client/navigationTransition";

export function RouteTransitionShell({
  children,
  className,
  enabled = true,
}: {
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      className={className}
      initial={{ opacity: prefersReducedMotion ? 0.92 : 0.82 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? REDUCED_DURATION_SECONDS : PAGE_ENTER_DURATION_SECONDS,
        ease: PREMIUM_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
