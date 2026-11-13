import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, PanInfo } from "framer-motion";
import { getImageUrl } from "@/lib/helpers/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Banner {
  id: number;
  banner: string;
  title: string;
  information_id?: string;
}

interface BannerCarouselProps {
  banners: Banner[];
  className?: string;
}

export function BannerCarousel({ banners, className }: BannerCarouselProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (banners.length <= 1) return;
    if (info.offset.x > 50) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    } else if (info.offset.x < -50) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }
  };

  const handleBannerClick = (banner: Banner) => {
    // APK logic: if information_id exists, navigate to info detail
    if (banner.information_id && banner.information_id.trim() !== '') {
      const infoId = parseInt(banner.information_id, 10);
      if (!isNaN(infoId)) {
        navigate(`/information/${infoId}`);
      } else {
        toast.error('ID informasi tidak valid');
      }
    }
    // If no information_id, banner is not clickable (just display)
  };

  if (banners.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Banner Container dengan shadow soft dan outline */}
      <div className="relative rounded-2xl overflow-hidden bg-muted shadow-sm ring-1 ring-border/60">
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className={cn(
                "w-full flex-shrink-0",
                banner.information_id && "cursor-pointer"
              )}
              onClick={() => handleBannerClick(banner)}
            >
              <img
                src={getImageUrl(banner.banner, "banner")}
                alt={banner.title}
                className="w-full h-auto object-contain"
                draggable={false}
              />
            </div>
          ))}
        </motion.div>

        {/* Pagination dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
