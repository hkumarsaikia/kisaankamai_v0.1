import * as React from "react";
import { cn } from "@/lib/utils";

const alertVariants: Record<"default" | "error" | "success" | "info", string> = {
  default: "border-outline-variant/80 bg-surface-container-low text-on-surface",
  error: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200",
  info: "border-secondary/20 bg-secondary-fixed/30 text-on-surface",
};

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: keyof typeof alertVariants }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "rounded-[1.2rem] border px-4 py-3 text-sm font-semibold shadow-[0_12px_28px_-24px_rgba(20,59,46,0.5)]",
      alertVariants[variant],
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

export { Alert };
