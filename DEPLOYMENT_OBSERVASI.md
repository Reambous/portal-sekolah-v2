# 📋 DEPLOYMENT MODUL OBSERVASI - SHARED HOSTING (No SSH)

**Environment**: PHP 8.3 + Laravel 13 | Shared Hosting cPanel | No SSH Access

---

## ✅ URUTAN DEPLOYMENT (Penting!)

### **TAHAP 1: DATABASE SETUP (phpMyAdmin)**
**Durasi**: 5 menit | **Tool**: phpMyAdmin cPanel

```sql
-- Jalankan 3 perintah SQL berurutan di phpMyAdmin

-- 1. Tabel Lembar Catatan Pra-Observasi (Form A)
CREATE TABLE pra_observasi_catatan (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  hari_tanggal DATE NOT NULL,
  nama_guru VARCHAR(255) NOT NULL,
  mata_pelajaran VARCHAR(255) NOT NULL,
  kelas VARCHAR(255) NOT NULL,
  waktu VARCHAR(255) NOT NULL,
  nama_supervisor VARCHAR(255) NOT NULL,
  tujuan_pembelajaran TEXT NULL,
  area_pengembangan TEXT NULL,
  strategi TEXT NULL,
  catatan_khusus TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT pra_observasi_catatan_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Tabel Instrumen Umpan Balik Perencanaan Pembelajaran (Form B)
CREATE TABLE pra_observasi_instrumen (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  jenjang VARCHAR(255) NOT NULL,
  mata_pelajaran VARCHAR(255) NOT NULL,
  kelas VARCHAR(255) NOT NULL,
  judul_perencanaan VARCHAR(255) NOT NULL,
  skor JSON NULL,
  komentar JSON NULL,
  kelebihan TEXT NULL,
  hal_ditingkatkan TEXT NULL,
  rekomendasi TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  CONSTRAINT pra_observasi_instrumen_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tambah kolom notifikasi ke users (badge system)
ALTER TABLE users ADD COLUMN observasi_seen_at TIMESTAMP NULL DEFAULT NULL;
```

**Verifikasi**: 
- ✅ Tabel `pra_observasi_catatan` ada
- ✅ Tabel `pra_observasi_instrumen` ada
- ✅ Kolom `observasi_seen_at` ada di tabel `users`

---

### **TAHAP 2: UPLOAD COMPOSER DEPENDENCIES**
**Durasi**: 15 menit | **Tool**: File Manager cPanel + ZIP

**File yang perlu di-upload**:

```
/kakroz-app/
├── composer.json          (UPDATE - sudah ada phpoffice packages)
├── composer.lock          (UPDATE)
└── vendor/
    ├── phpoffice/         (BARU - ~7 MB)
    │   ├── phpword/
    │   ├── phpspreadsheet/
    │   └── math-engine/
    ├── maennchen/         (BARU - dependency phpoffice)
    ├── markbaker/         (BARU - dependency phpoffice)
    └── composer/          (UPDATE - autoload terbarui)
```

**Langkah**:
1. Download `composer.json` + `composer.lock` dari lokal
2. Upload ke `/kakroz-app/`
3. Download folder `vendor/phpoffice`, `vendor/maennchen`, `vendor/markbaker` + `vendor/composer` 
4. ZIP masing-masing folder
5. Extract di `/kakroz-app/vendor/`
6. Verifikasi: `composer dumpautoload` via tinker jika perlu

**Catatan Penting**:
- Jika error "Class not found", upload seluruh folder `vendor/` (rekomendasi)
- File size besar, pastikan shared hosting punya quota cukup (~50 MB vendor)
- Jangan delete folder lama dulu, replace file saja

---

### **TAHAP 3: UPLOAD FILE PHP (Backend)**
**Durasi**: 10 menit | **Tool**: File Manager cPanel

**File-file**:

```
/kakroz-app/

1. MODELS (BARU):
   app/Models/PraObservasiCatatan.php
   app/Models/PraObservasiInstrumen.php

2. CONTROLLER (BARU):
   app/Http/Controllers/PraObservasiController.php

3. TRAIT (UPDATE):
   app/Concerns/HasNotificationBadges.php

4. MODEL USER (UPDATE):
   app/Models/User.php
   (Kolom observasi_seen_at sudah di cast)

5. ROUTES (UPDATE):
   routes/web.php
   (15 rute observasi sudah ditambahkan)

6. MIGRATIONS (3 file - baru, JANGAN langsung jalankan):
   database/migrations/2026_08_11_145254_create_pra_observasi_catatan_table.php
   database/migrations/2026_08_11_145254_create_pra_observasi_instrumen_table.php
   database/migrations/2026_08_11_163901_add_observasi_seen_at_to_users_table.php
   
   ⚠️ CATATAN: Jangan jalankan migration via SSH (tidak ada).
              Cukup upload file. Database sudah disetup manual di Tahap 1.
```

**Langkah**:
1. Download 6 file di atas dari lokal
2. Upload masing-masing ke path yang sesuai di hosting
3. Overwrite file yang sudah ada (User.php, HasNotificationBadges.php, web.php)
4. Jangan jalankan artisan migrate

---

### **TAHAP 4: BUILD & UPLOAD REACT FRONTEND**
**Durasi**: 20 menit (build lokal: 50 detik)

**Langkah**:

```bash
# 1. Lokal: Build React/Tailwind/Vite
npm run build

# 2. Lokal: Zip folder build
# Windows: Compress public/build/ ke public-build.zip
# Mac/Linux: zip -r public-build.zip public/build/

# 3. Upload ke 2 tempat di hosting:
#    Folder 1: /kakroz-app/public/build/
#    Folder 2: /public_html/kakroz.my.id/build/

# 4. Extract di kedua tempat
```

**File yang di-build**:
- `public/build/manifest.json` (index aset)
- `public/build/assets/*.js` (React components terupdate)
- `public/build/assets/*.css` (Tailwind styles)

---

### **TAHAP 5: TESTING DI HOSTING**
**Durasi**: 15 menit

**Checklist**:

```
Database:
☐ Login ke phpMyAdmin → verifikasi 2 tabel + 1 kolom ada
☐ SELECT COUNT(*) FROM pra_observasi_catatan; → hasil 0

Backend:
☐ Logout → login ulang (refresh page)
☐ Menu "Observasi" muncul di navbar
☐ Badge notifikasi tampil (jika ada data baru)

Frontend - Form A (Lembar Catatan):
☐ Klik "Observasi" → pilih "Lembar Catatan Percakapan"
☐ Isi form → simpan
☐ Cek detail halaman
☐ Klik "EXPORT WORD (.DOCX)" → file download
☐ Klik "EDIT" → ubah data → simpan
☐ Klik "HAPUS" → konfirmasi → berhasil dihapus

Frontend - Form B (Instrumen Umpan Balik):
☐ Klik "Observasi" → pilih "Instrumen Umpan Balik"
☐ Isi form → pilih skala 0-4 → tambah komentar
☐ Verifikasi total skor terukur
☐ Simpan
☐ Cek detail halaman
☐ Klik "EXPORT EXCEL (.XLSX)" → file download
☐ Klik "EDIT" → ubah skor → simpan
☐ Klik "HAPUS" → berhasil dihapus

Index & Authorization:
☐ Admin: Bisa lihat SEMUA data + tombol HAPUS untuk semua
☐ Guru biasa: Hanya lihat & hapus data miliknya sendiri
☐ Pagination: Muncul di bawah tabel (10 item per halaman)
☐ Mobile: Bisa navigasi menu, dropdown Kesiswaan berfungsi

Troubleshoot:
☐ Error "Class not found": Re-upload folder vendor/ lengkap
☐ Export kosong/error: Cek ekstensi PHP (zip, xml, mbstring, gd)
  → cPanel → Select PHP Version → extension list
☐ Rute 404: Buka terminal lokal → php artisan route:cache → push ke hosting
☐ Badge tidak muncul: Polling /notifications/count setiap 60 detik
```

---

## 📦 FILE CHECKLIST

### Lokal - Sudah Siap
- ✅ `app/Models/PraObservasiCatatan.php`
- ✅ `app/Models/PraObservasiInstrumen.php`
- ✅ `app/Http/Controllers/PraObservasiController.php`
- ✅ `app/Concerns/HasNotificationBadges.php` (updated)
- ✅ `app/Models/User.php` (updated)
- ✅ `routes/web.php` (15 rute added)
- ✅ 3 migration files
- ✅ React pages (`resources/js/pages/observasi/**/*.tsx`)
- ✅ `npm run build` → `public/build/`

### Hosting - Perlu Upload
- ⏳ Database tables (SQL Tahap 1)
- ⏳ vendor/ folder + composer files (Tahap 2)
- ⏳ PHP backend files (Tahap 3)
- ⏳ React build files (Tahap 4)

---

## ⚠️ CATATAN KRITIS

1. **Urutan Tahap**: Jangan loncat! Database dulu, baru backend, baru frontend.

2. **Shared Hosting Limit**:
   - Max upload file: biasanya 128 MB
   - vendor/ folder: ~50 MB (pastikan cukup)
   - public/build/: ~20 MB
   - ZIP sebelum upload untuk hemat bandwidth

3. **Export Functionality**:
   - Butuh ekstensi: `zip`, `xml`, `mbstring`, `gd`
   - Lokasi: cPanel → Select PHP Version → Extensions
   - Tidak ada? Request ke hosting provider

4. **Badge System**:
   - Auto-polling setiap 60 detik
   - Jika offline/tab hidden, polling pause (hemat bandwidth)
   - Reset saat pindah modul (mark as seen)

5. **Mobile Navigation** (Fix baru):
   - Menu auto-close saat navigasi di mobile
   - Dropdown Kesiswaan berfungsi normal
   - Deploy build yang sudah diupdate

---

## 🎯 NEXT ACTIONS

**Urutan yang disarankan**:

1. ✅ **Tahap 1 (SQL)** - Jalankan 3 perintah di phpMyAdmin
2. ⏳ **Tahap 2 (Vendor)** - Upload folder vendor/ via File Manager
3. ⏳ **Tahap 3 (PHP)** - Upload 6 file backend via File Manager
4. ⏳ **Tahap 4 (React)** - Build lokal, upload public/build/ ke 2 tempat
5. ⏳ **Tahap 5 (Test)** - Testing di hosting production

**Estimasi total waktu**: ~1 jam (tanpa hambatan)

---

## 📞 TROUBLESHOOTING

| Error | Penyebab | Solusi |
|-------|---------|--------|
| Class not found: PhpOffice | vendor/ tidak lengkap | Re-upload seluruh vendor/ folder |
| Export kosong/blank | Ekstensi PHP missing | Add extensions di cPanel |
| Rute 404 /observasi | Cache rute lama | php artisan route:cache (lokal), push |
| Menu tidak tutup mobile | Build outdated | Re-build npm, upload public/build/ baru |
| Badge tidak update | Polling error | Check browser console `/notifications/count` |
| Data tidak tersimpan | DB tables missing | Verify Tahap 1 SQL sudah jalan |

---

**Status**: 🟢 READY FOR DEPLOYMENT
**Updated**: 2026-08-14
