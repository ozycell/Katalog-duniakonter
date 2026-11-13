import { useEffect, useRef } from 'react';
import { registerBackHandler, unregisterBackHandler } from '@/lib/back-button';

/**
 * Hook to handle Android hardware back button for a specific page/component.
 * Only one handler is active at a time globally.
 */
export function useHardwareBackButton(callback: () => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const wrapped = () => callbackRef.current();
    registerBackHandler(wrapped);
    return () => unregisterBackHandler();
  }, []);
}
