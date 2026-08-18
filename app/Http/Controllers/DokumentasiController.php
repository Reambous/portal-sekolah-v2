<?php

namespace App\Http\Controllers;

use App\Models\Dokumentasi;
use App\Models\DokumentasiGambar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DokumentasiController extends Controller
{
    private const MAX_GAMBAR = 10;

    public function index()
    {
        $user = Auth::user();
        $query = Dokumentasi::with('user')->withCount('gambar');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $records = $query->orderByDesc('created_at')->paginate(15);

        return Inertia::render('observasi/dokumentasi/index', [
            'data' => $records,
        ]);
    }

    public function create()
    {
        return Inertia::render('observasi/dokumentasi/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'gambar' => 'required|array|max:'.self::MAX_GAMBAR,
            'gambar.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
            'keterangan' => 'nullable|string',
        ]);

        $dokumentasi = Dokumentasi::create([
            'user_id' => $request->user()->id,
            'judul' => $validated['judul'],
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        $this->simpanGambar($dokumentasi, $validated['gambar']);

        return redirect('/observasi/dokumentasi/'.$dokumentasi->id)->with('success', 'Dokumentasi berhasil disimpan!');
    }

    public function show($id)
    {
        $dokumentasi = Dokumentasi::with('user', 'gambar')->findOrFail($id);

        $this->authorizeOwner($dokumentasi);

        return Inertia::render('observasi/dokumentasi/show', [
            'record' => $dokumentasi,
        ]);
    }

    public function edit($id)
    {
        $dokumentasi = Dokumentasi::with('gambar')->findOrFail($id);

        $this->authorizeOwner($dokumentasi);

        return Inertia::render('observasi/dokumentasi/edit', [
            'record' => $dokumentasi,
        ]);
    }

    public function update(Request $request, $id)
    {
        $dokumentasi = Dokumentasi::findOrFail($id);

        $this->authorizeOwner($dokumentasi);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'gambar' => 'nullable|array|max:'.self::MAX_GAMBAR,
            'gambar.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
            'keterangan' => 'nullable|string',
        ]);

        $dokumentasi->update([
            'judul' => $validated['judul'],
            'keterangan' => $validated['keterangan'] ?? null,
        ]);

        if (! empty($validated['gambar'])) {
            if ($dokumentasi->gambar()->count() + count($validated['gambar']) > self::MAX_GAMBAR) {
                return back()->withErrors(['gambar' => 'Total gambar maksimal '.self::MAX_GAMBAR.' per dokumentasi.'])->withInput();
            }

            $this->simpanGambar($dokumentasi, $validated['gambar']);
        }

        return redirect('/observasi/dokumentasi/'.$dokumentasi->id)->with('success', 'Dokumentasi berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $dokumentasi = Dokumentasi::findOrFail($id);

        $this->authorizeOwner($dokumentasi);

        foreach ($dokumentasi->gambar as $gambar) {
            Storage::disk('public')->delete($gambar->path);
        }
        $dokumentasi->gambar()->delete();
        $dokumentasi->delete();

        return redirect('/observasi/dokumentasi')->with('success', 'Dokumentasi berhasil dihapus!');
    }

    public function hapusGambar($id)
    {
        $gambar = DokumentasiGambar::with('dokumentasi')->findOrFail($id);
        $dokumentasi = $gambar->dokumentasi;

        $this->authorizeOwner($dokumentasi);

        Storage::disk('public')->delete($gambar->path);
        $gambar->delete();

        return redirect('/observasi/dokumentasi/'.$dokumentasi->id.'/edit')->with('success', 'Gambar berhasil dihapus!');
    }

    public function downloadGambar($id)
    {
        $gambar = DokumentasiGambar::with('dokumentasi')->findOrFail($id);

        $this->authorizeOwner($gambar->dokumentasi);

        if (! Storage::disk('public')->exists($gambar->path)) {
            abort(404, 'File tidak ditemukan.');
        }

        return Storage::disk('public')->download($gambar->path, $gambar->name);
    }

    private function simpanGambar(Dokumentasi $dokumentasi, array $gambar): void
    {
        foreach ($gambar as $file) {
            $path = $file->store('dokumentasi', 'public');
            $dokumentasi->gambar()->create([
                'path' => $path,
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getClientMimeType(),
            ]);
        }
    }

    private function authorizeOwner(Dokumentasi $dokumentasi): void
    {
        if (Auth::user()->role !== 'admin' && Auth::id() !== $dokumentasi->user_id) {
            abort(403);
        }
    }
}
