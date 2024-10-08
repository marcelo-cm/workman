'use client';

import { useEffect, useState } from 'react';

export function PromiseWrapper({
  promise,
  children,
}: {
  promise: Promise<void>;
  children: React.ReactNode;
}) {
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    promise.then(() => setResolved(true));
  }, [promise]);

  if (!resolved) return null;

  return <>{children}</>;
}
