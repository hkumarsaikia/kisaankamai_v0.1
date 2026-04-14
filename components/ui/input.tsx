import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[1.15rem] border border-outline-variant/80 bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-[border-color,box-shadow,background-color] placeholder:text-on-surface-variant/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/35 focus-visible:border-secondary/60 disabled:cursor-not-allowed disabled:opacity-60 file:border-0 file:bg-transparent file:text-sm file:font-bold",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
