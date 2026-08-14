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
            'itemList' => ObservasiPelaksanaan::itemList(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'hari_tanggal' => 'required|date',
            'nama_guru' => 'required|string|max:255',
            'kelas_semester' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'pemberi_umpan_balik' => 'required|string|max:255',
            'bukti' => 'required|array',
            'catatan' => 'required|array',
            'refleksi' => 'required|array',
        ]);

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
            'itemList' => ObservasiPelaksanaan::itemList(),
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
            'itemList' => ObservasiPelaksanaan::itemList(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $observasi = ObservasiPelaksanaan::findOrFail($id);

        if (Auth::user()->role !== 'admin' && Auth::id() !== $observasi->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'hari_tanggal' => 'required|date',
            'nama_guru' => 'required|string|max:255',
            'kelas_semester' => 'required|string|max:255',
            'mata_pelajaran' => 'required|string|max:255',
            'pemberi_umpan_balik' => 'required|string|max:255',
            'bukti' => 'required|array',
            'catatan' => 'required|array',
            'refleksi' => 'required|array',
        ]);

        $observasi->update($validated);

        return redirect("/observasi/pelaksanaan/{$observasi->id}")->with('success', 'Observasi pelaksanaan berhasil diperbarui!');
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
        $sheet->getStyle('A1')->applyFromArray($bold + $center);
        $sheet->getStyle('A1')->getFont()->setSize(14);

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
            $row++;
        }

        // Header tabel
        $sheet->fromArray(['No', 'Aspek yang diamati', 'Bukti Pembelajaran', 'Catatan'], null, 'A9');
        $sheet->getStyle('A9:D9')->applyFromArray($bold + $center + $border);

        // Lebar kolom
        $sheet->getColumnDimension('A')->setWidth(10);
        $sheet->getColumnDimension('B')->setWidth(50);
        $sheet->getColumnDimension('C')->setWidth(30);
        $sheet->getColumnDimension('D')->setWidth(30);

        // Wrap text
        $sheet->getStyle('B:B')->getAlignment()->setWrapText(true);
        $sheet->getStyle('C:C')->getAlignment()->setWrapText(true);
        $sheet->getStyle('D:D')->getAlignment()->setWrapText(true);

        // Alignment
        $sheet->getStyle('A:A')->getAlignment()
            ->setVertical(Alignment::VERTICAL_CENTER)
            ->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C:C')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);
        $sheet->getStyle('D:D')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);
        $sheet->getStyle('B:B')->getAlignment()->setVertical(Alignment::VERTICAL_TOP);

        $row = 10;
        $no = 1;

        foreach ($definisi['seksi'] as $seksi) {
            // Banner seksi
            $sheet->mergeCells("A{$row}:D{$row}");
            $sheet->setCellValue('A'.$row, $seksi['nama']);
            $sheet->getStyle("A{$row}")->applyFromArray([
                'font' => ['bold' => true, 'size' => 11],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F3F4F6']],
            ]);
            $row++;

            foreach ($seksi['indikator'] as $ind) {
                // Indikator utama
                $sheet->setCellValue('A'.$row, $no++);
                $sheet->setCellValue('B'.$row, $ind['teks']);
                $sheet->setCellValue('C'.$row, $bukti[$ind['kode']] ?? '');
                $sheet->setCellValue('D'.$row, $catatan[$ind['kode']] ?? '');
                $sheet->getStyle("A{$row}:D{$row}")->applyFromArray($border);
                $sheet->getStyle("B{$row}")->getFont()->setBold(true);
                $row++;

                // Sub-indikator
                if (isset($ind['sub'])) {
                    foreach ($ind['sub'] as $sub) {
                        $sheet->setCellValue('A'.$row, $no++);
                        $sheet->setCellValue('B'.$row, '    '.$sub['teks']);
                        $sheet->setCellValue('C'.$row, $bukti[$sub['kode']] ?? '');
                        $sheet->setCellValue('D'.$row, $catatan[$sub['kode']] ?? '');
                        $sheet->getStyle("A{$row}:D{$row}")->applyFromArray($border);
                        $row++;
                    }
                }
            }
        }

        // Refleksi header
        $sheet->mergeCells("A{$row}:D{$row}");
        $sheet->setCellValue('A'.$row, 'REFLEKSI');
        $sheet->getStyle("A{$row}")->applyFromArray([
            'font' => ['bold' => true, 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => 'F3F4F6']],
        ]);
        $row++;

        // Refleksi items
        $refleksiDef = $definisi['seksi']['refleksi']['indikator'];
        foreach ($refleksiDef as $ref) {
            $sheet->mergeCells("A{$row}:D{$row}");
            $sheet->setCellValue('A'.$row, $ref['teks']);
            $sheet->getStyle("A{$row}")->applyFromArray($bold);
            $row++;

            $sheet->mergeCells("A{$row}:D".($row + 2));
            $sheet->setCellValue('A'.$row, $refleksi[$ref['kode']] ?? '');
            $sheet->getStyle("A{$row}")->getAlignment()->setWrapText(true)->setVertical(Alignment::VERTICAL_TOP);
            $sheet->getStyle("A{$row}:D".($row + 2))->applyFromArray($border);
            $row += 3;
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
