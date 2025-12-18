import { useEffect, useState } from 'react';

/**
 * Hook to safely detect if we're on the client side
 * Prevents hydration mismatches by returning false during SSR
 */
export const useIsClient = (): boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};