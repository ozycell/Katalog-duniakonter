# 🔥 Firebase FCM Setup Guide - Push Notifications

**Dokumen ini menjelaskan cara setup Firebase Cloud Messaging (FCM) untuk push notifications di Serpul Web App.**

> **Versi:** 1.0  
> **Terakhir Update:** 2026-02-25  
> **Status:** Implementation Complete ✅

---

## 📋 Daftar Isi

1. [Overview](#-overview)
2. [Prerequisites](#-prerequisites)
3. [Firebase Project Setup](#-firebase-project-setup)
4. [Web App Registration](#-web-app-registration)
5. [Configuration Options](#-configuration-options)
6. [Backend API Integration](#-backend-api-integration)
7. [Testing](#-testing)
8. [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

Aplikasi Serpul Web menggunakan Firebase Cloud Messaging (FCM) untuk mengirim push notifications ke browser pengguna. Fitur ini setara dengan `FireMessagingService.java` di APK Android.

### Arsitektur

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Firebase FCM   │────▶│   Browser    │◀────│   Backend API   │
│   (Google)      │     │  (Service    │     │  (sp2418-api)   │
│                 │     │   Worker)    │     │                 │
└─────────────────┘     └──────────────┘     └─────────────────┘
                                ▲                    │
                                │                    │
                         ┌──────┴──────┐            │
                         │  Web App    │◀───────────┘
                         │  (React)    │   POST /openapi/
                         └─────────────┘   update-firebase-token
```

### File Terkait

| File | Deskripsi |
|------|-----------|
| `src/lib/firebase.ts` | Firebase SDK initialization |
| `public/firebase-messaging-sw.js` | Service Worker untuk background notifications |
| `src/pages/main/AboutAppPage.tsx` | UI untuk test notifications |
| `src/services/app-service.ts` | API calls untuk Firebase token |

---

## ✅ Prerequisites

Sebelum mulai setup, pastikan:

- [ ] Akses ke [Firebase Console](https://console.firebase.google.com)
- [ ] Project backend API dapat diakses
- [ ] Domain aplikasi sudah diketahui (contoh: `https://serpul.co.id`)

---

## 🔧 Firebase Project Setup

### Step 1: Create Firebase Project

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Klik **"Add project"** atau pilih project existing
3. Ikuti wizard setup:
   - Enable Google Analytics (opsional tapi direkomendasikan)
   - Pilih Analytics account
4. Tunggu project selesai dibuat

### Step 2: Enable Cloud Messaging

1. Di sidebar Firebase Console, klik **Project Settings** (gear icon)
2. Pilih tab **Cloud Messaging**
3. Di bagian **Web Push certificates**:
   - Klik **"Generate key pair"** untuk Web Push certificate
   - Simpan **Key pair** (ini adalah VAPID key)

---

## 🌐 Web App Registration

### Step 3: Register Web App

1. Di Project Settings, scroll ke bawah ke bagian **"Your apps"**
2. Klik icon **"</>"** (Web) untuk menambahkan web app
3. Isi **App nickname** (contoh: "Serpul Web")
4. **Optional**: Centang "Also set up Firebase Hosting"
5. Klik **"Register app"**

### Step 4: Copy Firebase Config

Setelah register, Firebase akan menampilkan config seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

**Simpan config ini** untuk langkah berikutnya.

---

## ⚙️ Configuration Options

Ada **2 cara** untuk mengkonfigurasi Firebase di aplikasi:

### Option A: Environment Variables (Lokal/Dev)

Cocok untuk development atau jika tidak punya akses backend.

1. Copy file `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

2. Isi dengan Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
   VITE_FIREBASE_VAPID_KEY=BLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. Restart development server

### Option B: Backend API (Production - Direkomendasikan)

Cocok untuk production karena config dapat diupdate tanpa rebuild aplikasi.

Backend perlu menyediakan endpoint:

**Endpoint:** `GET /openapi/firebase-config`

**Response:**
```json
{
  "status": true,
  "data": {
    "api_key": "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "auth_domain": "your-project-id.firebaseapp.com",
    "project_id": "your-project-id",
    "storage_bucket": "your-project-id.appspot.com",
    "messaging_sender_id": "123456789012",
    "app_id": "1:123456789012:web:abcdef1234567890abcdef",
    "vapid_key": "BLxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

Aplikasi akan otomatis fetch config dari API saat startup.

---

## 🔌 Backend API Integration

### API Endpoints yang Diperlukan

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/openapi/firebase-config` | GET | Mengembalikan Firebase web config |
| `/openapi/update-firebase-token` | POST | Menerima FCM token dari client |

### Endpoint 1: Firebase Config

**Request:**
```http
GET /openapi/firebase-config
```

**Success Response (200):**
```json
{
  "status": true,
  "data": {
    "api_key": "AIzaSy...",
    "auth_domain": "your-project.firebaseapp.com",
    "project_id": "your-project-id",
    "storage_bucket": "your-project.appspot.com",
    "messaging_sender_id": "123456789",
    "app_id": "1:123456789:web:abc",
    "vapid_key": "BL..."
  }
}
```

**Error Response (404/500):**
```json
{
  "status": false,
  "message": "Firebase config not available"
}
```

### Endpoint 2: Update FCM Token

**Request:**
```http
POST /openapi/update-firebase-token
Content-Type: application/json

{
  "firebase_token": "fcm_token_dari_browser...",
  "verify": true
}
```

**Response:**
```json
{
  "status": true,
  "message": "Token updated successfully"
}
```

**Parameter:**
- `firebase_token` (string, required): FCM token dari browser
- `verify` (boolean, optional): Jika `true`, kirim notifikasi tes

---

## 🧪 Testing

### Step 5: Test di Aplikasi

1. Buka halaman **"Tentang Aplikasi"** di aplikasi web
2. Scroll ke bagian **"Uji Notifikasi"**
3. Klik tombol **"Kirim Notifikasi Tes"**
4. Browser akan meminta izin notifikasi → Klik **"Allow"**

**Expected Flow:**
```
1. Browser popup: "serpul.co.id ingin menampilkan notifikasi"
2. User klik "Allow"
3. FCM Token didapatkan
4. Token dikirim ke backend (/openapi/update-firebase-token)
5. Toast success: "FCM Token terdaftar!"
6. Notifikasi lokal muncul: "FCM Token terdaftar..."
7. (Opsional) Server kirim push notification test
```

### Step 6: Test dari Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project → **Cloud Messaging**
3. Klik **"Send your first message"** atau **"New notification"**
4. Isi:
   - **Notification title**: "Test dari Firebase"
   - **Notification text**: "Hello World!"
5. Klik **"Send test message"**
6. Masukkan FCM token yang didapat dari browser
7. Klik **"Test"**

**Expected:** Notifikasi muncul di browser.

---

## 🔍 Troubleshooting

### Issue: "Browser tidak mendukung notifikasi"

**Penyebab:** Browser tidak support Web Push API.

**Solusi:**
- Gunakan browser modern (Chrome, Firefox, Edge, Safari 16+)
- Pastikan HTTPS aktif (localhost juga boleh)

### Issue: "Gagal mendapatkan FCM token"

**Penyebab:**
1. Firebase config salah
2. Service Worker tidak terdaftar
3. VAPID key tidak valid

**Solusi:**
```bash
# 1. Check console log untuk error detail
# 2. Verifikasi service worker terdaftar:
#    - Buka DevTools → Application → Service Workers
#    - Pastikan "firebase-messaging-sw.js" muncul

# 3. Check VAPID key:
#    - Harus dimulai dengan "BL" atau "BE"
```

### Issue: "Server tidak menerima FCM token"

**Penyebab:** Backend endpoint belum diimplementasi.

**Solusi:**
- Implementasi endpoint `/openapi/update-firebase-token`
- atau Gunakan environment variables saja (fallback mode)

### Issue: Service Worker 404

**Penyebab:** File `firebase-messaging-sw.js` tidak ditemukan.

**Solusi:**
```bash
# Pastikan file ada di public folder
ls public/firebase-messaging-sw.js

# Jika tidak ada, copy dari repo:
cp node_modules/firebase/... # atau buat manual
```

### Issue: Notifikasi tidak muncul di background

**Penyebab:** Service Worker tidak aktif atau config mismatch.

**Solusi:**
1. Check DevTools → Application → Service Workers
2. Pastikan SW "activated and is running"
3. Check console SW untuk error
4. Refresh halaman dan coba lagi

---

## 📚 Referensi

### Dokumentasi Resmi

- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [FCM Web Setup](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications)

### Code Files

| File | Lokasi |
|------|--------|
| Firebase Utils | `src/lib/firebase.ts` |
| Service Worker | `public/firebase-messaging-sw.js` |
| Test UI | `src/pages/main/AboutAppPage.tsx` |
| API Service | `src/services/app-service.ts` |

---

## ✅ Checklist Setup

- [ ] Create Firebase Project
- [ ] Register Web App
- [ ] Copy Firebase Config
- [ ] Setup environment variables atau API endpoint
- [ ] Test notifikasi dari aplikasi
- [ ] Test notifikasi dari Firebase Console
- [ ] Verifikasi service worker aktif
- [ ] Dokumentasikan VAPID key di backend

---

## 🆘 Support

Jika mengalami masalah:

1. Check browser console untuk error log
2. Verifikasi config di DevTools → Application → Local Storage
3. Test dengan environment variables dulu sebelum API
4. Lihat [Firebase Docs](https://firebase.google.com/docs/cloud-messaging/js/receive) untuk detail teknis

---

**Last Updated:** 2026-02-25  
**Maintainer:** Development Team
