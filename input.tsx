import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Input Variants - Standardized Form Input
 * 
 * Height: 48px (h-12)
 * Font: 15px medium (text-[15px] font-medium)
 * Icons inside input: 20px (size-5)
 * Icons in label: 16px (size-4)
 * Icons color: text-muted-foreground
 */
const inputVariants = cva(
  "flex w-full border bg-background text-foreground shadow-xs transition-all outline-none file:text-foreground placeholder:text-muted-foreground/60 selection:bg-primary/20 selection:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px]",
        error: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 focus-visible:ring-[3px]",
        success: "border-success focus-visible:border-success focus-visible:ring-success/20 focus-visible:ring-[3px]",
      },
      size: {
        default: "h-12 px-3.5 py-4 text-[15px] font-medium rounded-xl",  // 48px, 15px font, medium weight
        md: "h-10 px-3 py-2 text-[15px] font-medium rounded-lg",         // 40px
        sm: "h-8 px-2.5 py-1 text-[14px] font-medium rounded-md",        // 32px
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Label Component - Standardized Label
 * 
 * Font: 13px (text-[13px])
 * Color: text-muted-foreground
 * Icon in label: 16px (size-4), color: text-muted-foreground
 * Icon in input: 20px (size-5), color: text-muted-foreground
 */
interface InputLabelProps {
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
  required?: boolean
}

const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ children, icon, className, required }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "flex items-center gap-1.5 text-[13px] text-muted-foreground mb-1.5",
          className
        )}
      >
        {icon && (
          <span className="[&_svg]:size-4 text-muted-foreground">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {required && <span className="text-destructive">*</span>}
      </label>
    )
  }
)
InputLabel.displayName = "InputLabel"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  VariantProps<typeof inputVariants> {
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  label?: string
  labelIcon?: React.ReactNode
  wrapperClassName?: string
}

/**
 * Input Component - Standardized Form Input
 * 
 * Rules:
 * 1. Without label: icon inside input (20px/size-5, muted-foreground)
 * 2. With label: icon in label (16px/size-4, muted-foreground)
 * 3. Input text: 15px, font-medium
 * 4. Label text: 13px, text-muted-foreground
 * 5. Height: 48px (h-12)
 * 6. endIcon ALWAYS shown if provided (regardless of label)
 * 7. startIcon only shown when NO label
 * 
 * Icon Alignment:
 * - Icons are vertically centered using flexbox
 * - top-1/2 + -translate-y-1/2 for perfect vertical center
 * - flex items-center justify-center for internal alignment
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant, 
    size, 
    type, 
    startIcon, 
    endIcon,
    label,
    labelIcon,
    wrapperClassName,
    ...props 
  }, ref) => {
    // If label is provided, startIcon goes to label (not inside input)
    // But endIcon is ALWAYS shown if provided
    const showLabelIcon = label && labelIcon
    const showInputStartIcon = !label && startIcon
    const showInputEndIcon = !!endIcon

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {/* Label with icon (if provided) - icon is 16px (size-4) */}
        {label && (
          <InputLabel icon={labelIcon}>
            {label}
          </InputLabel>
        )}
        
        {/* Input wrapper */}
        <div className="relative w-full">
          {/* Start icon inside input (only when no label) - 20px, perfectly centered */}
          {showInputStartIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none h-5 w-5 flex items-center justify-center">
              <div className="[&_svg]:size-5">{startIcon}</div>
            </div>
          )}
          
          <input
            type={type}
            ref={ref}
            data-slot="input"
            className={cn(
              inputVariants({ variant, size, className }),
              showInputStartIcon && "pl-10",
              showInputEndIcon && "pr-10"
            )}
            {...props}
          />
          
          {/* End icon inside input - 20px, perfectly centered */}
          {showInputEndIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 flex items-center justify-center">
              <div className="[&_svg]:size-5 flex items-center justify-center">{endIcon}</div>
            </div>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants, InputLabel }
