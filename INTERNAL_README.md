# Internal README — Setup Mobile Build

> Dokumen ini untuk tim internal / kontributor yang ingin build APK dari repo ini.
> Untuk penggunaan web standar, lihat `README.md`.

---

## Prasyarat

- Node.js ≥ 22 (disarankan via nvm)
- Java JDK ≥ 17 (untuk Gradle build)
- Android Studio (untuk signing & Play Store upload)

---

## 1. Install Capacitor Dependencies

Semua plugin Capacitor ada di `optionalDependencies`. Install manual:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install
```

> Catatan: `npm install --no-optional` akan skip semua Capacitor plugin.
> Untuk build APK, pastikan install tanpa flag `--no-optional`.

---

## 2. Generate `capacitor.config.ts`

File `capacitor.config.ts` tidak ikut di-track di repo (ada di `.gitignore`).
Generate dari template atau buat manual:

```bash
cat > capacitor.config.ts << 'EOF'
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.serpul.devs',
  appName: 'Serpul',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  android: {
    buildOptions: {
      keystorePath: './upload-keystore.jks',
      keystorePassword: 'your_keystore_pass',
      keystoreAlias: 'upload',
      keystoreAliasPassword: 'your_alias_pass',
      releaseType: 'AAB',
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffffff',
      androidScaleType: 'CENTER_CROP',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
EOF
```

Sesuaikan `appId`, `appName`, dan `buildOptions` sesuai keystore kamu.

---

## 3. Tambahkan Platform Android

```bash
npx cap add android
```

---

## 4. Copy Keystore & Google Services

```bash
# Keystore (wajib untuk signed release)
cp /path/to/your/upload-keystore.jks ./upload-keystore.jks

# Google Services (opsional, untuk Firebase Push Notification)
cp /path/to/your/google-services.json ./android/app/google-services.json
```

---

## 5. Build & Sync

```bash
# Build web assets
npm run build

# Sync ke project Android
npx cap sync android
```

---

## 6. Build APK / AAB

### Via Android Studio (Rekomendasi untuk development)

```bash
npx cap open android
```

Lalu di Android Studio: **Build → Generate Signed Bundle / APK**.

### Via Command Line (untuk CI/CD)

```bash
cd android
./gradlew assembleRelease bundleRelease --no-daemon
```

Output:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 7. Update Package Name di `google-services.json`

Jika `package_name` di `google-services.json` berbeda dengan `appId` di `capacitor.config.ts`, update via `jq`:

```bash
jq --arg pkg "id.serpul.devs" \
   '.client[0].client_info.android_client_info.package_name = $pkg' \
   android/app/google-services.json > tmp.json && mv tmp.json android/app/google-services.json
```

---

## Troubleshooting

### `Capacitor CLI requires NodeJS >=22.0.0`

```bash
source ~/.nvm/nvm.sh
nvm use 22
```

### `google-services.json not provided, skipping`

Normal jika tidak menggunakan Firebase. Build tetap berhasil.
Jika butuh Firebase, pastikan file `google-services.json` sudah di-copy ke `android/app/`.

### `Could not find upload-keystore.jks`

Pastikan keystore ada di root project (sejajar dengan `capacitor.config.ts`) dan path di `buildOptions.keystorePath` sudah benar.

---

## Checklist Sebelum Build Release

- [ ] `capacitor.config.ts` sudah dibuat dengan `appId` yang benar
- [ ] Keystore file tersedia dan password valid
- [ ] `google-services.json` sudah di-copy (jika pakai Firebase)
- [ ] `npm run build` sukses tanpa error
- [ ] `npx cap sync android` sukses
- [ ] VersionCode & VersionName sudah di-update
