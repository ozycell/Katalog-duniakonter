/**
 * TransactionDetail Components - Reusable detail page components
 * 
 * Standar detail page untuk semua tipe transaksi:
 * - Prabayar, Pascabayar, Top Up, Transfer Sesama, Transfer Bank
 * 
 * Features:
 * - Consistent status display (Success/Process/Failed)
 * - Detail row with copy functionality
 * - Bank/Method info card
 * - Saldo summary card
 * - Dark mode support
 * 
 * Usage:
 * <TransactionDetailCard
 *   status="SUCCESS"
 *   totalAmount={100000}
 *   title="Detail Transaksi"
 *   onCopy={handleCopy}
 *   onShare={handleShare}
 *   onRefresh={handleRefresh}
 *   isProcessing={false}
 * >
 *   <TransactionDetailRow label="ID" value="#123" copyable />
 *   <TransactionDetailRow label="Tanggal" value="12 Mar 2024, 10:30" />
 * </TransactionDetailCard>
 */

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SafeImage } from '@/components/ui/safe-image';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  Share2, 
  RefreshCw,
  Landmark,
  Wallet,
  Info,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'BERHASIL' | 'PROSES' | 'GAGAL' | string;

export interface StatusConfig {
  icon: React.ElementType;
  color: string;
  bg: string;
  label: string;
}

export interface TransactionDetailRowProps {
  label: string;
  value: string;
  bold?: boolean;
  copyable?: boolean;
  highlight?: boolean;
  onCopy?: (value: string) => void;
  className?: string;
  isLast?: boolean;
}

export interface TransactionDetailCardProps {
  children?: React.ReactNode;
  status: TransactionStatus;
  totalAmount: number;
  title?: string;
  onCopy?: (options?: { includeStatus?: boolean; statusLabel?: string }) => void;
  onShare?: () => void;
  onRefresh?: () => void;
  isProcessing?: boolean;
  showPrintButton?: boolean;
  onPrint?: () => void;
  className?: string;
  countdown?: string;
}

export interface BankInfoCardProps {
  name: string;
  logo?: string | null;
  description?: string;
  fallbackIcon?: React.ReactNode;
  title?: string;
}

export interface SaldoSummaryCardProps {
  before?: number;
  after?: number;
  label?: string;
}

export interface MessageCardProps {
  message: string;
  type?: 'info' | 'warning' | 'error';
}

export interface InfoCardProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'info' | 'warning' | 'success' | 'error';
  className?: string;
}

// =============================================================================
// STATUS CONFIGURATION
// =============================================================================

/**
 * Get status configuration - Standardized across all transaction types
 */
export function getTransactionStatusConfig(status: TransactionStatus): StatusConfig {
  const s = (status || '').toUpperCase();
  
  // Success statuses
  if (['SUCCESS', 'PAID', 'BERHASIL', 'COMPLETE'].includes(s)) {
    return { 
      icon: CheckCircle2, 
      color: 'text-emerald-600 dark:text-emerald-400', 
      bg: 'bg-emerald-100 dark:bg-emerald-900/30', 
      label: 'Sukses' 
    };
  }
  
  // Pending/Processing statuses
  if (['PENDING', 'PROCESSING', 'WAITING', 'HOLDON', 'PROSES', 'INQ', 'INQUIRY'].includes(s)) {
    return { 
      icon: Clock, 
      color: 'text-amber-600 dark:text-amber-400', 
      bg: 'bg-amber-100 dark:bg-amber-900/30', 
      label: 'Proses' 
    };
  }
  
  // Failed statuses
  if (['FAILED', 'CANCELLED', 'EXPIRED', 'GAGAL', 'REJECTED'].includes(s)) {
    return { 
      icon: XCircle, 
      color: 'text-red-600 dark:text-red-400', 
      bg: 'bg-red-100 dark:bg-red-900/30', 
      label: 'Gagal' 
    };
  }
  
  // Default to failed
  return { 
    icon: XCircle, 
    color: 'text-red-600 dark:text-red-400', 
    bg: 'bg-red-100 dark:bg-red-900/30', 
    label: 'Gagal' 
  };
}

// =============================================================================
// LOADING SKELETON
// =============================================================================

export function TransactionDetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}

// =============================================================================
// DETAIL ROW COMPONENT
// =============================================================================

export function TransactionDetailRow({
  label,
  value,
  bold = false,
  copyable = false,
  highlight = false,
  onCopy,
  className,
  isLast = false,
}: TransactionDetailRowProps) {
  const handleCopy = () => {
    if (onCopy) {
      onCopy(value);
    }
  };

  return (
    <div
      className={cn(
        'flex justify-between items-start py-2.5',
        !isLast && 'border-b border-border/50',
        className
      )}
    >
      <span className="text-body-sm text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 ml-4">
        <span
          className={cn(
            'text-body-md text-right break-words leading-relaxed',
            bold ? 'font-semibold text-foreground' : 'font-medium text-foreground',
            highlight && 'text-primary font-semibold'
          )}
        >
          {value}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:bg-accent/50 text-muted-foreground/50 hover:text-muted-foreground transition-colors shrink-0"
            aria-label={`Copy ${label}`}
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// DETAIL CARD CONTAINER
// =============================================================================

export function TransactionDetailInfoCard({
  children,
  className,
  title = 'Detail Transaksi',
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card variant="outline" className={cn('border-border overflow-hidden', className)}>
        <div className="px-4 py-2.5 bg-muted/20 border-b border-border/30">
          <h3 className="text-label-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        </div>
        <CardContent className="p-4">
          <div className="space-y-0">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// MAIN STATUS CARD COMPONENT
// =============================================================================

export function TransactionDetailCard({
  children,
  status,
  totalAmount,
  title = 'Detail Transaksi',
  onCopy,
  onShare,
  onRefresh,
  isProcessing = false,
  showPrintButton = false,
  onPrint,
  className,
  countdown,
}: TransactionDetailCardProps) {
  const sc = getTransactionStatusConfig(status);
  const StatusIcon = sc.icon;
  
  // Check status
  const isSuccess = ['SUCCESS', 'PAID', 'BERHASIL', 'COMPLETE'].includes((status || '').toUpperCase());
  const isFailed = ['FAILED', 'CANCELLED', 'EXPIRED', 'GAGAL', 'REJECTED'].includes((status || '').toUpperCase());

  return (
    <div className={cn('space-y-4', className)}>
      {/* Status Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card variant="outline" className="border-border">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-center relative">
            {/* Countdown Timer - KIRI (Deposit specific) */}
            {countdown && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 left-4 h-8 px-3 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center gap-2"
              >
                <Clock className="h-4 w-4 text-white/80" />
                <span className="text-white font-semibold text-body-sm">{countdown}</span>
              </motion.div>
            )}
            
            {/* Action buttons - KANAN - Standard: h-9 w-9 (36px), icon 20px */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {isProcessing && onRefresh && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={onRefresh}
                  className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-sm transition-all duration-200 flex items-center justify-center"
                  aria-label="Refresh"
                >
                  <RefreshCw className="h-5 w-5" />
                </motion.button>
              )}
              {/* Copy Detail - GAGAL & SUKSES & PROSES */}
              {onCopy && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={() => onCopy({ includeStatus: true, statusLabel: sc.label })}
                  className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-sm transition-all duration-200 flex items-center justify-center"
                  aria-label="Copy"
                >
                  <Copy className="h-5 w-5" />
                </motion.button>
              )}
              {/* Share - SUKSES saja */}
              {onShare && isSuccess && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onClick={onShare}
                  className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white backdrop-blur-sm transition-all duration-200 flex items-center justify-center"
                  aria-label="Share"
                >
                  <Share2 className="h-5 w-5" />
                </motion.button>
              )}
            </div>

            {/* Status Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3',
                sc.bg
              )}
            >
              <StatusIcon className={cn('w-8 h-8', sc.color)} />
            </motion.div>

            {/* Status Label */}
            <h2 className="text-white text-heading-md font-semibold">{sc.label}</h2>
          </div>

          {/* Total Amount */}
          <CardContent className="p-5">
            <div className="text-center">
              <p className="text-body-sm text-muted-foreground">Total Bayar</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <h3 className="text-display-sm font-semibold text-foreground">
                  {formatCurrency(totalAmount)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Content */}
      {children}

      {/* Print Button */}
      {showPrintButton && onPrint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="outline" className="w-full" onClick={onPrint}>
            Versi Struk
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// =============================================================================
// BANK INFO CARD
// =============================================================================

export function BankInfoCard({
  name,
  logo,
  description,
  fallbackIcon,
  title = 'Transfer Ke',
}: BankInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card variant="outline" className="border-border overflow-hidden">
        <div className="px-4 py-2.5 bg-muted/20 border-b border-border/30">
          <h3 className="text-label-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <SafeImage
                  src={logo}
                  alt={name}
                  className="h-6 w-6 object-contain"
                  fallback={
                    fallbackIcon || <Landmark className="h-5 w-5 text-primary" />
                  }
                />
              ) : (
                fallbackIcon || <Landmark className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0 font-sans">
              <p className="font-semibold text-[15px] text-foreground truncate">{name}</p>
              {description && (
                <p className="text-[13px] text-muted-foreground truncate">{description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// SALDO SUMMARY CARD
// =============================================================================

export function SaldoSummaryCard({
  before,
  after,
  label = 'Ringkasan Kredit',
}: SaldoSummaryCardProps) {
  if (before === undefined && after === undefined) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Card variant="outline" className="border-border bg-emerald-50/50 dark:bg-emerald-900/10 overflow-hidden">
        <div className="px-4 py-2.5 bg-emerald-100/50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-900/30">
          <h3 className="text-label-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {label}
          </h3>
        </div>
        <CardContent className="p-4">
          <div className="space-y-0">
            {before !== undefined && (
              <div className="flex justify-between items-start py-2.5 border-b border-emerald-100 dark:border-emerald-900/30">
                <span className="text-body-sm text-muted-foreground">Kredit Sebelum</span>
                <span className="font-medium text-body-md">{formatCurrency(before)}</span>
              </div>
            )}
            {after !== undefined && (
              <div className="flex justify-between items-start py-2.5">
                <span className="text-body-sm font-semibold text-foreground">Kredit Sesudah</span>
                <span className="font-bold text-body-md text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(after)}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// MESSAGE CARD
// =============================================================================

export function MessageCard({ message, type = 'info' }: MessageCardProps) {
  if (!message) return null;

  const typeStyles = {
    info: '',
    warning: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30',
    error: 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      toast.success('Pesan berhasil disalin');
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card variant="outline" className={cn('border-border overflow-hidden', typeStyles[type])}>
        <div className="px-4 py-2.5 bg-muted/20 border-b border-border/30 flex items-center justify-between">
          <h3 className="text-label-xs font-semibold text-muted-foreground uppercase tracking-wider">Pesan</h3>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            aria-label="Salin pesan"
            title="Salin pesan"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        <CardContent className="p-4">
          <p className="text-body-md text-foreground">{message}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// =============================================================================
// INFO CARD - SelectorCard Pattern (Clean, No Title)
// =============================================================================

const infoCardConfig = {
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-900/30',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-200 dark:border-emerald-900/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-900/30',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-300',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-900/30',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-300',
    iconColor: 'text-red-600 dark:text-red-400',
  },
};

export function InfoCard({
  children,
  icon,
  variant = 'info',
  className,
}: InfoCardProps) {
  const config = infoCardConfig[variant];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div 
        className={cn(
          'w-full p-4 rounded-xl flex items-center gap-4 border',
          config.bg,
          config.border,
          className
        )}
      >
        {/* Icon Container - SelectorCard Pattern: h-10 w-10 rounded-xl */}
        <div className={cn('shrink-0 h-10 w-10 rounded-xl flex items-center justify-center', config.iconBg)}>
          {icon || <IconComponent className={cn('h-5 w-5', config.iconColor)} />}
        </div>
        
        {/* Content - 14px only, no title */}
        <div className={cn('flex-1 min-w-0 text-body-sm font-medium leading-relaxed', config.textColor)}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// DEPOSIT SPECIFIC COMPONENTS
// =============================================================================

export interface DepositMethodCardProps {
  name: string;
  number?: string;
  owner?: string;
  logo?: string;
  type?: string;
}

export function DepositMethodCard({
  name,
  number,
  owner,
  logo,
  type,
}: DepositMethodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card variant="outline" className="border-border overflow-hidden">
        <div className="px-4 py-2.5 bg-muted/20 border-b border-border/30">
          <h3 className="text-label-xs font-semibold text-muted-foreground uppercase tracking-wider">Metode Pembayaran</h3>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <SafeImage
                  src={logo}
                  alt={name}
                  className="h-6 w-6 object-contain"
                  fallback={<Wallet className="h-5 w-5 text-primary" />}
                />
              ) : (
                <Wallet className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0 font-sans">
              <p className="font-semibold text-[15px] text-foreground">{name}</p>
              {number && (
                <p className="text-[15px] text-muted-foreground">{number}</p>
              )}
              {owner && (
                <p className="text-[13px] text-muted-foreground">{owner}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
