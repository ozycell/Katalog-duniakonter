# Serpul Mobile App - Web Migration

**Version:** 2.24.38 (Matching APK)  
**Stack:** React 18, TypeScript 5, Tailwind CSS 3, Vite 5  
**Status:** ✅ Production Ready

---

## 📚 Dokumentasi

| Dokumen | Kegunaan |
|---------|----------|
| [README.md](./README.md) | Quick start & overview (dokumen ini) |
| [AGENTS.md](./AGENTS.md) | Guidelines untuk AI agents |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Panduan lengkap untuk developer |
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) | Setup Firebase Cloud Messaging (Push Notifications) |
| [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) | Setup Google Sign-In (Production Only) |
| [IFRAME_EXTERNAL_PROVIDER.md](./IFRAME_EXTERNAL_PROVIDER.md) | Integrasi Omni Channel via Backend Proxy |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development server (http://localhost:8080)
npm run dev

# Production build
npm run build

# Type check
npx tsc --noEmit
```

---

## 🎯 Project Overview

Migrasi aplikasi Android native Serpul (v2.24.38) menjadi aplikasi web modern menggunakan React + TypeScript.

### Fitur Utama

- **Prabayar:** Pulsa, data, voucher game
- **Pascabayar:** PLN, PDAM, BPJS
- **Transfer:** Sesama member & antar bank
- **Deposit:** Top-up saldo
- **Downline:** Manajemen MLM/referral

### Tech Stack

| Layer | Technology |
|-------|------------|
| Build Tool | Vite |
| Framework | React 18 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS |
| State | Zustand |
| Routing | React Router DOM |
| Forms | React Hook Form + Zod |

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (50 files)
│   ├── common/          # Shared components (11 files)
│   ├── design-system/   # App-specific components
│   └── layout/          # Layout wrappers
├── pages/
│   ├── auth/            # Auth pages
│   └── main/            # Main app pages
│       ├── account/     # Account settings
│       ├── contacts/    # Contacts
│       ├── content/     # Legal content
│       ├── deposit/     # Top-up
│       ├── downline/    # MLM/Referral
│       ├── information/ # Info pages
│       └── transaction/ # Transactions
├── services/            # API services
├── stores/              # Zustand stores
├── types/               # TypeScript types
├── lib/                 # Utilities
└── hooks/               # Custom hooks
```

---

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npx tsc --noEmit` | Type check |

---

## ✅ Definition of Done

- [ ] `npm run build` succeeds
- [ ] `npx tsc --noEmit` passes
- [ ] No `console.log` debug statements
- [ ] Manual testing completed

---

**Last Updated:** 25 Maret 2026
