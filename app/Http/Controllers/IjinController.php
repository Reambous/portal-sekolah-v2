<?php

namespace App\Http\Controllers;

use App\Models\Ijin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class IjinController extends Controller
{
    // 1. Tampilkan Daftar Izin (Admin melihat semua, Guru melihat miliknya sendiri)
    public function index(Request $request)
    {
        $user = Auth::user();

        // Buat query dasar
        $query = Ijin::with('user')->latest();

        // Jika bukan admin, batasi hanya melihat datanya sendiri
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        // Fitur Pencarian berdasarkan alasan izin
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('alasan', 'like', "%{$search}%");
        }

        $daftarIjin = $query->paginate(10)->withQueryString();

        return Inertia::render('ijin/index', [
            'daftarIjin' => $daftarIjin,
            'filters' => $request->only(['search']),
        ]);
    }

    // 2. Form Tambah Izin
    public function create()
    {
        return Inertia::render('ijin/create');
    }

    // 3. Simpan Pengajuan Izin
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'nullable|date_format:H:i',
            'jam_selesai' => 'nullable|date_format:H:i',
            'alasan' => 'required|string',
            'bukti_foto' => 'nullable|file|mimes:jpeg,png,jpg,webp,pdf,doc,docx|max:5120',
        ]);

        $fotoPath = null;
        if ($request->hasFile('bukti_foto')) {
            $fotoPath = $request->file('bukti_foto')->store('ijin/bukti', 'public');
        }

        Ijin::create([
            'user_id' => Auth::id(),
            'tanggal' => $validated['tanggal'],
            'jam_mulai' => $validated['jam_mulai'],
            'jam_selesai' => $validated['jam_selesai'],
            'alasan' => $validated['alasan'],
            'bukti_foto' => $fotoPath,
            'status' => 'pending',
        ]);

        return redirect('/ijin')->with('success', 'Pengajuan izin Anda berhasil dikirim!');
    }

    public function show($id)
    {
        $ijin = Ijin::with('user')->findOrFail($id);
        $user = Auth::user();

        // Proteksi: Guru biasa tidak boleh intip izin milik guru lain
        if ($user->role !== 'admin' && $user->id !== $ijin->user_id) {
            abort(403);
        }

        return Inertia::render('ijin/show', [
            'ijin' => $ijin,
        ]);
    }

    // 4. Form Edit Izin
    public function edit($id)
    {
        $ijin = Ijin::findOrFail($id);
        $user = Auth::user();

        // Proteksi: Guru tidak boleh edit jika status sudah diputuskan oleh admin
        if ($ijin->status !== 'pending' && $user->role !== 'admin') {
            abort(403, 'Data izin sudah diproses dan tidak dapat diubah.');
        }

        if ($user->role !== 'admin' && $user->id !== $ijin->user_id) {
            abort(403);
        }

        return Inertia::render('ijin/edit', ['ijin' => $ijin]);
    }

    // 5. Proses Update Perubahan Izin
    public function update(Request $request, $id)
    {
        $ijin = Ijin::findOrFail($id);
        $user = Auth::user();

        if ($ijin->status !== 'pending' && $user->role !== 'admin') {
            abort(403, 'Data izin sudah diproses dan tidak dapat diubah.');
        }

        if ($user->role !== 'admin' && $user->id !== $ijin->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'nullable|date_format:H:i',
            'jam_selesai' => 'nullable|date_format:H:i',
            'alasan' => 'required|string',
            'bukti_foto' => 'nullable|file|mimes:jpeg,png,jpg,webp,pdf,doc,docx|max:5120',
        ]);

        if ($request->hasFile('bukti_foto')) {
            if ($ijin->bukti_foto) {
                Storage::disk('public')->delete($ijin->bukti_foto);
            }
            $ijin->bukti_foto = $request->file('bukti_foto')->store('ijin/bukti', 'public');
        }

        $ijin->tanggal = $validated['tanggal'];
        $ijin->jam_mulai = $validated['jam_mulai'];
        $ijin->jam_selesai = $validated['jam_selesai'];
        $ijin->alasan = $validated['alasan'];
        $ijin->save();

        return redirect('/ijin')->with('success', 'Data pengajuan izin berhasil diperbarui!');
    }

    // 6. Keputusan Admin (ACC / TOLAK)
    public function updateStatus(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403);
        }

        $request->validate([
            'status' => 'required|in:pending,disetujui,ditolak',
        ]);

        $ijin = Ijin::findOrFail($id);
        $ijin->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Keputusan status izin berhasil diperbarui!');
    }

    // 7. Hapus Pengajuan Izin
    public function destroy($id)
    {
        $ijin = Ijin::findOrFail($id);
        $user = Auth::user();

        if ($ijin->status !== 'pending' && $user->role !== 'admin') {
            abort(403, 'Data izin sudah diproses dan tidak dapat dihapus.');
        }

        if ($user->role !== 'admin' && $user->id !== $ijin->user_id) {
            abort(403);
        }

        if ($ijin->bukti_foto) {
            Storage::disk('public')->delete($ijin->bukti_foto);
        }

        $ijin->delete();

        return redirect('/ijin')->with('success', 'Pengajuan izin berhasil dihapus.');
    }

    // 8. Bulk Delete untuk Izin (Khusus Admin)
    public function bulkDelete(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Akses ditolak.');
        }

        $request->validate(['ids' => 'required|array']);

        $ijin = Ijin::whereIn('id', $request->ids)->get();
        foreach ($ijin as $item) {
            if ($item->bukti_foto) {
                Storage::disk('public')->delete($item->bukti_foto);
            }
            $item->delete();
        }

        return redirect()->back()->with('success', count($request->ids).' data pengajuan izin berhasil dihapus massal!');
    }

    // 9. Export CSV Rekap Izin (Khusus Admin/Semua jika diizinkan)
    public function export()
    {
        $user = Auth::user();

        // Admin bisa ekspor semua, Guru hanya ekspor riwayat izinnya sendiri
        $query = Ijin::with('user')->latest();
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $daftarIjin = $query->get();
        $fileName = 'Rekap_Izin_Pegawai_'.date('Y-m-d').'.csv';

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=$fileName",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($daftarIjin) {
            $file = fopen('php://output', 'w');
            // Menulis Header Kolom CSV
            fputcsv($file, ['ID', 'Nama Pegawai', 'Tanggal', 'Jam Mulai', 'Jam Selesai', 'Alasan', 'Status']);

            foreach ($daftarIjin as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->user ? $row->user->name : 'Sistem',
                    $row->tanggal,
                    $row->jam_mulai ?? '-',
                    $row->jam_selesai ?? '-',
                    $row->alasan,
                    strtoupper($row->status),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
