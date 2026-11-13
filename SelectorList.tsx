/**
 * SelectorList Component - Reusable list for bottom sheet selection
 * 
 * Digunakan di:
 * - DepositPage: Payment method list (grouped by category)
 * - TransferBankPage: Bank list (flat with search)
 * - PrabayarPage: Operator list (flat with search)
 * - PascabayarPage: Product list (flat with search)
 * 
 * Features:
 * - Flat or grouped layout
 * - Image/icon support with SafeImage
 * - Search integration (via SelectorSheet)
 * - Full-width touch areas
 * - Selected state indicator
 * - Separator between items
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { getImageUrl, ImageType } from "@/lib/helpers/image";
import { SafeImage } from "@/components/ui/safe-image";
import { CheckCircle2, LucideIcon } from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

interface BaseItem {
  id: string | number;
  title: string;
  subtitle?: string;
}

interface ImageItem extends BaseItem {
  image: string;
  imageType: ImageType;
  icon?: never;
}

interface IconItem extends BaseItem {
  icon: React.ReactNode;
  image?: never;
  imageType?: never;
}

type SelectorItem = ImageItem | IconItem;

interface SelectorGroup {
  caption: string;
  items: SelectorItem[];
}

interface SelectorListProps {
  /** Items untuk flat list (alternatif dari groups) */
  items?: SelectorItem[];
  /** Groups untuk list dengan kategori */
  groups?: SelectorGroup[];
  /** ID item yang sedang dipilih */
  selectedId?: string | number | null;
  /** Callback saat item dipilih */
  onSelect: (item: SelectorItem) => void;
  /** Custom className untuk container */
  className?: string;
  /** Custom className untuk item */
  itemClassName?: string;
  /** Layout mode - card (with border) atau full-width */
  layout?: 'card' | 'full-width';
  /** Custom render untuk leading (image/icon container) */
  renderLeading?: (item: SelectorItem) => React.ReactNode;
  /** Custom render untuk title */
  renderTitle?: (item: SelectorItem) => React.ReactNode;
  /** Custom render untuk subtitle */
  renderSubtitle?: (item: SelectorItem) => React.ReactNode;
  /** Custom render untuk trailing (selected indicator) */
  renderTrailing?: (item: SelectorItem, isSelected: boolean) => React.ReactNode;
  /** Placeholder jika list kosong */
  emptyPlaceholder?: React.ReactNode;
  /** Whether to show separator between items */
  showSeparator?: boolean;
}

// =============================================================================
// DEFAULT RENDERERS
// =============================================================================

function DefaultLeading(item: SelectorItem) {
  // State untuk tracking image load
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  
  // Reset state saat item berubah
  React.useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [item.image, item.title]);

  const hasImage = 'image' in item && !!item.image;

  if (hasImage) {
    // Container: bg-transparent saat gambar load, bg-primary/10 saat error/loading
    // Fallback: tanpa background (sudah di-handle container)
    const showTransparent = imageLoaded && !imageError;
    return (
      <div className={cn(
        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden",
        showTransparent ? "bg-transparent" : "bg-primary/10"
      )}>
        <SafeImage
          src={getImageUrl(item.image, item.imageType || 'general')}
          alt={item.title}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          fallback={
            // Fallback tanpa background - container sudah handle
            <span className="text-primary font-semibold text-sm">
              {item.title.charAt(0).toUpperCase()}
            </span>
          }
        />
      </div>
    );
  }

  if ('icon' in item && item.icon) {
    return (
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        {item.icon}
      </div>
    );
  }

  // Fallback - support dark mode
  return (
    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-primary font-semibold text-sm">
        {item.title.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function DefaultTitle(item: SelectorItem) {
  return (
    <span className="text-[15px] font-semibold text-foreground truncate">
      {item.title}
    </span>
  );
}

function DefaultSubtitle(item: SelectorItem) {
  if (!item.subtitle) return null;
  return (
    <span className="text-[13px] text-muted-foreground line-clamp-2">
      {item.subtitle}
    </span>
  );
}

function DefaultTrailing(_item: SelectorItem, isSelected: boolean) {
  if (!isSelected) return null;
  return <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />;
}

// =============================================================================
// FLAT LIST ITEM
// =============================================================================

interface ListItemProps {
  item: SelectorItem;
  isSelected: boolean;
  onClick: () => void;
  layout: 'card' | 'full-width';
  renderLeading: (item: SelectorItem) => React.ReactNode;
  renderTitle: (item: SelectorItem) => React.ReactNode;
  renderSubtitle: (item: SelectorItem) => React.ReactNode;
  renderTrailing: (item: SelectorItem, isSelected: boolean) => React.ReactNode;
  showSeparator: boolean;
  isLast: boolean;
}

function ListItem({
  item,
  isSelected,
  onClick,
  layout,
  renderLeading,
  renderTitle,
  renderSubtitle,
  renderTrailing,
  showSeparator,
  isLast,
}: ListItemProps) {
  const content = (
    <>
      {renderLeading(item)}
      <div className="flex-1 min-w-0 text-left">
        {renderTitle(item)}
        {renderSubtitle(item)}
      </div>
      {renderTrailing(item, isSelected)}
    </>
  );

  if (layout === 'card') {
    return (
      <>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 transition-colors border-0",
            "cursor-pointer hover:bg-accent active:bg-accent/80",
            isSelected && "bg-primary/5"
          )}
        >
          {content}
        </button>
        {showSeparator && !isLast && (
          <div className="h-px bg-border/50 mx-4" />
        )}
      </>
    );
  }

  // full-width layout
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 transition-colors",
          "hover:bg-accent/50 active:bg-accent/80",
          isSelected && "bg-primary/5"
        )}
      >
        {content}
      </button>
      {showSeparator && !isLast && (
        <div className="h-px bg-border/50 mx-4" />
      )}
    </>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SelectorList({
  items,
  groups,
  selectedId,
  onSelect,
  className,
  itemClassName,
  layout = 'card',
  renderLeading: customRenderLeading,
  renderTitle: customRenderTitle,
  renderSubtitle: customRenderSubtitle,
  renderTrailing: customRenderTrailing,
  emptyPlaceholder,
  showSeparator = true,
}: SelectorListProps) {
  const renderLeading = customRenderLeading || DefaultLeading;
  const renderTitle = customRenderTitle || DefaultTitle;
  const renderSubtitle = customRenderSubtitle || DefaultSubtitle;
  const renderTrailing = customRenderTrailing || DefaultTrailing;

  // Handle grouped list (like DepositPage payment methods)
  if (groups && groups.length > 0) {
    return (
      <div className={cn("space-y-6", className)}>
        {groups.map((group, groupIndex) => (
          <div key={`${group.caption}-${groupIndex}`}>
            {/* Wrapper melebar untuk title + list supaya sejajar */}
            <div className="-mx-4">
              {/* Kategori title */}
              <h3 className="text-label-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
                {group.caption}
              </h3>
              {/* List items */}
              <div className={cn(itemClassName)}>
                {group.items.map((item, index) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    isSelected={selectedId === item.id}
                    onClick={() => onSelect(item)}
                    layout="full-width"
                    renderLeading={renderLeading}
                    renderTitle={renderTitle}
                    renderSubtitle={renderSubtitle}
                    renderTrailing={renderTrailing}
                    showSeparator={showSeparator}
                    isLast={index === group.items.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Handle flat list (like Bank, Operator, Product selectors)
  if (items && items.length > 0) {
    if (layout === 'card') {
      return (
        <div className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card",
          className
        )}>
          {items.map((item, index) => (
            <ListItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              onClick={() => onSelect(item)}
              layout="card"
              renderLeading={renderLeading}
              renderTitle={renderTitle}
              renderSubtitle={renderSubtitle}
              renderTrailing={renderTrailing}
              showSeparator={showSeparator}
              isLast={index === items.length - 1}
            />
          ))}
        </div>
      );
    }

    // full-width flat list
    return (
      <div className={cn("-mx-4", className)}>
        {items.map((item, index) => (
          <ListItem
            key={item.id}
            item={item}
            isSelected={selectedId === item.id}
            onClick={() => onSelect(item)}
            layout="full-width"
            renderLeading={renderLeading}
            renderTitle={renderTitle}
            renderSubtitle={renderSubtitle}
            renderTrailing={renderTrailing}
            showSeparator={showSeparator}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (emptyPlaceholder) {
    return <div className={className}>{emptyPlaceholder}</div>;
  }

  return null;
}

// =============================================================================
// EXPORTS
// =============================================================================

export type { SelectorItem, SelectorGroup, SelectorListProps };
