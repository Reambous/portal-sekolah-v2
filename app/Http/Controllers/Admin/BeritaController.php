<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Komentar;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
        $berita = $query->paginate(6)->withQueryString();

        return Inertia::render('admin/berita/index', [
            'berita' => $berita,
            'filters' => $request->only(['search']),
        ]);
    }

    // 1. Menampilkan halaman form
    public function create()
    {
        return Inertia::render('admin/berita/create');
    }

    // 2. Memproses data dari form (Mendukung Gambar Sampul & File Dokumen)
    public function store(Request $request)
    {
        // Validasi inputan terpisah antara gambar dan dokumen
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096', // Khusus Gambar Sampul
            'lampiran' => 'nullable|file|mimes:pdf,doc,docx|max:5120',    // Khusus File Dokumen (Maks 5MB)
        ]);

        // Proses upload file Gambar Sampul jika ada
        $gambarPath = null;
        if ($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('berita/gambar', 'public');
        }

        // Proses upload file Lampiran Dokumen jika ada
        $lampiranPath = null;
        $namaFileAsli = null;
        if ($request->hasFile('lampiran')) {
            $fileLampiran = $request->file('lampiran');
            $namaFileAsli = $fileLampiran->getClientOriginalName(); // Ambil nama file asli (misal: Edaran_Sekolah.pdf)
            $lampiranPath = $fileLampiran->store('berita/lampiran', 'public');
        }

        // Simpan ke database sesuai dengan kolom tabel Anda
        Berita::create([
            'user_id' => $request->user()->id,
            'judul' => $validated['judul'],
            'isi' => $validated['isi'],
            'gambar' => $gambarPath,
            'lampiran' => $lampiranPath,
            'nama_file_asli' => $namaFileAsli,
        ]);

        return redirect('/berita')->with('success', 'Berita berhasil diterbitkan bersama lampiran!');
    }

    // Menampilkan detail satu berita
    public function show($id)
    {
        $berita = Berita::with(['user', 'komentar.user'])->findOrFail($id);

        return Inertia::render('admin/berita/show', [
            'berita' => $berita,
        ]);
    }

    // 3. Menampilkan halaman form Edit
    public function edit($id)
    {
        $berita = Berita::findOrFail($id);

        return Inertia::render('admin/berita/edit', [
            'berita' => $berita,
        ]);
    }

    // 4. Memproses update data (Pembaruan teks, gambar, dan dokumen)
    public function update(Request $request, $id)
    {
        $berita = Berita::findOrFail($id);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'lampiran' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        // Cek apakah ada file GAMBAR SAMPUL baru
        if ($request->hasFile('gambar')) {
            if ($berita->gambar) {
                Storage::disk('public')->delete($berita->gambar);
            }
            $berita->gambar = $request->file('gambar')->store('berita/gambar', 'public');
        }

        // Cek apakah ada file LAMPIRAN DOKUMEN baru
        if ($request->hasFile('lampiran')) {
            if ($berita->lampiran) {
                Storage::disk('public')->delete($berita->lampiran);
            }
            $fileLampiran = $request->file('lampiran');
            $berita->nama_file_asli = $fileLampiran->getClientOriginalName();
            $berita->lampiran = $fileLampiran->store('berita/lampiran', 'public');
        }

        // Update data teks
        $berita->judul = $validated['judul'];
        $berita->isi = $validated['isi'];
        $berita->save();

        return redirect('/berita')->with('success', 'Berita berhasil diperbarui!');
    }

    // 5. Menghapus data tunggal (Hapus gambar & dokumen sekaligus)
    public function destroy($id)
    {
        $berita = Berita::findOrFail($id);

        // Hapus file gambar fisiknya
        if ($berita->gambar) {
            Storage::disk('public')->delete($berita->gambar);
        }

        // Hapus file dokumen fisiknya
        if ($berita->lampiran) {
            Storage::disk('public')->delete($berita->lampiran);
        }

        $berita->delete();

        return redirect('/berita')->with('success', 'Berita berhasil dihapus!');
    }

    // 6. Hapus Massal / Bulk Delete (Membersihkan semua aset dokumen & foto)
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
        ]);

        $berita = Berita::whereIn('id', $request->ids)->get();

        foreach ($berita as $item) {
            // Bersihkan file gambar dari storage
            if ($item->gambar) {
                Storage::disk('public')->delete($item->gambar);
            }
            // Bersihkan file lampiran dokumen dari storage
            if ($item->lampiran) {
                Storage::disk('public')->delete($item->lampiran);
            }
            $item->delete();
        }

        return redirect()->back()->with('success', count($request->ids).' data berita berhasil dihapus secara massal!');
    }

    // 7. Export ke Excel / CSV
    public function export()
    {
        $berita = Berita::with('user')->latest()->get();
        $fileName = 'Laporan_Berita_Sekolah.csv';

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=$fileName",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($berita) {
            $file = fopen('php://output', 'w');

            fputcsv($file, ['ID', 'Judul Pengumuman', 'Nama Penginput', 'Tanggal Terbit']);

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
    public function storeKomentar(Request $request, $id)
    {
        $request->validate([
            'isi' => 'required|string',
        ]);

        Komentar::create([
            'berita_id' => $id,
            'user_id' => $request->user()->id,
            'isi_komentar' => $request->isi,
        ]);

        return redirect()->back()->with('with', 'Komentar berhasil ditambahkan!');
    }

    // Fungsi Hapus Komentar
    public function destroyKomentar($id)
    {
        $komentar = Komentar::findOrFail($id);

        /** @var User $user */
        $user = Auth::user();

        if ($user->id !== $komentar->user_id && $user->role !== 'admin') {
            abort(403, 'Anda tidak berhak menghapus komentar ini.');
        }

        $komentar->delete();

        return redirect()->back()->with('success', 'Tanggapan berhasil dihapus!');
    }
}
