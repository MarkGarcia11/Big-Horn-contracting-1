import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "light" | "dark";
  size?: "default" | "sm";
  asChild?: boolean;
};

// A small shadcn-style primitive; visual variants live in the site design tokens.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant = "primary", size = "default", asChild = false, ...props }, ref) {
  const Component = asChild ? Slot : "button";
  return <Component ref={ref} data-slot="button" className={cn(`button-${variant}`, size === "sm" && "button-small", className)} {...props} />;
});