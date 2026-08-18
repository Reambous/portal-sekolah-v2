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
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,jpg,jpeg,png|max:20480',
            'keterangan' => 'nullable|string',
        ]);

        $file = $validated['file'];
        $path = $file->store('modul-ajar', 'public');

        ModulAjar::create([
            'user_id' => $request->user()->id,
            'judul' => $validated['judul'],
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'mime_type' => $file->getClientMimeType(),
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        return redirect('/observasi/rpp')->with('success', 'RPP / Modul Ajar berhasil di-upload!');
    }

    public function show($id)
    {
        $modul = ModulAjar::with('user')->findOrFail($id);

        $this->authorizeOwner($modul);

        return Inertia::render('observasi/rpp/show', [
            'record' => $modul,
        ]);
    }

    public function edit($id)
    {
        $modul = ModulAjar::findOrFail($id);

        $this->authorizeOwner($modul);

        return Inertia::render('observasi/rpp/edit', [
            'record' => $modul,
        ]);
    }

    public function update(Request $request, $id)
    {
        $modul = ModulAjar::findOrFail($id);

        $this->authorizeOwner($modul);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt,zip,rar,jpg,jpeg,png|max:20480',
            'keterangan' => 'nullable|string',
        ]);

        $data = [
            'judul' => $validated['judul'],
            'keterangan' => $validated['keterangan'] ?? null,
        ];

        if (isset($validated['file'])) {
            Storage::disk('public')->delete($modul->file_path);

            $file = $validated['file'];
            $data['file_path'] = $file->store('modul-ajar', 'public');
            $data['file_name'] = $file->getClientOriginalName();
            $data['file_size'] = $file->getSize();
            $data['mime_type'] = $file->getClientMimeType();
        }

        $modul->update($data);

        return redirect('/observasi/rpp/'.$modul->id)->with('success', 'RPP / Modul Ajar berhasil diperbarui!');
    }

    public function download($id)
    {
        $modul = ModulAjar::findOrFail($id);

        $this->authorizeOwner($modul);

        $path = $modul->file_path;

        if (! Storage::disk('public')->exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return Storage::disk('public')->download($path, $modul->file_name);
    }

    public function destroy($id)
    {
        $modul = ModulAjar::findOrFail($id);

        $this->authorizeOwner($modul);

        Storage::disk('public')->delete($modul->file_path);
        $modul->delete();

        return redirect('/observasi/rpp')->with('success', 'RPP / Modul Ajar berhasil dihapus!');
    }

    private function authorizeOwner(ModulAjar $modul): void
    {
        if (Auth::user()->role !== 'admin' && Auth::id() !== $modul->user_id) {
            abort(403);
        }
    }
}
