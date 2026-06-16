<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        // 1. Siapkan kerangka query
        $query = Berita::with('user')->withCount('komentar')->latest();

        // 2. Jika ada kata kunci pencarian, filter datanya
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('judul', 'like', "%{$search}%")
                ->orWhere('isi', 'like', "%{$search}%");
        }

        // 3. Gunakan paginate() untuk membatasi 6 berita per halaman
        // withQueryString() berguna agar parameter search tidak hilang saat pindah halaman
        $berita = $query->paginate(6)->withQueryString();

        return Inertia::render('admin/berita/index', [
            'berita' => $berita,
            'filters' => $request->only(['search']) // Kirim balik kata kunci ke React agar tetap tampil di input
        ]);
    }

    // 1. Menampilkan halaman form
    public function create()
    {
        return Inertia::render('admin/berita/create');
    }

    // 2. Memproses data dari form
    public function store(Request $request)
    {
        // Validasi inputan
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:4096', // Maksimal 4MB
        ]);

        // Proses upload gambar jika ada
        $imagePath = null;
        if ($request->hasFile('gambar')) {
            // Gambar akan disimpan di folder storage/app/public/berita
            $imagePath = $request->file('gambar')->store('berita', 'public');
        }

        // Simpan ke database
        // Simpan ke database
        Berita::create([
            // 👇 Gunakan $request->user()->id (tanpa kurung setelah id)
            'user_id' => $request->user()->id,
            'judul' => $validated['judul'],
            'isi' => $validated['isi'],
            'gambar' => $imagePath,
        ]);

        // Kembali ke halaman index
        // ... kode simpan berita ...
        return redirect('/berita')->with('success', 'Berita berhasil diterbitkan!');
    }

    // Menampilkan detail satu berita
    public function show($id)
    {
        // Tarik berita, penulisnya, DAN komentarnya (beserta penulis komentarnya)
        // Pastikan relasi 'komentar' dan 'user' sudah ada di Model Berita & Komentar
        $berita = Berita::with(['user', 'komentar.user'])->findOrFail($id);

        return Inertia::render('admin/berita/show', [
            'berita' => $berita
        ]);
    }

    // 3. Menampilkan halaman form Edit
    public function edit($id)
    {
        $berita = Berita::findOrFail($id);
        return Inertia::render('admin/berita/edit', [
            'berita' => $berita
        ]);
    }

    // 4. Memproses update data
    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:4096',
        ]);

        // Cek apakah ada gambar baru yang diupload
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($berita->gambar) {
                Storage::disk('public')->delete($berita->gambar);
            }
            // Simpan gambar baru
            $berita->gambar = $request->file('gambar')->store('berita', 'public');
        }

        // Update teks
        $berita->judul = $validated['judul'];
        $berita->isi = $validated['isi'];
        $berita->save();

        // ... kode update berita ...
        return redirect('/berita')->with('success', 'Berita berhasil diperbarui!');
    }

    // 5. Menghapus data
    public function destroy($id)
    {
        $berita = Berita::findOrFail($id);

        // Hapus file gambar dari folder (jika ada) agar tidak jadi sampah
        if ($berita->gambar) {
            Storage::disk('public')->delete($berita->gambar);
        }

        $berita->delete();

        // ... kode hapus berita ...
        return redirect('/berita')->with('success', 'Berita berhasil dihapus!');
    }

    // 6. Hapus Massal (Bulk Delete)
    public function bulkDelete(Request $request)
    {
        // Validasi bahwa ada ID yang dikirim
        $request->validate([
            'ids' => 'required|array'
        ]);

        // Ambil semua berita yang ID-nya dicentang
        $berita = Berita::whereIn('id', $request->ids)->get();

        foreach ($berita as $item) {
            // Hapus gambar fisiknya dulu dari folder agar tidak menumpuk
            if ($item->gambar) {
                Storage::disk('public')->delete($item->gambar);
            }
            // Hapus data dari database
            $item->delete();
        }

        // Kembali dengan pesan sukses
        return redirect()->back()->with('success', count($request->ids) . ' data berita berhasil dihapus secara massal!');
    }

    // 7. Export ke Excel / CSV
    public function export()
    {
        $berita = Berita::with('user')->latest()->get();
        $fileName = 'Laporan_Berita_Sekolah.csv';

        // Header agar file langsung ter-download sebagai CSV/Excel
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        // Tulis data ke dalam format Excel/CSV
        $callback = function () use ($berita) {
            $file = fopen('php://output', 'w');

            // Baris pertama (Judul Kolom)
            fputcsv($file, ['ID', 'Judul Pengumuman', 'Nama Penginput', 'Tanggal Terbit']);

            // Baris selanjutnya (Isi Data)
            foreach ($berita as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->judul,
                    $row->user ? $row->user->name : 'Anonim',
                    $row->created_at->format('d M Y H:i'),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    // Fungsi Simpan Komentar
    // Fungsi Simpan Komentar
    public function storeKomentar(Request $request, $id)
    {
        $request->validate([
            'isi' => 'required|string'
        ]);

        // Simpan komentar ke database menggunakan Model yang baru dibuat
        \App\Models\Komentar::create([
            'berita_id' => $id,
            'user_id' => $request->user()->id,
            // 👇 Sesuaikan dengan nama kolom di migration Anda
            'isi_komentar' => $request->isi
        ]);

        return redirect()->back()->with('success', 'Komentar berhasil ditambahkan!');
    }

    // Fungsi Hapus Komentar
    // Fungsi Hapus Komentar
    public function destroyKomentar($id)
    {
        $komentar = \App\Models\Komentar::findOrFail($id);

        // Beri tahu editor bahwa $user ini merujuk ke Model User milik kita
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // CEK KEAMANAN: Pastikan yang menghapus adalah pemilik komentar ATAU Admin
        if ($user->id !== $komentar->user_id && $user->role !== 'admin') {
            abort(403, 'Anda tidak berhak menghapus komentar ini.');
        }

        $komentar->delete();

        return redirect()->back()->with('success', 'Tanggapan berhasil dihapus!');
    }
}
