/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_APP_ID: string;
  readonly VITE_WHITELABEL_PREFIX: string;
  readonly VITE_WHITELABEL_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
