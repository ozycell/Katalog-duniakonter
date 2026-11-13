import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LAYOUT_DIMENSIONS,
  PADDING_TOP_PRESETS,
  PADDING_BOTTOM_PRESETS,
  PADDING_X_PRESETS,
  calculateContentHeight,
  getPaddingClasses,
  type PaddingTop,
  type PaddingBottom,
  type PaddingX,
} from '@/lib/layout-variants';

/**
 * Route patterns yang tidak menampilkan bottom navigation
 * Mirror dari MainLayout.tsx NO_BOTTOM_NAV_PAGES
 */
const NO_BOTTOM_NAV_ROUTES = [
  '/deposit',
  '/transfer',
  '/transfer/member',
  '/transfer/bank',
  '/prabayar',
  '/pascabayar',
  '/omni',
  '/pin-transaction',
  '/transaction/',
  '/print/',
  '/checkout',
  '/downline/withdraw',
  '/downline/add',
  '/information/',
  '/my-account/account-',
  '/my-account/balance-',
  '/my-account/delete-',
  '/my-account/identity-',
  '/my-account/verify-',
  '/my-account/outlet-',
  '/my-account/personal-',
  '/my-account/referral-',
  '/my-account/transaction-',
  '/my-account/verification',
  '/my-account/change-pin',
  '/contact',
  '/contacts',
  '/help',
  '/contact-us',
  '/about',
  '/report',
  '/terms-of-service',
  '/privacy-policy',
] as const;

/**
 * Route patterns yang membutuhkan bottom action button area
 */
const BOTTOM_ACTION_ROUTES = [
  '/prabayar',
  '/pascabayar',
  '/transfer/member',
  '/transfer/bank',
  '/deposit',
  '/downline/withdraw',
  '/downline/add',
  '/pin-transaction',
  '/checkout',
  '/my-account/',
] as const;

/**
 * Hook untuk mengelola layout configuration
 * 
 * Provides utilities untuk:
 * - Cek apakah halaman memiliki bottom nav
 * - Cek apakah halaman membutuhkan bottom action area
 * - Get padding classes yang sesuai
 * - Calculate content height
 * 
 * @returns Layout utilities dan configuration
 * 
 * @example
 * ```tsx
 * function MyPage() {
 *   const { 
 *     hasBottomNav, 
 *     hasBottomAction,
 *     contentPadding,
 *     contentHeight 
 *   } = usePageLayout();
 *   
 *   return (
 *     <div style={{ height: contentHeight }}>
 *       {/* Content *\/}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePageLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  /**
   * Cek apakah current route memiliki bottom navigation
   */
  const hasBottomNav = useMemo(() => {
    return !NO_BOTTOM_NAV_ROUTES.some(route => {
      if (pathname === route) return true;
      if (pathname.startsWith(route)) return true;
      return false;
    });
  }, [pathname]);

  /**
   * Cek apakah current route membutuhkan bottom action area
   */
  const hasBottomAction = useMemo(() => {
    return BOTTOM_ACTION_ROUTES.some(route => {
      if (pathname === route) return true;
      if (pathname.startsWith(route)) return true;
      return false;
    });
  }, [pathname]);

  /**
   * Cek apakah halaman adalah standalone (tanpa nav dan action)
   */
  const isStandalone = useMemo(() => {
    return !hasBottomNav && !hasBottomAction;
  }, [hasBottomNav, hasBottomAction]);

  /**
   * Get padding bottom preset yang sesuai
   */
  const bottomPaddingPreset: PaddingBottom = useMemo(() => {
    if (hasBottomAction) return 'ACTION';
    if (hasBottomNav) return 'NAV';
    return 'MINIMAL';
  }, [hasBottomAction, hasBottomNav]);

  /**
   * Get content height yang sudah di-calculate
   */
  const contentHeight = useMemo(() => {
    return calculateContentHeight(hasBottomNav, hasBottomAction);
  }, [hasBottomNav, hasBottomAction]);

  /**
   * Get header offset height dalam px
   */
  const headerOffset = LAYOUT_DIMENSIONS.HEADER_OFFSET;

  /**
   * Get complete padding classes
   */
  const getContentPadding = (
    top: PaddingTop = 'HEADER',
    x: PaddingX = 'DEFAULT'
  ): string => {
    return getPaddingClasses(top, bottomPaddingPreset, x);
  };

  /**
   * Get individual padding classes
   */
  const paddingClasses = {
    top: PADDING_TOP_PRESETS,
    bottom: PADDING_BOTTOM_PRESETS,
    x: PADDING_X_PRESETS,
  };

  return {
    // Boolean flags
    hasBottomNav,
    hasBottomAction,
    isStandalone,
    
    // Calculated values
    contentHeight,
    headerOffset,
    bottomPaddingPreset,
    
    // Utility functions
    getContentPadding,
    
    // Raw preset classes
    paddingClasses,
    
    // Dimensions constants
    dimensions: LAYOUT_DIMENSIONS,
  } as const;
}

/**
 * Hook untuk manual layout configuration
 * 
 * Berguna ketika Anda perlu set layout config secara manual
 * tanpa bergantung pada current route.
 * 
 * @param config - Manual configuration
 * @returns Layout utilities
 */
export function useManualPageLayout(config: {
  hasBottomNav?: boolean;
  hasBottomAction?: boolean;
}) {
  const { hasBottomNav = false, hasBottomAction = false } = config;

  const bottomPaddingPreset: PaddingBottom = hasBottomAction 
    ? 'ACTION' 
    : hasBottomNav 
      ? 'NAV' 
      : 'NONE';

  const contentHeight = calculateContentHeight(hasBottomNav, hasBottomAction);

  const getContentPadding = (
    top: PaddingTop = 'HEADER',
    x: PaddingX = 'DEFAULT'
  ): string => {
    return getPaddingClasses(top, bottomPaddingPreset, x);
  };

  return {
    hasBottomNav,
    hasBottomAction,
    isStandalone: !hasBottomNav && !hasBottomAction,
    contentHeight,
    headerOffset: LAYOUT_DIMENSIONS.HEADER_OFFSET,
    getContentPadding,
    paddingClasses: {
      top: PADDING_TOP_PRESETS,
      bottom: PADDING_BOTTOM_PRESETS,
      x: PADDING_X_PRESETS,
    },
    dimensions: LAYOUT_DIMENSIONS,
  } as const;
}

export default usePageLayout;
