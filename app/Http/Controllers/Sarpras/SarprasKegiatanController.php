<?php

namespace App\Http\Controllers\Sarpras;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SarprasKegiatanController extends Controller
{
    public function index(Request $request)
    {
        $query = Kegiatan::with('user')->where('kategori', 'sarpras')->latest();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_kegiatan', 'like', "%{$search}%")
                    ->orWhere('refleksi', 'like', "%{$search}%");
            });
        }

        $kegiatan = $query->paginate(10)->withQueryString();

        return Inertia::render('sarpras/index', [
            'kegiatan' => $kegiatan,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('sarpras/create');
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

        $user = Auth::user();

        Kegiatan::create([
            'user_id' => $user->id,
            'tanggal' => $validated['tanggal'],
            'kategori' => 'sarpras', // 🔒 Dikunci ke kategori sarpras
            'nama_kegiatan' => $validated['nama_kegiatan'],
            'refleksi' => $validated['refleksi'],
            'bukti_gambar' => $gambarPath,
            'lampiran' => $lampiranPath,
            'nama_file_asli' => $namaAsli,
            'status' => 'pending',
        ]);

        return redirect('/sarpras')->with('success', 'Jurnal sarpras berhasil dicatat!');
    }

    public function show($id)
    {
        $kegiatan = Kegiatan::with('user')->where('kategori', 'sarpras')->findOrFail($id);
        return Inertia::render('sarpras/show', [
            'kegiatan' => $kegiatan
        ]);
    }

    public function edit($id)
    {
        $kegiatan = Kegiatan::where('kategori', 'sarpras')->findOrFail($id);
        return Inertia::render('sarpras/edit', [
            'kegiatan' => $kegiatan
        ]);
    }

    public function update(Request $request, $id)
    {
        $kegiatan = Kegiatan::where('kategori', 'sarpras')->findOrFail($id);
        $user = Auth::user();

        // 🔒 Proteksi Terkunci Pasca-ACC Admin
        if ($kegiatan->status === 'disetujui' && $user->role !== 'admin') {
            abort(403, 'Data sudah disetujui Admin and tidak dapat diubah.');
        }

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

        return redirect()->to("/sarpras/{$id}")->with('success', 'Jurnal sarpras diperbarui!');
    }

    public function updateStatus(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403);
        }
        $request->validate(['status' => 'required|in:pending,disetujui']);
        Kegiatan::findOrFail($id)->update(['status' => $request->status]);
        return redirect()->back()->with('success', 'Status jurnal sarpras diperbarui!');
    }

    public function destroy($id)
    {
        $kegiatan = Kegiatan::findOrFail($id);
        $user = Auth::user();

        // 🔒 Proteksi Hapus
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
        return redirect('/sarpras')->with('success', 'Data jurnal sarpras berhasil dihapus!');
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
        return redirect()->back()->with('success', count($request->ids) . ' data jurnal sarpras dihapus massal!');
    }

    public function export()
    {
        $kegiatan = Kegiatan::with('user')->where('kategori', 'sarpras')->latest()->get();
        $fileName = 'Laporan_Jurnal_Sarpras.csv';

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
