"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, InputProps, InputLabel } from "./input"

/**
 * FormInput - Standardized Form Input Component
 * 
 * Standar yang diterapkan:
 * - Tinggi: 48px (h-12)
 * - Font input: 14px medium weight
 * - Font label: 13px gray (text-muted-foreground)
 * - Icon: 20px (size-5)
 * 
 * Usage patterns:
 * 
 * 1. Input tanpa label (icon di dalam input):
 *    <FormInput 
 *      placeholder="Nomor HP" 
 *      startIcon={<Phone />} 
 *    />
 * 
 * 2. Input dengan label (icon di label, bukan di input):
 *    <FormInput 
 *      label="Nomor HP"
 *      labelIcon={<Phone />}
 *      placeholder="Masukkan nomor HP"
 *    />
 * 
 * 3. Input dengan error state:
 *    <FormInput 
 *      label="Email"
 *      labelIcon={<Mail />}
 *      error="Email tidak valid"
 *      variant="error"
 *    />
 */

interface FormInputProps extends Omit<InputProps, 'variant'> {
  error?: string
  helperText?: string
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ error, helperText, className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn("w-full", wrapperClassName)}>
        <Input
          ref={ref}
          variant={error ? "error" : "default"}
          className={className}
          {...props}
        />
        
        {/* Error message */}
        {error && (
          <p className="mt-1.5 text-[13px] text-destructive flex items-center gap-1">
            {error}
          </p>
        )}
        
        {/* Helper text */}
        {!error && helperText && (
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput, InputLabel }
export type { FormInputProps }
