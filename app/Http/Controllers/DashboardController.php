<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Models\JurnalRefleksi;
use App\Models\KesiswaanLomba;
use App\Models\Setting;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Ambil 3 Prestasi/Lomba Terbaru
        $juaraTerbaru = class_exists('\App\Models\KesiswaanLomba')
            ? KesiswaanLomba::latest()->take(3)->get(['id', 'jenis_lomba', 'prestasi'])
            : [];

        // 2. Ambil 4 Berita Terbaru (1 untuk Utama, 3 untuk List Samping)
        $beritaTerbaru = class_exists('\App\Models\Berita')
            ? Berita::latest()->take(4)->get(['id', 'judul', 'isi', 'gambar', 'created_at'])
            : [];

        // 3. Ambil 3 Catatan Refleksi Guru Terbaru sesuai peran (guru: miliknya, admin: semua)
        $user = Auth::user();
        $refleksiQuery = class_exists('\App\Models\JurnalRefleksi')
            ? JurnalRefleksi::with('user:id,name')->latest()
            : null;

        if ($refleksiQuery && $user && $user->role !== 'admin') {
            $refleksiQuery->where('user_id', $user->id);
        }

        $refleksiTerbaru = $refleksiQuery ? $refleksiQuery->take(3)->get(['id', 'judul_refleksi', 'tanggal', 'user_id']) : [];

        // 4. Pengaturan dashboard: kutipan + slider gambar
        $slider = Setting::getJson('slider_images', []);

        if (empty($slider)) {
            $slider = [
                '/images/slide1.jpg',
                '/images/slide2.jpg',
                '/images/slide3.jpg',
                '/images/slide4.jpg',
            ];
        }

        // 🔑 KIRIM DATA DENGAN NAMA VARIABEL YANG COCOK 100% DENGAN TSX
        $kutipanDefault = '"Setiap hari adalah kesempatan baru untuk membentuk masa depan. Ingatlah bahwa di tangan Bapak/Ibu Guru, terdapat harapan dan mimpi ratusan siswa. Mari kita terus bersinergi menciptakan inovasi pembelajaran."';

        return Inertia::render('dashboard', [
            'juara_terbaru' => $juaraTerbaru,
            'berita_terbaru' => $beritaTerbaru,
            'refleksi_terbaru' => $refleksiTerbaru,
            'kutipan_dashboard' => (string) Setting::get('kutipan_dashboard', $kutipanDefault),
            'slider_images' => $slider,
        ]);
    }
}
