<?php

namespace App\Http\Controllers;

use App\Models\JurnalRefleksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class JurnalRefleksiController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = JurnalRefleksi::with('user')->latest();

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul_refleksi', 'like', "%{$search}%")
                    ->orWhere('kategori', 'like', "%{$search}%");
            });
        }

        return Inertia::render('jurnal-refleksi/index', [
            'daftarJurnal' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('jurnal-refleksi/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:255',
            'judul_refleksi' => 'required|string|max:255',
            'isi_refleksi' => 'required|string',
            'bukti_file' => 'nullable|file|mimes:jpeg,png,jpg,webp,pdf,doc,docx|max:5120',
        ]);

        $filePath = null;
        if ($request->hasFile('bukti_file')) {
            $filePath = $request->file('bukti_file')->store('jurnal/bukti', 'public');
        }

        JurnalRefleksi::create([
            'user_id' => Auth::id(),
            'tanggal' => $validated['tanggal'],
            'kategori' => $validated['kategori'],
            'judul_refleksi' => $validated['judul_refleksi'],
            'isi_refleksi' => $validated['isi_refleksi'],
            'bukti_file' => $filePath,
        ]);

        return redirect('/jurnal-refleksi')->with('success', 'Jurnal refleksi berhasil disimpan!');
    }

    public function show($id)
    {
        $jurnal = JurnalRefleksi::with('user')->findOrFail($id);
        if (Auth::user()->role !== 'admin' && Auth::id() !== $jurnal->user_id) {
            abort(403);
        }

        return Inertia::render('jurnal-refleksi/show', ['jurnal' => $jurnal]);
    }

    public function edit($id)
    {
        $jurnal = JurnalRefleksi::findOrFail($id);
        if (Auth::user()->role !== 'admin' && Auth::id() !== $jurnal->user_id) {
            abort(403);
        }

        return Inertia::render('jurnal-refleksi/edit', ['jurnal' => $jurnal]);
    }

    public function update(Request $request, $id)
    {
        $jurnal = JurnalRefleksi::findOrFail($id);
        if (Auth::user()->role !== 'admin' && Auth::id() !== $jurnal->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:255',
            'judul_refleksi' => 'required|string|max:255',
            'isi_refleksi' => 'required|string',
            'bukti_file' => 'nullable|file|mimes:jpeg,png,jpg,webp,pdf,doc,docx|max:5120',
        ]);

        if ($request->hasFile('bukti_file')) {
            if ($jurnal->bukti_file) {
                Storage::disk('public')->delete($jurnal->bukti_file);
            }
            $jurnal->bukti_file = $request->file('bukti_file')->store('jurnal/bukti', 'public');
        }

        $jurnal->update([
            'tanggal' => $validated['tanggal'],
            'kategori' => $validated['kategori'],
            'judul_refleksi' => $validated['judul_refleksi'],
            'isi_refleksi' => $validated['isi_refleksi'],
        ]);

        return redirect('/jurnal-refleksi')->with('success', 'Jurnal refleksi berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $jurnal = JurnalRefleksi::findOrFail($id);
        if (Auth::user()->role !== 'admin' && Auth::id() !== $jurnal->user_id) {
            abort(403);
        }

        if ($jurnal->bukti_file) {
            Storage::disk('public')->delete($jurnal->bukti_file);
        }

        $jurnal->delete();

        return redirect('/jurnal-refleksi')->with('success', 'Jurnal refleksi berhasil dihapus.');
    }

    public function bulkDelete(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403);
        }

        $request->validate(['ids' => 'required|array']);
        $jurnal = JurnalRefleksi::whereIn('id', $request->ids)->get();

        foreach ($jurnal as $item) {
            if ($item->bukti_file) {
                Storage::disk('public')->delete($item->bukti_file);
            }
            $item->delete();
        }

        return redirect()->back()->with('success', count($request->ids).' data jurnal berhasil dihapus massal!');
    }

    public function export()
    {
        $user = Auth::user();
        $query = JurnalRefleksi::with('user')->latest();
        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $daftarJurnal = $query->get();
        $fileName = 'Rekap_Jurnal_Refleksi_'.date('Y-m-d').'.csv';

        $headers = [
            'Content-type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=$fileName",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function () use ($daftarJurnal) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Nama Guru', 'Tanggal', 'Kategori', 'Judul Refleksi', 'Isi Evaluasi']);

            foreach ($daftarJurnal as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->user ? $row->user->name : 'Sistem',
                    $row->tanggal,
                    $row->kategori,
                    $row->judul_refleksi,
                    $row->isi_refleksi,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
