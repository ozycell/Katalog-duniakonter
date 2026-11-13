import * as React from "react"
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"

export interface PinOtpInputProps {
  /** Nilai string saat ini (misal "123456") */
  value: string
  /** Callback saat nilai berubah */
  onChange: (value: string) => void
  /** Callback spesifik saat angka sudah terpenuhi length-nya (6 digit otomatis tersubmit) */
  onComplete?: (value: string) => void
  /** Panjang digit (default 6) */
  maxLength?: number
  /** Jika true, karakter akan di-mask menjadi "•" */
  isPassword?: boolean
  /** Disabled state saat loading memproses dsb */
  disabled?: boolean
  /** ClassName tambahan untuk container */
  className?: string
  /** Boolean apakah auto focus saat mounted */
  autoFocus?: boolean
}

export function PinOtpInput({
  value,
  onChange,
  onComplete,
  maxLength = 6,
  isPassword = false,
  disabled = false,
  className,
  autoFocus = false,
}: PinOtpInputProps) {
  // Setup focus ref agar bisa auto-focus
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      // Small timeout to ensure it focuses nicely after rendering/transitions
      const timeout = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [autoFocus])

  return (
    <InputOTP
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      onComplete={onComplete}
      disabled={disabled}
      pattern={REGEXP_ONLY_DIGITS}
      ref={inputRef}
      containerClassName={cn("flex justify-center gap-3", className)}
    >
      <InputOTPGroup className="gap-3 w-full justify-center">
        {Array.from({ length: maxLength }).map((_, index) => (
          <InputOTPSlot
            key={index}
            index={index}
            isPassword={isPassword}
            // Standar visual form input (meniru form komponen Auth sesuai desain)
            className="text-display-sm font-semibold disabled:opacity-50"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
