# 🔗 Iframe External Provider Integration

Dokumentasi untuk integrasi iframe dari provider eksternal (Omni Channel) menggunakan polling approach dengan Backend Proxy sebagai solusi ideal.

> **Versi:** 1.1  
> **Terakhir Update:** 2026-03-15  
> **Status:** Implementation Complete ✅ (Polling Approach)

---

## 📋 Daftar Isi

1. [Overview](#-overview)
2. [Masalah Same-Origin Policy](#-masalah-same-origin-policy)
3. [Solusi yang Tersedia](#-solusi-yang-tersedia)
4. [Implementasi Aktual (Polling)](#-implementasi-aktual-polling)
5. [Solusi Ideal: Backend Proxy](#-solusi-ideal-backend-proxy)
6. [Provider Configuration](#-provider-configuration)
7. [API Endpoints](#-api-endpoints)
8. [Testing](#-testing)
9. [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

Integrasi dengan provider eksternal (Telkomsel, XL, Axis, dll) melalui iframe untuk fitur Omni Channel.

### Arsitektur Aktual (Polling Approach)

```
┌─────────────────────────────────────────────────────────────┐
│  Web App (serpul.app)                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  OmniChannelPage.tsx                                │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Iframe src="https://telkomsel.com/omni"     │ │   │
│  │  │  (Cross-origin - limited access)             │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                       │                           │   │
│  │                       ▼                           │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Polling (500ms interval)                    │ │   │
│  │  │  Try access iframe.contentWindow.location    │ │   │
│  │  │  (Will fail due to same-origin policy)       │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  │                       │                           │   │
│  │                       ▼                           │   │
│  │  ┌───────────────────────────────────────────────┐ │   │
│  │  │  Listen postMessage from provider            │ │   │
│  │  │  (If provider supports it)                   │ │   │
│  │  └───────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                       │                                     │
│                       ▼                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Backend API (sp2418-api.serpul.co.id)              │   │
│  │  POST /openapi/transaction/prabayar-postpaid/inquiry  - Inquiry produk        │   │
│  │  POST /openapi/transaction/prabayar-postpaid/order      - Execute order         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### File Terkait

| File                                 | Deskripsi                                      |
| ------------------------------------ | ---------------------------------------------- |
| `src/lib/iframe/iframe-config.ts`    | Konfigurasi provider & utility functions       |
| `src/pages/main/OmniChannelPage.tsx` | Halaman Omni Channel dengan iframe integration |
| `src/services/product-service.ts`    | API service untuk omniCheckbill & omniOrder    |

---

## 🚫 Masalah Same-Origin Policy

### Batasan Browser

Web browser menerapkan [Same-Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy):

- ❌ Tidak bisa mengakses `contentDocument` iframe eksternal
- ❌ Tidak bisa membaca DOM iframe eksternal
- ❌ Tidak bisa inject script langsung ke iframe eksternal
- ❌ Tidak bisa intercept navigation di iframe cross-origin

### Dampak pada Implementasi

```typescript
// OmniChannelPage.tsx - This will FAIL
try {
  const currentUrl = iframe.contentWindow?.location?.href;
  // ❌ Cross-origin error - can't access location
} catch (e) {
  // Expected error
}
```

---

## ✅ Solusi yang Tersedia

| Solusi              | Status             | Keterangan                                   |
| ------------------- | ------------------ | -------------------------------------------- |
| **Polling**         | ⚠️ Current         | Coba akses iframe location (limited success) |
| **postMessage API** | ⚠️ Partial         | Provider harus mengirim message              |
| **Backend Proxy**   | ✅ **Recommended** | Fetch, modify, serve content                 |

---

## 🔧 Implementasi Aktual (Polling)

### Flow Polling

```typescript
// OmniChannelPage.tsx
const POLL_INTERVAL = 500; // 500ms

useEffect(() => {
  pollIntervalRef.current = setInterval(() => {
    interceptNavigation();
  }, POLL_INTERVAL);
}, []);

const interceptNavigation = () => {
  try {
    // This will fail due to cross-origin
    const currentUrl = iframe.contentWindow?.location?.href;

    // Check if URL matches payment pattern
    if (currentUrl.includes("/payment/")) {
      // Extract payment code
      const paymentCode = extractPaymentCode(currentUrl);
      handleCheckbill(paymentCode);
    }
  } catch (e) {
    // Cross-origin error - expected
  }
};
```

### Listen postMessage (Jika Provider Support)

```typescript
// OmniChannelPage.tsx
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === "PAYMENT_INITIATED") {
      handleCheckbill(event.data.paymentCode);
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, []);
```

### Configuration File

**Lokasi:** `src/lib/iframe/iframe-config.ts`

```typescript
export interface ProviderConfig {
  domain: string;
  selectors: string[];
  embedParams?: Record<string, string>;
  supportsPostMessage?: boolean;
  customCSS?: string;
  needsScriptInjection?: boolean;
}

// Provider configs
export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    domain: "telkomsel.com",
    selectors: [".wrapper-header", ".default-logo", ".header"],
    embedParams: {
      embed: "on",
      header: "false",
      noheader: "true",
      minimal: "true",
    },
    supportsPostMessage: false,
    customCSS: `.wrapper-header { display: none !important; }`,
    needsScriptInjection: true,
  },
  {
    domain: "xl.co.id",
    selectors: [".header", ".navbar", ".main-header"],
    embedParams: { embedded: "true", hideHeader: "true" },
    supportsPostMessage: false,
    customCSS: `.header { display: none !important; }`,
    needsScriptInjection: true,
  },
  {
    domain: "axis.co.id",
    selectors: [".header", ".main-nav", ".top-header"],
    embedParams: { embed: "true" },
    supportsPostMessage: false,
    customCSS: `.header { display: none !important; }`,
    needsScriptInjection: true,
  },
];
```

### Utility Functions

```typescript
// Get provider config by URL
export function getProviderConfig(url: string): ProviderConfig | null {
  try {
    const urlObj = new URL(url);
    return (
      PROVIDER_CONFIGS.find((config) =>
        urlObj.hostname.includes(config.domain)
      ) || null
    );
  } catch {
    return null;
  }
}

// Generate embed URL with params
export function getEmbedUrl(originalUrl: string, phoneNumber?: string): string {
  try {
    const urlObj = new URL(originalUrl);
    const config = getProviderConfig(originalUrl);

    if (config?.embedParams) {
      Object.entries(config.embedParams).forEach(([key, value]) => {
        urlObj.searchParams.set(key, value);
      });
    }

    if (phoneNumber) {
      urlObj.searchParams.set("phone", phoneNumber);
      urlObj.searchParams.set("msisdn", phoneNumber);
      urlObj.searchParams.set("destination", phoneNumber);
    }

    return urlObj.toString();
  } catch {
    return originalUrl;
  }
}
```

---

## 🏗️ Solusi Ideal: Backend Proxy

### Konsep

Backend bertindak sebagai proxy yang:

1. Fetch HTML dari provider
2. Modifikasi HTML (hapus header, inject script)
3. Serve ke web app dengan domain Serpul (same-origin)

### API Endpoints (Jika Implementasi Proxy)

#### 1. Proxy Page

```http
GET /openapi/omni/proxy?page={provider_url}&destination={phone_number}
```

**Response:** Modified HTML dengan injected CSS/Script

#### 2. Proxy Assets

```http
GET /openapi/omni/proxy/asset?url={asset_url}
```

### Implementasi Node.js (Reference)

```typescript
// routes/omni-proxy.ts
import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const router = express.Router();

const ALLOWED_PROVIDERS = ["telkomsel.com", "xl.co.id", "axis.co.id"];

router.get("/proxy", async (req, res) => {
  const { page, destination } = req.query;

  // Fetch dari provider
  const response = await axios.get(page as string);
  const $ = cheerio.load(response.data);

  // 1. Hapus header
  $("header, .header, .navbar").remove();

  // 2. Rewrite asset URLs
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) {
      const absoluteUrl = new URL(href, page as string).href;
      $(el).attr(
        "href",
        `/openapi/omni/proxy/asset?url=${encodeURIComponent(absoluteUrl)}`
      );
    }
  });

  // 3. Inject control script
  const script = `
    (function() {
      // Intercept navigation
      const originalAssign = window.location.assign;
      window.location.assign = function(url) {
        if (url.includes('/payment/')) {
          const match = url.match(/payment\/([^\/]+)/);
          if (match) {
            window.parent.postMessage({
              type: 'OMNI_PAYMENT_DETECTED',
              paymentCode: match[1]
            }, '*');
            return;
          }
        }
        return originalAssign.apply(this, arguments);
      };
    })();
  `;
  $("head").append(`<script>${script}</script>`);

  res.send($.html());
});
```

---

## ⚙️ Provider Configuration

### Menambah Provider Baru

Edit `src/lib/iframe/iframe-config.ts`:

```typescript
{
  domain: 'provider-domain.com',
  selectors: ['.header', '.navbar'],
  embedParams: {
    'embedded': 'true',
    'hideHeader': 'true'
  },
  supportsPostMessage: false,
  customCSS: `
    .header { display: none !important; }
    .navbar { display: none !important; }
  `,
  needsScriptInjection: true
}
```

### Whitelist Provider

| Provider  | Domain                 | Embed Params                     |
| --------- | ---------------------- | -------------------------------- |
| Telkomsel | telkomsel.com, tsel.me | `?embed=on&header=false`         |
| XL        | xl.co.id               | `?embedded=true&hideHeader=true` |
| Axis      | axis.co.id             | `?embed=true`                    |

---

## 🔌 API Endpoints

### Omni Checkbill (Inquiry)

**Request:**

```http
POST /openapi/transaction/prabayar-postpaid/inquiry
Content-Type: application/json

{
  "payment_code": "PAY123456"
}
```

**Response:**

```json
{
  "status": true,
  "message": "Success",
  "description": "Paket Data Telkomsel 10GB",
  "price": "50000",
  "invoice": "INV-20240315-001",
  "detail": [
    { "key": "Produk", "value": "Telkomsel Data" },
    { "key": "Nominal", "value": "10GB" }
  ]
}
```

### Omni Order (Payment)

**Request:**

```http
POST /openapi/transaction/prabayar-postpaid/order
Content-Type: application/json

{
  "invoice": "INV-20240315-001",
  "pin": "123456"
}
```

---

## 🧪 Testing

### Test Flow

1. **Buka halaman Prabayar**
2. **Pilih kategori Omni Channel**
3. **Pilih provider** (Telkomsel/XL/Axis)
4. **Input nomor telepon**
5. **Klik Beli** → Navigate ke OmniChannelPage
6. **Iframe load** dengan embed params
7. **User selesai transaksi** di iframe provider
8. **Sistem detect payment** (via polling/postMessage)
9. **Show confirmation sheet** dengan detail produk
10. **User konfirmasi** → API omniOrder

### Verifikasi postMessage

```javascript
// DevTools Console
window.addEventListener("message", (e) => {
  console.log("Received:", e.data);
  // Expected: { type: 'PAYMENT_INITIATED', paymentCode: '...' }
});
```

---

## 🔍 Troubleshooting

### Issue: "Iframe tidak bisa diakses (cross-origin)"

**Penyebab:** Same-origin policy browser.

**Solusi:**

- Provider harus mengirim postMessage
- Atau implementasi Backend Proxy

### Issue: "Polling tidak detect payment"

**Penyebab:**

- Can't access iframe location due to cross-origin
- URL pattern berbeda

**Solusi:**

```typescript
// Update pattern matching di OmniChannelPage.tsx
if (currentUrl.includes("/payment/") || currentUrl.includes("/checkout/")) {
  // Extract payment code
}
```

### Issue: "Header provider masih muncul"

**Penyebab:**

- Embed params tidak didukung provider
- CSS injection tidak berfungsi (cross-origin)

**Solusi:**

- Backend Proxy (solusi paling kuat)
- Koordinasi dengan provider untuk support params

---

## ✅ Checklist Setup

- [ ] Provider whitelist di konfigurasi
- [ ] Embed params dikonfigurasi per provider
- [ ] Polling interval diatur (500ms)
- [ ] postMessage listener diaktifkan
- [ ] API endpoint `/openapi/transaction/prabayar-postpaid/inquiry` tersedia
- [ ] API endpoint `/openapi/transaction/prabayar-postpaid/order` tersedia
- [ ] Error handling untuk cross-origin errors
- [ ] (Optional) Implementasi Backend Proxy

---

## 🆘 Support

Jika mengalami masalah:

1. **Check browser console** untuk cross-origin errors
2. **Verifikasi embed params** di URL iframe
3. **Test postMessage** dengan provider
4. **Consider Backend Proxy** untuk solusi permanen

---

**Last Updated:** 2026-03-15  
**Maintainer:** Development Team
