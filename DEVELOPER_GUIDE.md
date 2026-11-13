# Serpul Mobile App - Developer Guide

> **Dokumen Panduan untuk Tim Pengembang Internal**  
> **Versi:** 2.24.38  
> **Last Updated:** 25 Maret 2026

---

## 📋 Daftar Isi

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Component Architecture](#4-component-architecture)
5. [Design System](#5-design-system)
6. [API Integration](#6-api-integration)
7. [State Management](#7-state-management)
8. [Routing & Navigation](#8-routing--navigation)
9. [Development Guidelines](#9-development-guidelines)
10. [Troubleshooting](#10-troubleshooting)
11. [External Integrations](#11-external-integrations)

---

## 1. Project Overview

### 1.1 Deskripsi Proyek

Serpul Mobile App adalah migrasi web dari aplikasi Android native Serpul (v2.24.38). Aplikasi ini adalah platform PPOB (Payment Point Online Bank) yang menyediakan layanan:

- **Prabayar:** Pulsa, data, voucher game, dll.
- **Pascabayar:** PLN, PDAM, BPJS, dll.
- **Transfer:** Sesama member dan antar bank
- **Deposit:** Top-up saldo
- **Downline:** Manajemen MLM/referral

### 1.2 Tujuan Migrasi

- ✅ Konversi Android native ke web responsive
- ✅ Support multi-platform (Web, Android WebView, iOS WebView)
- ✅ Maintainable & customizable codebase
- ✅ Modern tech stack dengan TypeScript

---

## 2. Technology Stack

### 2.1 Core Technologies

| Layer                | Technology        | Version  | Kegunaan            |
| -------------------- | ----------------- | -------- | ------------------- |
| **Build Tool**       | Vite              | ^5.4.19  | Build & dev server  |
| **Framework**        | React             | ^18.3.1  | UI library          |
| **Language**         | TypeScript        | ^5.8.3   | Type safety         |
| **Styling**          | Tailwind CSS      | ^3.4.17  | Utility-first CSS   |
| **Routing**          | React Router DOM  | ^6.30.1  | Client-side routing |
| **State Management** | Zustand           | ^5.0.11  | Global state        |
| **HTTP Client**      | Axios             | ^1.13.5  | API calls           |
| **Forms**            | React Hook Form   | ^7.61.1  | Form handling       |
| **Validation**       | Zod               | ^3.25.76 | Schema validation   |
| **UI Components**    | shadcn/ui + Radix | Latest   | Base components     |
| **Animation**        | Framer Motion     | ^12.34.0 | Animations          |
| **Toast**            | Sonner            | ^1.7.4   | Notifications       |
| **Icons**            | Lucide React      | ^0.462.0 | Icon library        |

### 2.2 Dev Tools

| Tool                | Purpose          |
| ------------------- | ---------------- |
| ESLint              | Code linting     |
| TypeScript Compiler | Type checking    |
| Vitest              | Unit testing     |
| Vite SWC Plugin     | Fast compilation |

---

## 3. Project Structure

### 3.1 Root Directory

```
D:\Yuscorp-Dev\serpul-mobile-app\
│
├── 📁 src/                        ← 🚀 MAIN SOURCE CODE
├── 📁 public/                     ← Static assets
├── 📁 dist/                       ← Build output (generated)
├── 📄 package.json                ← Dependencies & scripts
├── 📄 vite.config.ts              ← Vite configuration
├── 📄 tailwind.config.ts          ← Tailwind CSS config
├── 📄 tsconfig.json               ← TypeScript config
├── 📄 README.md                   ← Quick start
├── 📄 AGENTS.md                   ← Agent guidelines
└── 📄 DEVELOPER_GUIDE.md          ← ← YOU ARE HERE
```

### 3.2 Source Code Structure (src/)

```
src/
├── 📁 components/                 ← React Components
│   ├── 📁 ui/                     ← shadcn/ui components (50 files)
│   ├── 📁 common/                 ← Shared components (11 files)
│   │   ├── AppLogo.tsx
│   │   ├── BottomNav.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Header.tsx
│   │   ├── HtmlContent.tsx
│   │   ├── InfoBanner.tsx
│   │   ├── PinOtpInput.tsx
│   │   ├── ScanBarcode.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── AddContactForm.tsx
│   │   └── index.ts              ← Barrel exports
│   │
│   ├── 📁 design-system/          ← Design system components
│   │   ├── ActionButtonGroup.tsx
│   │   ├── ActionOption.tsx
│   │   ├── AmountInput.tsx
│   │   ├── BannerCarousel.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── DataList.tsx
│   │   ├── DestinationInput.tsx
│   │   ├── GradientCard.tsx
│   │   ├── HistoryListCard.tsx
│   │   ├── LoadingState.tsx
│   │   ├── LogoImage.tsx
│   │   ├── MenuItem.tsx
│   │   ├── PageTabs.tsx
│   │   ├── QuickAmountGrid.tsx
│   │   ├── SelectorCard.tsx
│   │   ├── SelectorList.tsx
│   │   ├── TransactionDetail.tsx
│   │   └── index.ts              ← Barrel exports
│   │
│   ├── 📁 layout/                 ← Layout components
│   │   ├── AuthShell.tsx
│   │   ├── BottomAction.tsx
│   │   ├── PageContent.tsx
│   │   ├── PageShell.tsx
│   │   └── index.ts              ← Barrel exports
│   │
│   └── 📁 providers/              ← Context providers
│       ├── config-provider.tsx
│       └── theme-provider.tsx
│
├── 📁 pages/                      ← Page Components
│   ├── 📁 auth/                   ← Auth pages (6 files)
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── SetupPinPage.tsx
│   │   └── VerifyOtpPage.tsx
│   │
│   ├── 📁 main/                   ← Main app pages
│   │   ├── 📁 account/            ← Account settings (11 files)
│   │   ├── 📁 contacts/           ← Contacts (1 file)
│   │   ├── 📁 content/            ← Legal content (4 files)
│   │   ├── 📁 deposit/            ← Deposit (2 files)
│   │   ├── 📁 downline/           ← MLM/Referral (3 files)
│   │   ├── 📁 information/        ← Info pages (2 files)
│   │   ├── 📁 transaction/        ← Transactions
│   │   │   ├── 📁 pascabayar/     ← Postpaid
│   │   │   ├── 📁 prabayar/       ← Prepaid
│   │   │   ├── 📁 transfer/       ← Transfers
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── PinTransactionPage.tsx
│   │   │   └── TransactionDetailPage.tsx
│   │   │
│   │   ├── DashboardPage.tsx
│   │   ├── HistoryPage.tsx
│   │   ├── MyAccountPage.tsx
│   │   ├── HelpPage.tsx
│   │   ├── ReportPage.tsx
│   │   ├── ContactUsPage.tsx
│   │   ├── OmniChannelPage.tsx
│   │   └── PrinterPage.tsx
│   │
│   ├── ErrorPage.tsx
│   └── SplashPage.tsx
│
├── 📁 layouts/                    ← Layout wrappers
│   ├── AuthLayout.tsx
│   └── MainLayout.tsx
│
├── 📁 services/                   ← API Services
│   ├── account-service.ts
│   ├── app-service.ts
│   ├── auth-service.ts
│   ├── contact-service.ts
│   ├── deposit-service.ts
│   ├── downline-service.ts
│   ├── google-auth-service.ts
│   ├── printer-service.ts
│   ├── product-service.ts
│   ├── transaction-service.ts
│   └── transfer-service.ts
│
├── 📁 stores/                     ← Zustand Stores
│   ├── auth-store.ts
│   └── config-store.ts
│
├── 📁 types/                      ← TypeScript Types
│   ├── api.ts
│   └── models.ts
│
├── 📁 lib/                        ← Utilities
│   ├── 📁 api/
│   │   └── client.ts              ← Axios config
│   ├── 📁 contacts/
│   │   └── contact-bridge.ts
│   ├── 📁 helpers/
│   │   ├── badge-variants.ts
│   │   ├── image.ts
│   │   ├── index.ts               ← Barrel exports
│   │   ├── operator-helper.ts
│   │   └── phone.ts
│   ├── 📁 iframe/
│   │   └── iframe-config.ts
│   ├── 📁 validators/
│   │   └── auth.ts
│   ├── animation.ts
│   ├── design-system.ts
│   ├── firebase.ts
│   ├── layout-variants.ts
│   ├── typography.ts
│   └── utils.ts
│
├── 📁 hooks/                      ← Custom Hooks
│   ├── useDebounce.ts
│   ├── useMobile.ts
│   ├── usePageLayout.ts
│   ├── useWebContacts.ts
│   └── index.ts                   ← Barrel exports
│
├── 📁 config/                     ← Configuration
│   ├── brand.ts
│   └── whitelabel.ts
│
├── App.tsx                        ← Main app + routing
├── main.tsx                       ← Entry point
└── index.css                      ← Global styles
```

---

## 4. Component Architecture

### 4.1 Component Categories

| Category              | Location                    | Purpose                          |
| --------------------- | --------------------------- | -------------------------------- |
| **UI Components**     | `components/ui/`            | Base shadcn/ui components        |
| **Common Components** | `components/common/`        | Shared app components            |
| **Design System**     | `components/design-system/` | App-specific reusable components |
| **Layout Components** | `components/layout/`        | Layout wrappers & shells         |
| **Page Components**   | `pages/`                    | Route-level components           |

### 4.2 Component Import Patterns

**✅ Preferred: Barrel Exports**

```typescript
// Good - Use barrel exports
import { Header, BottomNav } from "@/components/common";
import { AmountInput, SelectorCard } from "@/components/design-system";
import { Button, Card } from "@/components/ui";
```

**❌ Avoid: Direct imports**

```typescript
// Avoid - Don't use direct imports
import { Header } from "@/components/common/Header";
import { AmountInput } from "@/components/design-system/AmountInput";
```

### 4.3 Creating New Components

**Naming Convention:**

- Components: `PascalCase.tsx`
- Utils/Hooks: `camelCase.ts`
- Types: `PascalCase` (interface) or `camelCase` (type alias)

**File Template:**

```typescript
// src/components/design-system/NewComponent.tsx
import { cn } from "@/lib/utils";

interface NewComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export function NewComponent({ className, children }: NewComponentProps) {
  return <div className={cn("base-classes", className)}>{children}</div>;
}
```

**Export in index.ts:**

```typescript
// src/components/design-system/index.ts
export { NewComponent } from "./NewComponent";
export type { NewComponentProps } from "./NewComponent";
```

---

## 5. Design System

### 5.1 Color System

**Primary Colors (HSL):**

```css
--primary: 238 62% 54%; /* #4045D5 */
--primary-hover: 238 62% 48%;
--primary-active: 238 62% 42%;
--primary-subtle: 238 62% 96%;
```

**Semantic Colors:**

```css
--destructive: 354 70% 54%; /* Red */
--success: 151 84% 39%; /* Emerald */
--warning: 38 92% 50%; /* Amber */
```

**Usage:**

```typescript
// Tailwind classes
className = "bg-primary text-primary-foreground";
className = "bg-destructive text-destructive-foreground";
```

### 5.2 Typography Scale

| Token             | Size | Usage           |
| ----------------- | ---- | --------------- |
| `text-display-lg` | 28px | Hero numbers    |
| `text-display-md` | 24px | Large titles    |
| `text-heading-lg` | 18px | Page titles     |
| `text-heading-md` | 16px | Card titles     |
| `text-body-lg`    | 16px | Primary body    |
| `text-body-md`    | 15px | Secondary body  |
| `text-label-md`   | 14px | Buttons, labels |
| `text-caption`    | 12px | Metadata        |

### 5.3 Spacing System

**Layout Constants:**

```typescript
// From lib/layout-variants.ts
HEADER_HEIGHT = 56px
BOTTOM_NAV_HEIGHT = 56px
BOTTOM_ACTION_HEIGHT = 80px
```

**Padding Presets:**

```typescript
pb-20      // 80px - For action buttons
pb-[72px]  // 72px - For bottom nav
pb-4       // 16px - Minimal
```

### 5.4 Key Components

#### AmountInput

```typescript
import { AmountInput } from "@/components/design-system";

<AmountInput
  modern
  value={amount}
  onChange={setAmount}
  min={10000}
  minErrorMessage="Minimal Rp 10.000"
/>;
```

#### SelectorCard

```typescript
import { SelectorCard } from "@/components/design-system";

<SelectorCard
  title={selectedBank?.product_name || "Pilih Bank"}
  subtitle="Pilih bank tujuan"
  image={selectedBank?.logo}
  imageType="payment"
  icon={<Landmark />}
  onClick={() => setShowSheet(true)}
/>;
```

#### Header

```typescript
import { Header } from "@/components/common";

<Header title="Transfer" showBack showBackLabel showChatUs />;
```

---

## 6. API Integration

### 6.1 API Client Setup

**Base URL:** `https://sp2418-api.serpul.co.id`

**Required Headers:**

```typescript
{
  'X-App-Id': '2418',
  'X-App-Version': '2.24.38',
  'X-Platform': 'android',
  'Authorization': 'Bearer <token>'
}
```

### 6.2 Service Pattern

```typescript
// services/example-service.ts
import apiClient from "@/lib/openapi/client";

export const ExampleService = {
  async getData() {
    const response = await apiClient.get("/openapi/endpoint");
    return response;
  },

  async postData(data: RequestType) {
    const response = await apiClient.post("/openapi/endpoint", data);
    return response;
  },
};
```

### 6.3 Error Handling

```typescript
import { getErrorMessage, getFieldError } from "@/lib/openapi/client";

try {
  await SomeService.doSomething(data);
} catch (error) {
  // General error
  toast.error(getErrorMessage(error, "Terjadi kesalahan"));

  // Field-specific error
  const fieldError = getFieldError(error, "field_name");
  if (fieldError) {
    setError(fieldError);
  }
}
```

### 6.4 API Endpoints Reference

#### Authentication

| Endpoint                          | Method | Description               |
| --------------------------------- | ------ | ------------------------- |
| `/openapi/v4/auth/login`          | POST   | Login with phone/password |
| `/openapi/v4/auth/register`       | POST   | Register new account      |
| `/openapi/v3/auth/login-gmail`    | POST   | Login with Google         |
| `/openapi/v3/auth/register-gmail` | POST   | Register with Google      |

#### Account

| Endpoint                               | Method | Description                |
| -------------------------------------- | ------ | -------------------------- |
| `/openapi/customer`                    | GET    | Get profile data           |
| `/openapi/customer/update-data-outlet` | POST   | Update outlet data         |
| `/openapi/customer/gmail-update`       | POST   | Connect Google account     |
| `/openapi/customer/password-update`    | POST   | Change password            |
| `/openapi/v2/customer/pin/modify`      | POST   | Change PIN                 |
| `/openapi/v2/customer/pin-trx/modify`  | POST   | Change transaction PIN     |
| `/openapi/customer/upgrade`            | POST   | Upgrade account to premium |
| `/openapi/customer/verification`       | POST   | Submit verification data   |

#### Transactions

| Endpoint                                  | Method | Description            |
| ----------------------------------------- | ------ | ---------------------- |
| `/openapi/history/prabayar`               | GET    | Get prabayar history   |
| `/openapi/history/pascabayar`             | GET    | Get pascabayar history |
| `/openapi/history/transfer`               | GET    | Get transfer history   |
| `/openapi/history/deposit`                | GET    | Get deposit history    |
| `/openapi/transaction/prabayar/order`     | POST   | Create prabayar order  |
| `/openapi/transaction/pascabayar/inquiry` | POST   | Check postpaid bill    |
| `/openapi/transaction/pascabayar/order`   | POST   | Pay postpaid bill      |
| `/openapi/transfer`                       | POST   | Transfer to member     |
| `/openapi/sendmoney/send`                 | POST   | Send money to bank     |

#### Products

| Endpoint                       | Method | Description               |
| ------------------------------ | ------ | ------------------------- |
| `/openapi/prabayar/category`   | GET    | Get prabayar categories   |
| `/openapi/prabayar/operator`   | GET    | Get operators by category |
| `/openapi/prabayar/product`    | GET    | Get products by operator  |
| `/openapi/pascabayar/category` | GET    | Get pascabayar categories |
| `/openapi/pascabayar/product`  | GET    | Get pascabayar products   |

#### Deposit

| Endpoint              | Method | Description         |
| --------------------- | ------ | ------------------- |
| `/openapi/v2/payment` | GET    | Get payment methods |
| `/openapi/v2/deposit` | POST   | Create deposit      |

#### Downline

| Endpoint                     | Method | Description         |
| ---------------------------- | ------ | ------------------- |
| `/openapi/referral/downline` | GET    | Get downline list   |
| `/openapi/referral/komisi`   | GET    | Get commission list |
| `/openapi/referral/create`   | POST   | Create new downline |
| `/openapi/withdrawal`        | POST   | Request withdrawal  |

---

## 7. State Management

### 7.1 Zustand Stores

#### Auth Store

```typescript
import { useAuthStore } from "@/stores/auth-store";

// Get state
const { user, token, isAuthenticated } = useAuthStore();

// Call actions
const login = useAuthStore((state) => state.login);
const logout = useAuthStore((state) => state.logout);
```

#### Config Store

```typescript
import { useConfigStore } from "@/stores/config-store";

// Get config
const config = useConfigStore((state) => state.getConfig());
const addOns = useConfigStore((state) => state.getAddOns());

// Check feature
const hasPremium = useConfigStore((state) =>
  state.checkFeature("MIX_ADDON_MEMBER_PREMIUM")
);
```

---

## 8. Routing & Navigation

### 8.1 Route Structure

```typescript
// App.tsx routes
<Route path="/" element={<SplashPage />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/dashboard" element={<DashboardPage />} />
<Route path="/history" element={<HistoryPage />} />
<Route path="/deposit" element={<DepositPage />} />
<Route path="/transfer/member" element={<TransferMemberPage />} />
<Route path="/transfer/bank" element={<TransferBankPage />} />
<Route path="/prabayar" element={<PrabayarPage />} />
<Route path="/pascabayar" element={<PascabayarPage />} />
<Route path="/downline" element={<DownlinePage />} />
<Route path="/information" element={<InformationPage />} />
<Route path="/my-account" element={<MyAccountPage />} />
```

### 8.2 Navigation

```typescript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate to page
navigate("/dashboard");

// Go back
navigate(-1);
```

---

## 9. Development Guidelines

### 9.1 Code Style

**Import Order:**

```typescript
// 1. React & third-party
import { useState } from "react";

// 2. Absolute imports (@/)
import { Button } from "@/components/ui/button";

// 3. Relative imports
import { MyComponent } from "./MyComponent";
```

### 9.2 Form Handling

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  phone: z.string().min(10, "Nomor HP minimal 10 digit"),
  amount: z.number().min(10000, "Minimal Rp 10.000"),
});

type FormData = z.infer<typeof schema>;

function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await submitData(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>
  );
}
```

### 9.3 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Type check
npx tsc --noEmit
```

### 9.4 Pre-Commit Checklist

- [ ] `npm run build` succeeds
- [ ] `npx tsc --noEmit` passes
- [ ] No `console.log` debug statements
- [ ] No `debugger` statements

---

## 10. Troubleshooting

### 10.1 Common Issues

**Build Errors:**

```bash
# Clear cache
rm -rf dist
npm run build

# Reinstall dependencies
rm -rf node_modules
npm install
```

**Type Errors:**

- Check `types/models.ts` for API response types
- Ensure interfaces match API responses
- Use `strict: false` in tsconfig.json (already set)

### 10.2 Debug Tips

**Check API Calls:**

```typescript
// Add logging in service
console.log("API Response:", response);
```

**Check State:**

```typescript
// Add logging in component
const user = useAuthStore((state) => state.user);
console.log("Current user:", user);
```

---

## 11. External Integrations

### 11.1 Google Sign-In

**Important:** Google Sign-In hanya tersedia di **production environment**. Tidak berfungsi di localhost atau IP addresses.

**Service:** `src/services/google-auth-service.ts`

**Usage:**

```typescript
import { GoogleAuthService } from "@/services/google-auth-service";

// Check environment support
if (GoogleAuthService.isOriginAllowed()) {
  // Initialize Google Sign-In button
  GoogleAuthService.initializeButton(
    clientId,
    "google-button-container",
    (response) => {
      // Handle credential
      GoogleAuthService.handleGoogleLogin(
        response.credential,
        onSuccess,
        onEmailNotRegistered,
        onNotRegistered,
        onError
      );
    }
  );
}
```

**See:** [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) untuk setup lengkap.

### 11.2 Iframe External Provider (Omni Channel)

Integrasi dengan provider eksternal (Telkomsel, XL, Axis) melalui iframe.

**Problem:** Same-Origin Policy membatasi akses ke iframe eksternal.
**Current Solution:** Polling approach (try access iframe location + postMessage listener)
**Recommended Solution:** Backend proxy yang fetch, modify, dan serve konten provider.

**Files:**

- `src/lib/iframe/iframe-config.ts` - Provider configurations
- `src/pages/main/OmniChannelPage.tsx` - Iframe integration

**Configuration:**

```typescript
// src/lib/iframe/iframe-config.ts
export const PROVIDER_CONFIGS: ProviderConfig[] = [
  {
    domain: "telkomsel.com",
    selectors: [".header", ".navbar"],
    embedParams: { embed: "on" },
    supportsPostMessage: false,
    customCSS: ".header { display: none !important; }",
    needsScriptInjection: true,
  },
];
```

**See:** [IFRAME_EXTERNAL_PROVIDER.md](./IFRAME_EXTERNAL_PROVIDER.md) untuk spesifikasi lengkap.

---

## 📚 Dokumentasi Lengkap

| Dokumen                                                      | Kegunaan                                            |
| ------------------------------------------------------------ | --------------------------------------------------- |
| [README.md](./README.md)                                     | Quick start & overview                              |
| [AGENTS.md](./AGENTS.md)                                     | Guidelines untuk AI agents                          |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)                   | Panduan lengkap (dokumen ini)                       |
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)                     | Setup Firebase Cloud Messaging (Push Notifications) |
| [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md)               | Setup Google Sign-In (Production Only)              |
| [IFRAME_EXTERNAL_PROVIDER.md](./IFRAME_EXTERNAL_PROVIDER.md) | Integrasi Omni Channel via Backend Proxy            |

---

## ✅ Definition of Done

A task is complete when:

- [ ] Code implemented following patterns
- [ ] `npm run build` succeeds (0 errors)
- [ ] `npx tsc --noEmit` passes (0 type errors)
- [ ] Manual testing completed

---

**Happy Coding! 🚀**
