<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Kesiswaan\KegiatanController;
use App\Http\Controllers\Kurikulum\KurikulumKegiatanController;
use App\Http\Controllers\Humas\HumasKegiatanController;
use App\Http\Controllers\Sarpras\SarprasKegiatanController;
use App\Http\Controllers\IjinController;
use App\Http\Controllers\JurnalRefleksiController;
use App\Http\Controllers\DashboardController;

// UBAH RUTE ROOT UTAMA:
// Pastikan diberi nama ->name('home') di ujungnya!
Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

// 🔑 Ganti grup middleware Anda menjadi seperti ini:
Route::middleware(['auth', 'verified'])->group(function () {

    // Rute dashboard lama yang menggunakan Route::inertia dipotong & diganti ke Controller:
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
});

// ==========================================
// 1. RUTE UMUM (Akses Guru & Admin)
// ==========================================
Route::middleware(['auth'])->group(function () {
    Route::get('/berita', [BeritaController::class, 'index'])->name('berita.index');
    Route::get('/berita/{id}', [BeritaController::class, 'show'])->name('berita.show');
    Route::post('/berita/{id}/komentar', [BeritaController::class, 'storeKomentar'])->name('berita.komentar.store');
    Route::delete('/komentar/{id}', [BeritaController::class, 'destroyKomentar'])->name('komentar.destroy');
    Route::get('/kesiswaan/lomba', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'index'])->name('kesiswaan.lomba.index');
    Route::get('/kesiswaan/lomba/create', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'create'])->name('kesiswaan.lomba.create');
    Route::post('/kesiswaan/lomba', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'store'])->name('kesiswaan.lomba.store');
    Route::put('/kesiswaan/lomba/{id}/status', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'updateStatus'])->name('kesiswaan.lomba.status');
    // Tambahkan dua rute baru ini di dalam grup middleware auth Anda
    Route::post('/kesiswaan/lomba/bulk-delete', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'bulkDelete'])->name('kesiswaan.lomba.bulkDelete');

    Route::get('/kesiswaan/lomba/{id}', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'show'])->name('kesiswaan.lomba.show');
    Route::delete('/kesiswaan/lomba/{id}', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'destroy'])->name('kesiswaan.lomba.destroy');
    Route::put('/kesiswaan/lomba/{id}/status', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'updateStatus'])->name('kesiswaan.lomba.status');
    Route::get('/kesiswaan/lomba/{id}/edit', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'edit'])->name('kesiswaan.lomba.edit');
    Route::post('/kesiswaan/lomba/{id}', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'update'])->name('kesiswaan.lomba.update');
    Route::get('/kesiswaan/kegiatan', [KegiatanController::class, 'index'])->name('kesiswaan.kegiatan.index');
    Route::get('/kesiswaan/kegiatan/create', [KegiatanController::class, 'create'])->name('kesiswaan.kegiatan.create');
    Route::post('/kesiswaan/kegiatan', [KegiatanController::class, 'store'])->name('kesiswaan.kegiatan.store');
    Route::get('/kesiswaan/lomba/export/csv', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'export'])->name('kesiswaan.lomba.export');
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
});

// ==========================================
// 2. RUTE KHUSUS ADMIN (Kelola Data)
// ==========================================
// 👇 Tambahkan AdminMiddleware di dalam array middleware ini:
Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/berita/create', [BeritaController::class, 'create'])->name('berita.create');
    Route::post('/berita', [BeritaController::class, 'store'])->name('berita.store');
    Route::get('/berita/{id}/edit', [BeritaController::class, 'edit'])->name('berita.edit');
    Route::put('/berita/{id}', [BeritaController::class, 'update'])->name('berita.update');
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])->name('berita.destroy');
    Route::post('/berita/bulk-delete', [BeritaController::class, 'bulkDelete'])->name('berita.bulk_delete');
    Route::get('/berita/export', [BeritaController::class, 'export'])->name('berita.export');
    Route::get('/users', [\App\Http\Controllers\Admin\UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [\App\Http\Controllers\Admin\UserController::class, 'create'])->name('users.create');
    Route::post('/users', [\App\Http\Controllers\Admin\UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}/edit', [\App\Http\Controllers\Admin\UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [\App\Http\Controllers\Admin\UserController::class, 'destroy'])->name('users.destroy');
});


require __DIR__ . '/settings.php';
