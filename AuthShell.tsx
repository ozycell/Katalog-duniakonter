import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppLogo } from '@/components/common/AppLogo';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface AuthStep {
  /** Step number (displayed in circle) */
  number: number;
  /** Step label (displayed below circle) */
  label: string;
}

interface AuthShellProps {
  /** Child elements */
  children: ReactNode;
  
  /** Optional step indicator configuration */
  steps?: {
    /** Array of step definitions */
    items: AuthStep[];
    /** Current active step number */
    current: number;
  };
  
  /** Show app logo di atas */
  showLogo?: boolean;
  
  /** Custom logo height dalam px */
  logoHeight?: number;
  
  /** Tagline text di bawah logo */
  tagline?: string;
  
  /** Custom className untuk content area */
  className?: string;
  
  /** Custom className untuk inner container */
  innerClassName?: string;
  
  /** Enable page transition animation */
  withAnimation?: boolean;
  
  /** Data test id */
  'data-testid'?: string;
}

// ============================================================================
// STEP INDICATOR COMPONENT
// ============================================================================

interface StepIndicatorProps {
  steps: AuthStep[];
  currentStep: number;
}

/**
 * StepIndicator - Progress indicator untuk multi-step auth flow
 * 
 * Menampilkan step progression dengan visual yang konsisten
 * sesuai design system aplikasi.
 */
function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex flex-col items-center relative">
              {/* Step Circle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-label-md font-bold transition-colors relative z-10',
                  isActive && 'bg-white text-primary ring-4 ring-white/20',
                  isCompleted && 'bg-emerald-400 text-white',
                  !isActive && !isCompleted && 'bg-white/30 text-white'
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>

              {/* Step Label */}
              <span
                className={cn(
                  'text-label-xs mt-2 text-center leading-tight max-w-[60px]',
                  isActive && 'text-white font-medium',
                  !isActive && 'text-white/70'
                )}
              >
                {step.label}
              </span>

              {/* Connector Line (jika bukan step terakhir) */}
              {!isLast && (
                <div className="flex-1 flex items-center pt-4 absolute left-full top-0 w-full">
                  <div
                    className={cn(
                      'w-full h-0.5 transition-colors',
                      isCompleted ? 'bg-emerald-400' : 'bg-white/30'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * AuthShell - Layout khusus untuk halaman autentikasi
 * 
 * Menyediakan layout dengan:
 * - Gradient background (bg-gradient-primary)
 * - Optional step indicator
 * - Optional app logo
 * - Centered container
 * 
 * ## Usage
 * 
 * ### Basic auth page
 * ```tsx
 * <AuthShell>
 *   <LoginForm />
 * </AuthShell>
 * ```
 * 
 * ### Dengan logo dan tagline
 * ```tsx
 * <AuthShell showLogo tagline="Aplikasi Digital Terpercaya">
 *   <RegisterForm />
 * </AuthShell>
 * ```
 * 
 * ### Multi-step form dengan step indicator
 * ```tsx
 * <AuthShell
 *   showLogo
 *   steps={{
 *     items: [
 *       { number: 1, label: 'Akun' },
 *       { number: 2, label: 'Verifikasi' },
 *       { number: 3, label: 'PIN' },
 *     ],
 *     current: 2,
 *   }}
 * >
 *   <VerificationForm />
 * </AuthShell>
 * ```
 */
export function AuthShell({
  children,
  steps,
  showLogo = false,
  logoHeight = 48,
  tagline,
  className,
  innerClassName,
  withAnimation = true,
  'data-testid': testId,
}: AuthShellProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  } as const;

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 20,
      },
    },
  } as const;

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
        delay: 0.1,
      },
    },
  } as const;

  // Wrapper component
  const Wrapper = withAnimation ? motion.div : 'div';
  const ContentWrapper = withAnimation ? motion.div : 'div';

  return (
    <Wrapper
      className={cn(
        'min-h-dvh bg-gradient-primary flex flex-col',
        className
      )}
      variants={withAnimation ? containerVariants : undefined}
      initial={withAnimation ? 'hidden' : undefined}
      animate={withAnimation ? 'visible' : undefined}
      data-testid={testId}
    >
      {/* Inner Container */}
      <div
        className={cn(
          'w-full max-w-md mx-auto flex flex-col flex-1 relative',
          innerClassName
        )}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Logo Section */}
        {showLogo && (
          <ContentWrapper
            className="relative z-10 pt-12 pb-8 flex flex-col items-center px-6"
            variants={withAnimation ? logoVariants : undefined}
          >
            <AppLogo height={logoHeight} />
            {tagline && (
              <p className="text-primary-100 text-body-sm mt-4 font-medium text-center">
                {tagline}
              </p>
            )}
          </ContentWrapper>
        )}

        {/* Step Indicator */}
        {steps && steps.items.length > 0 && (
          <div className="relative z-10">
            <StepIndicator steps={steps.items} currentStep={steps.current} />
          </div>
        )}

        {/* Content Area */}
        <ContentWrapper
          className="relative z-10 flex-1 flex flex-col px-6 pb-8"
          variants={withAnimation ? contentVariants : undefined}
        >
          {children}
        </ContentWrapper>
      </div>
    </Wrapper>
  );
}

// ============================================================================
// PRESET COMPONENTS
// ============================================================================

/**
 * Pre-configured AuthShell untuk pattern yang sering digunakan
 */

/**
 * LoginShell - Layout untuk halaman login
 * 
 * - showLogo: true
 * - tagline: default
 * - withAnimation: true
 */
export function LoginShell(props: Omit<AuthShellProps, 'showLogo'>) {
  return (
    <AuthShell
      {...props}
      showLogo
      tagline={props.tagline || 'Aplikasi Digital Terpercaya'}
    />
  );
}

/**
 * RegisterShell - Layout untuk halaman register
 * 
 * - showLogo: true
 * - tagline: default
 * - withAnimation: true
 * - Biasanya dengan steps
 */
export function RegisterShell(props: Omit<AuthShellProps, 'showLogo'>) {
  return (
    <AuthShell
      {...props}
      showLogo
      tagline={props.tagline || 'Daftar Sekarang, Mulai Bisnis Anda'}
    />
  );
}

export default AuthShell;
