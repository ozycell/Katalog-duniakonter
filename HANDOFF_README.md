# 🚀 Serpul Mobile App - Developer Handoff

> **Version:** 2.24.38 (Matching APK)  
> **Date:** 25 Maret 2026  
> **Status:** Production Ready ✅

---

## 📦 Package Contents

File zip ini berisi source code lengkap untuk **Serpul Mobile App Web Migration**.

### 🎯 Quick Start untuk Developer Baru

```bash
# 1. Extract zip file
# 2. Masuk ke folder project
cd serpul-mobile-app-handoff

# 3. Install dependencies
npm install

# 4. Jalankan development server
npm run dev

# 5. Buka browser
# http://localhost:8080
```

### 🔧 Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env dengan config yang sesuai
VITE_API_BASE_URL=https://sp2418-api.serpul.co.id
```

---

## 📚 Dokumentasi Penting

| Dokumen | Deskripsi | Wajib Baca |
|---------|-----------|------------|
| [README.md](./README.md) | Quick start & overview | ⭐⭐⭐ |
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Panduan lengkap developer | ⭐⭐⭐ |
| [AGENTS.md](./AGENTS.md) | Guidelines untuk AI agents | ⭐⭐ |
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) | Setup Push Notifications | ⭐⭐ |
| [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) | Setup Google Sign-In | ⭐⭐ |
| [IFRAME_EXTERNAL_PROVIDER.md](./IFRAME_EXTERNAL_PROVIDER.md) | Omni Channel Integration | ⭐ |

---

## 🏗️ Project Structure

```
serpul-mobile-app/
├── src/
│   ├── components/        # React Components
│   │   ├── ui/            # shadcn/ui (50+ components)
│   │   ├── common/        # Shared components (Header, BottomNav, etc)
│   │   ├── design-system/ # App-specific components
│   │   └── layout/        # Layout wrappers
│   ├── pages/             # Page Components
│   │   ├── auth/          # Login, Register, etc
│   │   └── main/          # Dashboard, Transaction, etc
│   ├── services/          # API Services
│   ├── stores/            # Zustand Stores
│   ├── types/             # TypeScript Types
│   ├── lib/               # Utilities
│   └── hooks/             # Custom Hooks
├── public/                # Static assets
├── package.json           # Dependencies
├── vite.config.ts         # Vite config
├── tailwind.config.ts     # Tailwind config
└── tsconfig.json          # TypeScript config
```

---

## ⚡ Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type check
npx tsc --noEmit
```

---

## 🔑 Key Integration Points

### 1. API Base URL
```
Production: https://sp2418-api.serpul.co.id
```

### 2. Required Headers
```typescript
{
  'X-App-Id': '2418',
  'X-App-Version': '2.24.38',
  'X-Platform': 'android'
}
```

### 3. External Services
| Service | Config Key | File |
|---------|------------|------|
| Google Sign-In | `MOBILE_SIGNIN_GOOGLE` | `src/stores/config-store.ts` |
| Firebase FCM | `firebase-config` | `src/lib/firebase.ts` |

---

## 🚨 Important Notes

### Environment Restrictions
- **Google Sign-In** hanya berfungsi di production (tidak di localhost)
- **Firebase FCM** memerlukan HTTPS (kecuali localhost)

### Omni Channel Limitation
- Implementasi saat ini menggunakan **polling approach**
- Backend proxy direkomendasikan untuk solusi jangka panjang
- Lihat `IFRAME_EXTERNAL_PROVIDER.md` untuk detail

---

## 📞 Contact & Support

Jika ada pertanyaan teknis, silakan merujuk ke:

1. **DEVELOPER_GUIDE.md** - Dokumentasi lengkap
2. **AGENTS.md** - Guidelines dan conventions
3. **Integration docs** - Setup guide untuk external services

---

## ✅ Pre-Deployment Checklist

- [ ] `npm run build` berhasil tanpa error
- [ ] `npx tsc --noEmit` lolos type check
- [ ] Environment variables sudah di-set
- [ ] Firebase config sudah dikonfigurasi (jika pakai push notification)
- [ ] Google Client ID sudah di-set (jika pakai Google Sign-In)
- [ ] Testing di staging environment selesai

---

**Selamat mengembangkan! 🚀**

_Last Updated: 25 Maret 2026_
