import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white shadow-md hover:bg-gray-900", // Dark button
        destructive:
          "bg-red-600 text-white shadow-md hover:bg-red-700",
        outline:
          "border bg-background shadow-xs hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800",
        secondary:
          "bg-gray-700 text-white shadow-md hover:bg-gray-800",
        ghost:
          "hover:bg-gray-200 dark:hover:bg-gray-700",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2 rounded-md",
        sm: "h-8 px-4 py-1.5 rounded-md",
        lg: "h-12 px-8 py-3 rounded-lg",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
