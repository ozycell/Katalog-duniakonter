import * as React from "react";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/helpers/image";
import { ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";

interface SelectorCardProps {
  /** Title utama - biasanya nama item terpilih atau placeholder */
  title: string;
  /** Subtitle/deskripsi tambahan (opsional) */
  subtitle?: string;
  /** Icon fallback saat tidak ada gambar */
  icon?: React.ReactNode;
  /** URL gambar/logo (opsional) */
  image?: string;
  /** Tipe image untuk getImageUrl helper */
  imageType?: 'payment' | 'operator' | 'product' | 'banner';
  /** Callback saat card diklik */
  onClick?: () => void;
  /** Error state - menampilkan border merah */
  error?: boolean;
  /** Placeholder text saat belum ada pilihan */
  placeholder?: string;
  /** Custom className */
  className?: string;
  /** Background putih saat gambar berhasil load (default: true) */
  dynamicBg?: boolean;
  /** Hide chevron icon (untuk kondisi tidak ada pilihan, misal hanya 1 item) */
  hideChevron?: boolean;
}

/**
 * Selector Card - Komponen reusable untuk memilih item
 * 
 * Digunakan di:
 * - Deposit: Pilih Metode Pembayaran
 * - Transfer Bank: Pilih Bank
 * - Prabayar: Pilih Operator
 * - Pascabayar: Pilih Produk
 * 
 * @example
 * ```tsx
 * <SelectorCard
 *   title={selectedPayment?.payment_name || 'Pilih Metode'}
 *   subtitle={selectedPayment ? `Biaya admin ${formatCurrency(biaya)}` : 'Pilih metode pembayaran'}
 *   image={selectedPayment?.logo}
 *   imageType="payment"
 *   icon={<Wallet className="h-5 w-5 text-primary" />}
 *   onClick={() => setShowSheet(true)}
 *   error={showError && !selectedPayment}
 * />
 * ```
 */
export function SelectorCard({
  title,
  subtitle,
  icon,
  image,
  imageType = 'payment',
  onClick,
  error = false,
  placeholder,
  className,
  dynamicBg = true,
  hideChevron = false,
}: SelectorCardProps) {
  const hasImage = !!image;
  const displayTitle = title || placeholder || 'Pilih';
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Reset state saat image berubah
  React.useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [image]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl flex items-center gap-4 border transition-all duration-200 text-left",
        "active:scale-[0.98] touch-manipulation",
        error
          ? "border-destructive ring-1 ring-destructive bg-card"
          : "border-border bg-card hover:border-primary/30 hover:bg-accent/30",
        className
      )}
    >
      {/* Icon/Image Container - h-10 w-10 (40px) standar */}
      {/* Background transparent saat gambar berhasil load untuk tampilan optimal */}
      {/* Background primary/10 saat tidak ada gambar/error (support dark mode) */}
      <div className={cn(
        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden",
        (hasImage && imageLoaded && !imageError && dynamicBg) ? "bg-transparent" : "bg-primary/10"
      )}>
        {hasImage ? (
          <SafeImage
            src={getImageUrl(image, imageType)}
            alt={displayTitle}
            className="w-full h-full object-cover"
            fallback={icon}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          icon
        )}
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-foreground truncate">
          {displayTitle}
        </p>
        {subtitle && (
          <p className="text-[13px] text-muted-foreground truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Chevron - hide jika tidak ada pilihan (hideChevron=true) */}
      {!hideChevron && (
        <ChevronRight className="h-5 w-5 text-muted-foreground/50 shrink-0" />
      )}
    </button>
  );
}
