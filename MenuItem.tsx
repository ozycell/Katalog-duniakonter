import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animation";

interface MenuItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  to?: string;
  onClick?: () => void;
  badge?: string | ReactNode;
  destructive?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MenuItem({
  icon: Icon,
  title,
  subtitle,
  to,
  onClick,
  badge,
  destructive = false,
  disabled = false,
  className
}: MenuItemProps) {
  const content = (
    <motion.div
      variants={itemVariants}
      className={cn(
        "flex items-center gap-3 px-4 py-3 transition-colors",
        !disabled && "cursor-pointer hover:bg-accent active:bg-accent/80",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Icon */}
      <div className={cn(
        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
        destructive 
          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          : "bg-primary/10 text-primary"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-body-md font-medium truncate",
          destructive && "text-red-600 dark:text-red-400"
        )}>
          {title}
        </p>
        {subtitle && (
          <p className="text-body-sm text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      
      {/* Badge or Arrow */}
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span className="text-label-xs bg-muted px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </motion.div>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className="block">
        {content}
      </Link>
    );
  }

  return (
    <div onClick={!disabled ? onClick : undefined}>
      {content}
    </div>
  );
}

interface MenuSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function MenuSection({ title, children, className }: MenuSectionProps) {
  return (
    <div className={cn("rounded-2xl border border-border overflow-hidden bg-card", className)}>
      {title && (
        <div className="px-4 py-2.5 border-b border-border/30">
          <h3 className="text-label-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="divide-y divide-border/30">
        {children}
      </div>
    </div>
  );
}
