<?php

namespace App\Http\Controllers;

use App\Models\PascaObservasi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\SimpleType\Jc;

class PascaObservasiController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = PascaObservasi::with('user');

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $records = $query->orderByDesc('hari_tanggal')->paginate(15);

        return Inertia::render('pasca-observasi/index', [
            'records' => $records,
        ]);
    }

    public function create()
    {
        $users = User::where('role', 'guru')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('pasca-observasi/create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hari_tanggal' => 'required|date',
            'nama_guru' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'waktu_percakapan' => 'required|string|max:255',
            'supervisor' => 'required|string|max:255',
            'catatan_refleksi_guru' => 'required|string',
            'topik_percakapan_catatan' => 'required|string',
            'rencana_tindak_lanjut' => 'required|string',
        ]);

        $pascaObservasi = PascaObservasi::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return redirect("/pasca-observasi/{$pascaObservasi->id}")->with('success', 'Pasca observasi berhasil disimpan!');
    }

    public function show($id)
    {
        $pascaObservasi = PascaObservasi::with('user')->findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $pascaObservasi->user_id) {
            abort(403);
        }

        return Inertia::render('pasca-observasi/show', [
            'record' => $pascaObservasi,
        ]);
    }

    public function edit($id)
    {
        $pascaObservasi = PascaObservasi::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $pascaObservasi->user_id) {
            abort(403);
        }

        $users = User::where('role', 'guru')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('pasca-observasi/edit', [
            'record' => $pascaObservasi,
            'users' => $users,
        ]);
    }

    public function update(Request $request, $id)
    {
        $pascaObservasi = PascaObservasi::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $pascaObservasi->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'hari_tanggal' => 'required|date',
            'nama_guru' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'waktu_percakapan' => 'required|string|max:255',
            'supervisor' => 'required|string|max:255',
            'catatan_refleksi_guru' => 'required|string',
            'topik_percakapan_catatan' => 'required|string',
            'rencana_tindak_lanjut' => 'required|string',
        ]);

        $pascaObservasi->update($validated);

        return redirect("/pasca-observasi/{$pascaObservasi->id}")->with('success', 'Pasca observasi berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $pascaObservasi = PascaObservasi::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $pascaObservasi->user_id) {
            abort(403);
        }

        $pascaObservasi->delete();

        return redirect('/pasca-observasi')->with('success', 'Pasca observasi berhasil dihapus!');
    }

    public function exportWord($id)
    {
        $pascaObservasi = PascaObservasi::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $pascaObservasi->user_id) {
            abort(403);
        }

        $phpWord = new PhpWord;
        $section = $phpWord->addSection([
            'marginTop' => 1134,
            'marginBottom' => 1134,
            'marginLeft' => 1134,
            'marginRight' => 1134,
        ]);

        // Judul
        $section->addText(
            'LEMBAR CATATAN PERCAKAPAN PASCA-OBSERVASI KELAS',
            ['bold' => true, 'size' => 15, 'color' => '000000'],
            ['alignment' => Jc::CENTER, 'spaceAfter' => 360]
        );

        $tableStyle = ['borderSize' => 4, 'borderColor' => '000000', 'cellMargin' => 120];
        $labelStyle = ['bold' => true, 'size' => 11];
        $valueStyle = ['size' => 11];

        // Tabel identitas (sekolah di baris paling atas)
        $table = $section->addTable($tableStyle);
        $header = ['Sekolah', 'Hari / Tanggal', 'Nama Guru', 'Kelas', 'Mata Pelajaran', 'Waktu Percakapan', 'Supervisor'];
        $values = [
            'SMP Negeri 1 Candimulyo',
            $pascaObservasi->hari_tanggal?->format('d-m-Y') ?? '-',
            $pascaObservasi->nama_guru,
            $pascaObservasi->kelas,
            $pascaObservasi->mata_pelajaran,
            $pascaObservasi->waktu_percakapan,
            $pascaObservasi->supervisor,
        ];
        foreach ($header as $i => $label) {
            $table->addRow();
            $table->addCell(3200)->addText($label, $labelStyle);
            $table->addCell(5800)->addText($values[$i], $valueStyle);
        }

        $section->addTextBreak();

        // Kotak isian utama
        $blocks = [
            'CATATAN REFLEKSI GURU' => $pascaObservasi->catatan_refleksi_guru,
            'TOPIK PERCAKAPAN DAN CATATAN' => $pascaObservasi->topik_percakapan_catatan,
            'RENCANA TINDAK LANJUT' => $pascaObservasi->rencana_tindak_lanjut,
        ];
        foreach ($blocks as $label => $isi) {
            $box = $section->addTable($tableStyle);
            $cell = $box->addRow()->addCell(9000);
            $cell->addText($label, $labelStyle);
            $cell->addText($isi ?: '-', $valueStyle);
            $section->addTextBreak();
        }

        // Footer tanda tangan (border invisible)
        $noBorder = ['borderSize' => 0, 'borderColor' => 'FFFFFF'];
        $footer = $section->addTable(array_merge(['cellMargin' => 80], $noBorder));
        $footer->addRow();
        $footer->addCell(4500, $noBorder)->addText('Supervisor', $labelStyle, ['alignment' => Jc::CENTER]);
        $footer->addCell(4500, $noBorder)->addText('Guru yang diobservasi', $labelStyle, ['alignment' => Jc::CENTER]);
        $footer->addRow();
        $footer->addCell(4500, $noBorder)->addText('', []);
        $footer->addCell(4500, $noBorder)->addText('', []);
        $footer->addRow();
        $footer->addCell(4500, $noBorder)->addText($pascaObservasi->supervisor, $valueStyle, ['alignment' => Jc::CENTER]);
        $footer->addCell(4500, $noBorder)->addText($pascaObservasi->nama_guru, $valueStyle, ['alignment' => Jc::CENTER]);
        $footer->addRow();
        $footer->addCell(4500, $noBorder)->addText('NIP. ............................................', $valueStyle, ['alignment' => Jc::CENTER]);
        $footer->addCell(4500, $noBorder)->addText('NIP. ............................................', $valueStyle, ['alignment' => Jc::CENTER]);

        $fileName = 'Pasca_Observasi_'.$pascaObservasi->id.'.docx';

        return response()->stream(function () use ($phpWord) {
            $writer = IOFactory::createWriter($phpWord, 'Word2007');
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
        ]);
    }
}
