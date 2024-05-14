import React from "react";

const ExtractionFormComponent = ({
  children,
  gridCols,
  label,
  className,
}: {
  children: React.ReactNode;
  gridCols?: number;
  label: string;
  className?: string;
}) => {
  return (
    <div className={`space-y-3 rounded-md border `}>
      <div
        className={`flex h-10 w-full items-center border-b p-2 text-sm font-medium `}
      >
        {label}
      </div>
      <div
        className={`${gridCols ? `grid grid-cols-${gridCols}` : null} gap-3 ${className} !pt-0 `}
      >
        {children}
      </div>
    </div>
  );
};

export default ExtractionFormComponent;
