import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "dark inline-flex flex-row gap-2 items-center font-instrument-sans transition-all duration-300 justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-wm-orange text-[#ffffff] hover:bg-wm-orange-500 active:bg-wm-orange-700 transition-colors duration-200 bg-[radial-gradient(circle_at_50%_0,_rgba(255,255,255,.25),_rgba(255,255,255,0)_70%)] shadow-[0_12px_24px_rgba(234,72,15,.15),0_-2px_5px_1px_#00000025_inset,0_2px_5px_1px_#ffffff75_inset]",
        secondary:
          "bg-black text-[#ffffff] hover:bg-gray-700 active:bg-gray-900 transition-colors duration-200 bg-[url('https://assets-global.website-files.com/65ef5219b50b1b6196919a3b/65ef521ab50b1b6196919d4b_Noise%20(2).png'),radial-gradient(circle_at_50%_0,_rgba(255,255,255,.3),_rgba(255,255,255,0)_70%)] shadow-[0_1px_2px_rgba(255,255,255,.2),_0_2px_6px_rgba(255,255,255,.12),_0_12px_24px_rgba(234,72,15,.15),0_-2px_5px_1px_#00000080_inset,0_2px_5px_1px_#ffffff75_inset]",
        outline: "border text-wm-white-950",
        ghost: "text-wm-white-950",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
