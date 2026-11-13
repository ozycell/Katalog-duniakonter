/**
 * ActionOption Component - Reusable card for action selection
 * 
 * Digunakan di:
 * - Dashboard: Jenis Kirim Dana (Transfer options)
 * - ForgotPassword: Metode Verifikasi
 * - AccountChangePin: Pilih metode (WhatsApp/Email)
 * - Downline: Menu Lainnya
 * 
 * Features:
 * - Consistent 40px icon container
 * - Dark mode support
 * - Selected state styling
 * - Disabled state with badge
 * - Optional description/subtitle
 * - Loading state support
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Loader2 } from "lucide-react";

interface ActionOptionProps {
  /** Unique identifier */
  id: string;
  /** Icon element (ReactNode) */
  icon: React.ReactNode;
  /** Title text */
  title: string;
  /** Optional description/subtitle */
  description?: string;
  /** Whether this option is selected */
  selected?: boolean;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Custom badge element (e.g., "Segera Hadir") */
  badge?: React.ReactNode;
  /** Click handler */
  onClick: () => void;
  /** Custom className for the container */
  className?: string;
  /** Custom className for the icon container */
  iconClassName?: string;
  /** Variant - default or custom color scheme */
  variant?: 'default' | 'whatsapp' | 'email' | 'primary';
}

/**
 * ActionOption - Standardized action selection card
 * 
 * @example
 * ```tsx
 * <ActionOption
 *   id="whatsapp"
 *   icon={<WhatsAppIcon />}
 *   title="WhatsApp"
 *   description="08123456789"
 *   selected={method === 'whatsapp'}
 *   loading={isLoading && method === 'whatsapp'}
 *   onClick={() => handleSelect('whatsapp')}
 *   variant="whatsapp"
 * />
 * ```
 */
export function ActionOption({
  id,
  icon,
  title,
  description,
  selected = false,
  disabled = false,
  loading = false,
  badge,
  onClick,
  className,
  iconClassName,
  variant = 'default',
}: ActionOptionProps) {
  // Variant-based styling
  const variantStyles = {
    default: {
      selected: {
        container: "border-primary bg-primary/5",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        title: "text-foreground",
        description: "text-primary",
      },
      default: {
        container: "border-border bg-card hover:border-primary/30 hover:bg-accent/30",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        title: "text-foreground",
        description: "text-muted-foreground",
      },
    },
    whatsapp: {
      selected: {
        container: "border-green-500 bg-green-50/50 dark:bg-green-950/30",
        iconBg: "bg-green-100 dark:bg-green-900/40",
        iconColor: "text-green-600 dark:text-green-400",
        title: "text-green-800 dark:text-green-300",
        description: "text-green-600 dark:text-green-400",
      },
      default: {
        container: "border-border bg-card hover:border-primary/30 hover:bg-accent/30",
        iconBg: "bg-green-50 dark:bg-green-950/30",
        iconColor: "text-green-500 dark:text-green-400",
        title: "text-foreground",
        description: "text-muted-foreground",
      },
    },
    email: {
      selected: {
        container: "border-red-500 bg-red-50/50 dark:bg-red-950/30",
        iconBg: "bg-red-100 dark:bg-red-900/40",
        iconColor: "text-red-600 dark:text-red-400",
        title: "text-red-800 dark:text-red-300",
        description: "text-red-600 dark:text-red-400",
      },
      default: {
        container: "border-border bg-card hover:border-primary/30 hover:bg-accent/30",
        iconBg: "bg-red-50 dark:bg-red-950/30",
        iconColor: "text-red-500 dark:text-red-400",
        title: "text-foreground",
        description: "text-muted-foreground",
      },
    },
    primary: {
      selected: {
        container: "border-primary bg-primary/5",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        title: "text-foreground",
        description: "text-primary",
      },
      default: {
        container: "border-border bg-card hover:border-primary/30 hover:bg-accent/30",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        title: "text-foreground",
        description: "text-muted-foreground",
      },
    },
  };

  const styles = selected ? variantStyles[variant].selected : variantStyles[variant].default;

  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "w-full p-4 rounded-xl flex items-center gap-4 border transition-all duration-200 text-left",
        "active:scale-[0.98] touch-manipulation",
        disabled && !loading && "opacity-50 cursor-not-allowed border-border/30 bg-muted/30",
        !disabled && !loading && "hover:border-primary/30 hover:bg-accent/30",
        styles.container,
        className
      )}
    >
      {/* Icon Container - 40px x 40px (h-10 w-10) */}
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0",
          styles.iconBg,
          iconClassName
        )}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <span className={cn(styles.iconColor)}>{icon}</span>
        )}
      </div>

      {/* Content */}
      <div className="text-left flex-1 min-w-0">
        <div className={cn("text-[15px] font-semibold truncate", styles.title)}>
          {title}
        </div>
        {description && (
          <div className={cn("text-[13px] truncate", styles.description)}>
            {description}
          </div>
        )}
      </div>

      {/* Badge or Chevron */}
      {badge ? (
        badge
      ) : (
        <ChevronRight
          className={cn(
            "w-5 h-5 flex-shrink-0",
            selected ? "text-primary" : "text-muted-foreground/50"
          )}
        />
      )}
    </button>
  );
}

// =============================================================================
// ACTION OPTION GROUP - For multiple options with consistent spacing
// =============================================================================

interface ActionOptionGroupProps {
  /** Array of action options */
  children: React.ReactNode;
  /** Custom className for the container */
  className?: string;
  /** Spacing between options */
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * ActionOptionGroup - Container for multiple ActionOption with consistent spacing
 * 
 * @example
 * ```tsx
 * <ActionOptionGroup gap="md">
 *   <ActionOption ... />
 *   <ActionOption ... />
 * </ActionOptionGroup>
 * ```
 */
export function ActionOptionGroup({
  children,
  className,
  gap = 'md',
}: ActionOptionGroupProps) {
  const gapClasses = {
    sm: "space-y-2",
    md: "space-y-3",
    lg: "space-y-4",
  };

  return (
    <div className={cn(gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { ActionOptionProps, ActionOptionGroupProps };
