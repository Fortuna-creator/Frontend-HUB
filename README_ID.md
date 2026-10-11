# 📅 Konsultasi PKP - Sistem Pemesanan Konsultasi

Platform pemesanan konsultasi yang modern dan aman, dibangun dengan React 19, TypeScript, dan Vite. Memungkinkan warga untuk memesan konsultasi di kantor PKP (Balai) untuk pertemuan tatap muka dengan administrator.

**Status:** 🟢 Pembangunan Selesai | 🔒 Keamanan Ditingkatkan (7 dari 10 Masalah Diperbaiki)

## 📋 Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Prasyarat](#prasyarat)
- [Instruksi Pemasangan](#instruksi-pemasangan)
- [Cara Menjalankan](#cara-menjalankan)
- [Cara Membangun](#cara-membangun)
- [Penerapan](#penerapan)
- [Struktur Proyek](#struktur-proyek)
- [Integrasi API](#integrasi-api)

## ✨ Fitur

### Untuk Warga (Penduduk)
- 🔐 **Pendaftaran Aman** dengan verifikasi OTP (dibatasi setelah 3 upaya gagal)
- 📅 **Jelajahi Balai** dan lihat slot waktu konsultasi yang tersedia
- 📋 **Pesan Konsultasi** dengan tanggal dan waktu yang diinginkan
- 📬 **Kotak Masuk** untuk pelacakan status konsultasi dan konfirmasi
- 💬 **Pembaruan Status Real-time** pada permintaan konsultasi (tertunda, diterima, selesai)
- ⏱️ **Kedaluwarsa Sesi Otomatis** (24 jam default, 7 hari dengan "Ingat Saya")
- ⚠️ **Banner Peringatan Kedaluwarsa Sesi** (30 menit sebelum waktu habis)

### Untuk Balai (Kantor Administrasi)
- 📊 **Dashboard** dengan statistik konsultasi dan ikhtisar
- 📋 **Kelola Permintaan** - Terima, tolak, atau tandai konsultasi sebagai selesai
- 👥 **Lihat Konsultasi** - Lacak permintaan warga yang tertunda dan selesai
- 🔔 **Notifikasi** - Sistem pemberitahuan untuk permintaan pemesanan baru

## 🔒 Keamanan

### Telah Diimplementasikan (7 dari 10 Masalah Diperbaiki)

| Masalah | Fitur | Status |
|---------|-------|--------|
| #2 | OTP Mock hardcoded → pembatasan dev-only | ✅ Selesai |
| #3 | Perlindungan XSS dengan cookie HttpOnly | ✅ Selesai |
| #6 | Validasi kekuatan kata sandi (8+ karakter, penilaian 6 level) | ✅ Selesai |
| #7 | Konfigurasi CORS untuk pengembangan | ✅ Selesai |
| #8 | Pembatasan laju OTP (3 upaya, penguncian 15 menit) | ✅ Selesai |
| #9 | Validasi input & sanitasi (semua kolom form) | ✅ Selesai |
| #10 | Kedaluwarsa token dengan logout otomatis | ✅ Selesai |

### Tertunda (3 Masalah - Memerlukan Domain PKP)
- **#1:** URL API Hardcoded → variabel lingkungan
- **#4:** Konfigurasi lingkungan untuk produksi/staging
- **#5:** Pembersihan logging konsol (dev-only)

### Fitur Keamanan

**Manajemen Autentikasi & Sesi:**
- ✅ Cookie HttpOnly (backend mencegah serangan XSS)
- ✅ Token durasi ganda: 24 jam default, 7 hari dengan "Ingat Saya"
- ✅ Validasi sesi otomatis saat pemuatan aplikasi
- ✅ Logout otomatis dengan hitungan mundur kedaluwarsa
- ✅ CORS dikonfigurasi dengan benar untuk permintaan lintas asal yang aman

**Keamanan Kata Sandi:**
- ✅ Minimum 8 karakter diperlukan
- ✅ Harus menyertakan: huruf besar, huruf kecil, angka, karakter khusus
- ✅ Indikator kekuatan real-time (6 level: merah → hijau gelap)
- ✅ Umpan balik visual tentang persyaratan kata sandi

**Validasi & Sanitasi Input:**
- ✅ NIK: Tepat 16 digit (ID Nasional Indonesia)
- ✅ Telepon: Format Indonesia (+62, 62, 0 prefiks)
- ✅ Email: Format email standar, maks 254 karakter
- ✅ Alamat: 10-500 karakter, alpanumerik + tanda baca aman
- ✅ Nama: 3-50 karakter, huruf/spasi/apostrof
- ✅ Pengodean entitas HTML mencegah injeksi XSS

**Pembatasan Laju API:**
- ✅ OTP: Maks 3 upaya per pengguna, penguncian 15 menit
- ✅ Respons HTTP 429 dengan hitungan mundur percobaan lagi
- ✅ Penegakan sisi server (tidak dapat dilewati)

[Lihat SECURITY_AUDIT.md](SECURITY_AUDIT.md) untuk dokumentasi keamanan lengkap.

## 🛠️ Teknologi

- **Framework Frontend:** React 19 + TypeScript
- **Alat Pembuat:** Vite
- **Styling:** Tailwind CSS 4
- **Routing:** React Router v7
- **Klien HTTP:** Fetch API dengan `credentials: 'include'` untuk cookie HttpOnly
- **Manajemen Status:** React Context API + Custom Hooks
- **Autentikasi:** JWT dengan cookie HttpOnly (backend) + sesi berbasis cookie
- **Validasi Form:** Validator khusus dengan umpan balik real-time
- **Ikon:** Lucide React, React Icons
- **Pemilih Tanggal:** React Datepicker
- **Kualitas Kode:** ESLint + TypeScript
- **Pengembangan:** Vite HMR untuk pemuatan ulang panas instan

## 📦 Prasyarat

- **Node.js:** v18 atau lebih tinggi
- **npm:** v9 atau lebih tinggi (atau yarn/pnpm)
- **Git:** Untuk kontrol versi
- **API Backend:** Berjalan di http://localhost:8080/api (pengembangan)

Verifikasi instalasi:
```bash
node --version   # Harus v18+
npm --version    # Harus v9+
```

## 🚀 Instruksi Pemasangan

### 1. Kloning Repositori
```bash
git clone <repository-url>
cd Klinik_HUB_PKP
```

### 2. Instal Dependensi
```bash
npm install
```

Ini akan memasang semua dependensi yang tercantum dalam `package.json`:
- React & React DOM
- React Router untuk navigasi
- Tailwind CSS untuk styling
- Perpustakaan pemilih tanggal dan ikon
- TypeScript untuk keamanan tipe
- ESLint untuk kualitas kode

### 3. Konfigurasi Lingkungan

Buat file `.env.local` di akar proyek (opsional - URL backend default ke produksi):

```env
# Konfigurasi API Backend
VITE_API_BASE_URL=http://localhost:3000/api

# Opsional: Bendera fitur
VITE_SHOW_SESSION_KEYS=true
```

**Catatan:** Aplikasi memiliki fallback konfigurasi API bawaan ke endpoint produksi.

### 4. Verifikasi Pemasangan

```bash
# Periksa kesalahan TypeScript
npm run build

# Periksa kualitas kode
npm run lint
```

## ▶️ Cara Menjalankan

### Server Pengembangan (Direkomendasikan)

Mulai server pengembangan dengan Hot Module Replacement (HMR):

```bash
npm run dev
```

**Keluaran:**
```
➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

**Fitur:**
- ⚡ Penyegaran halaman instan pada perubahan file
- 🐛 Debugging mudah dengan DevTools browser
- 🎨 Pembaruan CSS langsung

### Pratinjau Build Produksi

Untuk menguji build produksi secara lokal sebelum penerapan:

```bash
npm run build
npm run preview
```

**Keluaran:**
```
➜  Preview:  http://localhost:4173/
```

## 🔧 Cara Membangun

### Kompilasi TypeScript & Bundel

```bash
npm run build
```

**Proses:**
1. Mengompilasi file TypeScript (`tsc -b`)
2. Menggabungkan aset dengan Vite
3. Mengoptimalkan untuk produksi
4. Keluaran: direktori `dist/` (dimampatkan, siap untuk penerapan)

**File keluaran:**
```
dist/
  ├── index.html
  ├── assets/
  │   ├── main.*.js
  │   └── style.*.css
  └── _redirects (untuk perutean Netlify)
```

### Membangun dengan Peta Sumber (Debugging)

Untuk debugging produksi, sertakan peta sumber:

```bash
# Modifikasi opsi pembangunan vite.config.ts lalu jalankan
npm run build
```

## 🧹 Perintah Lainnya

### Kualitas Kode

**Jalankan Linter:**
```bash
npm run lint
```

Memeriksa kode untuk masalah gaya dan kualitas sesuai dengan aturan ESLint.

**Perbaiki Masalah Linting (Otomatis):**
```bash
npx eslint . --fix
```

### Pengecekan Tipe

```bash
npx tsc --noEmit
```

Memeriksa kesalahan tipe TypeScript tanpa memancarkan file.

## 📁 Struktur Proyek

```
src/
├── main.tsx                 # Titik masuk aplikasi
├── App.tsx                  # Aplikasi utama & perutean
├── App.css                  # Gaya global
├── index.css                # Pengaturan ulang CSS
├── api/                     # Integrasi backend
│   ├── service.ts           # Endpoint API (dengan credentials: 'include')
│   ├── config.ts            # Konfigurasi API
│   ├── hooks.ts             # Custom React hooks
│   ├── types.ts             # Definisi tipe API
│   └── idempotency.ts       # Utilitas idempoten
├── utils/
│   └── validation.ts        # Validator input & sanitizer
├── types/
│   └── types.ts             # Definisi tipe global
├── Warga/                   # Antarmuka Warga (Penduduk)
│   ├── components/
│   │   ├── Auth/            # Autentikasi (login, daftar, OTP)
│   │   │   ├── authContext.tsx       # Manajemen status autentikasi
│   │   │   ├── useAuth.ts            # Custom auth hook
│   │   │   ├── LoginForm.tsx         # Masuk dengan "Ingat Saya"
│   │   │   ├── TokenExpirationWarning.tsx  # Peringatan sesi
│   │   │   └── RouteGuards.tsx       # Rute terlindungi
│   │   └── Shared/          # Nav, footer, dll
│   └── pages/               # Komponen halaman
├── Balai/                   # Antarmuka Kantor PKP (Balai)
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── data/
└── assets/                  # Gambar, font
```

## 🔌 Integrasi API

### Endpoint Backend

**Autentikasi:**
- `POST /api/auth/register` - Daftar dengan verifikasi OTP
- `POST /api/auth/verify-otp` - Verifikasi kode OTP
- `POST /api/auth/resend-otp` - Kirim ulang OTP
- `POST /api/auth/login` - Masuk (mengatur cookie auth_token HttpOnly)
- `POST /api/auth/logout` - Keluar

**Konsultasi:**
- `GET /api/balai/list` - Daftar semua kantor
- `GET /api/balai/{id}/available-slots` - Slot waktu konsultasi yang tersedia
- `POST /api/consultations/book` - Pesan janji temu konsultasi
- `GET /api/consultations/me` - Pemesanan konsultasi pengguna
- `GET /api/consultations/{id}/status` - Periksa status konsultasi

**Dashboard:**
- `GET /api/dashboard/stats` - Statistik konsultasi
- `GET /api/booking-confirmations` - Kotak masuk konfirmasi

### Konfigurasi API

Semua permintaan secara otomatis menyertakan:
- ✅ `credentials: 'include'` - Mengirim cookie HttpOnly
- ✅ `Content-Type: application/json`
- ✅ Batas waktu: 30 detik
- ✅ Percobaan ulang otomatis pada kesalahan jaringan (dengan dukungan idempoten)

### Alur Autentikasi

1. **Daftar:** Pengguna memasukkan kredensial + verifikasi OTP
2. **Masuk:** Pengguna memasukkan email/kata sandi
3. **Respons Server:** Mengatur cookie auth_token HttpOnly
4. **Permintaan Terlindungi:** Browser secara otomatis mengirim cookie
5. **Validasi Sesi:** Token diperiksa saat pemuatan aplikasi
6. **Kedaluwarsa:** Logout otomatis setelah waktu habis (pengguna diberitahu 30 menit sebelumnya)

### Custom Hooks

```typescript
useAuth()                    // Dapatkan status pengguna & autentikasi saat ini
useGetBalai()               // Ambil daftar fasilitas
useGetConsultations(userId) // Ambil konsultasi pengguna
useGetDashboardStats()      // Ambil statistik dashboard
```

## 🚢 Penerapan

### Netlify (Direkomendasikan)

**Variabel Lingkungan:**
```
VITE_API_BASE_URL = https://api.pkp.go.id/api
```

**Penerapan:**
1. Hubungkan repositori ke Netlify
2. Tetapkan variabel lingkungan di dasbor Netlify
3. Penerapan otomatis saat git push

**Konfigurasi:**
- Pembangunan: `npm run build`
- Publikasi: `dist/`
- Node: 18+

### Penyiapan Lingkungan untuk Produksi

Saat domain PKP siap:

1. **Perbarui URL API:**
   ```env
   VITE_API_BASE_URL=https://api.pkp.go.id/api
   ```

2. **Aktifkan HTTPS:**
   - Backend harus melayani HTTPS
   - Cookie harus memiliki bendera `Secure`

3. **Konfigurasi CORS:**
   - Backend memungkinkan `https://app.pkp.go.id`
   - Kredensial diaktifkan untuk permintaan same-site

## 📝 Alur Kerja Git

```bash
# Buat cabang fitur
git checkout -b feature/your-feature

# Lakukan perubahan dan komit
git add .
git commit -m "feat: deskripsi perubahan"

# Dorong ke remote
git push origin feature/your-feature

# Buat Pull Request
# Setelah review dan persetujuan, gabungkan ke main
```

## 🐛 Pemecahan Masalah

### Port 5173 Sudah Digunakan

```bash
# Bunuh proses di port 5173
npx kill-port 5173

# Atau tentukan port berbeda
npm run dev -- --port 3000
```

### Masalah Node Modules

```bash
# Instal bersih
rm -rf node_modules
npm install
```

### Kesalahan TypeScript

```bash
# Periksa kesalahan
npx tsc --noEmit

# Perbaiki kesalahan yang dapat diperbaiki otomatis
npx eslint . --fix
```

### Masalah Koneksi API

- Verifikasi backend sedang berjalan
- Periksa `VITE_API_BASE_URL` dalam `.env.local`
- Periksa tab Network di DevTools browser
- Verifikasi konfigurasi CORS di backend

## 📱 Dukungan Browser

- Chrome (terbaru)
- Firefox (terbaru)
- Safari (terbaru)
- Edge (terbaru)

## 📄 Lisensi

Proyek ini bersifat proprietary dan rahasia.

## � Dokumentasi & Sumber Daya

Semua file dokumentasi dengan tujuan dan kasus penggunaan mereka:

| Dokumen | Tujuan | Untuk Siapa | Kasus Penggunaan |
|---------|--------|----------|----------|
| [SECURITY_AUDIT.md](SECURITY_AUDIT.md) | Laporan audit keamanan lengkap | Pengembang, Tim Keamanan | Tinjau 7 dari 10 peningkatan keamanan yang diselesaikan |
| [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md) | Daftar periksa penerapan produksi | DevOps, Project Manager | Persiapkan untuk penerapan produksi saat domain PKP siap |
| [API_CONTRACT.md](API_CONTRACT.md) | Spesifikasi kontrak API | Tim Backend | Implementasikan endpoint backend sesuai kebutuhan frontend |
| [BACKEND_INTEGRATION_HTTPCOOKIE.md](BACKEND_INTEGRATION_HTTPCOOKIE.md) | Panduan integrasi backend | Tim Backend | Konfigurasi autentikasi cookie HttpOnly |
| [FRONTEND_API_GUIDE.md](FRONTEND_API_GUIDE.md) | Panduan integrasi API frontend | Pengembang Frontend | Pahami lapisan layanan API, hooks, dan pola integrasi |
| [TOKEN_EXPIRATION.md](TOKEN_EXPIRATION.md) | Manajemen sesi & token | Pengembang Frontend | Konfigurasi timeout sesi, peringatan kedaluwarsa, logout otomatis |
| [COMPONENT_INTEGRATION_CHECKLIST.md](COMPONENT_INTEGRATION_CHECKLIST.md) | Status integrasi komponen | Tim Frontend | Lacak status implementasi dan integrasi komponen |
| [SQL_INJECTION_ANALYSIS.md](SQL_INJECTION_ANALYSIS.md) | Analisis keamanan injeksi SQL | Tim Keamanan, Tim Backend | Analisis keamanan dan strategi pencegahan |
| [SETUP_COMPLETE.md](SETUP_COMPLETE.md) | Dokumentasi pengaturan pengembangan | Pengembang Baru | Pengaturan proyek awal dan konfigurasi lingkungan |

---

## �👥 Tim

Tim Pengembangan Klinik HUB PKP

---

**Status:** 6 Maret 2026
- ✅ Frontend 100% selesai dan keamanan ditingkatkan
- ✅ 7 dari 10 masalah keamanan diperbaiki
- ⏳ Menunggu infrastruktur domain PKP untuk 3 masalah terakhir
- 🟢 Pengembangan: SIAP UNTUK PENERAPAN
