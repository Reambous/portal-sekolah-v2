# Portal Sekolah v2

Sistem Informasi Manajemen Sekolah berbasis web untuk mengelola administrasi operasional sekolah, mulai dari publikasi berita, pencatatan prestasi lomba, jurnal kegiatan multi-bidang, jurnal refleksi guru, pengajuan izin, hingga manajemen akun pengguna.

## Tech Stack & Tools

| Kategori | Teknologi |
|----------|-----------|
| **Backend** | PHP 8.3, Laravel 13.x |
| **Frontend** | React 19, TypeScript, Inertia.js v3 |
| **CSS** | Tailwind CSS v4, `tw-animate-css` |
| **UI Components** | Radix UI (Avatar, Dialog, Dropdown, Select, Sidebar, Toggle, Tooltip, dll), Lucide React (ikon) |
| **State/Form** | Inertia (useForm, usePage, router) |
| **Auth** | Laravel Fortify (login, register, 2FA, Passkeys/WebAuthn, email verification) |
| **Build** | Vite 8.x, `@vitejs/plugin-react`, React Compiler (`babel-plugin-react-compiler`) |
| **Type Safety** | TypeScript 5.7+, Laravel Wayfinder (rute type-safe), Larastan/PHPStan |
| **Testing** | Pest 4.x, PHPUnit 12 |
| **Code Quality** | Laravel Pint, ESLint 9.x, Prettier |
| **Database** | MySQL (via migration), SQLite (default/dev) |
| **Toast/Notif** | Sonner |
| **Utility** | CVA, CLSX, Tailwind Merge, `input-otp` |

## Key Features / Fitur Utama

### 1. Dashboard
Hero carousel slider otomatis, tampilan prestasi terbaru, berita terkini, dan refleksi guru dalam satu halaman.

### 2. Berita & Pengumuman (Papan Pengumuman)
- CRUD berita dengan upload gambar + lampiran dokumen (PDF, DOC, DOCX)
- Sistem komentar/diskusi pada setiap berita
- Pencarian judul
- Hapus massal & export CSV (admin)

### 3. Kesiswaan — Lomba
Catat dan kelola data lomba siswa: jenis lomba, daftar peserta, prestasi yang diraih, dan refleksi kegiatan. Dilengkapi upload bukti gambar.

### 4. Kesiswaan — Kegiatan
Catat kegiatan kesiswaan dengan dokumentasi foto dan lampiran file pendukung.

### 5. Kurikulum
Jurnal kegiatan kurikulum dengan fitur verifikasi status (pending / disetujui), export CSV, dan hapus massal.

### 6. Humas
Jurnal kegiatan Hubungan Masyarakat (Humas) dengan verifikasi status, export CSV, dan hapus massal.

### 7. Sarpras
Jurnal kegiatan Sarana dan Prasarana dengan verifikasi status, export CSV, dan hapus massal.

### 8. Izin / Perizinan Guru
- Pengajuan izin oleh guru (tanggal, jam, alasan, bukti foto)
- Status: pending, disetujui, ditolak
- Export CSV & hapus massal

### 9. Jurnal Refleksi Guru
Catatan refleksi harian/mingguan guru per kategori (Evaluasi Kelas, Pengembangan Diri, Diskusi Sejawat, dll) dengan upload bukti file.

### 10. Manajemen Akun (Admin)
- CRUD akun pengguna (guru & admin)
- Setiap user memiliki role: `admin` atau `guru`
- Login via email atau NIP

### 11. Autentikasi & Keamanan
- Registrasi & login
- Verifikasi email
- Lupa password & reset password
- Two-Factor Authentication (2FA)
- Passkeys (WebAuthn) — login tanpa password
- Session management

### 12. Pengaturan
- Edit profil
- Ganti password
- Tampilan (light/dark mode)
- Keamanan (2FA, passkey)

## Screenshots

> _Coming soon — tambahkan screenshot aplikasi di folder `public/screenshots/` atau gunakan URL gambar eksternal._

<!-- Contoh:
![Dashboard](public/screenshots/dashboard.png)
![Berita](public/screenshots/berita.png)
-->
