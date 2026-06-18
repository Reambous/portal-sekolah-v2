<?php

namespace App\Http\Controllers\Kesiswaan;

use App\Http\Controllers\Controller;
use App\Models\KesiswaanLomba; // 👈 1. PASTIKAN INI ADA (Menuju folder Models)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LombaController extends Controller
{
    public function index(Request $request)
    {
        $query = KesiswaanLomba::with('user')->latest();

        // Fitur Pencarian tegas ala Kak Roz
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('jenis_lomba', 'like', "%{$search}%")
                ->orWhere('peserta', 'like', "%{$search}%") // 👈 Sekarang bisa cari berdasarkan nama siswa/kelas di sini
                ->orWhere('prestasi', 'like', "%{$search}%");
        }

        $lomba = $query->paginate(10)->withQueryString();

        return Inertia::render('kesiswaan/lomba/index', [
            'lomba' => $lomba,
            'filters' => $request->only(['search'])
        ]);
    }

    // Menampilkan Form Tambah
    public function create()
    {
        return Inertia::render('kesiswaan/lomba/create');
    }

    // Menyimpan data pengajuan (Otomatis Pending)
    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'jenis_lomba' => 'required|string|max:255',
            'peserta' => 'required|array', // Sekarang wajib array
            'prestasi' => 'required|string|max:255',
            'refleksi' => 'required|string',
            'bukti_gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:4096', // Maksimal 4MB
        ]);

        // Proses Upload Gambar
        $pathGambar = null;
        if ($request->hasFile('bukti_gambar')) {
            $pathGambar = $request->file('bukti_gambar')->store('lomba', 'public');
        }

        KesiswaanLomba::create([
            'user_id' => Auth::id(),
            'tanggal' => $request->tanggal,
            'jenis_lomba' => $request->jenis_lomba,
            'peserta' => $request->peserta, // Otomatis jadi JSON berkat Model $casts
            'prestasi' => $request->prestasi,
            'refleksi' => $request->refleksi,
            'bukti_gambar' => $pathGambar, // Simpan path gambar
            'status' => 'pending',
        ]);

        return redirect('/kesiswaan/lomba')->with('success', 'Kegiatan lomba berhasil diajukan! Menunggu ACC Admin.');
    }

    // Fungsi ACC / Tolak oleh Admin
    public function updateStatus(Request $request, $id)
    {
        // Proteksi Lapis Baja: Hanya Admin yang boleh mengeksekusi ini
        // Pastikan user terautentikasi dan memiliki role admin
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403, 'Akses Ditolak! Hanya Admin yang berhak menyetujui atau menolak data lomba.');
        }

        $request->validate([
            'status' => 'required|in:pending,disetujui'
        ]);

        $lomba = KesiswaanLomba::findOrFail($id);
        $lomba->update(['status' => $request->status]);

        $pesan = $request->status === 'disetujui'
            ? '✅ Data lomba telah di-ACC!'
            : '⚠️ Status lomba dikembalikan ke Pending (Ditolak).';

        return redirect()->back()->with('success', $pesan);
    }

    // Menampilkan Detail Lomba
    public function show($id)
    {
        $lomba = KesiswaanLomba::with('user')->findOrFail($id);
        return Inertia::render('kesiswaan/lomba/show', [
            'lomba' => $lomba
        ]);
    }

    // Fungsi Hapus Lomba
    public function destroy($id)
    {
        $lomba = KesiswaanLomba::findOrFail($id);

        // Proteksi Keamanan: Hanya Admin ATAU Guru pemilik data yang bisa menghapus
        if (Auth::user()->role !== 'admin' && Auth::id() !== $lomba->user_id) {
            abort(403, 'Anda tidak berhak menghapus data ini.');
        }

        // Hapus file gambar dari storage jika ada
        if ($lomba->bukti_gambar) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($lomba->bukti_gambar);
        }

        $lomba->delete();

        return redirect('/kesiswaan/lomba')->with('success', 'Data rekaman lomba berhasil dihapus!');
    }

    // Menampilkan Form Edit
    public function edit($id)
    {
        $lomba = KesiswaanLomba::findOrFail($id);

        // Proteksi: Guru tidak boleh mengedit ajuan yang sudah di-ACC
        if (!Auth::check() || (Auth::user()->role !== 'admin' && $lomba->status === 'disetujui')) {
            abort(403, 'Data sudah di-ACC Admin, Anda tidak boleh mengeditnya lagi.');
        }

        return Inertia::render('kesiswaan/lomba/edit', [
            'lomba' => $lomba
        ]);
    }

    // Menyimpan Perubahan Data Lomba
    public function update(Request $request, $id)
    {
        $lomba = KesiswaanLomba::findOrFail($id);

        // Proteksi Lapis Baja
        if (!Auth::check() || (Auth::user()->role !== 'admin' && $lomba->status === 'disetujui')) {
            abort(403, 'Akses ditolak.');
        }

        $request->validate([
            'tanggal' => 'required|date',
            'jenis_lomba' => 'required|string|max:255',
            'peserta' => 'required|array',
            'prestasi' => 'required|string|max:255',
            'refleksi' => 'required|string',
            'bukti_gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        // Urus Gambar Baru jika ada yang diupload
        if ($request->hasFile('bukti_gambar')) {
            // Hapus gambar lama agar storage tidak penuh
            if ($lomba->bukti_gambar) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($lomba->bukti_gambar);
            }
            $lomba->bukti_gambar = $request->file('bukti_gambar')->store('lomba', 'public');
        }

        $lomba->update([
            'tanggal' => $request->tanggal,
            'jenis_lomba' => $request->jenis_lomba,
            'peserta' => $request->peserta,
            'prestasi' => $request->prestasi,
            'refleksi' => $request->refleksi,
        ]);

        return redirect()->to("/kesiswaan/lomba/{$id}")->with('success', 'Data rekaman lomba berhasil diperbarui!');
    }
}
