import React, { memo } from 'react';

import { ChatBubbleIcon } from '@radix-ui/react-icons';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

const EmailFounders = memo(() => {
  return (
    <Link href="mailto:ethan@workman.so">
      <Button variant={'outline'}>
        <ChatBubbleIcon /> Email Founders
      </Button>
    </Link>
  );
});

export default EmailFounders;
