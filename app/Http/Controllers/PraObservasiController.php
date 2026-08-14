<?php

namespace App\Http\Controllers;

use App\Models\PraObservasiCatatan;
use App\Models\PraObservasiInstrumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpWord\IOFactory as WordIOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\SimpleType\Jc;

class PraObservasiController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $catatanQuery = PraObservasiCatatan::with('user')->latest();
        $instrumenQuery = PraObservasiInstrumen::with('user')->latest();

        if ($user->role !== 'admin') {
            $catatanQuery->where('user_id', $user->id);
            $instrumenQuery->where('user_id', $user->id);
        }

        $catatan = $catatanQuery->paginate(10)->withQueryString();
        $instrumen = $instrumenQuery->paginate(10)->withQueryString();

        $instrumen->getCollection()->transform(function ($item) {
            $item->total_skor = PraObservasiInstrumen::hitungTotal($item->skor);

            return $item;
        });

        return Inertia::render('observasi/index', [
            'catatan' => $catatan,
            'instrumen' => $instrumen,
        ]);
    }

    // ============================= FORM A (CATATAN) =============================

    public function createCatatan()
    {
        return Inertia::render('observasi/catatan/create');
    }

    public function storeCatatan(Request $request)
    {
        $validated = $request->validate([
            'hari_tanggal' => 'required|date',
            'nama_guru' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'waktu' => 'required|string|max:255',
            'nama_supervisor' => 'required|string|max:255',
            'tujuan_pembelajaran' => 'nullable|string',
            'area_pengembangan' => 'nullable|string',
            'strategi' => 'nullable|string',
            'catatan_khusus' => 'nullable|string',
        ]);

        $catatan = PraObservasiCatatan::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return redirect("/observasi/pra-catatan/{$catatan->id}")->with('success', 'Lembar catatan pra-observasi berhasil disimpan!');
    }

    public function showCatatan($id)
    {
        $catatan = PraObservasiCatatan::with('user')->findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $catatan->user_id) {
            abort(403);
        }

        return Inertia::render('observasi/catatan/show', [
            'catatan' => $catatan,
        ]);
    }

    public function editCatatan($id)
    {
        $catatan = PraObservasiCatatan::findOrFail($id);

        $this->authorizeOwner($catatan);

        return Inertia::render('observasi/catatan/edit', [
            'catatan' => $catatan,
        ]);
    }

    public function updateCatatan(Request $request, $id)
    {
        $catatan = PraObservasiCatatan::findOrFail($id);

        $this->authorizeOwner($catatan);

        $validated = $request->validate([
            'hari_tanggal' => 'required|date',
            'nama_guru' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'waktu' => 'required|string|max:255',
            'nama_supervisor' => 'required|string|max:255',
            'tujuan_pembelajaran' => 'nullable|string',
            'area_pengembangan' => 'nullable|string',
            'strategi' => 'nullable|string',
            'catatan_khusus' => 'nullable|string',
        ]);

        $catatan->update($validated);

        return redirect("/observasi/pra-catatan/{$catatan->id}")->with('success', 'Lembar catatan berhasil diperbarui!');
    }

    public function destroyCatatan($id)
    {
        $catatan = PraObservasiCatatan::findOrFail($id);

        $this->authorizeOwner($catatan);

        $catatan->delete();

        return redirect('/observasi')->with('success', 'Lembar catatan berhasil dihapus.');
    }

    public function exportWordCatatan($id)
    {
        $catatan = PraObservasiCatatan::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $catatan->user_id) {
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
            'LEMBAR CATATAN PERCAKAPAN PRA-OBSERVASI KELAS',
            ['bold' => true, 'size' => 15, 'color' => '000000'],
            ['alignment' => Jc::CENTER, 'spaceAfter' => 360]
        );

        $tableStyle = ['borderSize' => 4, 'borderColor' => '000000', 'cellMargin' => 120];
        $labelStyle = ['bold' => true, 'size' => 11];
        $valueStyle = ['size' => 11];

        // Tabel identitas (nama sekolah di baris paling atas)
        $table = $section->addTable($tableStyle);
        $header = ['Sekolah', 'Hari / Tanggal', 'Nama Guru', 'Mata Pelajaran', 'Kelas', 'Waktu', 'Nama Supervisor'];
        $values = [
            'SMP Negeri 1 Candimulyo',
            $catatan->hari_tanggal?->format('d-m-Y') ?? '-',
            $catatan->nama_guru,
            $catatan->mata_pelajaran,
            $catatan->kelas,
            $catatan->waktu,
            $catatan->nama_supervisor,
        ];
        foreach ($header as $i => $label) {
            $table->addRow();
            $table->addCell(3200)->addText($label, $labelStyle);
            $table->addCell(5800)->addText($values[$i], $valueStyle);
        }

        $section->addTextBreak();

        // Kotak isian utama
        $blocks = [
            'TUJUAN PEMBELAJARAN' => $catatan->tujuan_pembelajaran,
            'AREA PENGEMBANGAN YANG HENDAK DICAPAI' => $catatan->area_pengembangan,
            'STRATEGI YANG DIPERSIAPKAN' => $catatan->strategi,
            'CATATAN KHUSUS SUPERVISOR' => $catatan->catatan_khusus,
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
        $footer->addCell(4500, $noBorder)->addText($catatan->nama_supervisor, $valueStyle, ['alignment' => Jc::CENTER]);
        $footer->addCell(4500, $noBorder)->addText($catatan->nama_guru, $valueStyle, ['alignment' => Jc::CENTER]);
        $footer->addRow();
        $footer->addCell(4500, $noBorder)->addText('NIP. ............................................', $valueStyle, ['alignment' => Jc::CENTER]);
        $footer->addCell(4500, $noBorder)->addText('NIP. ............................................', $valueStyle, ['alignment' => Jc::CENTER]);

        $fileName = 'Lembar_Catatan_Pra_Observasi_'.$catatan->id.'.docx';

        return response()->stream(function () use ($phpWord) {
            $writer = WordIOFactory::createWriter($phpWord, 'Word2007');
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
        ]);
    }

    // ============================= FORM B (INSTRUMEN) =============================

    public function createInstrumen()
    {
        return Inertia::render('observasi/instrumen/create', [
            'definisi' => PraObservasiInstrumen::definisi(),
            'totalMaks' => PraObservasiInstrumen::totalMaks(),
        ]);
    }

    public function storeInstrumen(Request $request)
    {
        $validated = $request->validate([
            'jenjang' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'judul_perencanaan' => 'required|string|max:255',
            'skor' => 'required|array',
            'skor.*' => 'nullable|in:0,1,2,3,4',
            'komentar' => 'nullable|array',
            'komentar.*' => 'nullable|string',
            'kelebihan' => 'nullable|string',
            'hal_ditingkatkan' => 'nullable|string',
            'rekomendasi' => 'nullable|string',
        ]);

        $instrumen = PraObservasiInstrumen::create([
            'user_id' => $request->user()->id,
            'jenjang' => $validated['jenjang'],
            'mata_pelajaran' => $validated['mata_pelajaran'],
            'kelas' => $validated['kelas'],
            'judul_perencanaan' => $validated['judul_perencanaan'],
            'skor' => $validated['skor'],
            'komentar' => $validated['komentar'] ?? [],
            'kelebihan' => $validated['kelebihan'],
            'hal_ditingkatkan' => $validated['hal_ditingkatkan'],
            'rekomendasi' => $validated['rekomendasi'],
        ]);

        return redirect("/observasi/pra-instrumen/{$instrumen->id}")->with('success', 'Instrumen umpan balik berhasil disimpan!');
    }

    public function showInstrumen($id)
    {
        $instrumen = PraObservasiInstrumen::with('user')->findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $instrumen->user_id) {
            abort(403);
        }

        return Inertia::render('observasi/instrumen/show', [
            'instrumen' => $instrumen,
            'definisi' => PraObservasiInstrumen::definisi(),
            'total' => PraObservasiInstrumen::hitungTotal($instrumen->skor),
            'totalMaks' => PraObservasiInstrumen::totalMaks(),
        ]);
    }

    public function editInstrumen($id)
    {
        $instrumen = PraObservasiInstrumen::findOrFail($id);

        $this->authorizeOwner($instrumen);

        return Inertia::render('observasi/instrumen/edit', [
            'instrumen' => $instrumen,
            'definisi' => PraObservasiInstrumen::definisi(),
            'totalMaks' => PraObservasiInstrumen::totalMaks(),
        ]);
    }

    public function updateInstrumen(Request $request, $id)
    {
        $instrumen = PraObservasiInstrumen::findOrFail($id);

        $this->authorizeOwner($instrumen);

        $validated = $request->validate([
            'jenjang' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'kelas' => 'required|string|max:255',
            'judul_perencanaan' => 'required|string|max:255',
            'skor' => 'required|array',
            'skor.*' => 'nullable|in:0,1,2,3,4',
            'komentar' => 'nullable|array',
            'komentar.*' => 'nullable|string',
            'kelebihan' => 'nullable|string',
            'hal_ditingkatkan' => 'nullable|string',
            'rekomendasi' => 'nullable|string',
        ]);

        $instrumen->update([
            'jenjang' => $validated['jenjang'],
            'mata_pelajaran' => $validated['mata_pelajaran'],
            'kelas' => $validated['kelas'],
            'judul_perencanaan' => $validated['judul_perencanaan'],
            'skor' => $validated['skor'],
            'komentar' => $validated['komentar'] ?? [],
            'kelebihan' => $validated['kelebihan'],
            'hal_ditingkatkan' => $validated['hal_ditingkatkan'],
            'rekomendasi' => $validated['rekomendasi'],
        ]);

        return redirect("/observasi/pra-instrumen/{$instrumen->id}")->with('success', 'Instrumen berhasil diperbarui!');
    }

    public function destroyInstrumen($id)
    {
        $instrumen = PraObservasiInstrumen::findOrFail($id);

        $this->authorizeOwner($instrumen);

        $instrumen->delete();

        return redirect('/observasi')->with('success', 'Instrumen berhasil dihapus.');
    }

    public function exportExcelInstrumen($id)
    {
        $instrumen = PraObservasiInstrumen::with('user')->findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $instrumen->user_id) {
            abort(403);
        }

        $definisi = PraObservasiInstrumen::definisi();
        $total = PraObservasiInstrumen::hitungTotal($instrumen->skor);
        $skor = $instrumen->skor ?? [];
        $komentar = $instrumen->komentar ?? [];

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Instrumen');

        $bold = ['font' => ['bold' => true]];
        $center = ['alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER]];
        $border = ['borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]]];

        // Judul
        $sheet->mergeCells('A1:D1');
        $sheet->setCellValue('A1', 'INSTRUMEN UMPAN BALIK PERENCANAAN PEMBELAJARAN MENDALAM');
        $sheet->getStyle('A1')->applyFromArray($bold + $center);
        $sheet->getStyle('A1')->getFont()->setSize(14);

        // Instruksi & skala
        $sheet->mergeCells('A2:D2');
        $sheet->setCellValue('A2', 'Skala: 0 = Tidak ada | 1 = Sangat kurang | 2 = Kurang | 3 = Baik | 4 = Sangat baik');
        $sheet->getStyle('A2')->applyFromArray($center);

        // Identitas (menurun, satu baris per item)
        $identitas = [
            'Jenjang pada Perencanaan Pembelajaran' => $instrumen->jenjang,
            'Mata Pelajaran pada Perencanaan Pembelajaran' => $instrumen->mata_pelajaran,
            'Kelas pada Perencanaan Pembelajaran' => $instrumen->kelas,
            'Judul Perencanaan Pembelajaran' => $instrumen->judul_perencanaan,
        ];
        $row = 3;
        foreach ($identitas as $label => $val) {
            $sheet->setCellValue('A'.$row, $label.': '.$val);
            $sheet->mergeCells("A{$row}:D{$row}");
            $sheet->getStyle("A{$row}")->applyFromArray($bold);
            $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $row++;
        }

        // Header tabel
        $sheet->fromArray(['No', 'Aspek yang diamati', 'Skala', 'Komentar Kritis'], null, 'A7');
        $sheet->getStyle('A7:D7')->applyFromArray($bold + $center + $border);

        // Kolom lebar
        $sheet->getColumnDimension('A')->setWidth(18);
        $sheet->getColumnDimension('B')->setWidth(55);
        $sheet->getColumnDimension('C')->setWidth(10);
        $sheet->getColumnDimension('D')->setWidth(38);

        // Wrap text untuk kolom teks panjang (Aspek & Komentar Kritis)
        $sheet->getStyle('B:B')->getAlignment()->setWrapText(true);
        $sheet->getStyle('D:D')->getAlignment()->setWrapText(true);

        // Vertical / horizontal alignment
        $sheet->getStyle('A:A')->getAlignment()
            ->setVertical(Alignment::VERTICAL_CENTER)
            ->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C:C')->getAlignment()
            ->setVertical(Alignment::VERTICAL_CENTER)
            ->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('B:B')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);
        $sheet->getStyle('D:D')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);

        $row = 8;
        $no = 1;

        foreach ($definisi['seksi'] as $seksi) {
            // Baris banner seksi (horizontal, bentang A-D)
            $sheet->mergeCells("A{$row}:D{$row}");
            $sheet->setCellValue('A'.$row, $seksi['nama']);
            $sheet->getStyle("A{$row}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 11],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F3F4F6']],
            ]);
            $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $row++;

            foreach ($seksi['indikator'] as $ind) {
                if (isset($ind['sub'])) {
                    $sheet->setCellValue('A'.$row, $no++);
                    $sheet->setCellValue('B'.$row, $ind['teks']);
                    $sheet->setCellValue('C'.$row, $skor[$ind['kode']] ?? '');
                    $sheet->setCellValue('D'.$row, $komentar[$ind['kode']] ?? '');
                    $sheet->getStyle("A{$row}:D{$row}")->applyFromArray($border);
                    $sheet->getStyle("B{$row}")->getFont()->setBold(true);
                    $row++;

                    foreach ($ind['sub'] as $sub) {
                        $sheet->setCellValue('A'.$row, $no++);
                        $sheet->setCellValue('B'.$row, '    '.$sub['teks']);
                        $sheet->setCellValue('C'.$row, $skor[$sub['kode']] ?? '');
                        $sheet->setCellValue('D'.$row, $komentar[$sub['kode']] ?? '');
                        $sheet->getStyle("A{$row}:D{$row}")->applyFromArray($border);
                        $row++;
                    }
                } else {
                    $sheet->setCellValue('A'.$row, $no++);
                    $sheet->setCellValue('B'.$row, $ind['teks']);
                    $sheet->setCellValue('C'.$row, $skor[$ind['kode']] ?? '');
                    $sheet->setCellValue('D'.$row, $komentar[$ind['kode']] ?? '');
                    $sheet->getStyle("A{$row}:D{$row}")->applyFromArray($border);
                    $row++;
                }
            }
        }

        // Total skor
        $sheet->setCellValue('A'.$row, '');
        $sheet->setCellValue('B'.$row, 'JUMLAH TOTAL SKOR');
        $sheet->setCellValue('C'.$row, $total);
        $sheet->getStyle("A{$row}:D{$row}")->applyFromArray($bold + $border);
        $sheet->setCellValue('D'.$row, 'Maksimal: '.PraObservasiInstrumen::totalMaks());

        // Catatan kualitatif
        $row += 2;
        foreach ($definisi['catatan'] as $catatan) {
            $value = $instrumen->{$catatan['kode']} ?? '';
            // Label prompt (1 baris, bentang A-D)
            $sheet->setCellValue('A'.$row, $catatan['teks']);
            $sheet->mergeCells("A{$row}:D{$row}");
            $sheet->getStyle("A{$row}")->applyFromArray($bold);
            $row++;
            // Nilai jawaban (3 baris, bentang A-D)
            $sheet->setCellValue('A'.$row, $value ?: '');
            $sheet->mergeCells("A{$row}:D".($row + 2));
            $sheet->getStyle("A{$row}")->getAlignment()->setWrapText(true);
            $sheet->getStyle("A{$row}")->getAlignment()->setVertical(Alignment::VERTICAL_TOP);
            $row += 3;
        }

        $fileName = 'Instrumen_Umpan_Balik_'.$instrumen->id.'.xlsx';

        return response()->stream(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
        ]);
    }

    // ============================= UTIL =============================

    private function authorizeOwner($record): void
    {
        if (Auth::user()->role !== 'admin' && Auth::id() !== $record->user_id) {
            abort(403, 'Anda tidak berhak mengubah data ini.');
        }
    }
}
