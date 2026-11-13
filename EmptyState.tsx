import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

/**
 * EmptyState Component - Standardized Empty State
 * 
 * Standard dari DownlinePage:
 * - Icon base: h-16 w-16 rounded-2xl bg-primary/10
 * - Icon: h-8 w-8 text-primary/60
 * - Title: text-heading-md font-semibold text-foreground mb-2
 * - Description: text-body-sm text-muted-foreground max-w-[260px] mb-6 leading-relaxed
 * - Button (jika ada): px-8 h-12 shadow-lg shadow-primary/25
 * - Animation: fade in with y offset
 */
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Jika true, akan memenuhi container parent dan centered secara vertikal */
  fullHeight?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  fullHeight = true,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center px-6 text-center',
        fullHeight ? 'flex-1 min-h-[50vh]' : 'py-12',
        className
      )}
    >
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-primary/60" />
      </div>
      <h3 className="text-heading-md font-semibold text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-body-sm text-muted-foreground max-w-[260px] mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="flex flex-col items-center gap-3">
          {action}
        </div>
      )}
    </motion.div>
  );
}
