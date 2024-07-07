import React from 'react';

import { Loader2Icon } from 'lucide-react';

const LoadingState = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-md border bg-wm-white-50">
      {message} <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
    </div>
  );
};

export default LoadingState;
