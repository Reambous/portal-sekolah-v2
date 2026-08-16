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

        $section->addText('LEMBAR CATATAN PERCAKAPAN PASCA-OBSERVASI KELAS', [
            'bold' => true,
            'size' => 14,
            'align' => Jc::CENTER,
        ]);
        $section->addTextRun()->addText('');

        $table = $section->addTable(['borderSize' => 6, 'borderColor' => '000000']);
        $table->setWidth(9000);

        $rows = [
            ['Sekolah', 'SMP Negeri 1 Candimulyo'],
            ['Hari / Tanggal', $pascaObservasi->hari_tanggal->format('d-m-Y')],
            ['Nama Guru', $pascaObservasi->nama_guru],
            ['Kelas', $pascaObservasi->kelas],
            ['Mata Pelajaran', $pascaObservasi->mata_pelajaran],
            ['Waktu Percakapan', $pascaObservasi->waktu_percakapan],
            ['Supervisor', $pascaObservasi->supervisor],
        ];

        foreach ($rows as $row) {
            $tr = $table->addRow();
            $tr->addCell(2500)->addText($row[0], ['bold' => true]);
            $tr->addCell(6500)->addText($row[1]);
        }

        $section->addTextRun()->addText('');

        $table = $section->addTable(['borderSize' => 6, 'borderColor' => '000000']);
        $table->setWidth(9000);

        $tr = $table->addRow();
        $tr->addCell(9000)->addText('Catatan Refleksi Guru', ['bold' => true]);
        $tr = $table->addRow();
        $tr->addCell(9000)->addText($pascaObservasi->catatan_refleksi_guru ?? '-');

        $tr = $table->addRow();
        $tr->addCell(9000)->addText('Topik Percakapan dan Catatan', ['bold' => true]);
        $tr = $table->addRow();
        $tr->addCell(9000)->addText($pascaObservasi->topik_percakapan_catatan ?? '-');

        $tr = $table->addRow();
        $tr->addCell(9000)->addText('Rencana Tindak Lanjut', ['bold' => true]);
        $tr = $table->addRow();
        $tr->addCell(9000)->addText($pascaObservasi->rencana_tindak_lanjut ?? '-');

        $section->addTextRun()->addText('');
        $section->addTextRun()->addText('');

        $signTable = $section->addTable(['borderSize' => 0]);
        $signTable->setWidth(9000);
        $tr = $signTable->addRow();
        $cell1 = $tr->addCell(4500);
        $cell1->addText('Supervisor:', ['bold' => true]);
        $cell1->addTextRun()->addText('');
        $cell1->addTextRun()->addText('_______________');
        $cell1->addTextRun()->addText('');
        $cell1->addText('Rusman As\'ari, S.Pd., M.Pd.');
        $cell1->addText('NIP. 19751222 200604 1 006', ['size' => 9]);

        $cell2 = $tr->addCell(4500);
        $cell2->addText('Guru yang diobservasi:', ['bold' => true]);
        $cell2->addTextRun()->addText('');
        $cell2->addTextRun()->addText('_______________');
        $cell2->addTextRun()->addText('');
        $cell2->addText($pascaObservasi->nama_guru);

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
