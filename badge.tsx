import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Badge Component - Standar tunggal untuk label, count, dan status
 * 
 * Standar UI/UX:
 * 
 * Typography:
 * - sm: text-[10px] (ultra compact, uppercase tracking-wide)
 * - md: text-[11px] (compact, uppercase tracking-wide) 
 * - lg: text-[12px] (default, uppercase tracking-wide)
 * 
 * Height (h-* untuk consistency):
 * - sm: h-5 (20px) - untuk inline badges
 * - md: h-6 (24px) - default, most common
 * - lg: h-7 (28px) - prominent badges
 * 
 * Icon Sizing:
 * - sm: w-2.5 h-2.5 (10px)
 * - md: w-3 h-3 (12px)
 * - lg: w-3.5 h-3.5 (14px)
 * 
 * Alignment:
 * - inline-flex items-center: vertical centering
 * - justify-center: horizontal centering
 * - gap-1: tight spacing between icon and text
 * 
 * Padding:
 * - Horizontal lebih besar dari vertical untuk pill shape
 * - sm: px-2 py-0
 * - md: px-2.5 py-0
 * - lg: px-3 py-0
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border font-semibold uppercase tracking-wide whitespace-nowrap shrink-0 transition-colors gap-1",
  {
    variants: {
      variant: {
        // Primary
        default: "bg-primary text-primary-foreground border-transparent hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/90",
        outline: "bg-background text-foreground border-border hover:bg-accent",
        ghost: "bg-transparent text-foreground border-transparent hover:bg-accent",
        
        // Status colors - dengan dark mode support
        emerald: "bg-emerald-100 text-emerald-700 border-transparent dark:bg-emerald-900/30 dark:text-emerald-300",
        amber: "bg-amber-100 text-amber-700 border-transparent dark:bg-amber-900/30 dark:text-amber-300",
        red: "bg-red-100 text-red-700 border-transparent dark:bg-red-900/30 dark:text-red-300",
        gray: "bg-gray-100 text-gray-700 border-transparent dark:bg-gray-800 dark:text-gray-300",
        blue: "bg-blue-100 text-blue-700 border-transparent dark:bg-blue-900/30 dark:text-blue-300",
      },
      size: {
        sm: "h-5 px-2 text-[10px] leading-none",
        md: "h-6 px-2.5 text-[11px] leading-none",
        lg: "h-7 px-3 text-[12px] leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

/**
 * Badge Component
 * 
 * Standar penggunaan dengan icon:
 * <Badge variant="emerald" size="sm">
 *   <Icon className="w-2.5 h-2.5" />
 *   <span>Text</span>
 * </Badge>
 * 
 * Standar penggunaan tanpa icon:
 * <Badge variant="emerald" size="sm">
 *   Text Only
 * </Badge>
 */
function Badge({ 
  className, 
  variant, 
  size, 
  asChild = false,
  children,
  ...props 
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp 
      className={cn(badgeVariants({ variant, size }), className)} 
      {...props}
    >
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
