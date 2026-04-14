import * as React from "react";
import { cn } from "@/lib/utils";

const alertVariants: Record<"default" | "error" | "success" | "info", string> = {
  default: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100",
  error: "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200",
  info: "border-soil-200 bg-soil-50 text-soil-800 dark:border-soil-900/40 dark:bg-soil-950/30 dark:text-soil-200",
};

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: keyof typeof alertVariants }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "rounded-[1.2rem] border px-4 py-3 text-sm font-semibold shadow-[0_12px_28px_-24px_rgba(15,23,42,0.45)]",
      alertVariants[variant],
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

export { Alert };
