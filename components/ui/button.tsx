"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-black tracking-[0.01em] transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-[0_18px_40px_-20px_rgba(20,59,46,0.9)] hover:bg-primary-container",
        secondary:
          "bg-secondary text-white shadow-[0_18px_40px_-20px_rgba(147,74,36,0.85)] hover:brightness-105",
        outline:
          "border border-outline-variant bg-surface-container-lowest text-on-surface hover:border-secondary/50 hover:bg-surface-container-low",
        ghost:
          "text-on-surface hover:bg-surface-container-low",
        destructive:
          "bg-error text-white hover:brightness-110",
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
