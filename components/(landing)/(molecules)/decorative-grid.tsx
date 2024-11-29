import { memo } from 'react';

import Image from 'next/image';

export const DecorativeGrid = memo(({ className }: { className?: string }) => {
  return (
    <Image
      className={className}
      src="/images/landing/grid-decor.svg"
      alt="Decoration"
      width={300}
      height={300}
    />
  );
});
