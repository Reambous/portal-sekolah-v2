<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DashboardSettingController extends Controller
{
    public function edit()
    {
        return Inertia::render('admin/pengaturan', [
            'kutipan' => (string) Setting::get('kutipan_dashboard', '"Setiap hari adalah kesempatan baru untuk membentuk masa depan. Ingatlah bahwa di tangan Bapak/Ibu Guru, terdapat harapan dan mimpi ratusan siswa. Mari kita terus bersinergi menciptakan inovasi pembelajaran."'),
            'slider' => Setting::getJson('slider_images', []),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'kutipan' => 'required|string',
            'slider' => 'nullable|array|max:6',
            'slider.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        Setting::set('kutipan_dashboard', $validated['kutipan']);

        if ($request->hasFile('slider')) {
            // Hapus gambar slider lama dari server (replace total)
            foreach (Setting::getJson('slider_images', []) as $oldPath) {
                Storage::disk('public')->delete($oldPath);
            }

            $paths = [];
            foreach ($validated['slider'] as $file) {
                $paths[] = $file->store('slider', 'public');
            }
            Setting::set('slider_images', $paths);
        }

        return redirect('/admin/pengaturan')->with('success', 'Pengaturan dashboard berhasil disimpan!');
    }
}
