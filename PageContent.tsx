import { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  PADDING_TOP_PRESETS,
  PADDING_BOTTOM_PRESETS,
  PADDING_X_PRESETS,
  type PaddingTop,
  type PaddingBottom,
  type PaddingX,
} from '@/lib/layout-variants';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type PageContentElement = ElementType;

interface PageContentProps<T extends PageContentElement = 'main'> {
  /** Child elements */
  children: ReactNode;
  
  /** HTML element yang digunakan - default: 'main' */
  as?: T;
  
  /** Padding top preset */
  paddingTop?: PaddingTop;
  
  /** Padding bottom preset */
  paddingBottom?: PaddingBottom;
  
  /** Horizontal padding preset */
  paddingX?: PaddingX;
  
  /** Enable scrollable content */
  scrollable?: boolean;
  
  /** Full height (100%) */
  fullHeight?: boolean;
  
  /** Custom className */
  className?: string;
  
  /** Enable stagger animation untuk children */
  withAnimation?: boolean;
  
  /** Animation variants (jika withAnimation true) */
  animationVariants?: {
    container?: object;
    item?: object;
  };
  
  /** Data test id */
  'data-testid'?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * PageContent - Content Area Component
 * 
 * Menyediakan content area dengan padding yang konsisten dan
 * konfigurasi scrollable yang fleksibel.
 * 
 * ## Padding Presets
 * 
 * ### Top (paddingTop)
 * - `HEADER`: pt-[72px] / pt-safe-header - Offset untuk header fixed + safe area
 * - `HEADER_ONLY`: pt-14 / pt-safe-header - Offset untuk header fixed + safe area
 * - `MINIMAL`: pt-4 - Minimal padding
 * - `NONE`: Tanpa padding top
 * 
 * ### Bottom (paddingBottom)
 * - `ACTION`: pb-20 / pb-safe-action - Area untuk bottom action button + safe area
 * - `NAV`: pb-[72px] / pb-safe-nav - Area untuk bottom navigation + safe area
 * - `MEDIUM`: pb-8 - Padding medium
 * - `MINIMAL`: pb-4 (16px) - Padding 16px ke bottom (no fixed element)
 * - `NONE`: Tanpa padding bottom
 * 
 * ### Horizontal (paddingX)
 * - `DEFAULT`: px-4 - Standard padding (default)
 * - `LARGE`: px-6 - Padding lebih besar
 * - `NONE`: Tanpa padding horizontal
 * 
 * ## Usage
 * 
 * ```tsx
 * // Standard halaman dengan header dan bottom nav
 * <PageContent>
 *   Content here
 * </PageContent>
 * 
 * // Halaman dengan bottom action button
 * <PageContent paddingBottom="ACTION">
 *   Content here
 * </PageContent>
 * 
 * // Scrollable content dengan animation
 * <PageContent 
 *   scrollable 
 *   withAnimation
 *   paddingTop="HEADER"
 *   paddingBottom="ACTION"
 * >
 *   {items.map(item => <Card key={item.id} />)}
 * </PageContent>
 * 
 * // Iframe container (tanpa scroll, full height)
 * <PageContent 
 *   as="div"
 *   paddingTop="HEADER_ONLY"
 *   fullHeight
 *   className="overflow-hidden"
 * >
 *   <iframe className="w-full h-full" />
 * </PageContent>
 * ```
 */
export function PageContent<T extends PageContentElement = 'main'>({
  children,
  as,
  paddingTop = 'HEADER',
  paddingBottom = 'NONE',
  paddingX = 'DEFAULT',
  scrollable = false,
  fullHeight = false,
  className,
  withAnimation = false,
  animationVariants,
  'data-testid': testId,
  ...props
}: PageContentProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof PageContentProps<T>>) {
  // Get padding classes dari presets
  const topClass = PADDING_TOP_PRESETS[paddingTop];
  const bottomClass = PADDING_BOTTOM_PRESETS[paddingBottom];
  const xClass = PADDING_X_PRESETS[paddingX];
  
  // Combine classes
  const contentClasses = cn(
    // Base layout
    fullHeight && 'h-full',
    
    // Padding
    topClass,
    bottomClass,
    xClass,
    
    // Scroll behavior
    scrollable && 'overflow-y-auto',
    
    // Custom classes
    className
  );
  
  // Element type
  const Component = as || 'main';
  
  // Animation wrapper jika di-enable
  if (withAnimation) {
    const containerVariants: Variants = (animationVariants?.container as Variants) || {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.06,
          delayChildren: 0.05,
        },
      },
    };
    
    return (
      <motion.div
        className={contentClasses}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        data-testid={testId}
      >
        {children}
      </motion.div>
    );
  }
  
  // Render tanpa animation
  return (
    <Component 
      className={contentClasses}
      data-testid={testId}
      {...props}
    >
      {children}
    </Component>
  );
}

// ============================================================================
// PRESET COMPONENTS
// ============================================================================

/**
 * Pre-configured PageContent untuk pattern yang sering digunakan
 */

/** 
 * StandardPageContent - Pattern paling umum
 * 
 * - paddingTop: HEADER (pt-[72px])
 * - paddingBottom: NAV (pb-16)
 * - paddingX: DEFAULT (px-4)
 * - scrollable: true
 */
export function StandardPageContent(props: Omit<PageContentProps, 'paddingTop' | 'paddingBottom' | 'paddingX' | 'scrollable'>) {
  return (
    <PageContent
      {...props}
      paddingTop="HEADER"
      paddingBottom="NAV"
      paddingX="DEFAULT"
      scrollable
    />
  );
}

/**
 * MainMenuPageContent - Khusus untuk 5 halaman utama dengan Bottom Nav
 * 
 * - paddingTop: MINIMAL (pt-4)
 * - paddingBottom: NAV_SAFE (pb-4 = 16px spacing, nav height handled by parent)
 * - paddingX: DEFAULT (px-4)
 * - scrollable: true
 */
export function MainMenuPageContent(props: Omit<PageContentProps<'div'>, 'paddingTop' | 'paddingBottom' | 'paddingX' | 'scrollable'>) {
  return (
    <PageContent
      {...props}
      as="div"
      paddingTop="MINIMAL"
      paddingBottom="NAV_SAFE"
      paddingX="DEFAULT"
      scrollable
    />
  );
}

/**
 * ActionPageContent - Untuk halaman dengan bottom action button
 * 
 * - paddingTop: pt-safe-header-with-gap (4.5rem + safe-area)
 * - paddingBottom: ACTION (pb-20 = 80px) - button 64px + 16px spacing
 * - paddingX: DEFAULT (px-4)
 * - scrollable: true
 */
export function ActionPageContent(props: Omit<PageContentProps, 'paddingTop' | 'paddingBottom' | 'paddingX' | 'scrollable'>) {
  return (
    <PageContent
      {...props}
      paddingTop="NONE"
      paddingBottom="ACTION"
      paddingX="DEFAULT"
      scrollable
      className={cn('pt-safe-header-with-gap', props.className)}
    />
  );
}

/**
 * StandalonePageContent - Untuk halaman tanpa bottom nav/action
 * 
 * - paddingTop: HEADER (pt-[72px])
 * - paddingBottom: MINIMAL (pb-4)
 * - paddingX: DEFAULT (px-4)
 * - scrollable: true
 */
export function StandalonePageContent(props: Omit<PageContentProps, 'paddingTop' | 'paddingBottom' | 'paddingX' | 'scrollable'>) {
  return (
    <PageContent
      {...props}
      paddingTop="HEADER"
      paddingBottom="MINIMAL"
      paddingX="DEFAULT"
      scrollable
    />
  );
}

/**
 * IframeContainer - Khusus untuk iframe content
 * 
 * - paddingTop: HEADER_ONLY (pt-14)
 * - paddingBottom: NONE
 * - fullHeight: true
 * - scrollable: false
 */
export function IframeContainer(props: Omit<PageContentProps<'div'>, 'as' | 'paddingTop' | 'paddingBottom' | 'fullHeight' | 'scrollable'>) {
  return (
    <PageContent
      {...props}
      as="div"
      paddingTop="HEADER_ONLY"
      paddingBottom="NONE"
      fullHeight
      scrollable={false}
      className={cn('overflow-hidden', props.className)}
    />
  );
}

/**
 * FormPageContent - Untuk halaman form
 * 
 * - paddingTop: HEADER (pt-[72px])
 * - paddingBottom: ACTION (pb-20 = 80px) - space untuk submit button + 16px spacing
 * - paddingX: DEFAULT (px-4)
 * - scrollable: true
 * - withAnimation: true
 */
export function FormPageContent(props: Omit<PageContentProps, 'paddingTop' | 'paddingBottom' | 'paddingX' | 'scrollable' | 'withAnimation'>) {
  return (
    <PageContent
      {...props}
      paddingTop="HEADER"
      paddingBottom="ACTION"
      paddingX="DEFAULT"
      scrollable
      withAnimation
    />
  );
}

export default PageContent;
