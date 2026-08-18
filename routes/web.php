<?php

use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DokumentasiController;
use App\Http\Controllers\Humas\HumasKegiatanController;
use App\Http\Controllers\IjinController;
use App\Http\Controllers\JurnalRefleksiController;
use App\Http\Controllers\Kesiswaan\KegiatanController;
use App\Http\Controllers\Kesiswaan\LombaController;
use App\Http\Controllers\Kurikulum\KurikulumKegiatanController;
use App\Http\Controllers\ModulAjarController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ObservasiPelaksanaanController;
use App\Http\Controllers\PascaObservasiController;
use App\Http\Controllers\PraObservasiController;
use App\Http\Controllers\Sarpras\SarprasKegiatanController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

// UBAH RUTE ROOT UTAMA:
// Pastikan diberi nama ->name('home') di ujungnya!
Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

// 🔑 Ganti grup middleware Anda menjadi seperti ini:
Route::middleware(['auth', 'verified'])->group(function () {

    // Rute dashboard lama yang menggunakan Route::inertia dipotong & diganti ke Controller:
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// ==========================================
// 1. RUTE UMUM (Akses Guru & Admin)
// ==========================================
Route::middleware(['auth'])->group(function () {
    Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
    Route::get('/berita/create', [BeritaController::class, 'create'])->name('berita.create');
    Route::post('/berita', [BeritaController::class, 'store'])->name('berita.store');
    Route::get('/berita/export', [BeritaController::class, 'export'])->name('berita.export');
    Route::get('/berita/{id}', [BeritaController::class, 'show'])->name('berita.show');
    Route::get('/berita/{id}/edit', [BeritaController::class, 'edit'])->name('berita.edit');
    Route::put('/berita/{id}', [BeritaController::class, 'update'])->name('berita.update');
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])->name('berita.destroy');
    Route::post('/berita/{id}/komentar', [BeritaController::class, 'storeKomentar'])->name('berita.komentar.store');
    Route::delete('/komentar/{id}', [BeritaController::class, 'destroyKomentar'])->name('komentar.destroy');
    Route::get('/notifications/count', [NotificationController::class, 'count'])->name('notifications.count');
    Route::get('/kesiswaan/lomba', [LombaController::class, 'index'])->name('kesiswaan.lomba.index');
    Route::get('/kesiswaan/lomba/create', [LombaController::class, 'create'])->name('kesiswaan.lomba.create');
    Route::post('/kesiswaan/lomba', [LombaController::class, 'store'])->name('kesiswaan.lomba.store');
    Route::put('/kesiswaan/lomba/{id}/status', [LombaController::class, 'updateStatus'])->name('kesiswaan.lomba.status');
    // Tambahkan dua rute baru ini di dalam grup middleware auth Anda
    Route::post('/kesiswaan/lomba/bulk-delete', [LombaController::class, 'bulkDelete'])->name('kesiswaan.lomba.bulkDelete');

    Route::get('/kesiswaan/lomba/{id}', [LombaController::class, 'show'])->name('kesiswaan.lomba.show');
    Route::delete('/kesiswaan/lomba/{id}', [LombaController::class, 'destroy'])->name('kesiswaan.lomba.destroy');
    Route::put('/kesiswaan/lomba/{id}/status', [LombaController::class, 'updateStatus'])->name('kesiswaan.lomba.status');
    Route::get('/kesiswaan/lomba/{id}/edit', [LombaController::class, 'edit'])->name('kesiswaan.lomba.edit');
    Route::post('/kesiswaan/lomba/{id}', [LombaController::class, 'update'])->name('kesiswaan.lomba.update');
    Route::get('/kesiswaan/kegiatan', [KegiatanController::class, 'index'])->name('kesiswaan.kegiatan.index');
    Route::get('/kesiswaan/kegiatan/create', [KegiatanController::class, 'create'])->name('kesiswaan.kegiatan.create');
    Route::post('/kesiswaan/kegiatan', [KegiatanController::class, 'store'])->name('kesiswaan.kegiatan.store');
    Route::get('/kesiswaan/lomba/export/csv', [LombaController::class, 'export'])->name('kesiswaan.lomba.export');
    Route::post('/kesiswaan/kegiatan/bulk-delete', [KegiatanController::class, 'bulkDelete'])->name('kesiswaan.kegiatan.bulkDelete');
    Route::get('/kesiswaan/kegiatan/{id}', [KegiatanController::class, 'show'])->name('kesiswaan.kegiatan.show');
    Route::put('/kesiswaan/kegiatan/{id}/status', [KegiatanController::class, 'updateStatus'])->name('kesiswaan.kegiatan.status');
    Route::delete('/kesiswaan/kegiatan/{id}', [KegiatanController::class, 'destroy'])->name('kesiswaan.kegiatan.destroy');

    Route::get('/kesiswaan/kegiatan/export/csv', [KegiatanController::class, 'export'])->name('kesiswaan.kegiatan.export');

    Route::get('/kesiswaan/kegiatan/{id}/edit', [KegiatanController::class, 'edit'])->name('kesiswaan.kegiatan.edit');
    Route::post('/kesiswaan/kegiatan/{id}', [KegiatanController::class, 'update'])->name('kesiswaan.kegiatan.update');
    // --- MODUL UTAMA JURNAL KURIKULUM ---
    Route::get('/kurikulum', [KurikulumKegiatanController::class, 'index'])->name('kurikulum.index');
    Route::get('/kurikulum/create', [KurikulumKegiatanController::class, 'create'])->name('kurikulum.create');
    Route::post('/kurikulum', [KurikulumKegiatanController::class, 'store'])->name('kurikulum.store');
    // Fitur Manajemen Massal & Data Eksternal
    Route::post('/kurikulum/bulk-delete', [KurikulumKegiatanController::class, 'bulkDelete'])->name('kurikulum.bulkDelete');
    Route::get('/kurikulum/export/csv', [KurikulumKegiatanController::class, 'export'])->name('kurikulum.export');
    Route::get('/kurikulum/{id}', [KurikulumKegiatanController::class, 'show'])->name('kurikulum.show');
    Route::get('/kurikulum/{id}/edit', [KurikulumKegiatanController::class, 'edit'])->name('kurikulum.edit');
    Route::post('/kurikulum/{id}', [KurikulumKegiatanController::class, 'update'])->name('kurikulum.update');
    Route::delete('/kurikulum/{id}', [KurikulumKegiatanController::class, 'destroy'])->name('kurikulum.destroy');

    // Verifikasi Status oleh Admin
    Route::put('/kurikulum/{id}/status', [KurikulumKegiatanController::class, 'updateStatus'])->name('kurikulum.status');

    // --- MODUL JURNAL HUMAS ---
    Route::get('/humas', [HumasKegiatanController::class, 'index'])->name('humas.index');
    Route::get('/humas/create', [HumasKegiatanController::class, 'create'])->name('humas.create');
    Route::post('/humas', [HumasKegiatanController::class, 'store'])->name('humas.store');
    Route::post('/humas/bulk-delete', [HumasKegiatanController::class, 'bulkDelete'])->name('humas.bulkDelete');
    Route::get('/humas/export/csv', [HumasKegiatanController::class, 'export'])->name('humas.export');
    Route::get('/humas/{id}', [HumasKegiatanController::class, 'show'])->name('humas.show');
    Route::get('/humas/{id}/edit', [HumasKegiatanController::class, 'edit'])->name('humas.edit');
    Route::post('/humas/{id}', [HumasKegiatanController::class, 'update'])->name('humas.update');
    Route::delete('/humas/{id}', [HumasKegiatanController::class, 'destroy'])->name('humas.destroy');
    Route::put('/humas/{id}/status', [HumasKegiatanController::class, 'updateStatus'])->name('humas.status');

    // 1. Rute Statis (Tanpa Parameter) - Harus di Atas!
    Route::get('/sarpras', [SarprasKegiatanController::class, 'index'])->name('sarpras.index');
    Route::get('/sarpras/create', [SarprasKegiatanController::class, 'create'])->name('sarpras.create');
    Route::post('/sarpras', [SarprasKegiatanController::class, 'store'])->name('sarpras.store');
    Route::post('/sarpras/bulk-delete', [SarprasKegiatanController::class, 'bulkDelete'])->name('sarpras.bulkDelete');
    Route::get('/sarpras/export/csv', [SarprasKegiatanController::class, 'export'])->name('sarpras.export');

    // 2. Rute Dinamis (Menggunakan Parameter {id}) - Harus di Bawah!
    Route::get('/sarpras/{id}', [SarprasKegiatanController::class, 'show'])->name('sarpras.show');
    Route::get('/sarpras/{id}/edit', [SarprasKegiatanController::class, 'edit'])->name('sarpras.edit');
    Route::post('/sarpras/{id}', [SarprasKegiatanController::class, 'update'])->name('sarpras.update');
    Route::delete('/sarpras/{id}', [SarprasKegiatanController::class, 'destroy'])->name('sarpras.destroy');
    Route::put('/sarpras/{id}/status', [SarprasKegiatanController::class, 'updateStatus'])->name('sarpras.status');

    Route::get('/ijin', [IjinController::class, 'index'])->name('ijin.index');
    Route::get('/ijin/create', [IjinController::class, 'create'])->name('ijin.create');
    Route::post('/ijin', [IjinController::class, 'store'])->name('ijin.store');
    // Tempatkan di dalam grup Route::middleware(['auth'])
    Route::post('/ijin/bulk-delete', [IjinController::class, 'bulkDelete'])->name('ijin.bulkDelete');
    Route::get('/ijin/export/csv', [IjinController::class, 'export'])->name('ijin.export');
    Route::get('/ijin/{id}', [IjinController::class, 'show'])->name('ijin.show');
    Route::get('/ijin/{id}/edit', [IjinController::class, 'edit'])->name('ijin.edit');
    Route::post('/ijin/{id}', [IjinController::class, 'update'])->name('ijin.update');
    Route::delete('/ijin/{id}', [IjinController::class, 'destroy'])->name('ijin.destroy');

    // Khusus Admin merubah status izin (disetujui/ditolak)
    Route::put('/ijin/{id}/status', [IjinController::class, 'updateStatus'])->name('ijin.status');

    Route::post('/jurnal-refleksi/bulk-delete', [JurnalRefleksiController::class, 'bulkDelete'])->name('jurnal-refleksi.bulkDelete');
    Route::get('/jurnal-refleksi/export/csv', [JurnalRefleksiController::class, 'export'])->name('jurnal-refleksi.export');

    Route::get('/jurnal-refleksi', [JurnalRefleksiController::class, 'index'])->name('jurnal-refleksi.index');
    Route::get('/jurnal-refleksi/create', [JurnalRefleksiController::class, 'create'])->name('jurnal-refleksi.create');
    Route::post('/jurnal-refleksi', [JurnalRefleksiController::class, 'store'])->name('jurnal-refleksi.store');
    Route::get('/jurnal-refleksi/{id}', [JurnalRefleksiController::class, 'show'])->name('jurnal-refleksi.show');
    Route::get('/jurnal-refleksi/{id}/edit', [JurnalRefleksiController::class, 'edit'])->name('jurnal-refleksi.edit');
    Route::post('/jurnal-refleksi/{id}', [JurnalRefleksiController::class, 'update'])->name('jurnal-refleksi.update');
    Route::delete('/jurnal-refleksi/{id}', [JurnalRefleksiController::class, 'destroy'])->name('jurnal-refleksi.destroy');

    // --- MODUL OBSERVASI: PRA OBSERVASI ---
    Route::get('/observasi', [PraObservasiController::class, 'index'])->name('observasi.index');

    // Form A: Lembar Catatan Percakapan Pra-Observasi Kelas
    Route::get('/observasi/pra-catatan/create', [PraObservasiController::class, 'createCatatan'])->name('observasi.catatan.create');
    Route::post('/observasi/pra-catatan', [PraObservasiController::class, 'storeCatatan'])->name('observasi.catatan.store');
    Route::get('/observasi/pra-catatan/{id}', [PraObservasiController::class, 'showCatatan'])->name('observasi.catatan.show');
    Route::get('/observasi/pra-catatan/{id}/edit', [PraObservasiController::class, 'editCatatan'])->name('observasi.catatan.edit');
    Route::put('/observasi/pra-catatan/{id}', [PraObservasiController::class, 'updateCatatan'])->name('observasi.catatan.update');
    Route::delete('/observasi/pra-catatan/{id}', [PraObservasiController::class, 'destroyCatatan'])->name('observasi.catatan.destroy');
    Route::get('/observasi/pra-catatan/{id}/export/word', [PraObservasiController::class, 'exportWordCatatan'])->name('observasi.catatan.exportWord');

    // Form B: Instrumen Umpan Balik Perencanaan Pembelajaran Mendalam
    Route::get('/observasi/pra-instrumen/create', [PraObservasiController::class, 'createInstrumen'])->name('observasi.instrumen.create');
    Route::post('/observasi/pra-instrumen', [PraObservasiController::class, 'storeInstrumen'])->name('observasi.instrumen.store');
    Route::get('/observasi/pra-instrumen/{id}', [PraObservasiController::class, 'showInstrumen'])->name('observasi.instrumen.show');
    Route::get('/observasi/pra-instrumen/{id}/edit', [PraObservasiController::class, 'editInstrumen'])->name('observasi.instrumen.edit');
    Route::put('/observasi/pra-instrumen/{id}', [PraObservasiController::class, 'updateInstrumen'])->name('observasi.instrumen.update');
    Route::delete('/observasi/pra-instrumen/{id}', [PraObservasiController::class, 'destroyInstrumen'])->name('observasi.instrumen.destroy');
    Route::get('/observasi/pra-instrumen/{id}/export/excel', [PraObservasiController::class, 'exportExcelInstrumen'])->name('observasi.instrumen.exportExcel');

    // Form C: Observasi Pelaksanaan (Implementasi dan Refleksi)
    Route::get('/observasi/pelaksanaan', [ObservasiPelaksanaanController::class, 'index'])->name('observasi.pelaksanaan.index');
    Route::get('/observasi/pelaksanaan/create', [ObservasiPelaksanaanController::class, 'create'])->name('observasi.pelaksanaan.create');
    Route::post('/observasi/pelaksanaan', [ObservasiPelaksanaanController::class, 'store'])->name('observasi.pelaksanaan.store');
    Route::get('/observasi/pelaksanaan/{id}', [ObservasiPelaksanaanController::class, 'show'])->name('observasi.pelaksanaan.show');
    Route::get('/observasi/pelaksanaan/{id}/edit', [ObservasiPelaksanaanController::class, 'edit'])->name('observasi.pelaksanaan.edit');
    Route::put('/observasi/pelaksanaan/{id}', [ObservasiPelaksanaanController::class, 'update'])->name('observasi.pelaksanaan.update');
    Route::delete('/observasi/pelaksanaan/{id}', [ObservasiPelaksanaanController::class, 'destroy'])->name('observasi.pelaksanaan.destroy');
    Route::get('/observasi/pelaksanaan/{id}/export/excel', [ObservasiPelaksanaanController::class, 'exportExcel'])->name('observasi.pelaksanaan.exportExcel');

    // Form D: Pasca Observasi (Lembar Catatan Percakapan Pasca-Observasi)
    Route::get('/pasca-observasi', [PascaObservasiController::class, 'index'])->name('pasca-observasi.index');
    Route::get('/pasca-observasi/create', [PascaObservasiController::class, 'create'])->name('pasca-observasi.create');
    Route::post('/pasca-observasi', [PascaObservasiController::class, 'store'])->name('pasca-observasi.store');
    Route::get('/pasca-observasi/{id}', [PascaObservasiController::class, 'show'])->name('pasca-observasi.show');
    Route::get('/pasca-observasi/{id}/edit', [PascaObservasiController::class, 'edit'])->name('pasca-observasi.edit');
    Route::put('/pasca-observasi/{id}', [PascaObservasiController::class, 'update'])->name('pasca-observasi.update');
    Route::delete('/pasca-observasi/{id}', [PascaObservasiController::class, 'destroy'])->name('pasca-observasi.destroy');
    Route::get('/pasca-observasi/{id}/export/word', [PascaObservasiController::class, 'exportWord'])->name('pasca-observasi.exportWord');

    // RPP / Modul Ajar (upload file, guru upload, admin lihat semua)
    Route::get('/observasi/rpp', [ModulAjarController::class, 'index'])->name('observasi.rpp.index');
    Route::get('/observasi/rpp/create', [ModulAjarController::class, 'create'])->name('observasi.rpp.create');
    Route::post('/observasi/rpp', [ModulAjarController::class, 'store'])->name('observasi.rpp.store');
    Route::get('/observasi/rpp/{id}', [ModulAjarController::class, 'show'])->name('observasi.rpp.show');
    Route::get('/observasi/rpp/{id}/edit', [ModulAjarController::class, 'edit'])->name('observasi.rpp.edit');
    Route::put('/observasi/rpp/{id}', [ModulAjarController::class, 'update'])->name('observasi.rpp.update');
    Route::get('/observasi/rpp/{id}/download', [ModulAjarController::class, 'download'])->name('observasi.rpp.download');
    Route::delete('/observasi/rpp/{id}', [ModulAjarController::class, 'destroy'])->name('observasi.rpp.destroy');

    // Dokumentasi (multi-gambar, guru upload, admin lihat semua)
    Route::get('/observasi/dokumentasi', [DokumentasiController::class, 'index'])->name('observasi.dokumentasi.index');
    Route::get('/observasi/dokumentasi/create', [DokumentasiController::class, 'create'])->name('observasi.dokumentasi.create');
    Route::post('/observasi/dokumentasi', [DokumentasiController::class, 'store'])->name('observasi.dokumentasi.store');
    Route::get('/observasi/dokumentasi/{id}', [DokumentasiController::class, 'show'])->name('observasi.dokumentasi.show');
    Route::get('/observasi/dokumentasi/{id}/edit', [DokumentasiController::class, 'edit'])->name('observasi.dokumentasi.edit');
    Route::put('/observasi/dokumentasi/{id}', [DokumentasiController::class, 'update'])->name('observasi.dokumentasi.update');
    Route::delete('/observasi/dokumentasi/{id}', [DokumentasiController::class, 'destroy'])->name('observasi.dokumentasi.destroy');
    Route::delete('/observasi/dokumentasi/gambar/{id}', [DokumentasiController::class, 'hapusGambar'])->name('observasi.dokumentasi.gambar.destroy');
    Route::get('/observasi/dokumentasi/gambar/{id}/download', [DokumentasiController::class, 'downloadGambar'])->name('observasi.dokumentasi.gambar.download');
});

// ==========================================
// 2. RUTE KHUSUS ADMIN (Kelola Data)
// ==========================================
// 👇 Tambahkan AdminMiddleware di dalam array middleware ini:
Route::middleware(['auth', AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::post('/berita/bulk-delete', [BeritaController::class, 'bulkDelete'])->name('berita.bulk_delete');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/settings.php';
