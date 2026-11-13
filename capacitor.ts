/**
 * Capacitor Environment Detection & Native Bridge
 * Detects if running inside Capacitor native app
 */

export const isCapacitor = (): boolean => {
  return typeof (window as any).Capacitor !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.();
};

export const CapacitorEnv = {
  isNative: isCapacitor,
  isWeb: () => !isCapacitor(),
};
