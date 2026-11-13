import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button Variants - Typography Standards
 * 
 * Font sizes:
 * - default: text-[15px] (Large)
 * - md: text-[14px] (Medium)
 * - sm: text-[14px] (Small)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 shrink-0 outline-none focus-visible:ring-primary/30 focus-visible:ring-[3px] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-button-primary hover:bg-primary-hover active:bg-primary-active hover:shadow-button-primary-hover active:shadow-button-primary-active",
        destructive:
          "bg-destructive text-destructive-foreground shadow-button-danger hover:bg-destructive-hover active:bg-destructive-active",
        outline:
          "border border-primary text-primary bg-transparent shadow-xs hover:bg-primary-subtle active:bg-primary-subtle",
        secondary:
          "bg-secondary text-secondary-foreground shadow-button-secondary hover:bg-secondary-hover active:bg-secondary-active",
        ghost:
          "hover:bg-accent hover:text-accent-foreground text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-2.5 text-[15px] rounded-xl has-[>svg]:px-4", // Large (48px)
        md: "h-10 px-5 py-2 text-[14px] rounded-[10px] has-[>svg]:px-3.5",   // Medium (40px)
        sm: "h-8 px-4 py-1.5 text-[14px] font-medium rounded-lg has-[>svg]:px-3", // Small (32px)
        // Icon only sizes
        icon: "size-12 text-[15px] rounded-xl",          // Large Icon
        "icon-md": "size-10 text-[14px] rounded-[10px]", // Medium Icon
        "icon-sm": "size-8 text-[14px] rounded-lg",      // Small Icon
      },
      loading: {
        true: "cursor-wait opacity-80",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    // When using asChild, we cannot add loading spinner as sibling
    // because Slot expects exactly one child
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        disabled={loading || props.disabled}
        className={cn(buttonVariants({ variant, size, loading, className }))}
        {...props}
      >
        {!asChild && loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
