import React, { ReactNode } from 'react';

const Container = ({
  children,
  header,
  className,
  footer,
  innerClassName,
}: {
  children?: React.ReactNode;
  gridCols?: number;
  header?: string | ReactNode;
  footer?: string | ReactNode;
  className?: string;
  innerClassName?: string;
}) => {
  return (
    <div className={`rounded-md border ${className}`}>
      {header ? (
        <div className="flex min-h-10 w-full flex-row items-center border-b p-2 text-sm font-medium">
          {header}
        </div>
      ) : null}
      <div className={innerClassName}>{children}</div>
      {footer ? (
        <div className="flex min-h-10 w-full flex-row items-center border-t">
          {footer}
        </div>
      ) : null}
    </div>
  );
};

export default Container;
