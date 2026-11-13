import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface LoadingStateProps {
  /** Text yang ditampilkan di bawah spinner */
  text?: string;
  
  /** Ukuran spinner */
  size?: 'sm' | 'md' | 'lg';
  
  /** Custom className untuk container */
  className?: string;
  
  /** Custom className untuk spinner */
  spinnerClassName?: string;
  
  /** Custom className untuk text */
  textClassName?: string;
  
  /** Full height (min-h-dvh) atau tidak */
  fullHeight?: boolean;
  
  /** Center dalam container parent (gunakan flex-1) */
  flexCenter?: boolean;
  
  /** Children tambahan (misal: subtext) */
  children?: ReactNode;
}

// ============================================================================
// SIZE CONFIGURATIONS
// ============================================================================

const SIZE_CONFIG = {
  sm: {
    spinner: 'w-8 h-8',
    border: 'border-2',
  },
  md: {
    spinner: 'w-10 h-10',
    border: 'border-2',
  },
  lg: {
    spinner: 'w-12 h-12',
    border: 'border-[3px]',
  },
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * LoadingState - Komponen loading yang konsisten
 * 
 * Menyediakan spinner loading dengan style yang seragam
 * di seluruh aplikasi.
 * 
 * ## Usage
 * 
 * ### Basic (centered dalam halaman)
 * ```tsx
 * <LoadingState />
 * ```
 * 
 * ### Dengan custom text
 * ```tsx
 * <LoadingState text="Memuat data..." />
 * ```
 * 
 * ### Ukuran berbeda
 * ```tsx
 * <LoadingState size="lg" />
 * ```
 * 
 * ### Full screen
 * ```tsx
 * <LoadingState fullHeight />
 * ```
 * 
 * ### Dalam container flex
 * ```tsx
 * <div className="flex flex-col">
 *   <Header />
 *   <LoadingState flexCenter />
 * </div>
 * ```
 * 
 * ### Dengan subtext
 * ```tsx
 * <LoadingState text="Sedang memuat">
 *   <p className="text-caption text-muted-foreground/60 mt-1">
 *     Mohon tunggu sebentar
 *   </p>
 * </LoadingState>
 * ```
 */
export function LoadingState({
  text = 'Sedang memuat',
  size = 'md',
  className,
  spinnerClassName,
  textClassName,
  fullHeight = false,
  flexCenter = false,
  children,
}: LoadingStateProps) {
  const config = SIZE_CONFIG[size];
  
  const spinnerClasses = cn(
    'relative',
    config.spinner,
    spinnerClassName
  );
  
  const containerClasses = cn(
    'flex flex-col items-center justify-center',
    fullHeight && 'min-h-dvh',
    flexCenter && 'flex-1',
    className
  );
  
  const trackClasses = cn(
    'absolute inset-0 rounded-full',
    config.border,
    'border-primary/20'
  );
  
  const spinnerTrackClasses = cn(
    'absolute inset-0 rounded-full',
    config.border,
    'border-primary border-t-transparent animate-spin'
  );
  
  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}>
        <div className={trackClasses} />
        <div className={spinnerTrackClasses} />
      </div>
      
      {text && (
        <p className={cn('text-body-sm text-muted-foreground mt-3', textClassName)}>
          {text}
        </p>
      )}
      
      {children}
    </div>
  );
}

// ============================================================================
// PRESET COMPONENTS
// ============================================================================

/**
 * LoadingState untuk full page (min-h-dvh)
 */
export function FullPageLoading(props: Omit<LoadingStateProps, 'fullHeight'>) {
  return <LoadingState {...props} fullHeight />;
}

/**
 * LoadingState untuk flex container (flex-1 center)
 */
export function FlexCenterLoading(props: Omit<LoadingStateProps, 'flexCenter'>) {
  return <LoadingState {...props} flexCenter />;
}

/**
 * LoadingState small size
 */
export function SmallLoading(props: Omit<LoadingStateProps, 'size'>) {
  return <LoadingState {...props} size="sm" />;
}

/**
 * LoadingState large size
 */
export function LargeLoading(props: Omit<LoadingStateProps, 'size'>) {
  return <LoadingState {...props} size="lg" />;
}

export default LoadingState;
