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
      initial={{ opacity: prefersReducedMotion ? 0.94 : 0.86, y: prefersReducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? REDUCED_DURATION_SECONDS : PAGE_ENTER_DURATION_SECONDS,
        ease: PREMIUM_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
