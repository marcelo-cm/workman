import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        success: "border-green-700/30 bg-green-200 text-green-700",
        destructive: "border-red-300 bg-red-200 text-red-500",
        warning: "border-yellow-400 bg-yellow-200 text-yellow-600",
        info: "border-wm-white-200 bg-wm-white-50 text-wm-white-700",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

// className="text-xs font-medium bg-wm-white-50 w-fit px-2 py-1 border border-wm-white-200 rounded-md"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
