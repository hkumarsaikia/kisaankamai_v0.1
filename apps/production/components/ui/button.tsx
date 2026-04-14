"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-black tracking-[0.01em] transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soil-300/50",
  {
    variants: {
      variant: {
        default:
          "bg-brand-700 text-white shadow-[0_18px_40px_-20px_rgba(27,100,71,0.9)] hover:bg-brand-600",
        secondary:
          "bg-soil-600 text-white shadow-[0_18px_40px_-20px_rgba(197,90,17,0.9)] hover:bg-soil-500",
        outline:
          "border border-slate-200 bg-white text-slate-800 hover:border-soil-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
        ghost:
          "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
        destructive:
          "bg-red-600 text-white hover:bg-red-500",
      },
      size: {
        default: "min-h-11 px-5 py-3",
        sm: "min-h-9 px-4 py-2.5 text-xs",
        lg: "min-h-12 px-6 py-3.5 text-base",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
