import React from 'react';

import Container from '../../ui/container';

const ExtractionFormComponent = ({
  children,
  gridCols,
  label,
  className,
}: {
  children: React.ReactNode;
  gridCols?: number;
  label: string | React.ReactNode;
  className?: string;
}) => {
  return (
    <Container
      header={label}
      innerClassName={`${gridCols ? `grid grid-cols-${gridCols}` : null} gap-3 ${className} !pt-2`}
    >
      {children}
    </Container>
  );
};

export default ExtractionFormComponent;
