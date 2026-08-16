<?php

namespace App\Http\Controllers;

use App\Models\ObservasiPelaksanaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ObservasiPelaksanaanController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = ObservasiPelaksanaan::with('user')->latest();

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        return Inertia::render('observasi/pelaksanaan/index', [
            'data' => $query->paginate(10)->withQueryString(),
        ]);
    }

    public function create()
    {
        return Inertia::render('observasi/pelaksanaan/create', [
            'definisi' => ObservasiPelaksanaan::definisi(),
            'itemUtama' => ObservasiPelaksanaan::itemUtama(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);

        $observasi = ObservasiPelaksanaan::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return redirect("/observasi/pelaksanaan/{$observasi->id}")->with('success', 'Observasi pelaksanaan berhasil disimpan!');
    }

    public function show($id)
    {
        $observasi = ObservasiPelaksanaan::with('user')->findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $observasi->user_id) {
            abort(403);
        }

        return Inertia::render('observasi/pelaksanaan/show', [
            'observasi' => $observasi,
            'definisi' => ObservasiPelaksanaan::definisi(),
            'itemUtama' => ObservasiPelaksanaan::itemUtama(),
        ]);
    }

    public function edit($id)
    {
        $observasi = ObservasiPelaksanaan::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $observasi->user_id) {
            abort(403);
        }

        return Inertia::render('observasi/pelaksanaan/edit', [
            'observasi' => $observasi,
            'definisi' => ObservasiPelaksanaan::definisi(),
            'itemUtama' => ObservasiPelaksanaan::itemUtama(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $observasi = ObservasiPelaksanaan::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $observasi->user_id) {
            abort(403);
        }

        $observasi->update($this->validated($request));

        return redirect("/observasi/pelaksanaan/{$observasi->id}")->with('success', 'Observasi pelaksanaan berhasil diperbarui!');
    }

    private function validated(Request $request): array
    {
        $kodeUtama = ObservasiPelaksanaan::kodeUtama();
        $buktiRule = [];
        $catatanRule = [];
        foreach ($kodeUtama as $kode) {
            $buktiRule["bukti.{$kode}"] = 'nullable|string';
            $catatanRule["catatan.{$kode}"] = 'nullable|string';
        }

        return $request->validate([
            'hari_tanggal' => 'required|date',
            'nama_guru' => 'required|string|max:255',
            'kelas_semester' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'pemberi_umpan_balik' => 'required|string|max:255',
            'bukti' => 'required|array',
            'catatan' => 'required|array',
            'refleksi' => 'nullable|array',
            ...$buktiRule,
            ...$catatanRule,
        ]);
    }

    public function destroy($id)
    {
        $observasi = ObservasiPelaksanaan::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $observasi->user_id) {
            abort(403);
        }

        $observasi->delete();

        return redirect('/observasi/pelaksanaan')->with('success', 'Observasi pelaksanaan berhasil dihapus.');
    }

    public function exportExcel($id)
    {
        $observasi = ObservasiPelaksanaan::with('user')->findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $observasi->user_id) {
            abort(403);
        }

        $definisi = ObservasiPelaksanaan::definisi();
        $bukti = $observasi->bukti ?? [];
        $catatan = $observasi->catatan ?? [];
        $refleksi = $observasi->refleksi ?? [];

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Observasi Pelaksanaan');

        $bold = ['font' => ['bold' => true]];
        $center = ['alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER]];
        $border = ['borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]]];

        // Judul
        $sheet->mergeCells('A1:D1');
        $sheet->setCellValue('A1', 'INSTRUMEN IMPLEMENTASI DAN REFLEKSI PERENCANAAN PEMBELAJARAN');
        $sheet->getStyle('A1')->applyFromArray($bold);
        $sheet->getStyle('A1')->getFont()->setSize(14);
        $sheet->getStyle('A1')->getAlignment()
            ->setHorizontal(Alignment::HORIZONTAL_CENTER)
            ->setVertical(Alignment::VERTICAL_CENTER);

        // Identitas (menurun)
        $identitas = [
            'Hari/Tanggal' => $observasi->hari_tanggal?->format('d-m-Y') ?? '-',
            'Nama Satuan Pendidikan' => 'SMP Negeri 1 Candimulyo',
            'Nama Guru' => $observasi->nama_guru,
            'Kelas/Semester' => $observasi->kelas_semester,
            'Mata Pelajaran' => $observasi->mata_pelajaran,
            'Pemberi Umpan Balik' => $observasi->pemberi_umpan_balik,
        ];
        $row = 3;
        foreach ($identitas as $label => $val) {
            $sheet->setCellValue('A'.$row, $label.': '.$val);
            $sheet->mergeCells("A{$row}:D{$row}");
            $sheet->getStyle("A{$row}")->applyFromArray($bold);
            $sheet->getStyle("A{$row}")->getAlignment()
                ->setWrapText(true)
                ->setVertical(Alignment::VERTICAL_TOP)
                ->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $sheet->getRowDimension($row)->setRowHeight(-1);
            $row++;
        }

        // Header tabel
        $sheet->fromArray(['No', 'Aspek yang diamati', 'Bukti Pembelajaran', 'Catatan'], null, 'A9');
        $sheet->getStyle('A9:D9')->applyFromArray($bold + $center + $border);
        $sheet->getStyle('A9:D9')->getAlignment()
            ->setWrapText(true)
            ->setVertical(Alignment::VERTICAL_CENTER)
            ->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Lebar kolom
        $sheet->getColumnDimension('A')->setWidth(8);
        $sheet->getColumnDimension('B')->setWidth(60);
        $sheet->getColumnDimension('C')->setWidth(40);
        $sheet->getColumnDimension('D')->setWidth(40);

        // Default: wrap text + vertical top untuk semua kolom
        $sheet->getDefaultRowDimension()->setRowHeight(-1);
        foreach (['A', 'B', 'C', 'D'] as $col) {
            $sheet->getStyle($col.':'.$col)->getAlignment()->setWrapText(true);
        }
        $sheet->getStyle('A:A')->getAlignment()
            ->setVertical(Alignment::VERTICAL_CENTER)
            ->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('B:B')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);
        $sheet->getStyle('C:C')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);
        $sheet->getStyle('D:D')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);

        $row = 10;
        $no = 1;

        foreach ($definisi['seksi'] as $seksiKey => $seksi) {
            // Banner seksi
            $sheet->mergeCells("A{$row}:D{$row}");
            $sheet->setCellValue('A'.$row, $seksi['nama']);
            $sheet->getStyle("A{$row}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 11],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F3F4F6']],
            ]);
            $sheet->getStyle("A{$row}")->getAlignment()
                ->setHorizontal(Alignment::HORIZONTAL_LEFT)
                ->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getRowDimension($row)->setRowHeight(-1);
            $row++;

            if ($seksiKey === 'refleksi') {
                // Refleksi: pertanyaan + jawaban dalam cell merge besar
                foreach ($seksi['indikator'] as $ref) {
                    $answer = $refleksi[$ref['kode']] ?? '';
                    $content = $ref['teks']."\n\n".$answer;
                    $areaRows = 5;

                    $sheet->setCellValue('A'.$row, $no++);
                    $sheet->setCellValue('B'.$row, $content);
                    $sheet->mergeCells("A{$row}:A".($row + $areaRows - 1));
                    $sheet->mergeCells("B{$row}:D".($row + $areaRows - 1));
                    $sheet->getStyle("A{$row}:D".($row + $areaRows - 1))->applyFromArray($border);
                    $sheet->getStyle("A{$row}")->getAlignment()
                        ->setVertical(Alignment::VERTICAL_CENTER)
                        ->setHorizontal(Alignment::HORIZONTAL_CENTER);
                    $sheet->getStyle("B{$row}")->getFont()->setBold(true);
                    $sheet->getStyle("B{$row}")->getAlignment()
                        ->setWrapText(true)
                        ->setVertical(Alignment::VERTICAL_TOP);

                    // Auto row height untuk area refleksi
                    for ($i = 0; $i < $areaRows; $i++) {
                        $sheet->getRowDimension($row + $i)->setRowHeight(-1);
                    }
                    $row += $areaRows;
                }

                continue;
            }

            foreach ($seksi['indikator'] as $ind) {
                $subCount = count($ind['sub'] ?? []);
                $totalRows = $subCount + 1;
                $startRow = $row;
                $endRow = $startRow + $totalRows - 1;

                // Nomor & bukti/catatan hanya untuk indikator utama, di-merge ke bawah
                $sheet->setCellValue('A'.$startRow, $no);
                $sheet->setCellValue('B'.$startRow, $ind['teks']);
                $sheet->setCellValue('C'.$startRow, $bukti[$ind['kode']] ?? '');
                $sheet->setCellValue('D'.$startRow, $catatan[$ind['kode']] ?? '');
                $sheet->getStyle("B{$startRow}")->getFont()->setBold(true);

                if ($totalRows > 1) {
                    $sheet->mergeCells("A{$startRow}:A{$endRow}");
                    $sheet->mergeCells("C{$startRow}:C{$endRow}");
                    $sheet->mergeCells("D{$startRow}:D{$endRow}");
                }

                // Sub-indikator sebagai teks di kolom B
                foreach ($ind['sub'] ?? [] as $i => $sub) {
                    $sheet->setCellValue('B'.($startRow + 1 + $i), '    '.$sub['teks']);
                }

                // Border seluruh area indikator
                $sheet->getStyle("A{$startRow}:D{$endRow}")->applyFromArray($border);

                // Vertical top + wrap untuk semua sel area indikator
                $sheet->getStyle("A{$startRow}:D{$endRow}")->getAlignment()
                    ->setWrapText(true)
                    ->setVertical(Alignment::VERTICAL_TOP);
                $sheet->getStyle("A{$startRow}:A{$endRow}")->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                // Auto row height untuk semua baris indikator
                for ($i = 0; $i < $totalRows; $i++) {
                    $sheet->getRowDimension($startRow + $i)->setRowHeight(-1);
                }

                $no++;
                $row = $endRow + 1;
            }
        }

        $fileName = 'Observasi_Pelaksanaan_'.$observasi->id.'.xlsx';

        return response()->stream(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
        ]);
    }
}
