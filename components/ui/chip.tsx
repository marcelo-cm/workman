import React, { MouseEventHandler, ReactNode } from 'react';

import { AlertTriangle, Check, Lock, X } from 'lucide-react';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const STATUS_CHIP_VARIANTS: {
  [key: string]: { icon: ReactNode; variant: ChipVariants['variant'] };
} = {
  PENDING: {
    icon: <X className="h-3 w-3 group-hover:text-red-500" />,
    variant: 'info',
  },
  APPROVED: { icon: <Check className="h-3 w-3" />, variant: 'success' },
  REJECTED: {
    icon: <AlertTriangle className="h-3 w-3" />,
    variant: 'destructive',
  },
  NON_REMOVABLE: { icon: <Lock className="h-3 w-3" />, variant: 'special' },
};

const chipVariants = cva(
  'py-1 px-2 rounded-md flex flex-row gap-2 items-center select-none w-fit text-sm group',
  {
    variants: {
      variant: {
        info: 'bg-gray-100 text-gray-600',
        success: 'bg-green-100 text-green-600',
        destructive: 'bg-red-200 text-red-600',
        warning: 'bg-yellow-100 text-yellow-600',
        special: 'bg-blue-200 text-blue-600',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export type ChipVariants = VariantProps<typeof chipVariants>;

const Chip = ({
  variant = 'info',
  className,
  children,
  onClick,
}: {
  variant?: ChipVariants['variant'];
  className?: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div className={cn(chipVariants({ variant, className }))} onClick={onClick}>
      {children}
    </div>
  );
};

export default Chip;
