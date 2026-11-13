import * as React from "react";
import { cn } from "@/lib/utils";

// =============================================================================
// DATALIST COMPONENT
// =============================================================================

export interface DataListProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * DataList
 * Container untuk menampilkan list data transaksi yang rapih (misal: di BottomSheet konfirmasi).
 * Memberikan styling default: bg-card, rounded-xl, border, dan overflow-hidden.
 */
export function DataList({ className, children, ...props }: DataListProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// =============================================================================
// DATALISTITEM COMPONENT
// =============================================================================

export interface DataListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Label atau key teks di sebelah kiri */
  label: React.ReactNode;
  /** Value teks di sebelah kanan */
  value: React.ReactNode;
  /** 
   * Jika true, row ini akan distyling menonjol (highlight).
   * Biasanya digunakan untuk baris "Total Bayar".
   */
  highlight?: boolean;
}

/**
 * DataListItem
 * Baris individual di dalam DataList. 
 * Secara otomatis menghapus border bawah (border-b-0) pada elemen terakhir menggunakan CSS class `last:border-b-0`.
 */
export function DataListItem({
  className,
  label,
  value,
  highlight = false,
  ...props
}: DataListItemProps) {
  if (highlight) {
    return (
      <div
        className={cn(
          "px-4 py-3 flex justify-between items-start bg-primary/5 last:border-b-0",
          className
        )}
        {...props}
      >
        <span className="text-body-sm font-semibold text-foreground">{label}</span>
        <span className="text-[15px] font-semibold text-primary text-right flex-1 ml-4 break-words">
          {value}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "px-4 py-3 border-b border-border/50 flex justify-between items-start last:border-b-0",
        className
      )}
      {...props}
    >
      <span className="text-body-sm text-muted-foreground">{label}</span>
      <span className="text-[15px] font-medium text-foreground text-right flex-1 ml-4 break-words">
        {value}
      </span>
    </div>
  );
}
