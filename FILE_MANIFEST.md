# 📦 FILE MANIFEST - OBSERVASI DEPLOYMENT

**Generated**: 2026-08-14
**Purpose**: Tracking file untuk upload ke hosting

---

## TAHAP 1: DATABASE (phpMyAdmin)
Status: ⏳ Manual via SQL
Files: None (SQL commands only)

```
- Run 3 SQL commands in phpMyAdmin
- Verify: 2 tables + 1 column created
```

---

## TAHAP 2: COMPOSER DEPENDENCIES
Status: ⏳ Upload via File Manager

**Lokasi di Hosting**: `/kakroz-app/`

### Files to Upload:

```
composer.json
├── Size: ~4 KB
├── Action: REPLACE (overwrite yang lama)
├── Path: /kakroz-app/composer.json
└── Note: Sudah punya phpoffice packages

composer.lock
├── Size: ~150 KB
├── Action: REPLACE
├── Path: /kakroz-app/composer.lock
└── Note: Updated dependency versions

vendor/ (Folder - 3 bagian)
├── vendor/phpoffice/                 (~5 MB)
│   ├── phpword/
│   ├── phpspreadsheet/
│   └── math-engine/
├── vendor/maennchen/                 (~500 KB)
├── vendor/markbaker/                 (~200 KB)
└── vendor/composer/                  (UPDATE - autoload)

Total vendor size: ~50 MB (lebih kecil jika delete vendor lama dulu)
Action: REPLACE or MERGE
Path: /kakroz-app/vendor/
```

---

## TAHAP 3: BACKEND FILES (PHP)
Status: ⏳ Upload via File Manager

**Lokasi di Hosting**: `/kakroz-app/`

### NEW FILES (Buat baru):

```
app/Models/PraObservasiCatatan.php
├── Size: ~1 KB
├── Action: CREATE NEW
├── Path: /kakroz-app/app/Models/PraObservasiCatatan.php
└── Content: Model untuk tabel pra_observasi_catatan

app/Models/PraObservasiInstrumen.php
├── Size: ~7 KB
├── Action: CREATE NEW
├── Path: /kakroz-app/app/Models/PraObservasiInstrumen.php
├── Content: Model + definisi indikator 27 items
└── Methods: definisi(), itemSkala(), totalMaks(), hitungTotal()

app/Http/Controllers/PraObservasiController.php
├── Size: ~15 KB
├── Action: CREATE NEW
├── Path: /kakroz-app/app/Http/Controllers/PraObservasiController.php
├── Content: 15 methods (CRUD + export Word/Excel)
└── Dependencies: PhpWord, PhpSpreadsheet
```

### UPDATED FILES (Replace):

```
app/Concerns/HasNotificationBadges.php
├── Size: ~4 KB
├── Action: REPLACE (update method countNew untuk observasi)
├── Path: /kakroz-app/app/Concerns/HasNotificationBadges.php
└── Change: Add observasi case + combine catatan + instrumen counts

app/Models/User.php
├── Size: ~2 KB
├── Action: REPLACE
├── Path: /kakroz-app/app/Models/User.php
└── Change: Add 'observasi_seen_at' => 'datetime' to casts()

routes/web.php
├── Size: ~6 KB
├── Action: REPLACE
├── Path: /kakroz-app/routes/web.php
└── Change: Add 15 routes untuk observasi (lines 137-157)
```

### MIGRATION FILES (Upload - jangan run):

```
database/migrations/2026_08_11_145254_create_pra_observasi_catatan_table.php
├── Size: ~1 KB
├── Action: CREATE (untuk reference, jangan artisan migrate)
├── Path: /kakroz-app/database/migrations/
└── Note: DB sudah manual setup di Tahap 1

database/migrations/2026_08_11_145254_create_pra_observasi_instrumen_table.php
├── Size: ~1 KB
├── Action: CREATE
├── Path: /kakroz-app/database/migrations/
└── Note: DB sudah manual setup di Tahap 1

database/migrations/2026_08_11_163901_add_observasi_seen_at_to_users_table.php
├── Size: ~800 B
├── Action: CREATE
├── Path: /kakroz-app/database/migrations/
└── Note: Column sudah manual add di Tahap 1
```

---

## TAHAP 4: REACT FRONTEND (Build Assets)
Status: ⏳ Build lokal, upload ke 2 tempat

**Build Command (Lokal)**:
```bash
npm run build
# Output: public/build/
# Time: ~50 detik
# Size: ~20 MB (manifaet + JS/CSS assets)
```

### Upload to 2 Locations:

```
Location 1: /kakroz-app/public/build/
└── Action: REPLACE folder
    Files:
    ├── manifest.json           (~5 KB)
    ├── assets/app-*.js         (~180 KB gzipped)
    ├── assets/jsx-runtime.js   (~300 KB)
    ├── assets/*.css            (Tailwind compiled)
    └── [other JS chunks]

Location 2: /public_html/kakroz.my.id/build/
└── Action: REPLACE folder
    Same files as Location 1
```

### React Pages (Sources - untuk reference):

```
resources/js/pages/observasi/
├── index.tsx                           (Main page - rekap form A & B)
├── catatan/
│   ├── create.tsx                     (Form A - input)
│   ├── edit.tsx                       (Form A - edit)
│   └── show.tsx                       (Form A - detail + export word)
└── instrumen/
    ├── create.tsx                     (Form B - input)
    ├── edit.tsx                       (Form B - edit)
    └── show.tsx                       (Form B - detail + export excel)

Note: Source files tidak perlu diupload. 
      Only compiled public/build/ needed di hosting.
```

---

## TAHAP 5: TESTING (No files)
Status: ⏳ Manual testing di hosting

Checklist ada di DEPLOYMENT_OBSERVASI.md

---

## 📋 UPLOAD CHECKLIST

### Before Upload:
- [ ] All files downloaded dari lokal
- [ ] vendor/ folder dikompresi (ZIP) untuk faster upload
- [ ] composer.json & composer.lock ready
- [ ] 3 new PHP files ready
- [ ] 3 update PHP files ready
- [ ] 3 migration files ready
- [ ] npm run build sudah jalan
- [ ] public/build/ ready untuk upload

### During Upload:
- [ ] Tahap 1: SQL setup di phpMyAdmin ✓
- [ ] Tahap 2: Upload composer.json, composer.lock, vendor/
- [ ] Tahap 3: Upload app/Models/*.php
- [ ] Tahap 3: Upload app/Http/Controllers/PraObservasiController.php
- [ ] Tahap 3: Update app/Concerns/HasNotificationBadges.php
- [ ] Tahap 3: Update app/Models/User.php
- [ ] Tahap 3: Update routes/web.php
- [ ] Tahap 3: Upload database/migrations/*.php
- [ ] Tahap 4: Upload public/build/ ke /kakroz-app/
- [ ] Tahap 4: Upload public/build/ ke /public_html/kakroz.my.id/

### After Upload:
- [ ] Tahap 5: Testing checklist di DEPLOYMENT_OBSERVASI.md

---

## 🔍 FILE LOCATIONS SUMMARY

### Lokal (Source):
```
C:\laragon\www\portal-sekolah-v2\
├── composer.json
├── composer.lock
├── app/Models/PraObservasiCatatan.php
├── app/Models/PraObservasiInstrumen.php
├── app/Http/Controllers/PraObservasiController.php
├── app/Concerns/HasNotificationBadges.php
├── app/Models/User.php
├── routes/web.php
├── database/migrations/2026_08_11_*.php (3 files)
└── public/build/ (after npm run build)
```

### Hosting (Destination):
```
/kakroz-app/
├── composer.json
├── composer.lock
├── vendor/
├── app/Models/PraObservasiCatatan.php
├── app/Models/PraObservasiInstrumen.php
├── app/Http/Controllers/PraObservasiController.php
├── app/Concerns/HasNotificationBadges.php
├── app/Models/User.php
├── routes/web.php
├── database/migrations/2026_08_11_*.php (3 files)
└── public/build/

/public_html/kakroz.my.id/
└── build/
```

---

## ⚠️ CRITICAL NOTES

1. **Don't Skip Steps**: Tahap 1 (DB) MUST be before Tahap 3 (PHP)
2. **Shared Hosting**: No SSH, all via cPanel File Manager + phpMyAdmin
3. **File Size**: vendor/ ~50 MB - may need multiple uploads or ZIP compression
4. **Overwrite Policy**: 
   - composer.json/lock: REPLACE (force)
   - User.php, HasNotificationBadges.php, web.php: REPLACE (merge is risky)
   - PraObservasi*.php: CREATE NEW (shouldn't exist)
   - vendor/: REPLACE or merge carefully
5. **Extensions Check**: After upload, verify PHP extensions (zip, xml, mbstring, gd)
6. **Cache Clear**: May need to clear route cache locally, push update

---

## 📊 SUMMARY

| Tahap | Files | Size | Time | Status |
|-------|-------|------|------|--------|
| 1. DB | SQL (3 commands) | - | 5 min | ⏳ |
| 2. Vendor | composer + vendor/ | ~50 MB | 15 min | ⏳ |
| 3. PHP | 6 files + 3 migrations | ~30 KB | 10 min | ⏳ |
| 4. React | public/build/ | ~20 MB | 20 min | ⏳ |
| 5. Test | - | - | 15 min | ⏳ |

**Total**: ~65 MB upload, ~1 hour total time

---

**Generated**: 2026-08-14
**Version**: 1.0
**Status**: READY FOR DEPLOYMENT
