'use client';

import { useEffect, useState } from 'react';

export function PromiseWrapper({
  promise,
  children,
}: {
  promise: Promise<void> | null;
  children: React.ReactNode;
}) {
  if (!promise) throw Promise.resolve();

  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    promise.then(() => setResolved(true));
  }, [promise]);

  if (!resolved) return null; // Render nothing until the promise resolves

  return <>{children}</>; // Render the children once resolved
}
