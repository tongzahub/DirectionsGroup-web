/**
 * Hydration debugging utilities
 * Helps identify and resolve hydration mismatches in development
 */

export const logHydrationMismatch = (componentName: string, serverValue: any, clientValue: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Hydration Mismatch] ${componentName}:`, {
      server: serverValue,
      client: clientValue,
      timestamp: new Date().toISOString(),
    });
  }
};

export const createHydrationSafeValue = <T>(
  serverValue: T,
  clientValue: T,
  componentName?: string
): T => {
  if (typeof window === 'undefined') {
    return serverValue;
  }
  
  if (serverValue !== clientValue && componentName) {
    logHydrationMismatch(componentName, serverValue, clientValue);
  }
  
  return clientValue;
};

export const isServer = typeof window === 'undefined';
export const isClient = typeof window !== 'undefined';

/**
 * Hook to safely get client-side values without hydration mismatches
 */
export const useClientValue = <T>(clientValue: T, serverValue: T): T => {
  if (isServer) {
    return serverValue;
  }
  return clientValue;
};