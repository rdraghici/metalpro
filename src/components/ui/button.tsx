import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-industrial",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-industrial",
        outline: "border border-border bg-background hover:bg-card-hover hover:border-primary/20 shadow-soft",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-soft",
        ghost: "hover:bg-card-hover hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        hero: "gradient-hero text-white hover:shadow-strong transform hover:-translate-y-0.5",
        accent: "gradient-accent text-accent-foreground hover:shadow-medium transform hover:-translate-y-0.5",
        industrial: "bg-card border border-card-border hover:bg-card-hover hover:border-primary/30 shadow-industrial text-card-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
