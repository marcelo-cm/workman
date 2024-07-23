import React, { ReactNode } from 'react';

import { CheckIcon } from '@radix-ui/react-icons';
import { FileWarningIcon, Lock } from 'lucide-react';

import { Close } from '@radix-ui/react-toast';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const STATUS_CHIP_VARIANTS: {
  [key: string]: { icon: ReactNode; variant: ChipVariants['variant'] };
} = {
  PENDING: { icon: <Close className="h-3 w-3" />, variant: 'info' },
  APPROVED: { icon: <CheckIcon className="h-3 w-3" />, variant: 'success' },
  REJECTED: {
    icon: <FileWarningIcon className="h-3 w-3" />,
    variant: 'destructive',
  },
  NON_REMOVABLE: { icon: <Lock className="h-3 w-3" />, variant: 'special' },
};

const chipVariants = cva(
  'py-1 px-2 rounded-md flex flex-row gap-2 items-center select-none w-fit text-sm',
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
}: {
  variant?: ChipVariants['variant'];
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn(chipVariants({ variant, className }))}>{children}</div>
  );
};

export default Chip;
