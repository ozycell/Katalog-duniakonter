/**
 * Whitelabel Configuration - Vite version
 */
export const whitelabelConfig = {
  brand: {
    name: "Serpul",
    tagline: "Solusi Digital Terpercaya",
    description: "Platform layanan digital terlengkap",
    logo: {
      default: "/logo.png",
      height: 56,
      maxHeight: 64,
      minHeight: 40,
      color: "#4045D5",
      altText: "Serpul Logo",
    },
    favicon: "/favicon.ico",
    icons: {
      apple: "/apple-touch-icon.png",
      android: "/android-chrome-192x192.png",
    },
  },
  colors: {
    primary: "4045D5",
  },
  ui: {
    radius: "0.625rem",
    fontFamily: {
      sans: "Inter, ui-sans-serif, system-ui, sans-serif",
      mono: "ui-monospace, monospace",
    },
    container: {
      mobile: "448px",
      tablet: "512px",
      desktop: "576px",
      wide: "1152px",
    },
  },
  features: {
    showReferral: true,
    showUpgradeAccount: true,
    enableTransfer: true,
    enableDownline: true,
    enableIslamic: true,
    enablePrinter: true,
  },
  contact: {
    phone: "",
    email: "support@serpul.co.id",
    whatsapp: "",
    website: "https://sp2418.serpul.co.id",
  },
  api: {
    baseUrl: import.meta.env.VITE_API_URL || "https://sp2418-api.serpul.co.id",
    siteUrl: import.meta.env.VITE_SITE_URL || "https://sp2418.serpul.co.id",
    appId: import.meta.env.VITE_APP_ID || "2418",
    version: "2.24.38",
  },
} as const;

export type WhitelabelConfig = typeof whitelabelConfig;

export function generateColorPalette(primaryHex: string) {
  const hex = primaryHex.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const lighten = (factor: number) => {
    const newR = Math.round(r + (255 - r) * factor);
    const newG = Math.round(g + (255 - g) * factor);
    const newB = Math.round(b + (255 - b) * factor);
    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  };

  const darken = (factor: number) => {
    const newR = Math.round(r * (1 - factor));
    const newG = Math.round(g * (1 - factor));
    const newB = Math.round(b * (1 - factor));
    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  };

  return {
    50: lighten(0.93),
    100: lighten(0.87),
    200: lighten(0.74),
    300: lighten(0.61),
    400: lighten(0.48),
    500: lighten(0.35),
    600: `#${hex}`,
    700: darken(0.2),
    800: darken(0.4),
    900: darken(0.6),
  };
}

export function getPrimaryColor(): string {
  return whitelabelConfig.colors.primary;
}

export function getPrimaryPalette() {
  return generateColorPalette(whitelabelConfig.colors.primary);
}

export function getLogoUrl(apiLogo?: string | null): string {
  if (apiLogo) {
    if (apiLogo.startsWith("http")) return apiLogo;
    return `${whitelabelConfig.api.siteUrl}${apiLogo}`;
  }
  return whitelabelConfig.brand.logo.default;
}

export default whitelabelConfig;
