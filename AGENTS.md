# Serpul Mobile App — Agent Guidelines

> **Project**: Serpul Mobile App  
> **Version**: 2.25.44  
> **Language**: Indonesian (Bahasa Indonesia)  
> **Last Updated**: 12 Mei 2026

---

## 📋 Project Overview

Aplikasi web modern untuk platform Serpul menggunakan React + TypeScript + Vite.

### Core Features

- **Authentication**: Login, registration, OTP verification, PIN management
- **Transactions**: Prepaid (prabayar) and postpaid (pascabayar) purchases
- **Transfers**: Member-to-member and bank transfers
- **Deposits**: Top-up balance
- **Downline**: MLM network management
- **History**: Transaction history

---

## 🛠️ Technology Stack

| Layer                | Technology           | Version  |
| -------------------- | -------------------- | -------- |
| **Build Tool**       | Vite                 | ^5.4.19  |
| **Framework**        | React                | ^18.3.1  |
| **Language**         | TypeScript           | ^5.8.3   |
| **Styling**          | Tailwind CSS         | ^3.4.17  |
| **UI Components**    | shadcn/ui + Radix UI | Latest   |
| **State Management** | Zustand              | ^5.0.11  |
| **HTTP Client**      | Axios                | ^1.13.5  |
| **Forms**            | React Hook Form      | ^7.61.1  |
| **Validation**       | Zod                  | ^3.25.76 |
| **Routing**          | React Router DOM     | ^6.30.1  |
| **Animation**        | Framer Motion        | ^12.34.0 |

---

## 🔧 Build Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:8080)
npm run dev

# Production build (MUST PASS before committing)
npm run build

# TypeScript type check (MUST PASS)
npx tsc --noEmit
```

### Pre-Commit Checklist

- [ ] `npm run build` succeeds without errors
- [ ] `npx tsc --noEmit` passes (no type errors)
- [ ] No `console.log` debug statements (except for error handling)
- [ ] No `debugger` statements left in code

---

## 📱 Mobile Build (Optional — Capacitor)

This project supports building as a native Android APK via **Capacitor**. Capacitor dependencies are in `optionalDependencies` — they are NOT installed by default for pure web development.

### Setup Capacitor for Mobile Build

```bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Generate capacitor.config.ts (or create manually)
npx cap init MyApp com.example.app --web-dir dist

# 3. Add Android platform
npx cap add android

# 4. Build web assets and sync
npm run build
npx cap sync android

# 5. Open in Android Studio
npx cap open android
```

### Cross-Platform Pattern in Code

All Capacitor imports use **dynamic import** with `Capacitor.isNativePlatform()` guard:

```typescript
import { Capacitor } from '@capacitor/core';

if (Capacitor.isNativePlatform()) {
  const { Camera } = await import('@capacitor/camera');
  // ...native-only code
}
```

This ensures the web version runs perfectly in the browser without Capacitor installed.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── common/                # Shared components
│   ├── design-system/         # Design system components
│   ├── layout/                # Layout system
│   └── providers/             # Context providers
├── pages/
│   ├── auth/                  # Auth pages
│   └── main/                  # Main app pages
│       ├── account/           # Account settings
│       ├── contacts/          # Contacts
│       ├── content/           # Legal content
│       ├── deposit/           # Top-up
│       ├── downline/          # MLM/Referral
│       ├── information/       # Info pages
│       └── transaction/       # Transactions
├── services/                  # API services
├── stores/                    # Zustand stores
├── types/                     # TypeScript types
├── lib/                       # Utilities
├── hooks/                     # Custom hooks
└── config/                    # Configuration
```

---

## 🎨 Code Style Guidelines

### Import Order

```typescript
// 1. React and third-party libraries
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2. Absolute imports (@/ alias)
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

// 3. Relative imports
import { MyComponent } from "./MyComponent";
```

### Naming Conventions

| Type               | Convention                       | Example                       |
| ------------------ | -------------------------------- | ----------------------------- |
| Components         | PascalCase                       | `BalanceCard`, `LoginForm`    |
| Functions          | camelCase                        | `handleSubmit`, `formatPhone` |
| Files (kebab-case) | `auth-service.ts`, `use-auth.ts` |
| Hooks              | camelCase with `use`             | `useAuthStore`                |

---

## 🚨 Critical Rules

### NEVER DO

1. **Never modify APK reference logic** - Business logic must match original
2. **Never skip type checking** - Always run `npx tsc --noEmit`
3. **Never use `any` type** - Use proper TypeScript types
4. **Never rewrite entire files** - Use StrReplaceFile for targeted edits

### ALWAYS DO

1. **Check project structure first** before creating new files
2. **Use CSS variables** for theming: `hsl(var(--primary))`
3. **Follow field name mapping** exactly as documented
4. **Test before committing**: `npm run build && npx tsc --noEmit`

---

## 📞 Important Files Reference

| Purpose          | Path                         |
| ---------------- | ---------------------------- |
| API Client       | `src/lib/api/client.ts`      |
| Auth Store       | `src/stores/auth-store.ts`   |
| Config Store     | `src/stores/config-store.ts` |
| Type Definitions | `src/types/models.ts`        |
| Global Styles    | `src/index.css`              |
| App Router       | `src/App.tsx`                |

---

## ✅ Definition of Done

A task is complete when:

- [ ] Code implemented following project patterns
- [ ] `npm run build` succeeds (0 errors)
- [ ] `npx tsc --noEmit` passes (0 type errors)
- [ ] No `console.log` debug statements
- [ ] Manual testing completed

---

**Remember**: Always follow existing code patterns and conventions!
