<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\BeritaController;

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
});

// ==========================================
// 2. RUTE KHUSUS ADMIN (Kelola Data)
// ==========================================
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/berita/create', [BeritaController::class, 'create'])->name('berita.create');
    Route::post('/berita', [BeritaController::class, 'store'])->name('berita.store');
    Route::get('/berita/{id}/edit', [BeritaController::class, 'edit'])->name('berita.edit');
    Route::put('/berita/{id}', [BeritaController::class, 'update'])->name('berita.update');
    Route::delete('/berita/{id}', [BeritaController::class, 'destroy'])->name('berita.destroy');
    Route::post('/berita/bulk-delete', [BeritaController::class, 'bulkDelete'])->name('berita.bulk_delete');
    Route::get('/berita/export', [BeritaController::class, 'export'])->name('berita.export');
});

require __DIR__ . '/settings.php';
