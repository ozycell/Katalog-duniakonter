# 🚀 Serpul Mobile — Android APK / Play Store Setup

Panduan lengkap untuk mengubah web app React + Vite ini menjadi APK/AAB dan publish ke Google Play Store.

## 📋 Teknologi: Capacitor (by Ionic)

**Kenapa Capacitor?**
- ✅ 100% kode web tetap digunakan (React, Vite, Tailwind, Zustand)
- ✅ Tidak perlu rewrite UI ke React Native / Flutter
- ✅ Support native plugin (camera, push notification, GPS, dll)
- ✅ Bisa buat APK untuk testing & AAB untuk Play Store
- ✅ Modern replacement dari Cordova

---

## 🛠️ Step 1: Install Dependencies

```bash
# Install Capacitor core, Android platform, dan CLI
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# (Optional) Plugin untuk push notification, camera, storage, dll
npm install @capacitor/push-notifications
```

**File `capacitor.config.ts` sudah dibuat di root project.**

---

## 🤖 Step 2: Add Android Platform

```bash
npx cap add android
```

Perintah ini akan membuat folder `android/` yang berisi project Android Studio native.

---

## 🖼️ Step 3: App Icon & Splash Screen

```bash
npm install -D @capacitor/assets
```

Buat 2 file gambar di root project:
- `assets/icon.png` — **1024×1024 px** (logo aplikasi)
- `assets/splash.png` — **2732×2732 px** (splash screen, logo di tengah)

Generate semua ukuran:
```bash
npx capacitor-assets generate
```

---

## 🔧 Step 4: Firebase Cloud Messaging (FCM)

Karena app sudah pakai Firebase:

1. Buka [Firebase Console](https://console.firebase.google.com/) → Project Settings → Android
2. Daftarkan app dengan package name: `com.serpul.mobile`
3. Download `google-services.json`
4. Taruh di: `android/app/google-services.json`

---

## 🧪 Step 5: Test Debug Build

```bash
# Build web + sync ke Android
npm run build
npx cap sync android

# Buka di Android Studio (untuk run di emulator / device)
npx cap open android

# Atau langsung run di device/emulator yang terhubung
npx cap run android
```

---

## 🔐 Step 6: Generate Keystore (Sekali Saja)

Keystore ini untuk **signing app**. Simpan dengan aman, kalau hilang tidak bisa update app di Play Store.

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore upload-keystore.jks \
  -alias upload \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

Isi data yang diminta (nama, organisasi, negara, dll). **Backup file `upload-keystore.jks` dan passwordnya!**

---

## 📦 Step 7: Generate APK / AAB

### Cara Cepat (via Script)

```bash
# Build AAB untuk Play Store
KEYSTORE_PASS='passwordAnda' KEY_ALIAS_PASS='passwordAlias' ./scripts/build-android.sh

# Build APK untuk testing
BUILD_TYPE=APK KEYSTORE_PASS='passwordAnda' KEY_ALIAS_PASS='passwordAlias' ./scripts/build-android.sh
```

### Cara Manual

```bash
# 1. Build web
npm run build

# 2. Sync ke Android
npx cap sync android

# 3. Build signed AAB (Play Store)
npx cap build android \
  --androidreleasetype AAB \
  --keystorepath upload-keystore.jks \
  --keystorepass 'passwordAnda' \
  --keystorealias upload \
  --keystorealiaspass 'passwordAlias'

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📤 Step 8: Upload ke Google Play Store

### Persyaratan Play Store (2025)

| Requirement | Detail |
|---|---|
| **Format** | `.aab` (Android App Bundle) |
| **Target SDK** | API 34 (Android 14) minimum |
| **Biaya** | $25 one-time |
| **Privacy Policy** | Wajib punya web page privacy policy |
| **Screenshots** | 2-8 screenshot phone (9:16), 512×512 icon |
| **Account Deletion** | Wajib ada mekanisme hapus akun |

### Step Upload

1. Buka [Google Play Console](https://play.google.com/console) → buat akun developer ($25)
2. Buat app baru → isi judul, deskripsi, screenshot, icon
3. Upload AAB ke **Internal Testing** dulu
4. Setelah testing lancar, promote ke **Production**
5. Submit untuk review (1-5 hari kerja)

---

## ⚠️ Catatan Penting

### localStorage / sessionStorage di WebView
- **Tetap berfungsi** tanpa perubahan kode
- Data tersimpan di WebView origin (`https://localhost`)
- Kalau ganti `androidScheme` (http ↔ https), storage akan reset

### React Router DOM
- `BrowserRouter` berjalan normal di Capacitor (bukan `file://`)
- Tidak perlu ubah ke `HashRouter`

### Push Notification
- Install plugin: `@capacitor/push-notifications`
- Ganti `firebase-messaging-sw.js` approach dengan native push Capacitor
- Token FCM didapat via native plugin, bukan web Firebase SDK

### Deep Linking (opsional)
Kalau ingin link `https://serpul.co.id/...` bisa dibuka langsung di app:
```typescript
// capacitor.config.ts
server: {
  androidScheme: 'https',
},
```

---

## 📂 File yang Sudah Dibuat

| File | Fungsi |
|---|---|
| `capacitor.config.ts` | Konfigurasi Capacitor (appId, webDir, splash, push) |
| `scripts/build-android.sh` | Script otomatis: build → sync → signed APK/AAB |
| `ANDROID_SETUP.md` | Dokumentasi ini |

---

## 🆘 Troubleshooting

**`npx cap add android` gagal?**
→ Pastikan Android Studio sudah terinstall dengan SDK Platform & SDK Tools.

**Build gagal karena keystore?**
→ Pastikan `upload-keystore.jks` ada di root project dan password benar.

**App blank putih di emulator?**
→ Cek `webDir` di `capacitor.config.ts` harus sama dengan Vite `outDir` (default: `dist`).

**Push notification tidak jalan?**
→ Pastikan `google-services.json` sudah di-copy ke `android/app/` dan `npx cap sync` sudah dijalankan.
