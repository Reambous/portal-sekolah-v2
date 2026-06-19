<?php

namespace App\Http\Controllers\Kesiswaan;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan; // Pastikan Anda sudah membuat Model Kegiatan
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class KegiatanController extends Controller
{
    // 1. Tampilkan Daftar Kegiatan Kesiswaan
    public function index(Request $request)
    {
        // Menyaring data khusus kategori 'kesiswaan'
        $query = Kegiatan::with('user')->where('kategori', 'kesiswaan')->latest();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_kegiatan', 'like', "%{$search}%")
                    ->orWhere('refleksi', 'like', "%{$search}%");
            });
        }

        $kegiatan = $query->paginate(10)->withQueryString();

        return Inertia::render('kesiswaan/kegiatan/index', [
            'kegiatan' => $kegiatan,
            'filters' => $request->only(['search'])
        ]);
    }

    // 2. Form Tambah Kegiatan
    public function create()
    {
        return Inertia::render('kesiswaan/kegiatan/create');
    }

    // 3. Simpan Data Kegiatan Baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'nama_kegiatan' => 'required|string|max:255',
            'refleksi' => 'required|string',
            'bukti_gambar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096', // Foto dokumentasi
            'lampiran' => 'nullable|file|mimes:pdf,doc,docx|max:5120',           // Dokumen pendukung
        ]);

        $gambarPath = null;
        $lampiranPath = null;
        $namaAsli = null;

        if ($request->hasFile('bukti_gambar')) {
            $gambarPath = $request->file('bukti_gambar')->store('kegiatan/gambar', 'public');
        }

        if ($request->hasFile('lampiran')) {
            $file = $request->file('lampiran');
            $namaAsli = $file->getClientOriginalName();
            $lampiranPath = $file->store('kegiatan/lampiran', 'public');
        }

        /** @var \App\Models\User $user */
        $user = $request->user();

        Kegiatan::create([
            'user_id' => $user->id,
            'tanggal' => $validated['tanggal'],
            'kategori' => 'kesiswaan', // Otomatis terkunci ke kesiswaan
            'nama_kegiatan' => $validated['nama_kegiatan'],
            'refleksi' => $validated['refleksi'],
            'bukti_gambar' => $gambarPath,
            'lampiran' => $lampiranPath,
            'nama_file_asli' => $namaAsli,
            'status' => 'pending',
        ]);

        return redirect('/kesiswaan/kegiatan')->with('success', 'Catatan kegiatan kesiswaan berhasil diajukan!');
    }

    // 4. Detail Tampilan Kegiatan
    public function show($id)
    {
        $kegiatan = Kegiatan::with('user')->where('kategori', 'kesiswaan')->findOrFail($id);
        return Inertia::render('kesiswaan/kegiatan/show', [
            'kegiatan' => $kegiatan
        ]);
    }

    // 5. Ubah Status ACC Admin
    public function updateStatus(Request $request, $id)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            abort(403);
        }

        $request->validate(['status' => 'required|in:pending,disetujui']);
        $kegiatan = Kegiatan::findOrFail($id);
        $kegiatan->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status kegiatan berhasil diperbarui!');
    }

    // 6. Hapus Data Tunggal
    public function destroy($id)
    {
        $kegiatan = Kegiatan::findOrFail($id);
        $user = Auth::user();

        // 🔒 PROTEKSI KEGIATAN KESISWAAN: Jika sudah di-ACC, Guru dilarang hapus!
        if ($kegiatan->status === 'disetujui' && $user->role !== 'admin') {
            abort(403, 'Data kegiatan sudah disetujui Admin dan tidak dapat dihapus.');
        }

        if ($kegiatan->bukti_gambar) {
            Storage::disk('public')->delete($kegiatan->bukti_gambar);
        }
        if ($kegiatan->lampiran) {
            Storage::disk('public')->delete($kegiatan->lampiran);
        }

        $kegiatan->delete();
        return redirect('/kesiswaan/kegiatan')->with('success', 'Data kegiatan berhasil dihapus!');
    }

    // 7. Bulk Delete (Hapus Massal)
    public function bulkDelete(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            abort(403);
        }
        $request->validate(['ids' => 'required|array']);

        $kegiatan = Kegiatan::whereIn('id', $request->ids)->get();
        foreach ($kegiatan as $item) {
            if ($item->bukti_gambar) {
                Storage::disk('public')->delete($item->bukti_gambar);
            }
            if ($item->lampiran) {
                Storage::disk('public')->delete($item->lampiran);
            }
            $item->delete();
        }

        return redirect()->back()->with('success', count($request->ids) . ' data kegiatan berhasil dihapus massal!');
    }

    // 8. Export ke CSV/Excel
    public function export()
    {
        $kegiatan = Kegiatan::with('user')->where('kategori', 'kesiswaan')->latest()->get();
        $fileName = 'Laporan_Kegiatan_Kesiswaan.csv';

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function () use ($kegiatan) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Tanggal', 'Nama Kegiatan', 'Catatan Evaluasi / Refleksi', 'Penginput', 'Status']);

            foreach ($kegiatan as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->tanggal,
                    $row->nama_kegiatan,
                    $row->refleksi,
                    $row->user ? $row->user->name : '-',
                    $row->status
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    // Menampilkan halaman Form Edit
    public function edit($id)
    {
        $kegiatan = Kegiatan::where('kategori', 'kesiswaan')->findOrFail($id);

        return Inertia::render('kesiswaan/kegiatan/edit', [
            'kegiatan' => $kegiatan
        ]);
    }

    // Memproses data pembaruan (Update)
    public function update(Request $request, $id)
    {
        $kegiatan = Kegiatan::where('kategori', 'kesiswaan')->findOrFail($id);
        $user = Auth::user();

        // 🔒 PROTEKSI KEGIATAN KESISWAAN: Jika sudah di-ACC, Guru dilarang edit!
        if ($kegiatan->status === 'disetujui' && $user->role !== 'admin') {
            abort(403, 'Data kegiatan sudah disetujui Admin dan tidak dapat diubah.');
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'nama_kegiatan' => 'required|string|max:255',
            'refleksi' => 'required|string',
            'bukti_gambar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'lampiran' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        // Urus pergantian Foto Dokumentasi Baru
        if ($request->hasFile('bukti_gambar')) {
            if ($kegiatan->bukti_gambar) {
                Storage::disk('public')->delete($kegiatan->bukti_gambar);
            }
            $kegiatan->bukti_gambar = $request->file('bukti_gambar')->store('kegiatan/gambar', 'public');
        }

        // Urus pergantian Berkas Dokumen Baru
        if ($request->hasFile('lampiran')) {
            if ($kegiatan->lampiran) {
                Storage::disk('public')->delete($kegiatan->lampiran);
            }
            $file = $request->file('lampiran');
            $kegiatan->nama_file_asli = $file->getClientOriginalName();
            $kegiatan->lampiran = $file->store('kegiatan/lampiran', 'public');
        }

        // Simpan data teks yang diubah
        $kegiatan->tanggal = $validated['tanggal'];
        $kegiatan->nama_kegiatan = $validated['nama_kegiatan'];
        $kegiatan->refleksi = $validated['refleksi'];
        $kegiatan->save();

        return redirect()->to("/kesiswaan/kegiatan/{$id}")->with('success', 'Catatan jurnal kegiatan berhasil diperbarui!');
    }
}
