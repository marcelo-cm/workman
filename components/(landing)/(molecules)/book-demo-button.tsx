import React, { memo } from 'react';

import { PhoneCallIcon } from 'lucide-react';

import Link from 'next/link';

import { Button, ButtonProps } from '@/components/ui/button';

const BookDemo = memo(({ ...props }: ButtonProps) => {
  return (
    <Link href="https://cal.com/ethanhan">
      <Button variant={'secondary'} {...props}>
        <PhoneCallIcon className="size-4 stroke-[1.5px]" /> Book a Demo
      </Button>
    </Link>
  );
});

export default BookDemo;
