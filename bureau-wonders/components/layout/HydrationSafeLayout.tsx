'use client';

import { useEffect, useState } from 'react';

interface HydrationSafeLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout wrapper that prevents hydration mismatches
 * by ensuring consistent rendering between server and client
 */
export default function HydrationSafeLayout({ children }: HydrationSafeLayoutProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after the first render
    setIsHydrated(true);
  }, []);

  // During SSR and initial client render, use a simplified version
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    );
  }

  // After hydration, render the full layout
  return <>{children}</>;
}