"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

/**
 * Label Component - Standardized Form Label
 * 
 * Font: 13px (text-[13px])
 * Color: text-muted-foreground
 * Icon: 16px (size-4), color: text-muted-foreground
 */
interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  icon?: React.ReactNode
}

function Label({
  className,
  icon,
  children,
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-1.5 text-[13px] text-muted-foreground leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {icon && (
        <span className="[&_svg]:size-4 text-muted-foreground flex-shrink-0">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </LabelPrimitive.Root>
  )
}

export { Label }
