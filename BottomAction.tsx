/**
 * BottomAction Component - Fixed bottom action button container
 * 
 * Digunakan di:
 * - RegisterPage: Tombol submit di setiap step
 * - ForgotPasswordPage: Tombol submit OTP
 * - DepositPage: Tombol Lanjutkan
 * - TransferMemberPage/TransferBankPage: Tombol Lanjutkan
 * - AddMemberPage: Tombol Daftarkan
 * - DownlineWithdrawPage: Tombol Tarik
 * - PersonalDataPage: Tombol Simpan
 * 
 * Standards:
 * - Container: fixed bottom, z-50, full width
 * - Inner: max-width centered, padding, transparent bg
 * - Border: top border saja untuk separator
 * 
 * @example
 * ```tsx
 * <BottomAction>
 *   <Button className="w-full" onClick={handleSubmit}>
 *     Simpan
 *   </Button>
 * </BottomAction>
 * ```
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

interface BottomActionProps {
  /** Button atau komponen yang akan dirender */
  children: React.ReactNode;
  /** Custom className untuk container */
  className?: string;
  /** Custom className untuk inner container */
  innerClassName?: string;
}

export function BottomAction({
  children,
  className,
  innerClassName,
}: BottomActionProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 safe-bottom',
        className
      )}
    >
      <div
        className={cn(
          // Container sizing - sama dengan layout standard
          'w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl',
          'mx-auto',
          // Padding horizontal saja (padding bottom di parent)
          'px-4',
          // Background transparent seperti pattern AccountUpgradePage
          'bg-transparent',
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default BottomAction;
