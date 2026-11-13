type BackHandler = () => void;

let activeHandler: BackHandler | null = null;
let isNativeListenerSetup = false;

/**
 * Register a handler for the Android hardware back button.
 * Only one handler is active at a time — the most recent registration wins.
 */
export const registerBackHandler = (cb: BackHandler) => {
  activeHandler = cb;
};

/**
 * Unregister the current back button handler.
 */
export const unregisterBackHandler = () => {
  activeHandler = null;
};

/**
 * Get the currently registered back button handler.
 */
export const getBackHandler = () => activeHandler;

/**
 * Initialize the global native back button listener.
 * Should be called once at app startup (e.g. in App.tsx).
 */
export const initNativeBackButton = async () => {
  if (isNativeListenerSetup) return;
  isNativeListenerSetup = true;

  const { App } = await import('@capacitor/app');

  App.addListener('backButton', ({ canGoBack }) => {
    const handler = getBackHandler();
    if (handler) {
      handler();
    } else if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
};
