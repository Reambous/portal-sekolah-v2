<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\JurnalRefleksi;
use App\Models\KesiswaanLomba;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ambil 3 Prestasi/Lomba Terbaru (Sesuaikan nama model Kesiswaan/Lomba Anda jika berbeda)
        $juaraTerbaru = class_exists('\App\Models\KesiswaanLomba')
            ? KesiswaanLomba::latest()->take(3)->get(['id', 'jenis_lomba', 'prestasi'])
            : [];

        // 2. Ambil 4 Berita Terbaru (1 untuk Utama, 3 untuk List Samping)
        $beritaTerbaru = class_exists('\App\Models\Berita')
            ? Berita::latest()->take(4)->get(['id', 'judul', 'isi', 'gambar', 'created_at'])
            : [];

        // 3. Ambil 3 Catatan Refleksi Guru Terbaru beserta nama pembuatnya
        $refleksiTerbaru = class_exists('\App\Models\JurnalRefleksi')
            ? JurnalRefleksi::with('user:id,name')->latest()->take(3)->get(['id', 'judul_refleksi', 'tanggal', 'user_id'])
            : [];

        // 🔑 KIRIM DATA DENGAN NAMA VARIABEL YANG COCOK 100% DENGAN TSX
        return Inertia::render('dashboard', [
            'juara_terbaru' => $juaraTerbaru,
            'berita_terbaru' => $beritaTerbaru,
            'refleksi_terbaru' => $refleksiTerbaru,
        ]);
    }
}
