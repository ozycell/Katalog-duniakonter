import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  getLayoutConfig,
  BACKGROUND_VARIANTS,
  SHADOW_VARIANTS,
  CONTAINER_CLASSES,
  type LayoutVariant,
} from '@/lib/layout-variants';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PageShellProps {
  /** Child elements */
  children: ReactNode;
  
  /** Layout variant - menentukan background dan container */
  variant?: LayoutVariant;
  
  /** Custom className untuk outer wrapper */
  className?: string;
  
  /** Custom className untuk inner container */
  innerClassName?: string;
  
  /** Enable/disable page transition animation */
  withAnimation?: boolean;
  
  /** Custom animation duration (dalam seconds) */
  animationDuration?: number;
  
  /** Force override background color */
  backgroundColor?: string;
  
  /** Data test id untuk testing */
  'data-testid'?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * PageShell - Layout Wrapper Component
 * 
 * Menyediakan outer wrapper dengan background dan container yang konsisten
 * untuk seluruh halaman aplikasi.
 * 
 * ## Variants
 * 
 * - **fullscreen**: bg-background, full width (pattern lama)
 * - **centered**: bg-muted/30 + centered container dengan shadow (pattern baru)
 * - **auth**: bg-gradient-primary untuk halaman autentikasi
 * - **splash**: bg-gradient-primary + h-screen untuk splash screen
 * - **error**: bg-gradient-to-b untuk error pages
 * 
 * ## Usage
 * 
 * ```tsx
 * // Fullscreen layout (default)
 * <PageShell>
 *   <Header title="Dashboard" />
 *   <PageContent>Content here</PageContent>
 * </PageShell>
 * 
 * // Centered layout dengan shadow
 * <PageShell variant="centered">
 *   <Header title="Terms" />
 *   <main className="pt-14">Content</main>
 * </PageShell>
 * 
 * // Auth layout
 * <PageShell variant="auth">
 *   <LoginForm />
 * </PageShell>
 * ```
 */
export function PageShell({
  children,
  variant = 'fullscreen',
  className,
  innerClassName,
  withAnimation = false,
  animationDuration = 0.15,
  backgroundColor,
  'data-testid': testId,
}: PageShellProps) {
  const config = getLayoutConfig(variant);
  
  // Determine if we need inner container (centered, auth, splash)
  const needsInnerContainer = config.useMaxWidth;
  
  // Outer wrapper classes
  const outerClasses = cn(
    'min-h-dvh',
    config.outerBg,
    className
  );
  
  // Inner container classes (jika variant menggunakan container)
  const innerClasses = cn(
    needsInnerContainer && CONTAINER_CLASSES,
    needsInnerContainer && config.innerBg,
    needsInnerContainer && config.shadow,
    needsInnerContainer && 'relative',
    innerClassName
  );

  // Animation props
  const animationProps = withAnimation
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: animationDuration },
      }
    : {};

  // Wrapper component berdasarkan animation
  const Wrapper = withAnimation ? motion.div : 'div';

  // Render dengan atau tanpa inner container
  if (needsInnerContainer) {
    return (
      <Wrapper
        className={outerClasses}
        style={backgroundColor ? { backgroundColor } : undefined}
        data-testid={testId}
        {...animationProps}
      >
        <div className={innerClasses}>
          {children}
        </div>
      </Wrapper>
    );
  }

  // Fullscreen variant - tanpa inner container
  return (
    <Wrapper
      className={outerClasses}
      style={backgroundColor ? { backgroundColor } : undefined}
      data-testid={testId}
      {...animationProps}
    >
      {children}
    </Wrapper>
  );
}

// ============================================================================
// PRESET EXPORTS
// ============================================================================

/**
 * Pre-configured PageShell untuk pattern yang sering digunakan
 */

/** Fullscreen layout - pattern lama tanpa centered container */
export function FullscreenShell(props: Omit<PageShellProps, 'variant'>) {
  return <PageShell {...props} variant="fullscreen" />;
}

/** Centered layout dengan shadow dan max-width */
export function CenteredShell(props: Omit<PageShellProps, 'variant'>) {
  return <PageShell {...props} variant="centered" />;
}

/** Auth layout dengan gradient background */
export function AuthShellLayout(props: Omit<PageShellProps, 'variant'>) {
  return <PageShell {...props} variant="auth" />;
}

/** Splash screen layout */
export function SplashShell(props: Omit<PageShellProps, 'variant'>) {
  return <PageShell {...props} variant="splash" />;
}

/** Error page layout */
export function ErrorShell(props: Omit<PageShellProps, 'variant'>) {
  return <PageShell {...props} variant="error" />;
}

export default PageShell;
