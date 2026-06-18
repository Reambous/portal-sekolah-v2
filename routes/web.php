<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\BeritaController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Kesiswaan\KegiatanController;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
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
    Route::get('/kesiswaan/lomba/{id}', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'show'])->name('kesiswaan.lomba.show');
    Route::delete('/kesiswaan/lomba/{id}', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'destroy'])->name('kesiswaan.lomba.destroy');
    Route::put('/kesiswaan/lomba/{id}/status', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'updateStatus'])->name('kesiswaan.lomba.status');
    Route::get('/kesiswaan/lomba/{id}/edit', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'edit'])->name('kesiswaan.lomba.edit');
    Route::post('/kesiswaan/lomba/{id}', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'update'])->name('kesiswaan.lomba.update');
    Route::get('/kesiswaan/kegiatan', [KegiatanController::class, 'index'])->name('kesiswaan.kegiatan.index');
    Route::get('/kesiswaan/kegiatan/create', [KegiatanController::class, 'create'])->name('kesiswaan.kegiatan.create');
    Route::post('/kesiswaan/kegiatan', [KegiatanController::class, 'store'])->name('kesiswaan.kegiatan.store');
    Route::get('/kesiswaan/kegiatan/{id}', [KegiatanController::class, 'show'])->name('kesiswaan.kegiatan.show');
    Route::put('/kesiswaan/kegiatan/{id}/status', [KegiatanController::class, 'updateStatus'])->name('kesiswaan.kegiatan.status');
    Route::delete('/kesiswaan/kegiatan/{id}', [KegiatanController::class, 'destroy'])->name('kesiswaan.kegiatan.destroy');
    Route::post('/kesiswaan/kegiatan/bulk-delete', [KegiatanController::class, 'bulkDelete'])->name('kesiswaan.kegiatan.bulkDelete');
    Route::get('/kesiswaan/kegiatan/export/csv', [KegiatanController::class, 'export'])->name('kesiswaan.kegiatan.export');
    Route::get('/kesiswaan/lomba/export/csv', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'export'])->name('kesiswaan.lomba.export');
    Route::get('/kesiswaan/kegiatan/{id}/edit', [KegiatanController::class, 'edit'])->name('kesiswaan.kegiatan.edit');
    Route::post('/kesiswaan/kegiatan/{id}', [KegiatanController::class, 'update'])->name('kesiswaan.kegiatan.update');
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
    Route::put('/kesiswaan/lomba/{id}/status', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'updateStatus'])->name('kesiswaan.lomba.status');
    // Tambahkan dua rute baru ini di dalam grup middleware auth Anda
    Route::post('/kesiswaan/lomba/bulk-delete', [\App\Http\Controllers\Kesiswaan\LombaController::class, 'bulkDelete'])->name('kesiswaan.lomba.bulkDelete');
});

require __DIR__ . '/settings.php';
