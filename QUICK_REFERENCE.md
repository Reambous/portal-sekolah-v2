# ⚡ QUICK REFERENCE - DEPLOYMENT OBSERVASI

**Last Updated**: 2026-08-14
**Status**: ✅ READY TO DEPLOY

---

## 🚀 5 TAHAP DEPLOYMENT - QUICK CHECKLIST

### ✅ TAHAP 1: DATABASE (5 menit)
**Tool**: phpMyAdmin cPanel | **Action**: Run SQL commands

```
Login phpMyAdmin → Select Database → SQL tab → Paste & Run:

1️⃣  CREATE TABLE pra_observasi_catatan (...)
2️⃣  CREATE TABLE pra_observasi_instrumen (...)
3️⃣  ALTER TABLE users ADD COLUMN observasi_seen_at TIMESTAMP NULL;

Result: ✓ 2 tables + 1 column created
```

---

### ⏳ TAHAP 2: UPLOAD VENDOR (15 menit)
**Tool**: File Manager cPanel | **Action**: Upload & Extract

**Download dari lokal** → **Upload ke hosting**:

| File | Size | Upload To | Action |
|------|------|-----------|--------|
| composer.json | 4 KB | /kakroz-app/ | Replace |
| composer.lock | 150 KB | /kakroz-app/ | Replace |
| vendor/phpoffice/ | 5 MB | /kakroz-app/vendor/ | Replace |
| vendor/maennchen/ | 500 KB | /kakroz-app/vendor/ | Replace |
| vendor/markbaker/ | 200 KB | /kakroz-app/vendor/ | Replace |
| vendor/composer/ | - | /kakroz-app/vendor/ | Replace |

**Tip**: ZIP vendor folder sebelum upload untuk cepat

```
Result: ✓ Composer packages ready for use
```

---

### ⏳ TAHAP 3: UPLOAD PHP FILES (10 menit)
**Tool**: File Manager cPanel | **Action**: Upload 6 files + 3 migrations

**CREATE NEW**:
```
app/Models/PraObservasiCatatan.php → /kakroz-app/app/Models/
app/Models/PraObservasiInstrumen.php → /kakroz-app/app/Models/
app/Http/Controllers/PraObservasiController.php → /kakroz-app/app/Http/Controllers/
```

**REPLACE** (3 files):
```
app/Concerns/HasNotificationBadges.php → /kakroz-app/app/Concerns/ (overwrite)
app/Models/User.php → /kakroz-app/app/Models/ (overwrite)
routes/web.php → /kakroz-app/routes/ (overwrite)
```

**UPLOAD (jangan jalankan)**:
```
database/migrations/2026_08_11_145254_create_pra_observasi_catatan_table.php
database/migrations/2026_08_11_145254_create_pra_observasi_instrumen_table.php
database/migrations/2026_08_11_163901_add_observasi_seen_at_to_users_table.php
```

```
Result: ✓ Backend code ready
```

---

### ⏳ TAHAP 4: BUILD & UPLOAD REACT (20 menit)
**Tool**: Terminal (lokal) + File Manager (hosting) | **Action**: Build → ZIP → Upload

**Lokal** (Command Prompt/PowerShell):
```powershell
cd C:\laragon\www\portal-sekolah-v2
npm run build

# Output: public/build/
# Wait: ~50 detik
```

**Zip** (Windows Explorer):
```
Right-click public/build/ → Compress → public-build.zip
Size: ~20 MB
```

**Upload ke 2 tempat** di hosting:
```
Location 1: /kakroz-app/public/build/ (extract di sini)
Location 2: /public_html/kakroz.my.id/build/ (extract di sini)

Action: Upload ZIP → Extract (File Manager cPanel)
```

```
Result: ✓ Frontend assets deployed
```

---

### ⏳ TAHAP 5: TESTING (15 menit)
**Tool**: Browser + cPanel | **Action**: Verify functionality

**Step 1: Backend Check**
```
☐ Login ke cPanel → phpMyAdmin
☐ Table pra_observasi_catatan: SELECT COUNT(*) → 0
☐ Table pra_observasi_instrumen: SELECT COUNT(*) → 0
☐ Column observasi_seen_at ada di users
```

**Step 2: Frontend Check**
```
☐ Open https://kakroz.my.id (atau domain Anda)
☐ Logout → Login ulang
☐ Menu "Observasi" muncul di navbar
☐ Badge notifikasi tampil (kalau ada data)
```

**Step 3: Form A Test (Lembar Catatan)**
```
☐ Click Observasi → Lembar Catatan Percakapan
☐ Isi: Tanggal, Guru, Mapel, Kelas, Waktu, Supervisor, dsb
☐ Click SIMPAN → redirect ke detail
☐ Click EXPORT WORD → file .docx download
☐ Click EDIT → ubah data → SIMPAN
☐ Click HAPUS → konfirmasi → deleted
```

**Step 4: Form B Test (Instrumen)**
```
☐ Click Observasi → Instrumen Umpan Balik
☐ Isi: Jenjang, Mapel, Kelas, Judul Perencanaan
☐ Pilih skala 0-4 untuk 27 indikator
☐ Tambah komentar (optional)
☐ Lihat total skor live update
☐ Click SIMPAN → redirect ke detail
☐ Click EXPORT EXCEL → file .xlsx download
☐ Click EDIT → ubah data → SIMPAN
☐ Click HAPUS → deleted
```

**Step 5: Authorization & Pagination**
```
☐ Admin account: Bisa lihat SEMUA, tombol HAPUS untuk semua
☐ Guru biasa: Hanya lihat & hapus data sendiri
☐ Pagination: Muncul di bawah tabel (10 items/page)
☐ Mobile: Menu dropdown Kesiswaan berfungsi
```

**Step 6: Troubleshoot (jika ada error)**
```
Error: Class not found: PhpOffice
→ Re-upload vendor/ folder lengkap

Error: Export blank/error
→ cPanel → Select PHP Version → add extensions: zip, xml, mbstring, gd

Error: Rute 404 /observasi
→ Lokal: php artisan route:cache
→ Push ke hosting

Error: Mobile menu tidak tutup
→ Verify public/build/ sudah terupdate (npm run build lokal)
```

```
Result: ✓ ALL FEATURES WORKING
```

---

## 📞 EMERGENCY CONTACTS

**If stuck at**:

| Issue | Try This |
|-------|----------|
| Can't login phpMyAdmin | Check database credentials di .env |
| File upload timeout | Use ZIP compression + split upload |
| Class not found | Check vendor/autoload.php exists + regenerate |
| Export error | Check cPanel PHP extensions |
| Menu not appearing | Clear browser cache (Ctrl+Shift+Del) |
| Mobile dropdown broken | Verify build is latest (check timestamp) |

---

## 🎯 SUCCESS INDICATORS

✅ Deployment berhasil jika:
- [x] Menu Observasi ada di navbar
- [x] Form A bisa isi & export Word
- [x] Form B bisa isi & export Excel
- [x] Tombol HAPUS sesuai role (admin/owner)
- [x] Pagination works (10 items/page)
- [x] Mobile navigation smooth
- [x] Badge notifikasi update setiap 60 detik
- [x] Tidak ada error di browser console

---

## 📊 TIME ESTIMATE

| Tahap | Time | Notes |
|-------|------|-------|
| 1. Database | 5 min | Very quick |
| 2. Vendor | 15 min | Largest upload |
| 3. Backend | 10 min | Multiple small files |
| 4. Frontend | 20 min | Build + upload |
| 5. Testing | 15 min | Verify all features |
| **TOTAL** | **~65 min** | May vary by internet speed |

---

## 💾 BACKUP BEFORE UPLOAD

**Recommended** (jangan abaikan):
```
1. Download .env file (jika ada perubahan)
2. Backup database (Export SQL dari phpMyAdmin)
3. Backup public/build/ folder (jika ada yang error bisa revert)
4. Backup app/ folder (untuk safety)

Location: Save ke folder lokal "hosting-backup-[date]"
```

---

## 🔐 SECURITY CHECKLIST

After deployment:
- [ ] .env tidak exposed (check git ignore)
- [ ] Database credentials aman (hanya di .env)
- [ ] vendor/ folder tidak dalam version control
- [ ] public/build/ tersimpan properly
- [ ] Migration files tidak auto-run
- [ ] User roles & permissions berfungsi

---

## 📝 NOTES FOR FUTURE

**Jika ada update**:
1. Lokal: Edit file
2. Lokal: npm run build (jika ada React changes)
3. Upload file yang berubah (REPLACE)
4. Clear browser cache di client
5. Test di hosting

**Example flow**:
```
File change → npm run build → Upload public/build → Test → Done
```

---

**FINAL STATUS**: 🟢 READY TO DEPLOY

**Next Action**: Start Tahap 1 (Database Setup)

Need help? Refer to DEPLOYMENT_OBSERVASI.md for detailed steps.
