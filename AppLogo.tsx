import { useConfigStore } from "@/stores/config-store";
import { getLogoUrl } from "@/config/whitelabel";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  height?: number;
  className?: string;
  invert?: boolean;
  fallbackText?: string;
}

export function AppLogo({ height = 32, className, invert = true, fallbackText = "SERPUL" }: AppLogoProps) {
  const config = useConfigStore.getState().getConfig();
  const logoSrc = getLogoUrl(invert ? (config?.logo_header_white || config?.logo_header_color) : (config?.logo_header_color || config?.logo_header_white));

  return (
    <img
      src={logoSrc}
      alt="Serpul"
      className={cn(invert && className)}
      style={{ height: `${height}px`, width: 'auto' }}
      onError={(e) => {
        const el = e.target as HTMLImageElement;
        const span = document.createElement('span');
        span.className = cn(
          'font-semibold',
          height > 40 ? 'text-display-sm' : 'text-body-lg',
          invert ? 'text-white' : 'text-primary'
        );
        span.textContent = fallbackText;
        el.replaceWith(span);
      }}
    />
  );
}
