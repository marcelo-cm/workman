import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { PhoneCallIcon } from 'lucide-react';

import { Button } from '../ui/button';

export const CallToAction = () => {
  return (
    <div className="flex flex-row gap-4">
      <Button variant={'secondary'}>
        <PhoneCallIcon className="size-[15px] stroke-[1.5px]" /> Book a Demo
      </Button>
      <Button variant={'outline'}>
        <ChatBubbleIcon /> Email Founders
      </Button>
    </div>
  );
};
