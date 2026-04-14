import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-[border-color,box-shadow,background-color] placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soil-300/45 focus-visible:border-soil-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 file:border-0 file:bg-transparent file:text-sm file:font-bold",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
