<?php

namespace App\Http\Controllers;

use App\Models\ModulAjar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ModulAjarController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = ModulAjar::with('user');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $records = $query->orderByDesc('created_at')->paginate(15);

        return Inertia::render('observasi/rpp/index', [
            'data' => $records,
        ]);
    }

    public function create()
    {
        return Inertia::render('observasi/rpp/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'kelas_semester' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,jpg,jpeg,png|max:20480',
            'keterangan' => 'nullable|string',
        ]);

        $file = $validated['file'];
        $path = $file->store('modul-ajar', 'public');

        ModulAjar::create([
            'user_id' => $request->user()->id,
            'judul' => $validated['judul'],
            'mata_pelajaran' => $validated['mata_pelajaran'],
            'kelas_semester' => $validated['kelas_semester'],
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getClientMimeType(),
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return redirect('/observasi/rpp')->with('success', 'RPP / Modul Ajar berhasil di-upload!');
    }

    public function download($id)
    {
        $modul = ModulAjar::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $modul->user_id) {
            abort(403);
        }

        $path = $modul->file_path;

        if (! Storage::disk('public')->exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return Storage::disk('public')->download($path, $modul->file_name);
    }

    public function destroy($id)
    {
        $modul = ModulAjar::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $modul->user_id) {
            abort(403);
        }

        Storage::disk('public')->delete($modul->file_path);
        $modul->delete();

        return redirect('/observasi/rpp')->with('success', 'RPP / Modul Ajar berhasil dihapus!');
    }
}
