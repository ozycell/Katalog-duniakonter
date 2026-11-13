# 🔐 Google Authentication Setup Guide

Dokumentasi untuk setup Google Sign-In (Google Identity Services) di Serpul Web App.

> **Versi:** 1.0  
> **Terakhir Update:** 2026-03-15  
> **Status:** Production Only ⚠️

---

## 📋 Daftar Isi

1. [Overview](#-overview)
2. [Prerequisites](#-prerequisites)
3. [Google Cloud Console Setup](#-google-cloud-console-setup)
4. [Configuration Options](#-configuration-options)
5. [Backend API Integration](#-backend-api-integration)
6. [Environment Support](#-environment-support)
7. [Testing](#-testing)
8. [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

Google Sign-In memungkinkan user login menggunakan akun Google mereka. Implementasi menggunakan **Google Identity Services (GIS)** - library modern dari Google yang menggantikan Google Sign-In Platform Library yang lama.

### Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│  Web App (serpul.app)                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Google Sign-In Button                              │   │
│  │  (Google Identity Services)                         │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                     │
│                       ▼                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Google OAuth Server                                │   │
│  │  - Verifikasi consent                               │   │
│  │  - Return ID Token (JWT)                            │   │
│  └────────────────────┬────────────────────────────────┘   │
│                       │                                     │
│                       ▼                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Backend API (sp2418-api.serpul.co.id)              │   │
│  │  POST /openapi/auth/login-gmail                      │   │
│  │  - Validasi Google JWT                              │   │
│  │  - Return access_token atau register flow           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### File Terkait

| File                                  | Deskripsi                             |
| ------------------------------------- | ------------------------------------- |
| `src/services/google-auth-service.ts` | Google Auth service & GIS integration |
| `src/pages/auth/LoginPage.tsx`        | Halaman login dengan Google button    |
| `src/pages/auth/RegisterPage.tsx`     | Registrasi dengan Google              |
| `index.html`                          | Google Identity Services script       |

---

## ✅ Prerequisites

- [ ] Akses ke [Google Cloud Console](https://console.cloud.google.com)
- [ ] Project dengan domain production (bukan localhost)
- [ ] Backend API endpoint `/openapi/auth/login-gmail` tersedia
- [ ] Config `MOBILE_SIGNIN_GOOGLE` di `/openapi/v2/asset` (untuk client ID)
- [ ] Google Identity Services script di `index.html`

---

## 🔧 Google Cloud Console Setup

### Step 1: Create/Select Project

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru atau pilih project existing
3. Pastikan project sudah aktif

### Step 2: Enable Google Identity Services

1. Navigasi ke **APIs & Services** → **Library**
2. Search "Google Identity Services"
3. Klik **Enable**

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Pilih **External** (untuk public app) atau **Internal** (untuk organization)
3. Fill required fields:
   - **App name**: Serpul
   - **User support email**: support@serpul.co.id
   - **Developer contact**: dev@serpul.co.id
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (untuk testing)
6. Submit untuk verification (production)

### Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Klik **Create Credentials** → **OAuth client ID**
3. Pilih **Web application**
4. Fill details:
   - **Name**: Serpul Web
   - **Authorized JavaScript origins**:
     ```
     https://serpul.co.id
     https://www.serpul.co.id
     ```
   - **Authorized redirect URIs**:
     ```
     https://serpul.co.id/auth/callback
     ```
5. Klik **Create**
6. **Copy Client ID** - simpan untuk konfigurasi

### Step 5: Copy Client ID

```
Client ID: 123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

---

## ⚙️ Configuration Options

### Option A: Environment Variables (Lokal/Dev)

**Note:** Google Sign-In tidak berfungsi di localhost! Lihat [Environment Support](#-environment-support).

```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

### Option B: Backend API (Production - Direkomendasikan)

Cocok untuk production karena config dapat diupdate tanpa rebuild aplikasi.

**Config Key:** `MOBILE_SIGNIN_GOOGLE` (dari `/openapi/v2/asset` → `dataConfiguration`)

**Config Store:** `src/stores/config-store.ts`

```typescript
getGoogleClientId: () => {
  const configs = get().getDataConfiguration();
  const config = configs.find((c) => c.config_id === "MOBILE_SIGNIN_GOOGLE");
  return config?.value || null;
};
```

**API Response:**

```json
{
  "status": true,
  "data": {
    "application": { ... },
    "dataAddon": [ ... ],
    "dataConfiguration": [
      {
        "config_id": "MOBILE_SIGNIN_GOOGLE",
        "value": "123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com",
        "status": "ACTIVE"
      }
    ]
  }
}
```

**index.html:**

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

---

## 🔌 Backend API Integration

### API Endpoint: Login Gmail

**Request:**

```http
POST /openapi/auth/login-gmail
Content-Type: application/json

{
  "gmailToken": "eyJhbGciOiJSUzI1NiIs...",
  "gmailEmail": "user@gmail.com",
  "gmailName": "John Doe"
}
```

**Success Response (200):**

```json
{
  "status": true,
  "data": {
    "access_token": "jwt_token_here",
    "customer": "{\"id\":123,\"name\":\"John Doe\"...}"
  }
}
```

**Error: Email Not Registered (200 dengan err_code):**

```json
{
  "status": true,
  "data": {
    "err_code": "ERR_EMAIL_NOT_REGISTERED",
    "message": "Email belum terdaftar"
  }
}
```

**Error: Not Registered (200 dengan err_code):**

```json
{
  "status": true,
  "data": {
    "err_code": "ERR_NOT_REGISTERED",
    "message": "User belum terdaftar"
  }
}
```

### Error Code Handling

| Error Code                 | Flow                                                     |
| -------------------------- | -------------------------------------------------------- |
| `ERR_EMAIL_NOT_REGISTERED` | Redirect ke halaman register dengan pre-fill data Google |
| `ERR_NOT_REGISTERED`       | Redirect ke halaman register dengan pre-fill data Google |
| (none)                     | Login success, simpan token                              |

---

## 🌍 Environment Support

### ⚠️ IMPORTANT: Production Only

Google Sign-In menggunakan **Google Identity Services (GIS)** yang memiliki batasan keamanan:

| Environment                      | Status               | Keterangan                             |
| -------------------------------- | -------------------- | -------------------------------------- |
| **Production** (`serpul.co.id`)  | ✅ Supported         | Domain terverifikasi di Google Cloud   |
| **Localhost** (`localhost:8080`) | ❌ **NOT Supported** | GIS memblokir localhost & IP addresses |
| **IP Address** (`192.168.x.x`)   | ❌ **NOT Supported** | GIS memblokir IP addresses             |
| **Staging**                      | ⚠️ Conditional       | Harus domain public dengan HTTPS       |

### Implementasi Environment Check

```typescript
// src/services/google-auth-service.ts
isOriginAllowed: (): boolean => {
  const hostname = window.location.hostname;
  return (
    hostname !== "localhost" &&
    !hostname.includes("127.") &&
    !hostname.includes("192.168.") &&
    !hostname.includes("10.")
  );
};
```

### UX untuk Non-Production

```tsx
{
  !GoogleAuthService.isOriginAllowed() && (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Google Sign-In hanya tersedia di production environment. Gunakan login
        dengan nomor HP untuk development.
      </AlertDescription>
    </Alert>
  );
}
```

---

## 🧪 Testing

### Production Testing

1. Deploy ke production domain
2. Buka halaman login
3. Klik **"Sign in with Google"** button
4. Pilih akun Google
5. Verifikasi login berhasil

### Test Scenarios

| Scenario              | Expected Result                           |
| --------------------- | ----------------------------------------- |
| Email sudah terdaftar | Login sukses, redirect ke dashboard       |
| Email belum terdaftar | Redirect ke register dengan pre-fill data |
| User cancel           | Kembali ke login page                     |
| Invalid origin        | Button disabled dengan warning            |

---

## 🔍 Troubleshooting

### Issue: "Google Sign-In tidak muncul di localhost"

**Penyebab:** Google Identity Services memblokir localhost.

**Solusi:**

- Gunakan **ngrok** untuk public URL:
  ```bash
  npx ngrok http 8080
  # Use https://xxx.ngrok.io untuk testing
  ```
- Atau test langsung di production environment

### Issue: "Error: origin_mismatch"

**Penyebab:** Domain tidak terdaftar di Google Cloud Console.

**Solusi:**

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit OAuth client ID
4. Tambahkan domain ke **Authorized JavaScript origins**

### Issue: "Error: invalid_client"

**Penyebab:** Client ID salah atau project tidak aktif.

**Solusi:**

- Verifikasi `VITE_GOOGLE_CLIENT_ID` di environment
- Pastikan project aktif di Google Cloud

### Issue: "Button tidak render"

**Penyebab:** Google Identity Services tidak ter-load.

**Solusi:**

```html
<!-- Pastikan script di index.html -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Issue: "API return ERR_EMAIL_NOT_REGISTERED terus"

**Penyebab:** Email Google belum ter-link dengan akun Serpul.

**Solusi:**

- User perlu register terlebih dahulu
- Atau implement auto-register dengan data Google

---

## ✅ Checklist Setup

- [ ] Create project di Google Cloud Console
- [ ] Enable Google Identity Services API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 Web client ID
- [ ] Add authorized JavaScript origins (production domain)
- [ ] Copy Client ID ke environment/backend
- [ ] Implement `/openapi/auth/login-gmail` endpoint
- [ ] Test di production environment
- [ ] Handle error codes (ERR_EMAIL_NOT_REGISTERED, ERR_NOT_REGISTERED)

---

## 🆘 Support

Jika mengalami masalah:

1. **Check Google Identity Services loaded:**

   ```javascript
   console.log(window.google?.accounts?.id);
   ```

2. **Verify origin allowed:**

   ```javascript
   console.log("Origin allowed:", GoogleAuthService.isOriginAllowed());
   ```

3. **Check Google Cloud Console:**

   - Pastikan domain di-authorized
   - Verifikasi OAuth consent screen status

4. **Lihat dokumentasi resmi:**
   - [Google Identity Services](https://developers.google.com/identity/gsi/web)
   - [GIS Reference](https://developers.google.com/identity/gsi/web/reference/js-reference)

---

**Last Updated:** 2026-03-15  
**Maintainer:** Development Team

---

## ⚠️ Important Notes

### Development Workflow

```
Development (localhost)
  └── Gunakan Login dengan Nomor HP (bukan Google)

Production (serpul.co.id)
  └── Google Sign-In tersedia
```

### Security Considerations

1. **Never expose Client Secret** di frontend
2. **Always verify ID Token** di backend
3. **Use HTTPS only** untuk production
4. **Implement proper CSRF protection**
