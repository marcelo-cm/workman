import { ReactNode } from 'react';

export const OrangeText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <span className={`text-wm-orange ${className}`}>{children}</span>;
};