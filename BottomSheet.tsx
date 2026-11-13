"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// =============================================================================
// CONSTANTS - Header height untuk perhitungan max-height
// =============================================================================

const HEADER_HEIGHT = 56; // px - tinggi navbar header

// =============================================================================
// TYPES
// =============================================================================

interface BottomSheetProps {
  /** Whether the sheet is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Sheet title (optional) */
  title?: string;
  /** Optional description/subtitle */
  description?: string;
  /** Content of the sheet */
  children: React.ReactNode;
  /** Additional className for SheetContent */
  className?: string;
  /** Additional className for content area */
  contentClassName?: string;
  /** Callback when sheet is closed */
  onClose?: () => void;
  /** Whether this sheet has a search input (affects spacing) */
  hasSearch?: boolean;
  /** Size variant - affects height behavior */
  size?: 'auto' | 'full' | 'sm' | 'md' | 'lg' | 'selector';
  /** Custom max height (e.g. "400px", "80vh") - overrides default calc */
  maxHeight?: string;
}

// =============================================================================
// HANDLE BAR COMPONENT
// =============================================================================

/**
 * Standard drag handle bar for bottom sheets
 * Fixed dimensions: w-12 h-1 with pt-3 pb-2 spacing
 */
function SheetHandleBar() {
  return (
    <div className="w-full flex justify-center pt-3 pb-2 shrink-0">
      <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT - DYNAMIC HEIGHT BOTTOM SHEET
// =============================================================================

/**
 * Standardized Bottom Sheet component dengan dynamic height
 * 
 * Layout structure:
 * - Handle bar: pt-3 pb-2 (12px top, 8px bottom) - shrink-0
 * - Header: px-4 py-2 with gap-1.5 (8px vertical padding) - shrink-0
 * - Content: flex-1, overflow-y-auto (scroll di sini)
 * 
 * Height behavior:
 * - Konten sedikit: Tinggi mengikuti konten (h-auto)
 * - Konten banyak: Max height = 100dvh - headerHeight (56px)
 * - Scroll hanya di content area, tidak ada nested scroll
 * 
 * @example
 * ```tsx
 * <BottomSheet
 *   open={showSheet}
 *   onOpenChange={setShowSheet}
 *   title="Pilih Operator"
 * >
 *   <LongListContent />
 * </BottomSheet>
 * ```
 */
export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  contentClassName,
  onClose,
  hasSearch = false,
  size,
  maxHeight,
}: BottomSheetProps) {
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen && onClose) {
      onClose();
    }
  };

  // Calculate max height
  const maxHeightStyle = {
    maxHeight: maxHeight || `calc(100dvh - ${HEADER_HEIGHT}px)`,
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "h-auto p-0 flex flex-col",
          "rounded-t-3xl",
          className
        )}
        style={maxHeightStyle}
        showCloseButton={false}
      >
        {/* Accessibility: Radix Dialog requires a Title */}
        <SheetTitle className="sr-only">
          {title || "Bottom sheet"}
        </SheetTitle>

        {/* Drag Handle Bar - shrink-0 agar tidak mengecil */}
        <SheetHandleBar />

        {/* Header - shrink-0 agar tidak mengecil, hanya render jika title ada */}
        {title && (
          <SheetHeader className="flex flex-col gap-1.5 text-left px-4 py-2 shrink-0">
            <div className="text-heading-md font-semibold tracking-tight text-foreground">
              {title}
            </div>
            {/* Selalu render SheetDescription untuk accessibility, sembunyikan jika tidak ada description */}
            <SheetDescription className={cn(
              "text-body-sm text-muted-foreground",
              !description && "sr-only"
            )}>
              {description || `${title} options`}
            </SheetDescription>
          </SheetHeader>
        )}

        {/* Content Area - flex-1 dan overflow-y-auto untuk scroll. Jika tidak ada search, jarak dari title = 16px (SheetHeader pb-2 = 8px + pt-2 = 8px) */}
        <div
          className={cn(
            "flex-1 overflow-y-auto px-4 pb-4 min-h-0",
            !hasSearch && "pt-2",
            contentClassName
          )}
        >
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// =============================================================================
// SELECTOR VARIANT - Untuk list selection dengan banyak items
// =============================================================================

interface SelectorSheetProps extends Omit<BottomSheetProps, "children"> {
  /** Search query state */
  searchQuery?: string;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Callback when search changes */
  onSearchChange?: (query: string) => void;
  /** Whether to show search input */
  showSearch?: boolean;
  /** Threshold to show search (default: 20 items) */
  searchThreshold?: number;
  /** Total items count (to determine if search should show) */
  itemCount?: number;
  /** Content */
  children: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Loading skeleton */
  loadingSkeleton?: React.ReactNode;
}

/**
 * Selector Bottom Sheet variant
 * For list selections (Operator, Bank, Payment Method, etc)
 * 
 * Search input dengan label "Pencarian" dan icon Search
 * Posisi fixed di bawah title, jarak 12px (pt-3)
 * Tidak ikut scroll dengan konten
 */
export function SelectorSheet({
  searchQuery,
  searchPlaceholder = "Cari...",
  onSearchChange,
  showSearch = false,
  searchThreshold = 20,
  itemCount = 0,
  isLoading = false,
  loadingSkeleton,
  children,
  contentClassName,
  ...props
}: SelectorSheetProps) {
  const shouldShowSearch = showSearch && itemCount > searchThreshold;

  return (
    <BottomSheet {...props} hasSearch={shouldShowSearch} contentClassName="flex flex-col min-h-0 p-0">
      <div className="flex flex-col h-full min-h-0">
        {/* Search Area - Jika ada search, jarak dari title = 8px (SheetHeader pb-2 = 8px, pt-0 = 0) */}
        {shouldShowSearch && onSearchChange && (
          <div className="px-4 pt-0 pb-3 shrink-0">
            {/* Input dengan startIcon Search (20px) */}
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              startIcon={<Search className="size-5 text-muted-foreground" />}
            />
          </div>
        )}

        {/* Content - Scrollable area. Jika tidak ada search, jarak dari title = 16px (SheetHeader pb-2 = 8px + pt-2 = 8px) */}
        <div className={cn("flex-1 overflow-y-auto px-4 pb-4 min-h-0", !shouldShowSearch && "pt-2", contentClassName)}>
          {isLoading && loadingSkeleton ? loadingSkeleton : children}
        </div>
      </div>
    </BottomSheet>
  );
}

// =============================================================================
// FORM VARIANT - Untuk form dengan input fields
// =============================================================================

interface FormSheetProps extends Omit<BottomSheetProps, "children"> {
  /** Form content */
  children: React.ReactNode;
  /** Custom max height (e.g. "400px", "80vh") */
  maxHeight?: string;
}

/**
 * Form Bottom Sheet variant
 * For forms and input fields
 * Tinggi mengikuti konten, tapi dibatasi max-height
 */
export function FormSheet({
  children,
  contentClassName,
  maxHeight,
  ...props
}: FormSheetProps) {
  return (
    <BottomSheet 
      {...props} 
      contentClassName={contentClassName}
      maxHeight={maxHeight}
    >
      {children}
    </BottomSheet>
  );
}

// =============================================================================
// ACTION VARIANT (for simple action buttons like Dashboard)
// =============================================================================

interface ActionSheetProps extends Omit<BottomSheetProps, "children"> {
  /** Action items */
  actions: Array<{
    id: string;
    icon: React.ReactNode;
    title: string;
    description?: string;
    onClick: () => void;
    disabled?: boolean;
    badge?: React.ReactNode;
  }>;
}

/**
 * Action Bottom Sheet variant
 * For simple action buttons (like Dashboard transfer options)
 * Hanya untuk konten sedikit (2-5 action items)
 * 
 * Icon size: 40px x 40px (h-10 w-10) - standardized
 * Background: bg-primary/10 (support dark mode)
 */
export function ActionSheet({ actions, contentClassName, ...props }: ActionSheetProps) {
  return (
    <BottomSheet {...props} contentClassName={cn("space-y-3", contentClassName)}>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className={cn(
            "w-full p-4 rounded-xl flex items-center gap-4 border transition-all duration-200 text-left",
            "active:scale-[0.98] touch-manipulation",
            action.disabled
              ? "border-border/30 bg-muted/30 cursor-not-allowed"
              : "border-border bg-card hover:border-primary/30 hover:bg-accent/30"
          )}
        >
          {/* Icon Container - 40px x 40px standardized */}
          <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
            {action.icon}
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-foreground truncate">
              {action.title}
            </div>
            {action.description && (
              <div className="text-[13px] text-muted-foreground truncate">
                {action.description}
              </div>
            )}
          </div>
          {action.badge}
        </button>
      ))}
    </BottomSheet>
  );
}

// =============================================================================
// CONFIRMATION VARIANT
// =============================================================================

interface ConfirmationSheetProps extends Omit<BottomSheetProps, "children"> {
  /** Data items to display (label, value pairs) */
  data: Array<{
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
  }>;
  /** Cancel button label */
  cancelLabel?: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Callback when confirm is clicked */
  onConfirm: () => void;
  /** Whether action is loading */
  isLoading?: boolean;
  /** Confirm button variant */
  confirmVariant?: "default" | "destructive";
}

/**
 * Confirmation Bottom Sheet variant
 * For confirmation dialogs dengan detail data
 * Action buttons diletakkan DI DALAM content area (tidak fixed)
 */
export function ConfirmSheet({
  data,
  cancelLabel = "Batal",
  confirmLabel = "Konfirmasi",
  onCancel,
  onConfirm,
  isLoading = false,
  confirmVariant = "default",
  contentClassName,
  ...props
}: ConfirmationSheetProps) {
  return (
    <BottomSheet {...props} contentClassName={cn("space-y-4", contentClassName)}>
      {/* Detail Card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              "px-4 py-3 flex justify-between items-start",
              index < data.length - 1 && "border-b border-border/50"
            )}
          >
            <span className="text-body-sm text-muted-foreground">
              {item.label}
            </span>
            <span
              className={cn(
                "text-body-sm font-medium text-right max-w-[60%]",
                item.highlight && "text-primary"
              )}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            onCancel?.();
            props.onOpenChange(false);
          }}
          disabled={isLoading}
          className="flex-1 h-12 rounded-xl border border-input bg-background font-semibold text-body-sm hover:bg-accent disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={cn(
            "flex-1 h-12 rounded-xl font-semibold text-body-sm text-white",
            confirmVariant === "destructive"
              ? "bg-destructive hover:bg-destructive/90"
              : "bg-primary hover:bg-primary/90",
            "disabled:opacity-50"
          )}
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Memproses...
            </span>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </BottomSheet>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export { SheetHandleBar };
export type {
  BottomSheetProps,
  SelectorSheetProps,
  ConfirmationSheetProps,
  FormSheetProps,
  ActionSheetProps,
};
