'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-black">
      Whoops. Page not found.
      <Button onClick={() => router.back()}>
        <ArrowLeftIcon /> Go Back
      </Button>
    </div>
  );
};

export default NotFound;
