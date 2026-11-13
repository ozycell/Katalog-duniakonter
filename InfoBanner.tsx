import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const infoBannerVariants = cva(
  'rounded-xl p-4 flex gap-3 border',
  {
    variants: {
      variant: {
        warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800',
        success: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800',
        error: 'bg-red-50 dark:bg-red-950/30 border-red-200/60 dark:border-red-800',
        info: 'bg-primary/5 border-primary/20',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const iconColorMap = {
  warning: 'text-amber-600 dark:text-amber-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-primary',
};

const textColorMap = {
  warning: 'text-amber-800 dark:text-amber-300',
  success: 'text-emerald-800 dark:text-emerald-300',
  error: 'text-red-800 dark:text-red-300',
  info: 'text-foreground',
};

interface InfoBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof infoBannerVariants> {
  title?: string;
  icon?: React.ReactNode;
}

export function InfoBanner({
  className,
  variant = 'info',
  title,
  icon,
  children,
  ...props
}: InfoBannerProps) {
  const v = variant || 'info';
  const DefaultIcon = iconMap[v];
  const iconColor = iconColorMap[v];
  const textColor = textColorMap[v];

  return (
    <div className={cn(infoBannerVariants({ variant }), className)} {...props}>
      <div className={cn('flex-shrink-0 mt-0.5', iconColor)}>
        {icon || <DefaultIcon className="h-5 w-5" />}
      </div>
      <div className={cn('text-caption leading-relaxed', textColor)}>
        {title && <p className="text-body-sm font-semibold mb-0.5 tracking-tight">{title}</p>}
        <div className="font-medium">{children}</div>
      </div>
    </div>
  );
}
