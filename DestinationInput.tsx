/**
 * DestinationInput Component - Integrated input + action buttons
 * 
 * Menggabungkan Input nomor tujuan dengan action buttons (Favorit, Tambah, Kontak)
 * menjadi satu kesatuan visual yang modern dan rapi.
 * 
 * Digunakan di:
 * - PrabayarPage: Input nomor + scan + check PLN + Favorit/Tambah/Kontak
 * - PascabayarPage: Input nomor + scan + Favorit/Tambah/Kontak
 * 
 * Pattern: Mirip AmountInput yang menyatu, tapi untuk input nomor pembelian.
 * 
 * Standards:
 * - Input height: h-12 (48px)
 * - Input font: text-[15px] font-medium (dari Input component)
 * - Action text: text-[13px] font-semibold
 * - Action icon: h-3.5 w-3.5 (14px)
 * - Container: rounded-xl, border-border, bg-background
 * - Separator: border-b border-border/40
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface DestinationAction {
  /** Lucide icon component */
  icon: LucideIcon;
  /** Button label */
  label: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether this action is visible */
  visible?: boolean;
  /** Whether this action is disabled */
  disabled?: boolean;
  /** Disabled tooltip text */
  disabledTooltip?: string;
}

interface DestinationInputProps {
  /** Input value */
  value: string;
  /** Input change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Input placeholder */
  placeholder?: string;
  /** Input type */
  type?: string;
  /** Input mode (numeric, text, tel, etc.) */
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  /** Input ref forwarding */
  inputRef?: React.Ref<HTMLInputElement>;
  /** Custom input className (appended to default) */
  inputClassName?: string;
  /** Touch handlers for long-press support */
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onTouchMove?: (e: React.TouchEvent) => void;
  /** Custom paste handler */
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  /** React nodes to render as icons/buttons inside the input (right side) */
  endActions?: React.ReactNode;
  /** Action buttons row (Favorit, Tambah, Kontak) */
  actions?: DestinationAction[];
  /** Custom container className */
  className?: string;
}

// =============================================================================
// ACTION BUTTON (INLINE TEXT LINK STYLE)
// =============================================================================

interface InlineActionProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  disabledTooltip?: string;
  isLast?: boolean;
}

function InlineAction({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  disabledTooltip,
  isLast = false,
}: InlineActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? disabledTooltip : undefined}
      className={cn(
        // Layout
        "flex-1 flex items-center justify-center gap-1.5",
        // Spacing
        "py-2.5",
        // Typography
        "text-[13px] font-semibold",
        // Colors
        disabled
          ? "text-muted-foreground/40 cursor-not-allowed"
          : "text-muted-foreground hover:text-primary active:text-primary",
        // Transitions
        "transition-colors duration-200",
        // Touch
        "touch-manipulation",
        // Divider (not on last item)
        !isLast && "border-r border-border/40",
      )}
    >
      <Icon
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          disabled ? "text-muted-foreground/40" : "text-inherit"
        )}
      />
      <span>{label}</span>
    </button>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DestinationInput({
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  inputRef,
  inputClassName,
  onTouchStart,
  onTouchEnd,
  onTouchMove,
  onPaste,
  endActions,
  actions,
  className,
}: DestinationInputProps) {
  // Filter visible actions
  const visibleActions = actions?.filter(a => a.visible !== false) || [];
  const hasActions = visibleActions.length > 0;

  return (
    <div
      className={cn(
        // Container styling
        "rounded-xl border border-border bg-background overflow-hidden",
        // Focus-within border
        "focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/20",
        // Transition
        "transition-all duration-200",
        className
      )}
    >
      {/* INPUT ROW */}
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={onTouchMove}
          onPaste={onPaste}
          className={cn(
            // Base styles (match Input component: h-12, 15px font, medium weight)
            "w-full h-12 px-3.5 bg-transparent text-foreground",
            "text-[15px] font-medium",
            "placeholder:text-muted-foreground/60",
            // Remove default focus ring (handled by container)
            "focus:outline-none",
            // Disabled
            "disabled:opacity-50 disabled:cursor-not-allowed",
            // Custom
            inputClassName
          )}
        />
        
        {/* End action icons (scan, check, etc.) */}
        {endActions && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {endActions}
          </div>
        )}
      </div>

      {/* ACTION ROW - Separated by border */}
      {hasActions && (
        <div
          className={cn(
            "flex items-center",
            // Separator line between input and actions
            "border-t border-border/40",
            // Subtle bg difference for action area
            "bg-muted/20"
          )}
        >
          {visibleActions.map((action, index) => (
            <InlineAction
              key={action.label}
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              disabledTooltip={action.disabledTooltip}
              isLast={index === visibleActions.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { DestinationInputProps, DestinationAction };
