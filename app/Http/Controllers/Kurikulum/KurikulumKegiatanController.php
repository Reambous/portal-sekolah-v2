<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class KurikulumKegiatanController extends Controller
{
    public function index(Request $request)
    {
        $query = Kegiatan::with('user')->where('kategori', 'kurikulum')->latest();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_kegiatan', 'like', "%{$search}%")
                    ->orWhere('refleksi', 'like', "%{$search}%");
            });
        }

        $kegiatan = $query->paginate(10)->withQueryString();

        return Inertia::render('kurikulum/index', [
            'kegiatan' => $kegiatan,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('kurikulum/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'nama_kegiatan' => 'required|string|max:255',
            'refleksi' => 'required|string',
            'bukti_gambar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'lampiran' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
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
            'kategori' => 'kurikulum',
            'nama_kegiatan' => $validated['nama_kegiatan'],
            'refleksi' => $validated['refleksi'],
            'bukti_gambar' => $gambarPath,
            'lampiran' => $lampiranPath,
            'nama_file_asli' => $namaAsli,
            'status' => 'pending',
        ]);

        return redirect('/kurikulum')->with('success', 'Jurnal kurikulum berhasil dicatat!');
    }

    public function show($id)
    {
        $kegiatan = Kegiatan::with('user')->where('kategori', 'kurikulum')->findOrFail($id);
        return Inertia::render('kurikulum/show', [
            'kegiatan' => $kegiatan
        ]);
    }

    public function edit($id)
    {
        $kegiatan = Kegiatan::where('kategori', 'kurikulum')->findOrFail($id);
        return Inertia::render('kurikulum/edit', [
            'kegiatan' => $kegiatan
        ]);
    }

    public function update(Request $request, $id)
    {

        $kegiatan = Kegiatan::where('kategori', 'kurikulum')->findOrFail($id);
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // 🔒 JIKA SUDAH DISETUJUI: Hanya Admin yang boleh edit. Guru biasa ditolak!
        if ($kegiatan->status === 'disetujui' && $user->role !== 'admin') {
            abort(403, 'Data sudah disetujui Admin dan tidak dapat diubah.');
        }

        // Hak akses dasar (Owner atau Admin)
        if ($user->role !== 'admin' && $user->id !== $kegiatan->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'nama_kegiatan' => 'required|string|max:255',
            'refleksi' => 'required|string',
            'bukti_gambar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'lampiran' => 'nullable|file|mimes:pdf,doc,docx|max:5120',
        ]);

        if ($request->hasFile('bukti_gambar')) {
            if ($kegiatan->bukti_gambar) {
                Storage::disk('public')->delete($kegiatan->bukti_gambar);
            }
            $kegiatan->bukti_gambar = $request->file('bukti_gambar')->store('kegiatan/gambar', 'public');
        }

        if ($request->hasFile('lampiran')) {
            if ($kegiatan->lampiran) {
                Storage::disk('public')->delete($kegiatan->lampiran);
            }
            $file = $request->file('lampiran');
            $kegiatan->nama_file_asli = $file->getClientOriginalName();
            $kegiatan->lampiran = $file->store('kegiatan/lampiran', 'public');
        }

        $kegiatan->tanggal = $validated['tanggal'];
        $kegiatan->nama_kegiatan = $validated['nama_kegiatan'];
        $kegiatan->refleksi = $validated['refleksi'];
        $kegiatan->save();

        return redirect()->to("/kurikulum/{$id}")->with('success', 'Jurnal kurikulum diperbarui!');
    }

    public function updateStatus(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403);
        }
        $request->validate(['status' => 'required|in:pending,disetujui']);
        Kegiatan::findOrFail($id)->update(['status' => $request->status]);
        return redirect()->back()->with('success', 'Status jurnal berhasil diperbarui!');
    }

    public function destroy($id)
    {
        /** @var \App\Models\User $user */
        $kegiatan = Kegiatan::findOrFail($id);
        $user = Auth::user();

        // 🔒 JIKA SUDAH DISETUJUI: Hanya Admin yang boleh hapus.
        if ($kegiatan->status === 'disetujui' && $user->role !== 'admin') {
            abort(403, 'Data sudah disetujui Admin dan tidak dapat dihapus.');
        }

        if ($user->role !== 'admin' && $user->id !== $kegiatan->user_id) {
            abort(403);
        }

        if ($kegiatan->bukti_gambar) {
            Storage::disk('public')->delete($kegiatan->bukti_gambar);
        }
        if ($kegiatan->lampiran) {
            Storage::disk('public')->delete($kegiatan->lampiran);
        }

        $kegiatan->delete();
        return redirect('/kurikulum')->with('success', 'Data jurnal berhasil dihapus!');
    }

    public function bulkDelete(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
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
        return redirect()->back()->with('success', count($request->ids) . ' data jurnal berhasil dihapus massal!');
    }

    public function export()
    {
        $kegiatan = Kegiatan::with('user')->where('kategori', 'kurikulum')->latest()->get();
        $fileName = 'Laporan_Jurnal_Kurikulum.csv';

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($kegiatan) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Tanggal', 'Nama Kegiatan', 'Evaluasi / Refleksi', 'Penginput', 'Status']);
            foreach ($kegiatan as $row) {
                fputcsv($file, [$row->id, $row->tanggal, $row->nama_kegiatan, $row->refleksi, $row->user ? $row->user->name : '-', $row->status]);
            }
            fclose($file);
        };
        return response()->stream($callback, 200, $headers);
    }
}
