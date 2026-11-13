/**
 * ActionButtonGroup Component - Horizontal action buttons for Prabayar/Pascabayar
 * 
 * Digunakan di:
 * - PrabayarPage: Tombol Favorit, Tambah, Kontak
 * - PascabayarPage: Tombol Favorit, Tambah, Kontak
 * 
 * Standards (sesuai DepositPage counter buttons):
 * - Height: h-10 (40px)
 * - Font: text-[14px] font-semibold
 * - Layout: flex row (icon di kiri, text di kanan)
 * - Icon: h-4 w-4 (16px)
 * - Gap: gap-1.5 (6px antara icon dan text)
 * - Border radius: rounded-xl
 * - Border: border-border
 * - Background: bg-card
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Users, Plus, BookUser, LucideIcon } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface ActionButtonConfig {
  /** Button label */
  label: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether button is visible */
  visible?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Disabled tooltip text */
  disabledTooltip?: string;
}

interface ActionButtonGroupProps {
  /** Favorit button configuration */
  favorit: ActionButtonConfig;
  /** Tambah button configuration */
  tambah: ActionButtonConfig;
  /** Kontak button configuration */
  kontak: ActionButtonConfig;
  /** Custom className */
  className?: string;
}

// =============================================================================
// SINGLE BUTTON COMPONENT
// =============================================================================

interface CompactActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  disabledTooltip?: string;
}

function CompactActionButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  disabledTooltip,
}: CompactActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? disabledTooltip : undefined}
      className={cn(
        // Layout: flex row, center aligned
        "flex items-center justify-center",
        // Height: 40px (h-10)
        "h-10",
        // Padding horizontal
        "px-2",
        // Gap icon-text
        "gap-1.5",
        // Styling
        "rounded-xl",
        "bg-card border border-border",
        // Hover states
        !disabled && [
          "hover:border-primary/50",
          "hover:bg-accent/50",
        ],
        // Active/touch feedback
        "active:scale-[0.96]",
        // Transitions
        "transition-all duration-200",
        // Touch manipulation
        "touch-manipulation",
        // Disabled state
        disabled && [
          "bg-muted/30",
          "border-border/50",
          "opacity-60",
          "cursor-not-allowed",
        ]
      )}
    >
      <Icon 
        className={cn(
          "h-4 w-4 shrink-0",
          disabled ? "text-muted-foreground" : "text-primary"
        )} 
      />
      <span 
        className={cn(
          "text-[14px] font-semibold",
          disabled ? "text-muted-foreground" : "text-foreground"
        )}
      >
        {label}
      </span>
    </button>
  );
}

// =============================================================================
// PLACEHOLDER COMPONENT
// =============================================================================

function ActionButtonPlaceholder() {
  return (
    <div className="h-10 rounded-xl bg-muted/30 border border-transparent" />
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ActionButtonGroup({
  favorit,
  tambah,
  kontak,
  className,
}: ActionButtonGroupProps) {
  return (
    <div 
      className={cn(
        "grid grid-cols-3",
        "gap-2",
        className
      )}
    >
      {/* FAVORIT */}
      {favorit.visible ? (
        <CompactActionButton
          icon={Users}
          label={favorit.label}
          onClick={favorit.onClick}
          disabled={favorit.disabled}
          disabledTooltip={favorit.disabledTooltip}
        />
      ) : (
        <ActionButtonPlaceholder />
      )}

      {/* TAMBAH */}
      {tambah.visible ? (
        <CompactActionButton
          icon={Plus}
          label={tambah.label}
          onClick={tambah.onClick}
          disabled={tambah.disabled}
          disabledTooltip={tambah.disabledTooltip}
        />
      ) : (
        <ActionButtonPlaceholder />
      )}

      {/* KONTAK */}
      {kontak.visible ? (
        <CompactActionButton
          icon={BookUser}
          label={kontak.label}
          onClick={kontak.onClick}
          disabled={kontak.disabled}
          disabledTooltip={kontak.disabledTooltip}
        />
      ) : (
        <ActionButtonPlaceholder />
      )}
    </div>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { ActionButtonGroupProps, ActionButtonConfig };
