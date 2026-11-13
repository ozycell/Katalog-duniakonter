/**
 * HistoryListCard Component - Reusable card for history/transaction lists
 * 
 * Digunakan di:
 * - HistoryPage: Prabayar, Pascabayar, Top Up, Transfer Sesama, Transfer Bank
 * - DownlinePage: Member List, Bonus History, Penarikan History
 * 
 * Features:
 * - Consistent 40px icon container
 * - Dark mode support
 * - Flexible content areas
 * - Status badge support
 * - Loading skeleton
 * 
 * Font Standards:
 * - Title: text-[15px] font-semibold (15px)
 * - Subtitle: text-[13px] (13px)
 * - Meta/Date: text-[13px] text-muted-foreground (13px)
 * - Amount: text-[15px] font-semibold (15px)
 * - ID: text-[13px] text-muted-foreground/70 (13px)
 */

import * as React from "react";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// =============================================================================
// TYPES
// =============================================================================

interface HistoryListCardProps {
  /** Click handler */
  onClick?: () => void;
  /** Icon element */
  icon: React.ReactNode;
  /** Icon container background class */
  iconBgClass?: string;
  /** Icon color class */
  iconColorClass?: string;
  /** Title text */
  title: string;
  /** Subtitle/description text */
  subtitle?: string;
  /** Meta info (e.g., date/time) */
  meta?: string;
  /** Custom className for subtitle */
  subtitleClassName?: string;
  /** Amount to display */
  amount?: string | number;
  /** Amount formatter function */
  formatAmount?: (amount: number | string) => string;
  /** Status badge element */
  statusBadge?: React.ReactNode;
  /** ID to display */
  id?: string | number;
  /** Custom className */
  className?: string;
  /** Loading state */
  loading?: boolean;
  /** Card variant */
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

export function HistoryListCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="text-right space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function HistoryListCard({
  onClick,
  icon,
  iconBgClass = "bg-primary/10",
  iconColorClass = "text-primary",
  title,
  subtitle,
  meta,
  subtitleClassName,
  amount,
  formatAmount,
  statusBadge,
  id,
  className,
  loading = false,
}: HistoryListCardProps) {
  if (loading) {
    return <HistoryListCardSkeleton />;
  }

  // Format amount if provided
  const displayAmount = React.useMemo(() => {
    if (amount === undefined || amount === null) return null;
    if (formatAmount) return formatAmount(amount);
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return amount;
  }, [amount, formatAmount]);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-card overflow-hidden cursor-pointer",
        "hover:border-primary/30 hover:bg-accent/30 active:scale-[0.98]",
        "transition-all duration-200",
        className
      )}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Icon Container - 40px x 40px standardized */}
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-primary/10",
              iconBgClass
            )}
          >
            <span className={cn("h-5 w-5 flex items-center justify-center text-primary", iconColorClass)}>{icon}</span>
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0 space-y-0.5">
            {/* Title - 15px font-semibold */}
            <p className="text-[15px] font-semibold text-foreground tracking-tight truncate leading-tight">
              {title}
            </p>
            
            {/* Subtitle - 13px */}
            {subtitle && (
              <p className={cn("text-[13px] truncate leading-tight", subtitleClassName || "text-muted-foreground")}>
                {subtitle}
              </p>
            )}
            
            {/* Meta/Date - 13px with reduced opacity */}
            {meta && (
              <p className="text-[13px] text-muted-foreground/60 leading-tight">
                {meta}
              </p>
            )}
          </div>

          {/* Amount & Status Section */}
          <div className="text-right shrink-0 space-y-1">
            {/* Amount - 15px font-semibold */}
            {displayAmount && (
              <p className="text-[15px] font-semibold text-foreground tracking-tight">
                {displayAmount}
              </p>
            )}
            
            {/* Status Badge */}
            {statusBadge}
            
            {/* ID - 13px */}
            {id !== undefined && (
              <p className="text-[13px] text-muted-foreground/70">
                #{id}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// GROUP COMPONENT - For multiple cards with consistent spacing
// =============================================================================

interface HistoryListCardGroupProps {
  /** Card children */
  children: React.ReactNode;
  /** Custom className */
  className?: string;
  /** Gap between cards */
  gap?: 'sm' | 'md' | 'lg';
}

export function HistoryListCardGroup({
  children,
  className,
  gap = 'md',
}: HistoryListCardGroupProps) {
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

export type { HistoryListCardProps, HistoryListCardGroupProps };
